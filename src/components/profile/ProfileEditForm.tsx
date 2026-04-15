// @ts-nocheck
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, GraduationCap, CheckCircle, AlertCircle, Briefcase,
  FileText, Link as LinkIcon, Github, Linkedin, Globe, Phone, Languages, Upload, X
} from "lucide-react";

interface ProfileEditFormProps {
  profile: any;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ profile, onSave, onCancel }: ProfileEditFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    bio: profile?.bio || '',
    about_me: profile?.about_me || '',
    phone_number: profile?.phone_number || '',
    country_id: profile?.country_id || '',
    university_id: profile?.university_id || '',
    course_id: profile?.course_id || '',
    year: profile?.year || '',
    semester: profile?.semester || '',
    graduation_year: profile?.graduation_year || '',
    skills: profile?.skills || [],
    soft_skills: profile?.soft_skills || [],
    languages: profile?.languages || [],
    career_interests: profile?.career_interests || '',
    industry_preferences: profile?.industry_preferences || [],
    availability: profile?.availability || '',
    salary_expectations: profile?.salary_expectations || '',
    location_preference: profile?.location_preference || '',
    portfolio_url: profile?.portfolio_url || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
    cv_url: profile?.cv_url || '',
    cv_file_path: profile?.cv_file_path || '',
  });

  useEffect(() => { fetchCountries(); }, []);
  useEffect(() => { if (formData.country_id) fetchUniversities(formData.country_id); }, [formData.country_id]);
  useEffect(() => { if (formData.university_id) fetchCourses(formData.university_id); }, [formData.university_id]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    const { data } = await supabase.from('countries').select('*').order('name');
    setCountries(data || []);
    setLoadingCountries(false);
  };

  const fetchUniversities = async (countryId: string) => {
    setLoadingUniversities(true);
    const { data } = await supabase.from('universities').select('*').eq('country_id', countryId).order('name');
    setUniversities(data || []);
    setLoadingUniversities(false);
  };

  const fetchCourses = async (universityId: string) => {
    setLoadingCourses(true);
    const { data } = await supabase.from('courses').select('*').eq('university_id', universityId).order('name');
    setCourses(data || []);
    setLoadingCourses(false);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "CV must be under 10MB", variant: "destructive" });
      return;
    }
    setUploadingCV(true);
    try {
      const filePath = `${user?.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('student-cvs').upload(filePath, file);
      if (error) throw error;
      setFormData({ ...formData, cv_file_path: filePath });
      toast({ title: "CV uploaded!", description: "Your CV has been uploaded successfully." });
    } catch (error) {
      console.error("CV upload error:", error);
      toast({ title: "Upload failed", description: "Failed to upload CV.", variant: "destructive" });
    } finally {
      setUploadingCV(false);
    }
  };

  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter("");
    }
  };

  const removeFromArray = (field: string, value: string) => {
    setFormData({ ...formData, [field]: formData[field].filter((v: string) => v !== value) });
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: formData.full_name,
        bio: formData.bio,
        about_me: formData.about_me,
        phone_number: formData.phone_number || null,
        country_id: formData.country_id || null,
        university_id: formData.university_id || null,
        course_id: formData.course_id || null,
        year: formData.year || null,
        semester: formData.semester || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        skills: formData.skills,
        soft_skills: formData.soft_skills,
        languages: formData.languages,
        career_interests: formData.career_interests || null,
        industry_preferences: formData.industry_preferences,
        availability: formData.availability || null,
        salary_expectations: formData.salary_expectations || null,
        location_preference: formData.location_preference || null,
        portfolio_url: formData.portfolio_url || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        cv_url: formData.cv_url || null,
        cv_file_path: formData.cv_file_path || null,
      }).eq('user_id', user?.id);

      if (error) throw error;
      toast({ title: "Success", description: "Profile updated!" });
      onSave({ ...profile, ...formData });
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = formData.full_name && formData.email && formData.country_id && formData.university_id && formData.course_id && formData.year;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Basic Information
            {isProfileComplete && <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Full Name *</Label><Input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} /></div>
            <div><Label>Email *</Label><Input value={formData.email} disabled className="bg-muted" /></div>
          </div>
          <div><Label>Phone Number</Label><Input value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} placeholder="+254..." /></div>
          <div><Label>Bio (short)</Label><Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="A brief introduction..." rows={2} /></div>
          <div><Label>About Me (detailed)</Label><Textarea value={formData.about_me} onChange={(e) => setFormData({...formData, about_me: e.target.value})} placeholder="Your story, passions, goals..." rows={4} /></div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Academic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Country *</Label>
              <Select value={formData.country_id} onValueChange={(v) => setFormData({...formData, country_id: v, university_id: '', course_id: ''})}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>University *</Label>
              <Select value={formData.university_id} onValueChange={(v) => setFormData({...formData, university_id: v, course_id: ''})} disabled={!formData.country_id}>
                <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
                <SelectContent>{universities.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Course *</Label>
              <Select value={formData.course_id} onValueChange={(v) => setFormData({...formData, course_id: v})} disabled={!formData.university_id}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year *</Label>
              <Select value={formData.year} onValueChange={(v) => setFormData({...formData, year: v})}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {["1st Year","2nd Year","3rd Year","4th Year","5th Year","Graduated","Alumni"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expected Graduation Year</Label>
              <Input type="number" value={formData.graduation_year} onChange={(e) => setFormData({...formData, graduation_year: e.target.value})} placeholder="2027" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills & Languages */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Skills & Languages</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Technical Skills</Label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("skills", skillInput, setSkillInput))} placeholder="e.g. React, Python, Data Analysis" />
              <Button variant="outline" onClick={() => addToArray("skills", skillInput, setSkillInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{formData.skills.map((s: string) => <Badge key={s} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray("skills", s)}>{s} <X className="h-3 w-3 ml-1" /></Badge>)}</div>
          </div>
          <div>
            <Label>Soft Skills</Label>
            <div className="flex gap-2">
              <Input value={softSkillInput} onChange={(e) => setSoftSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("soft_skills", softSkillInput, setSoftSkillInput))} placeholder="e.g. Leadership, Communication" />
              <Button variant="outline" onClick={() => addToArray("soft_skills", softSkillInput, setSoftSkillInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{formData.soft_skills.map((s: string) => <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => removeFromArray("soft_skills", s)}>{s} <X className="h-3 w-3 ml-1" /></Badge>)}</div>
          </div>
          <div>
            <Label>Languages</Label>
            <div className="flex gap-2">
              <Input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToArray("languages", languageInput, setLanguageInput))} placeholder="e.g. English, Swahili, French" />
              <Button variant="outline" onClick={() => addToArray("languages", languageInput, setLanguageInput)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">{formData.languages.map((l: string) => <Badge key={l} variant="outline" className="cursor-pointer" onClick={() => removeFromArray("languages", l)}>{l} <X className="h-3 w-3 ml-1" /></Badge>)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Career & Preferences */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Career & Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Career Interests</Label><Textarea value={formData.career_interests} onChange={(e) => setFormData({...formData, career_interests: e.target.value})} placeholder="What fields/roles interest you?" rows={2} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Availability</Label>
              <Select value={formData.availability} onValueChange={(v) => setFormData({...formData, availability: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Full-time","Part-time","Internship","Freelance","Not looking"].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Location Preference</Label><Input value={formData.location_preference} onChange={(e) => setFormData({...formData, location_preference: e.target.value})} placeholder="Remote, Nairobi, etc." /></div>
          </div>
          <div><Label>Salary Expectations</Label><Input value={formData.salary_expectations} onChange={(e) => setFormData({...formData, salary_expectations: e.target.value})} placeholder="e.g. $500-$1000/month" /></div>
        </CardContent>
      </Card>

      {/* Links & CV */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Links & CV</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> LinkedIn</Label><Input value={formData.linkedin_url} onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
            <div><Label className="flex items-center gap-1"><Github className="h-3 w-3" /> GitHub</Label><Input value={formData.github_url} onChange={(e) => setFormData({...formData, github_url: e.target.value})} placeholder="https://github.com/..." /></div>
          </div>
          <div><Label className="flex items-center gap-1"><Globe className="h-3 w-3" /> Portfolio URL</Label><Input value={formData.portfolio_url} onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})} placeholder="https://myportfolio.com" /></div>
          <div><Label className="flex items-center gap-1"><FileText className="h-3 w-3" /> CV Link (external)</Label><Input value={formData.cv_url} onChange={(e) => setFormData({...formData, cv_url: e.target.value})} placeholder="https://drive.google.com/..." /></div>
          <div>
            <Label className="flex items-center gap-1"><Upload className="h-3 w-3" /> Upload CV (PDF, max 10MB)</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} disabled={uploadingCV} />
            {formData.cv_file_path && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> CV uploaded</p>}
            {uploadingCV && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
          </div>
        </CardContent>
      </Card>

      {/* Incomplete warning */}
      {!isProfileComplete && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800"><AlertCircle className="h-4 w-4" /><span className="font-medium">Profile Incomplete</span></div>
          <p className="text-sm text-yellow-700 mt-1">Complete your profile to access all features and improve AI matching results.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={loading || !isProfileComplete} className="flex-1">{loading ? "Saving..." : "Save Profile"}</Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
