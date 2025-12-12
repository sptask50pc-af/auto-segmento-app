import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo.png';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative animate-pulse">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
          <img 
            src={logo} 
            alt="Segmento Positivo" 
            className="relative h-20 w-20 rounded-xl object-contain" 
          />
        </div>
        <p className="mt-4 text-muted-foreground text-sm">A carregar...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
