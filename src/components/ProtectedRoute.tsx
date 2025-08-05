import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHook } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuthHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (adminOnly && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, adminOnly, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user || (adminOnly && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};