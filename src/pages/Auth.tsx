import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Lock, Mail, User, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/control-panel');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast({
        title: 'Erro de validação',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Utilizador já existe',
              description: 'Este email já está registado. Tente iniciar sessão.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erro no registo',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Registo bem-sucedido',
            description: 'Verifique o seu email para confirmar a conta ou inicie sessão.',
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Erro de autenticação',
            description: 'Email ou palavra-passe incorretos.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sessão iniciada',
            description: 'Bem-vindo ao Painel de Controlo!',
          });
          navigate('/control-panel');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <img src={logo} alt="Segmento Positivo" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-bold tracking-tight">Autenticação</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {isSignUp ? 'Criar Conta' : 'Iniciar Sessão'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? 'Crie uma conta para aceder ao Painel de Controlo' 
                : 'Inicie sessão para aceder ao Painel de Controlo'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Palavra-passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-card"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  A processar...
                </span>
              ) : isSignUp ? (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Criar Conta
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Já tem conta? Inicie sessão' 
                : 'Não tem conta? Crie uma agora'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
