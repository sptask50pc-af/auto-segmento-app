import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

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
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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

export const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente da Auto Segmento. Como posso ajudá-lo a encontrar peças ou acessórios para o seu veículo?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
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
    <>
      {/* Chat Panel - slides up from bottom */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl shadow-2xl overflow-hidden max-h-[75vh] flex flex-col md:left-auto md:right-4 md:bottom-4 md:rounded-2xl md:max-w-md md:max-h-[520px] md:border"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">Assistente AI</h3>
                    <p className="text-[11px] text-muted-foreground">Auto Segmento • Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div ref={scrollAreaRef}></div>
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
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t border-border bg-card">
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-1 border border-border/50 focus-within:border-primary/40 transition-colors">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground py-2 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom AI Bar - always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-4 md:left-auto md:right-4 md:w-auto">
        {!isOpen && (
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-xl shadow-black/10 md:rounded-2xl md:border md:shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 md:px-5 md:py-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/20 group-active:scale-95 transition-transform">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Pergunte ao Assistente AI</p>
                <p className="text-[11px] text-muted-foreground">Peças, compatibilidade, recomendações...</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                AI
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};
