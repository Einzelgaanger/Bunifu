import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, Sparkles, Calendar, Users, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  type: "career" | "event" | "trend" | "network" | "tip";
  title: string;
  description: string;
  relevance: string;
}

export function DashboardInsights() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsights = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("student-insights", {
        body: { user_id: user.id },
      });
      if (error) throw error;
      
      // Parse the AI response into structured insights
      const raw = data?.insights || data?.analysis || "";
      if (typeof raw === "string" && raw.length > 0) {
        // Simple parsing - split into sections
        const sections = raw.split(/\n(?=##|\*\*|🎯|📅|📈|💡|🤝)/);
        const parsed: Insight[] = sections
          .filter((s: string) => s.trim().length > 20)
          .slice(0, 5)
          .map((s: string, i: number) => ({
            type: i === 0 ? "career" : i === 1 ? "trend" : i === 2 ? "event" : i === 3 ? "network" : "tip",
            title: s.split("\n")[0]?.replace(/[#*🎯📅📈💡🤝]/g, "").trim().slice(0, 60) || "Insight",
            description: s.split("\n").slice(1).join(" ").trim().slice(0, 200),
            relevance: "Based on your profile",
          }));
        setInsights(parsed.length > 0 ? parsed : [{ type: "tip", title: "Complete your profile", description: "Add skills, achievements, and career interests to get personalized insights.", relevance: "Getting started" }]);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error("Insights error:", error);
      setInsights([{ type: "tip", title: "AI Insights Coming Soon", description: "We're preparing personalized insights based on your profile and activity. Check back shortly!", relevance: "" }]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasLoaded) fetchInsights();
  }, [user]);

  const typeIcon = (type: string) => {
    switch (type) {
      case "career": return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "trend": return <Sparkles className="h-4 w-4 text-purple-600" />;
      case "event": return <Calendar className="h-4 w-4 text-green-600" />;
      case "network": return <Users className="h-4 w-4 text-orange-600" />;
      default: return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "career": return "bg-blue-50 text-blue-700 border-blue-200";
      case "trend": return "bg-purple-50 text-purple-700 border-purple-200";
      case "event": return "bg-green-50 text-green-700 border-green-200";
      case "network": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights for You
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchInsights} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && !hasLoaded ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, i) => (
            <div key={i} className={`rounded-lg border p-3 ${typeColor(insight.type)}`}>
              <div className="flex items-start gap-2">
                {typeIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-xs mt-1 opacity-80 line-clamp-2">{insight.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Add skills and achievements to unlock personalized insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
