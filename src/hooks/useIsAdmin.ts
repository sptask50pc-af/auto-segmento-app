import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
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
    run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, loading: loading || checking };
}