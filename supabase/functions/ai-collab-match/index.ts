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
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the requesting user's profile
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("user_id, full_name, skills, soft_skills, career_interests, industry_preferences, bio, university_id, course_id, year")
      .eq("user_id", user_id)
      .single();

    if (!myProfile) throw new Error("Profile not found");

    // Get the user's Sifa posts
    const { data: myAchievements } = await supabase
      .from("achievements")
      .select("title, description")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get other students' profiles (excluding self), preferring same university first
    const { data: otherProfiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, skills, soft_skills, career_interests, industry_preferences, bio, university_id, course_id, year, profile_picture_url, universities!fk_profiles_university(name), courses!fk_profiles_course(name)")
      .neq("user_id", user_id)
      .in("role", ["student", "lecturer"])
      .limit(150);

    // Get other users' achievements
    const otherUserIds = (otherProfiles || []).map((p: any) => p.user_id);
    let otherAchievements: any[] = [];
    if (otherUserIds.length > 0) {
      const { data } = await supabase
        .from("achievements")
        .select("user_id, title, description")
        .in("user_id", otherUserIds)
        .order("created_at", { ascending: false })
        .limit(500);
      otherAchievements = data || [];
    }

    const achievementsByUser: Record<string, string[]> = {};
    otherAchievements.forEach((a: any) => {
      if (!achievementsByUser[a.user_id]) achievementsByUser[a.user_id] = [];
      if (achievementsByUser[a.user_id].length < 3) {
        achievementsByUser[a.user_id].push(a.title);
      }
    });

    const mySummary = `Skills: ${(myProfile.skills || []).join(', ')} | Interests: ${myProfile.career_interests || 'N/A'} | Bio: ${(myProfile.bio || '').slice(0, 150)} | Sifa posts: ${(myAchievements || []).map((a: any) => a.title).join(', ') || 'None'}`;

    const otherSummaries = (otherProfiles || []).map((p: any, i: number) => {
      return `[${i}] ${p.full_name} | ${p.universities?.name || 'N/A'} | ${p.courses?.name || 'N/A'} | Skills: ${(p.skills || []).join(', ') || 'None'} | Interests: ${p.career_interests || 'N/A'} | Sifa: ${(achievementsByUser[p.user_id] || []).join(', ') || 'None'}`;
    }).join('\n');

    if (!otherSummaries) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
            content: `You are a collaboration matching AI for Bunifu university platform. Find students who could work well together on projects, startups, or academic collaborations.

Consider complementary skills (not just same skills), shared interests, achievement synergy, and potential for impactful collaboration.

Return a JSON object with a "matches" array of up to 8 best collaboration matches. Each match has:
- "index": candidate index
- "score": compatibility 0-100
- "reason": why they'd collaborate well (1-2 sentences)
- "project_idea": a specific project/collaboration idea for them`,
          },
          {
            role: "user",
            content: `Find collaboration matches for this student:\n${mySummary}\n\nPotential collaborators:\n${otherSummaries}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let matchResults: any[] = [];

    // Handle both tool_calls and plain JSON response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      matchResults = JSON.parse(toolCall.function.arguments).matches || [];
    } else {
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          matchResults = JSON.parse(content).matches || [];
        } catch { /* ignore */ }
      }
    }

    const matches = matchResults
      .filter((m: any) => m.index >= 0 && m.index < (otherProfiles || []).length)
      .sort((a: any, b: any) => b.score - a.score)
      .map((m: any) => {
        const p = (otherProfiles as any[])[m.index];
        return {
          user_id: p.user_id,
          full_name: p.full_name,
          profile_picture_url: p.profile_picture_url,
          skills: p.skills || [],
          university_name: p.universities?.name,
          course_name: p.courses?.name,
          match_score: m.score,
          match_reason: m.reason,
          project_idea: m.project_idea,
        };
      });

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Collab match error:", error);
    return new Response(JSON.stringify({ error: error.message || "Matching failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
