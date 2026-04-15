// @ts-nocheck
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Search, Briefcase, Users, Sparkles, Plus, Building, MapPin,
  DollarSign, Calendar, ExternalLink, Loader2, Star, Award, Brain
} from "lucide-react";

interface TalentMatch {
  user_id: string;
  full_name: string;
  email: string;
  profile_picture_url?: string;
  skills: string[];
  bio?: string;
  university_name?: string;
  course_name?: string;
  match_score: number;
  match_reason: string;
}

export default function EmployerPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TalentMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    ad_title: "",
    ad_description: "",
    company_name: "",
    ad_type: "job",
    location: "",
    salary_range: "",
    application_url: "",
    contact_email: "",
    target_skills: [] as string[],
    skillInput: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMyAds();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user?.id).single();
    if (data) {
      setProfile(data);
      setJobForm((f) => ({ ...f, company_name: data.company_name || "", contact_email: data.email || "" }));
    }
  };

  const fetchMyAds = async () => {
    const { data } = await supabase
      .from("employer_ads")
      .select("*")
      .eq("employer_email", user?.email)
      .order("created_at", { ascending: false });
    setMyAds(data || []);
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("ai-talent-search", {
        body: { query: searchQuery, employer_id: user?.id },
      });
      if (error) throw error;
      setSearchResults(data?.matches || []);
      if (!data?.matches?.length) {
        toast({ title: "No matches", description: "Try broadening your search criteria." });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({ title: "Search failed", description: "AI search encountered an error. Please try again.", variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const handlePostJob = async () => {
    if (!jobForm.ad_title || !jobForm.ad_description || !jobForm.company_name) {
      toast({ title: "Required fields", description: "Please fill in title, description, and company name.", variant: "destructive" });
      return;
    }
    setIsPostingJob(true);
    try {
      const { error } = await supabase.from("employer_ads").insert({
        employer_name: profile?.full_name || "Employer",
        employer_email: user?.email || "",
        company_name: jobForm.company_name,
        ad_title: jobForm.ad_title,
        ad_description: jobForm.ad_description,
        ad_type: jobForm.ad_type,
        location: jobForm.location,
        salary_range: jobForm.salary_range,
        application_url: jobForm.application_url,
        contact_email: jobForm.contact_email,
        target_skills: jobForm.target_skills,
        status: "pending",
        is_paid: false,
      });
      if (error) throw error;
      toast({ title: "Job posted!", description: "Your listing is pending review. Payment will activate it." });
      setJobForm({ ad_title: "", ad_description: "", company_name: profile?.company_name || "", ad_type: "job", location: "", salary_range: "", application_url: "", contact_email: profile?.email || "", target_skills: [], skillInput: "" });
      fetchMyAds();
    } catch (error) {
      console.error("Post error:", error);
      toast({ title: "Error", description: "Failed to post job listing.", variant: "destructive" });
    } finally {
      setIsPostingJob(false);
    }
  };

  const addSkill = () => {
    if (jobForm.skillInput.trim() && !jobForm.target_skills.includes(jobForm.skillInput.trim())) {
      setJobForm({ ...jobForm, target_skills: [...jobForm.target_skills, jobForm.skillInput.trim()], skillInput: "" });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold fredoka-bold flex items-center gap-2">
              <Building className="h-7 w-7 text-orange-600" />
              Employer Portal
            </h1>
            <p className="text-muted-foreground mt-1 fredoka-medium">
              Find talent, post jobs, and connect with top students
            </p>
          </div>
        </div>

        <Tabs defaultValue="search" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Brain className="h-4 w-4" /> AI Search
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Post Job
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> My Listings
            </TabsTrigger>
          </TabsList>

          {/* AI Talent Search */}
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI-Powered Talent Search
                </CardTitle>
                <CardDescription>
                  Describe what you're looking for in natural language. Our AI analyzes student profiles, achievements, and Sifa posts to find the best matches.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 'Looking for a software engineer intern with React experience from East African universities'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleAISearch} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Top Matches ({searchResults.length})</h3>
                    {searchResults.map((match, i) => (
                      <Card key={match.user_id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={match.profile_picture_url} />
                              <AvatarFallback>{match.full_name?.split(" ").map((n) => n[0]).join("") || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{match.full_name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  {Math.round(match.match_score)}% match
                                </Badge>
                              </div>
                              {match.university_name && (
                                <p className="text-sm text-muted-foreground">{match.university_name} · {match.course_name}</p>
                              )}
                              {match.bio && <p className="text-sm mt-1 line-clamp-2">{match.bio}</p>}
                              {match.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {match.skills.slice(0, 6).map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground mt-2 italic">{match.match_reason}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Job */}
          <TabsContent value="post" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post a Job or Event
                </CardTitle>
                <CardDescription>Create a listing that reaches thousands of students across universities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Listing Title *</Label>
                    <Input value={jobForm.ad_title} onChange={(e) => setJobForm({ ...jobForm, ad_title: e.target.value })} placeholder="Software Engineering Intern" />
                  </div>
                  <div>
                    <Label>Company Name *</Label>
                    <Input value={jobForm.company_name} onChange={(e) => setJobForm({ ...jobForm, company_name: e.target.value })} placeholder="Acme Corp" />
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={jobForm.ad_description}
                    onChange={(e) => setJobForm({ ...jobForm, ad_description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Nairobi, Kenya / Remote" />
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <Input value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} placeholder="$500-$1000/month" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Application URL</Label>
                    <Input value={jobForm.application_url} onChange={(e) => setJobForm({ ...jobForm, application_url: e.target.value })} placeholder="https://apply.example.com" />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input value={jobForm.contact_email} onChange={(e) => setJobForm({ ...jobForm, contact_email: e.target.value })} placeholder="hr@example.com" />
                  </div>
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={jobForm.skillInput}
                      onChange={(e) => setJobForm({ ...jobForm, skillInput: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill and press Enter"
                    />
                    <Button variant="outline" onClick={addSkill}>Add</Button>
                  </div>
                  {jobForm.target_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {jobForm.target_skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setJobForm({ ...jobForm, target_skills: jobForm.target_skills.filter((s) => s !== skill) })}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handlePostJob} disabled={isPostingJob} className="w-full">
                  {isPostingJob ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Post Listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Listings */}
          <TabsContent value="listings" className="space-y-4">
            {myAds.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No listings yet</h3>
                  <p className="text-muted-foreground">Post your first job or event listing to reach students</p>
                </CardContent>
              </Card>
            ) : (
              myAds.map((ad) => (
                <Card key={ad.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{ad.ad_title}</h3>
                        <p className="text-sm text-muted-foreground">{ad.company_name} · {ad.location}</p>
                        <p className="text-sm mt-2 line-clamp-2">{ad.ad_description}</p>
                      </div>
                      <Badge variant={ad.status === "active" ? "default" : ad.status === "pending" ? "secondary" : "outline"}>
                        {ad.status}
                      </Badge>
                    </div>
                    {ad.target_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ad.target_skills.map((s: string) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
