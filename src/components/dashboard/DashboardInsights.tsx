import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, Sparkles, Calendar, Users, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Insight {
  type: "career" | "event" | "trend" | "network" | "tip";
  title: string;
  description: string;
  relevance: string;
}

export function DashboardInsights() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsights = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("student-insights", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      
      // If we get structured insights (from the JSON response)
      if (data?.top_insights && Array.isArray(data.top_insights)) {
        const parsed: Insight[] = data.top_insights.slice(0, 5).map((insight: any, i: number) => ({
          type: insight.category === "career" ? "career" : 
                insight.category === "academic" ? "trend" :
                insight.category === "network" ? "network" :
                insight.category === "opportunity" ? "event" : "tip",
          title: insight.title,
          description: insight.description,
          relevance: insight.action || "Based on your profile",
        }));
        setInsights(parsed);
      } else {
        setInsights([{ 
          type: "tip", 
          title: "Complete your profile", 
          description: "Add skills, achievements, and career interests to get personalized insights.", 
          relevance: "Getting started" 
        }]);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error("Insights error:", error);
      setInsights([{ 
        type: "tip", 
        title: "AI Insights Available", 
        description: "Visit the Maarifa page for detailed career and academic insights powered by AI.", 
        relevance: "" 
      }]);
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
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={fetchInsights} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/insights")}>
              View All
            </Button>
          </div>
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
