import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RequireAdminProps {
  children: React.ReactNode;
}

export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!cancelled) {
        setIsAdmin(!error && data === true);
        setChecking(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        A verificar permissões...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};