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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, skills, soft_skills, career_interests, industry_preferences, languages, availability, about_me, course_id, university_id, year, semester, graduation_year, work_experience, certifications, portfolio_url, linkedin_url, github_url, points, rank")
      .eq("user_id", user.id)
      .single();

    // Fetch course & university names
    let courseName = "Unknown";
    let universityName = "Unknown";
    if (profile?.course_id) {
      const { data: course } = await supabase.from("courses").select("name").eq("id", profile.course_id).single();
      if (course) courseName = course.name;
    }
    if (profile?.university_id) {
      const { data: uni } = await supabase.from("universities").select("name").eq("id", profile.university_id).single();
      if (uni) universityName = uni.name;
    }

    // Fetch recent Sifa posts
    const { data: achievements } = await supabase
      .from("achievements")
      .select("title, description, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fetch upcoming events
    const { data: events } = await supabase
      .from("events")
      .select("title, event_date, description")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(5);

    // Fetch upcoming assignments
    const { data: assignments } = await supabase
      .from("assignments")
      .select("title, deadline, description")
      .gte("deadline", new Date().toISOString())
      .order("deadline", { ascending: true })
      .limit(5);

    // Build context for AI
    const profileContext = profile ? `
Student: ${profile.full_name}
University: ${universityName}
Course: ${courseName}
Year: ${profile.year || "Not set"}, Semester: ${profile.semester || "Not set"}
Graduation Year: ${profile.graduation_year || "Not set"}
Skills: ${(profile.skills || []).join(", ") || "None listed"}
Soft Skills: ${(profile.soft_skills || []).join(", ") || "None listed"}
Career Interests: ${profile.career_interests || "Not set"}
Industry Preferences: ${(profile.industry_preferences || []).join(", ") || "None listed"}
Languages: ${(profile.languages || []).join(", ") || "None listed"}
Availability: ${profile.availability || "Not set"}
About Me: ${profile.about_me || "Not set"}
Work Experience: ${JSON.stringify(profile.work_experience || [])}
Certifications: ${JSON.stringify(profile.certifications || [])}
Portfolio: ${profile.portfolio_url || "None"}
LinkedIn: ${profile.linkedin_url || "None"}
GitHub: ${profile.github_url || "None"}
Points: ${profile.points}, Rank: ${profile.rank}
` : "No profile data available.";

    const sifaContext = achievements?.length
      ? `Recent Sifa (achievement) posts:\n${achievements.map(a => `- "${a.title}": ${a.description || "No description"} (${new Date(a.created_at!).toLocaleDateString()})`).join("\n")}`
      : "No Sifa posts yet.";

    const eventsContext = events?.length
      ? `Upcoming events:\n${events.map(e => `- "${e.title}" on ${new Date(e.event_date).toLocaleDateString()}: ${e.description || ""}`).join("\n")}`
      : "No upcoming events.";

    const assignmentsContext = assignments?.length
      ? `Upcoming assignments:\n${assignments.map(a => `- "${a.title}" due ${a.deadline ? new Date(a.deadline).toLocaleDateString() : "TBD"}: ${a.description || ""}`).join("\n")}`
      : "No upcoming assignments.";

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are Bunifu Insights — a proactive, always-on career and academic advisor for East African university students. Today is ${dateStr}.

Your job is to analyze everything about this student and give them highly personalized, actionable insights to position them for success in the job market and academia.

You must return a JSON object with this exact structure:
{
  "greeting": "A warm, personalized greeting mentioning their name and something specific about them",
  "career_readiness_score": 0-100,
  "career_readiness_label": "one of: Getting Started | Building Foundation | Growing | Strong | Excellent",
  "top_insights": [
    {
      "category": "career|academic|skill|network|opportunity",
      "icon": "trending-up|target|zap|users|briefcase|award|book|lightbulb|calendar|star",
      "title": "Short title",
      "description": "2-3 sentence actionable insight",
      "priority": "high|medium|low",
      "action": "Specific next step they should take"
    }
  ],
  "trending_in_field": ["3-5 current trends in their field of study"],
  "skill_gaps": ["2-4 skills they should learn based on their course and career interests"],
  "weekly_challenge": "A specific challenge or task for this week to improve their profile",
  "profile_tips": ["2-3 specific tips to improve their Bunifu profile for employer matching"],
  "motivational_quote": "A relevant motivational quote"
}

Generate 5-8 top_insights covering different categories. Be specific to their course, university, region (East Africa/Uganda/Kenya), and career stage. Reference their Sifa posts, upcoming deadlines, and profile gaps. If their profile is incomplete, make that a high-priority insight.`;

    const userPrompt = `Analyze this student and generate personalized insights:

${profileContext}

${sifaContext}

${eventsContext}

${assignmentsContext}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to generate insights" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    let insights;
    try {
      insights = JSON.parse(content);
    } catch {
      insights = { error: "Failed to parse AI response", raw: content };
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("student-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
