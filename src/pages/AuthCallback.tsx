import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PageBlockSkeleton } from '@/components/ui/page-skeletons';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for auth state to be determined
        if (loading) return;

        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        // Check if user has a profile, create one if they don't
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          navigate('/login');
          return;
        }

        if (!existingProfile) {
          // New user - send to role picker
          console.log('No profile found, redirecting to role picker');
          navigate('/role-picker');
          return;
        }

        // Existing user - route based on role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profile?.role === 'employer') {
          navigate('/employer-portal');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <PageBlockSkeleton />
    </div>
  );
};

export default AuthCallback;