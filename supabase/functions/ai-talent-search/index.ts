import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, employer_id } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student profiles with rich data
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(`
        user_id, full_name, email, bio, skills, soft_skills, languages,
        career_interests, industry_preferences, availability,
        profile_picture_url, portfolio_url, linkedin_url, github_url,
        graduation_year, work_experience, certifications,
        university_id, course_id, year, semester,
        universities!fk_profiles_university(name),
        courses!fk_profiles_course(name)
      `)
      .in("role", ["student", "lecturer"])
      .not("full_name", "is", null)
      .limit(200);

    if (profilesError) {
      console.error("Profiles fetch error:", profilesError);
      throw profilesError;
    }

    // Fetch recent Sifa achievements
    const { data: achievements } = await supabase
      .from("achievements")
      .select("user_id, title, description, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    // Build a condensed profile summary for AI
    const achievementsByUser: Record<string, string[]> = {};
    (achievements || []).forEach((a: any) => {
      if (!achievementsByUser[a.user_id]) achievementsByUser[a.user_id] = [];
      if (achievementsByUser[a.user_id].length < 3) {
        achievementsByUser[a.user_id].push(`${a.title}${a.description ? ': ' + a.description.slice(0, 80) : ''}`);
      }
    });

    const candidateSummaries = (profiles || []).map((p: any, i: number) => {
      const sifa = achievementsByUser[p.user_id] || [];
      return `[${i}] ${p.full_name} | ${p.universities?.name || 'N/A'} | ${p.courses?.name || 'N/A'} | Year: ${p.year || 'N/A'} | Skills: ${(p.skills || []).join(', ') || 'None listed'} | Soft: ${(p.soft_skills || []).join(', ') || 'N/A'} | Languages: ${(p.languages || []).join(', ') || 'N/A'} | Interests: ${p.career_interests || 'N/A'} | Bio: ${(p.bio || '').slice(0, 100)} | Sifa: ${sifa.join('; ') || 'None'}`;
    }).join('\n');

    // Ask AI to match
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a talent matching AI for Bunifu, an African university platform. An employer is searching for candidates. Analyze the candidate profiles and their Sifa (achievement) posts to find the best matches.

Return a JSON object with a "matches" array of up to 10 best matches. For each match include:
- "index": the candidate index number from the list
- "score": match percentage 0-100
- "reason": 1-2 sentence explanation of why they're a good match

Consider: skills match, relevant achievements, university quality, career interests alignment, language fit, and overall profile strength.`,
          },
          {
            role: "user",
            content: `Employer search: "${query}"\n\nCandidate profiles:\n${candidateSummaries}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let matchResults: any[] = [];

    // Parse response - handle both tool call and JSON response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      matchResults = parsed.matches || [];
    } else {
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          matchResults = parsed.matches || [];
        } catch { /* ignore parse error */ }
      }
    }

    // Map back to full profile data
    const matches = matchResults
      .filter((m: any) => m.index >= 0 && m.index < (profiles || []).length)
      .sort((a: any, b: any) => b.score - a.score)
      .map((m: any) => {
        const p = (profiles as any[])[m.index];
        return {
          user_id: p.user_id,
          full_name: p.full_name,
          email: p.email,
          profile_picture_url: p.profile_picture_url,
          skills: p.skills || [],
          bio: p.bio,
          university_name: p.universities?.name,
          course_name: p.courses?.name,
          match_score: m.score,
          match_reason: m.reason,
        };
      });

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Talent search error:", error);
    return new Response(JSON.stringify({ error: error.message || "Search failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
