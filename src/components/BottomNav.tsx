import * as React from "react";
import { motion } from "framer-motion";
import { Home, Package, User, LogOut, Sparkles, QrCode } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onAIClick?: () => void;
}

const BottomNav = React.forwardRef<HTMLDivElement, BottomNavProps>(
  ({ className, onAIClick, ...props }, ref) => {
    const location = useLocation();
    const { user, signOut } = useAuth() as { user: any; signOut: () => Promise<void> };
    const { toast } = useToast();

    const handleSignOut = async () => {
      await signOut();
      toast({
        title: "Sessão terminada",
        description: "Até breve!",
      });
    };

    const userMeta = user?.user_metadata ?? {};
    const displayName: string = userMeta.full_name || userMeta.name || user?.email?.split("@")[0] || "Conta";
    const avatarUrl: string | undefined = userMeta.avatar_url || userMeta.picture;
    const initials = displayName
      .split(" ")
      .map((s: string) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const navItems = [
      { icon: Home, label: "Início", path: "/" },
      { icon: Package, label: "Produtos", path: "/admin" },
      { icon: QrCode, label: "Sobre", path: "/about" },
    ];

    const authActive = location.pathname === "/auth";

    return (
      <motion.div
        ref={ref}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className={cn(
          "fixed bottom-4 left-4 right-4 z-50 md:hidden rounded-2xl mx-auto max-w-sm",
          className
        )}
        role="navigation"
        {...(props as any)}
      >
        <div className="relative border border-border/30 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg shadow-black/20 rounded-2xl pb-[env(safe-area-inset-bottom)]">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

          <div className="grid grid-cols-5 h-[68px] items-center px-1">
            {/* Nav items on left */}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-3 px-1 transition-all duration-100 active:scale-95 rounded-lg",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    className={cn(
                      "p-2 rounded-xl relative transition-colors duration-100",
                      isActive && "bg-primary/12"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomnav-indicator"
                        className="absolute inset-0 bg-primary/12 rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <item.icon className={cn(
                      "h-[21px] w-[21px] relative z-10 transition-all duration-200",
                      isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                    )} />
                  </motion.div>
                  <span className={cn(
                    "text-[10px] leading-tight transition-all duration-200",
                    isActive ? "font-semibold" : "font-medium opacity-60"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Auth button */}
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 text-primary active:scale-90"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="text-[11px] font-semibold bg-primary/15 text-primary">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] leading-tight font-medium truncate max-w-[52px]">
                      {displayName}
                    </span>
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-3 mb-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-primary/15 text-primary">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start mt-2 text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Terminar sessão
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 active:scale-90",
                  authActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    "p-1.5 rounded-xl relative",
                    authActive && "bg-primary/12"
                  )}
                >
                  {authActive && (
                    <motion.div
                      layoutId="bottomnav-indicator"
                      className="absolute inset-0 bg-primary/12 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <User className={cn(
                    "h-[21px] w-[21px] relative z-10",
                    authActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] leading-tight transition-all duration-200",
                  authActive ? "font-semibold" : "font-medium opacity-60"
                )}>
                  Conta
                </span>
              </Link>
            )}

            {/* AI Button - right side, slightly elevated */}
            <div className="flex flex-col items-center justify-center pb-1">
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
                onClick={onAIClick}
                className="relative flex items-center justify-center h-11 w-11 -mt-3 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground shadow-md shadow-primary/25 transition-shadow duration-200 active:shadow-primary/40"
                aria-label="Abrir assistente AI"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/10" />
                <Sparkles className="h-[18px] w-[18px] relative z-10" />
              </motion.button>
              <span className="text-[9px] font-bold text-primary mt-1 tracking-wide">AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

BottomNav.displayName = "BottomNav";

export { BottomNav };
