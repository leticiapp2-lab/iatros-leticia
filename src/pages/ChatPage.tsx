import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "@/components/ui/sonner";
import logoIatros from "@/assets/logo-iatros.png";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const navButtons = [
  { label: "Chat Auxiliar", href: "/chat" },
  { label: "Critérios Diagnósticos", href: "/criterios" },
  { label: "Calculadoras clínicas", href: "/calculadoras" },
  { label: "PDF editáveis", href: "/pdf" },
];

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (status: number, msg: string) => void;
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
    const body = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    onError(resp.status, body.error || "Erro desconhecido");
    return;
  }

  if (!resp.body) {
    onError(500, "Sem corpo na resposta");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

export default function ChatPage() {
  const location = useLocation();
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialSent = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (status, msg) => {
          setIsLoading(false);
          if (status === 429) {
            toast.error("Limite de requisições excedido. Aguarde alguns instantes.");
          } else if (status === 402) {
            toast.error("Créditos insuficientes para o serviço de IA.");
          } else {
            toast.error(msg);
          }
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Erro de conexão. Verifique sua internet.");
    }
  };

  useEffect(() => {
    if (initialMessage && !initialSent.current) {
      initialSent.current = true;
      sendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = () => sendMessage(input);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Francois One', sans-serif" }}
    >
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-[#7B2FBE] via-[#9B30FF] to-[#7B2FBE] flex items-center justify-center py-5 px-6">
        <img
          src={logoIatros}
          alt="IATROS"
          className="h-48 sm:h-56 md:h-64 object-contain -my-14 sm:-my-16 md:-my-20 relative z-10"
        />
      </header>

      {/* Nav */}
      <nav className="w-full bg-gradient-to-r from-[#E8720C] to-[#F59E0B] px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {navButtons.map((btn) => (
            <Link
              key={btn.href}
              to={btn.href}
              className={`border-2 border-[#D4841A] font-semibold text-base sm:text-lg px-6 sm:px-10 py-3 rounded-lg transition-colors text-center min-w-[160px] shadow-sm ${
                btn.href === "/chat"
                  ? "bg-[#D4841A] text-background"
                  : "bg-[#F5A623] hover:bg-[#E8960C] text-foreground"
              }`}
              style={{ fontFamily: "'Francois One', sans-serif" }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Chat area */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-6">
        {/* Back button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Voltar ao início</span>
        </Link>

        {/* Messages */}
        <div className="flex-1 border-2 border-[#E8720C] rounded-xl bg-[#FFF5EB] p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] max-h-[60vh]">
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8">
                <p>
                  Descreva o caso clínico: sexo, idade, queixa principal,
                  tempo de evolução e dados relevantes.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-[#7B2FBE] text-[#FFFFFF]"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Iatros está pensando...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 border border-[#E8720C]/40 rounded-lg bg-card px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Sexo, idade, queixa principal e tempo..."
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base sm:text-lg disabled:opacity-50"
              style={{ fontFamily: "'Francois One', sans-serif" }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="text-[#E8720C] hover:text-[#D4841A] transition-colors p-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
