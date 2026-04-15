import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Briefcase, ArrowRight, Building, Mail, User } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function RolePicker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<"student" | "employer" | null>(null);
  const [loading, setLoading] = useState(false);
  const [employerForm, setEmployerForm] = useState({
    company_name: "",
    company_role: "",
    company_website: "",
    full_name: user?.user_metadata?.full_name || "",
  });

  const handleStudentContinue = async () => {
    setLoading(true);
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!existing) {
        await supabase.from("profiles").insert({
          user_id: user?.id,
          email: user?.email || "",
          full_name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student",
          role: "student" as any,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to set up profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerContinue = async () => {
    if (!employerForm.company_name || !employerForm.full_name) {
      toast({ title: "Required", description: "Please fill in your name and company.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      const profileData = {
        user_id: user?.id,
        email: user?.email || "",
        full_name: employerForm.full_name,
        role: "employer" as any,
        company_name: employerForm.company_name,
        company_role: employerForm.company_role,
        company_website: employerForm.company_website,
      };

      if (existing) {
        await supabase.from("profiles").update(profileData).eq("user_id", user?.id);
      } else {
        await supabase.from("profiles").insert(profileData);
      }
      navigate("/employer-portal");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to set up employer profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <Logo size="lg" showText={true} className="mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold fredoka-bold">Welcome to Bunifu!</h1>
          <p className="text-muted-foreground mt-2 fredoka-medium">How would you like to use Bunifu?</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
              onClick={() => setSelectedRole("student")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold fredoka-bold">I'm a Student</h3>
                <p className="text-sm text-muted-foreground fredoka-medium">
                  Access classes, share achievements, collaborate with peers, and get career insights
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 hover:border-orange-500 hover:shadow-lg transition-all duration-200 group"
              onClick={() => setSelectedRole("employer")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold fredoka-bold">I'm an Employer</h3>
                <p className="text-sm text-muted-foreground fredoka-medium">
                  Post jobs, search for talent using AI, advertise events, and discover top students
                </p>
              </CardContent>
            </Card>
          </div>
        ) : selectedRole === "student" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Student Account
              </CardTitle>
              <CardDescription>You'll set up your full profile after signing in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleStudentContinue} disabled={loading} className="w-full">
                {loading ? "Setting up..." : "Continue as Student"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="ghost" onClick={() => setSelectedRole(null)} className="w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-600" />
                Employer Account
              </CardTitle>
              <CardDescription>Tell us about your company to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emp_name">Your Full Name *</Label>
                <Input
                  id="emp_name"
                  value={employerForm.full_name}
                  onChange={(e) => setEmployerForm({ ...employerForm, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={employerForm.company_name}
                  onChange={(e) => setEmployerForm({ ...employerForm, company_name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={employerForm.company_role}
                  onChange={(e) => setEmployerForm({ ...employerForm, company_role: e.target.value })}
                  placeholder="HR Manager"
                />
              </div>
              <div>
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  value={employerForm.company_website}
                  onChange={(e) => setEmployerForm({ ...employerForm, company_website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <Button onClick={handleEmployerContinue} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
                {loading ? "Setting up..." : "Continue as Employer"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="ghost" onClick={() => setSelectedRole(null)} className="w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
