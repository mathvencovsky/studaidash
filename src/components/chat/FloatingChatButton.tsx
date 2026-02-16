import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat, type ChatMessage } from "@/hooks/use-chat";
import ReactMarkdown from "react-markdown";

export function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, send, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-card border-2 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">StudAI Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearMessages}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-medium">Olá! Sou o StudAI 👋</p>
                <p className="text-xs mt-1">Pergunte sobre qualquer tema de estudo.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="text-sm"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </Button>
    </>
  );
}
