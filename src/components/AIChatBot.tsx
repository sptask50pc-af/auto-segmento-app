import { forwardRef, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type Message = { role: 'user' | 'assistant'; content: string };

const env = (import.meta as any).env ?? {};
const CHAT_URL = `${env.VITE_SUPABASE_URL ?? ""}/functions/v1/ai-assistant`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  // Use the user's session JWT — the edge function requires an authenticated user.
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    onError("Inicie sessão para falar com o assistente.");
    return;
  }

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: "Erro de conexão" }));
    onError(errorData.error || `Erro ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("Sem resposta do servidor");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

/* Custom SVG robot logo */
function BotLogo({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* antenna */}
      <line x1="16" y1="2" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="2" r="1.5" fill="currentColor" />
      {/* head */}
      <rect x="6" y="7" width="20" height="14" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      {/* eyes */}
      <circle cx="12" cy="14" r="2.5" fill="currentColor" />
      <circle cx="20" cy="14" r="2.5" fill="currentColor" />
      <circle cx="12.8" cy="13.2" r="0.8" fill="white" />
      <circle cx="20.8" cy="13.2" r="0.8" fill="white" />
      {/* mouth */}
      <path d="M12 18.5 Q16 21 20 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* body */}
      <rect x="10" y="22" width="12" height="7" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      {/* arms */}
      <rect x="3" y="23" width="6" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="23" y="23" width="6" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

interface AIChatBotProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
  onExternalOpen?: () => void;
}

export const AIChatBot = forwardRef<HTMLDivElement, AIChatBotProps>(({ externalOpen, onExternalClose, onExternalOpen }, ref) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const isMobile = useIsMobile();

  const setIsOpen = (val: boolean) => {
    if (val && onExternalOpen) onExternalOpen();
    if (!val && onExternalClose) onExternalClose();
    setInternalOpen(val);
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente da Auto Segmento. Como posso ajudá-lo a encontrar peças ou acessórios para o seu veículo?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2].role === 'user') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div ref={ref} className="contents">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className={cn(
                "absolute bottom-0 left-0 right-0 flex flex-col overflow-hidden rounded-t-3xl border-t border-border bg-card shadow-2xl",
                isMobile
                  ? "max-h-[85dvh] pb-[env(safe-area-inset-bottom)]"
                  : "md:bottom-4 md:left-auto md:right-4 md:max-h-[520px] md:max-w-md md:rounded-2xl md:border"
              )}
            >
              {isMobile && (
                <div className="flex justify-center pt-2 pb-1">
                  <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
                </div>
              )}

              <div className="flex items-center justify-between border-b border-border/50 bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BotLogo size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Assistente AI</h3>
                    <p className="text-[11px] text-muted-foreground">Auto Segmento • Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:text-foreground active:scale-90"
                  aria-label="Fechar assistente"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i === messages.length - 1 ? 0.05 : 0 }}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <BotLogo size={16} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-primary text-primary-foreground'
                            : 'rounded-bl-md bg-muted text-foreground'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start gap-2">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BotLogo size={16} />
                      </div>
                      <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollBottomRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-border/50 bg-card p-3">
                <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/40 px-3 py-1 transition-all duration-200 focus-within:border-primary/40 focus-within:bg-muted/60">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="rounded-xl bg-primary p-2.5 text-primary-foreground transition-all duration-200 active:scale-90 hover:bg-primary/90 disabled:opacity-30"
                    aria-label="Enviar mensagem"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop-only floating launcher */}
      {!isOpen && !isMobile && (
        <div className="fixed z-40 bottom-4 right-4">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Abrir assistente AI"
              className="group flex items-center gap-3 px-5 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-active:scale-95">
                <BotLogo size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Pergunte ao Assistente AI</p>
                <p className="text-[11px] text-muted-foreground">Peças, compatibilidade, recomendações...</p>
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                AI
              </div>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
});

AIChatBot.displayName = 'AIChatBot';