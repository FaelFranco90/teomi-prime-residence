import { Navigate } from 'react-router-dom';
import { useAuthHook } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isEditor } = useAuthHook();

  const hasAccess = requireAdmin ? isAdmin : (isAdmin || isEditor);

  console.log('[route-debug] loading:', loading, 'user:', user?.id, user?.email, 'isAdmin:', isAdmin, 'isEditor:', isEditor, 'hasAccess:', hasAccess);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return hasAccess ? <>{children}</> : <Navigate to="/admin/403" replace />;
};