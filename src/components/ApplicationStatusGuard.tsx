import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';

interface ApplicationStatusGuardProps {
  children: React.ReactNode;
}

const ApplicationStatusGuard = ({ children }: ApplicationStatusGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasApplication, status, loading: statusLoading } = useApplicationStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const lastCheckRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch user role once
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setRoleLoading(false);
      return;
    }
    const fetchRole = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      setUserRole(data?.role || null);
      setRoleLoading(false);
    };
    fetchRole();
  }, [user]);

  useEffect(() => {
    if (!user) {
      lastCheckRef.current = null;
      isNavigatingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (authLoading || statusLoading || roleLoading) return;

    // Employers bypass application check entirely
    if (userRole === 'employer') return;

    if (status === undefined || status === null) return;

    const currentPath = location.pathname;
    if (currentPath === '/application-status' || 
        currentPath === '/application-rejected' || 
        currentPath === '/login' || 
        currentPath === '/application' ||
        currentPath === '/role-picker' ||
        currentPath === '/employer-portal') {
      return;
    }

    if (lastCheckRef.current === currentPath) return;
    lastCheckRef.current = currentPath;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      if (isNavigatingRef.current) return;
      
      if (status === 'approved') {
        const validPaths = [
          '/dashboard', '/ukumbi', '/events', '/ajira', '/inbox', '/alumni', 
          '/profile', '/info', '/units', '/unit', '/sifa', '/masomo',
          '/class', '/insights', '/gamification'
        ];
        const isValidPath = validPaths.some(path => currentPath.startsWith(path));
        if (!isValidPath && currentPath !== '/') {
          isNavigatingRef.current = true;
          navigate('/dashboard');
        }
      } else if (status === 'pending') {
        isNavigatingRef.current = true;
        navigate('/application-status');
      } else if (status === 'rejected') {
        const rejectionData = localStorage.getItem(`rejection_${user.id}`);
        let shouldRedirectToRejected = false;
        if (rejectionData) {
          const { rejectedAt } = JSON.parse(rejectionData);
          const timeDiff = Date.now() - new Date(rejectedAt).getTime();
          if (timeDiff < 7 * 24 * 3600 * 1000) shouldRedirectToRejected = true;
        } else {
          localStorage.setItem(`rejection_${user.id}`, JSON.stringify({ rejectedAt: new Date().toISOString() }));
          shouldRedirectToRejected = true;
        }
        if (shouldRedirectToRejected) {
          isNavigatingRef.current = true;
          navigate('/application-rejected');
        }
      } else if (!hasApplication) {
        const validPaths = [
          '/dashboard', '/ukumbi', '/events', '/ajira', '/inbox', '/alumni', 
          '/profile', '/info', '/units', '/unit', '/application', '/sifa',
          '/masomo', '/class', '/insights', '/gamification'
        ];
        const isValidPath = validPaths.some(path => currentPath.startsWith(path));
        if (!isValidPath && currentPath !== '/') {
          isNavigatingRef.current = true;
          navigate('/dashboard');
        }
      }
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isNavigatingRef.current = false;
    };
  }, [user, authLoading, statusLoading, roleLoading, userRole, status, hasApplication, location.pathname, navigate]);

  useEffect(() => {
    if (!authLoading && !statusLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, statusLoading, navigate]);

  if (authLoading || statusLoading || roleLoading) {
    return <LoadingSpinner message="Checking application status..." variant="fullscreen" />;
  }

  if (!user) {
    return <LoadingSpinner message="Redirecting to login..." variant="fullscreen" />;
  }

  return <>{children}</>;
};

export default ApplicationStatusGuard;
