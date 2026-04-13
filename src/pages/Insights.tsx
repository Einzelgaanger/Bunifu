import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  TrendingUp, Target, Zap, Users, Briefcase, Award, BookOpen, Lightbulb,
  Calendar, Star, RefreshCw, Sparkles, ChevronRight, ArrowUp, Brain,
  Flame, Trophy, GraduationCap
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "trending-up": TrendingUp, target: Target, zap: Zap, users: Users,
  briefcase: Briefcase, award: Award, book: BookOpen, lightbulb: Lightbulb,
  calendar: Calendar, star: Star,
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const categoryColors: Record<string, string> = {
  career: "border-l-blue-500",
  academic: "border-l-purple-500",
  skill: "border-l-emerald-500",
  network: "border-l-orange-500",
  opportunity: "border-l-pink-500",
};

interface Insight {
  category: string;
  icon: string;
  title: string;
  description: string;
  priority: string;
  action: string;
}

interface InsightsData {
  greeting: string;
  career_readiness_score: number;
  career_readiness_label: string;
  top_insights: Insight[];
  trending_in_field: string[];
  skill_gaps: string[];
  weekly_challenge: string;
  profile_tips: string[];
  motivational_quote: string;
  error?: string;
}

const fetchInsights = async (): Promise<InsightsData> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("student-insights", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) throw error;
  return data as InsightsData;
};

const Insights = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: insights, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["student-insights", user?.id],
    queryFn: fetchInsights,
    staleTime: 30 * 60 * 1000, // 30 min
    enabled: !!user,
    retry: 1,
  });

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshing insights...", description: "Analyzing your latest data" });
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const scoreProgressColor = (score: number) => {
    if (score >= 80) return "[&>div]:bg-emerald-500";
    if (score >= 60) return "[&>div]:bg-blue-500";
    if (score >= 40) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-red-500";
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold fredoka-bold">Maarifa</h1>
              <p className="text-sm text-muted-foreground">AI-powered career & academic insights</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold fredoka-semibold">Analyzing your profile...</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Looking at your skills, Sifa posts, course, and market trends
                    </p>
                  </div>
                  <div className="w-48">
                    <Progress value={undefined} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-3">
                {(error as Error)?.message || "Failed to load insights"}
              </p>
              <Button onClick={handleRefresh} variant="outline" size="sm">Try Again</Button>
            </CardContent>
          </Card>
        )}

        {/* Insights Content */}
        {insights && !insights.error && (
          <>
            {/* Greeting */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <p className="text-lg fredoka-medium text-foreground">{insights.greeting}</p>
              </CardContent>
            </Card>

            {/* Career Readiness Score */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg fredoka-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Career Readiness
                  </CardTitle>
                  <Badge variant="outline" className="fredoka-medium">
                    {insights.career_readiness_label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 mb-3">
                  <span className={`text-4xl font-bold fredoka-bold ${scoreColor(insights.career_readiness_score)}`}>
                    {insights.career_readiness_score}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">/100</span>
                </div>
                <Progress
                  value={insights.career_readiness_score}
                  className={`h-3 ${scoreProgressColor(insights.career_readiness_score)}`}
                />
              </CardContent>
            </Card>

            {/* Top Insights */}
            <div>
              <h2 className="text-lg font-semibold fredoka-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Your Insights
              </h2>
              <div className="space-y-3">
                {insights.top_insights?.map((insight, i) => {
                  const Icon = iconMap[insight.icon] || Lightbulb;
                  return (
                    <Card
                      key={i}
                      className={`border-0 shadow-sm border-l-4 ${categoryColors[insight.category] || "border-l-gray-300"} hover:shadow-md transition-shadow`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                            <Icon className="h-4 w-4 text-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold fredoka-semibold text-sm">{insight.title}</h3>
                              <Badge variant="outline" className={`text-xs ${priorityColors[insight.priority] || ""}`}>
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                              <ChevronRight className="h-3 w-3" />
                              <span>{insight.action}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Two-column: Trends + Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base fredoka-semibold flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Trending in Your Field
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.trending_in_field?.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ArrowUp className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base fredoka-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    Skills to Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {insights.skill_gaps?.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Challenge */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base fredoka-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-600" />
                  This Week's Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{insights.weekly_challenge}</p>
              </CardContent>
            </Card>

            {/* Profile Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base fredoka-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  Profile Improvement Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.profile_tips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Star className="h-3 w-3 text-amber-400 mt-1 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Motivational Quote */}
            <Card className="border-0 shadow-sm bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm italic text-muted-foreground fredoka-medium">
                  "{insights.motivational_quote}"
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Insights;
