import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomOAuthProviderProps {
  children: React.ReactNode;
}

export const CustomOAuthProvider: React.FC<CustomOAuthProviderProps> = ({ children }) => {
  const handleGoogleAuth = async () => {
    try {
      // Normal Google OAuth flow (no domain restriction)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Ensures the account chooser is shown
            prompt: "select_account",
          },
          scopes: "openid email profile",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Custom OAuth error:", error);
      throw error;
    }
  };

  return <div className="custom-oauth-provider">{children}</div>;
};

export default CustomOAuthProvider;
