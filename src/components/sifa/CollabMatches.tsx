import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Users, Loader2, Lightbulb, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CollabMatch {
  user_id: string;
  full_name: string;
  profile_picture_url?: string;
  skills: string[];
  university_name?: string;
  course_name?: string;
  match_score: number;
  match_reason: string;
  project_idea: string;
}

export function CollabMatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<CollabMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const findMatches = async () => {
    if (!user) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-collab-match", {
        body: { user_id: user.id },
      });
      if (error) throw error;
      setMatches(data?.matches || []);
      if (!data?.matches?.length) {
        toast({ title: "No matches found", description: "Complete your profile and post more achievements for better results." });
      }
    } catch (error: any) {
      console.error("Match error:", error);
      toast({ title: "Error", description: "Failed to find matches. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Collaboration Matches
        </CardTitle>
        <CardDescription>
          Find students with complementary skills to collaborate on projects, startups, or research based on your profile and Sifa achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={findMatches}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Finding collaborators...
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              {hasSearched ? "Refresh Matches" : "Find Collaborators"}
            </>
          )}
        </Button>

        {matches.length > 0 && (
          <div className="space-y-3">
            {matches.map((match) => (
              <Card key={match.user_id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/profile/${match.user_id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={match.profile_picture_url} />
                      <AvatarFallback>{match.full_name?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{match.full_name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {Math.round(match.match_score)}%
                        </Badge>
                      </div>
                      {match.university_name && (
                        <p className="text-xs text-muted-foreground">{match.university_name} · {match.course_name}</p>
                      )}
                      <p className="text-xs mt-1">{match.match_reason}</p>
                      <div className="bg-purple-50 rounded-lg p-2 mt-2">
                        <div className="flex items-center gap-1 text-xs font-medium text-purple-700 mb-1">
                          <Lightbulb className="h-3 w-3" /> Project Idea
                        </div>
                        <p className="text-xs text-purple-600">{match.project_idea}</p>
                      </div>
                      {match.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasSearched && !loading && matches.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No matches found. Add more skills and achievements to improve results.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
