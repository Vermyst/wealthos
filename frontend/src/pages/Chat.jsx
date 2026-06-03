import { useState, useRef, useEffect } from "react";
import axios from "../utils/axios";

const suggestions = [
  "How much am I spending on food?",
  "Which debt should I pay first?",
  "Can I afford to save ₹10,000 this month?",
  "What's my biggest spending category?",
  "How long will it take to clear my debt?",
  "Where can I cut expenses?",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your WealthOS AI advisor. I have access to your real financial data — transactions, debts, and goals. Ask me anything about your money.",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: msg, time }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat", { message: msg });
      setMessages(prev => [...prev, {
        role: "assistant",
        text: res.data.reply,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Sorry, I couldn't process that right now. Please try again.",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[88vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-700))" }}>
            <i className="ti ti-message-chatbot text-white" style={{ fontSize: 16 }} />
          </div>
          <div>
            <h1 className="text-base font-medium" style={{ color: "#111827" }}>AI Financial Advisor</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs" style={{ color: "#6B7280" }}>Online · Grounded in your financial data</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#E1F5EE" }}>
          <i className="ti ti-shield-check" style={{ fontSize: 13, color: "#0F6E56" }} />
          <span className="text-xs font-medium" style={{ color: "#0F6E56" }}>Your data stays private</span>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white rounded-2xl border overflow-y-auto p-4 space-y-3 mb-3"
        style={{ borderColor: "#E5E7EB" }}>

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-700))" }}>
                <i className="ti ti-sparkles text-white" style={{ fontSize: 12 }} />
              </div>
            )}
            <div className="max-w-[75%]">
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
                style={{
                  background: m.role === "user" ? "var(--green-700)" : "#F9FAFB",
                  color: m.role === "user" ? "white" : "#374151",
                  border: m.role === "assistant" ? "0.5px solid #E5E7EB" : "none"
                }}>
                {m.role === "assistant" && (
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "#0F6E56" }}>WealthOS AI</p>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
              <p className="text-xs mt-1 px-1" style={{ color: "#9CA3AF", fontSize: 10 }}>{m.time}</p>
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 mt-0.5"
                style={{ background: "#F3F4F6" }}>
                <i className="ti ti-user" style={{ fontSize: 12, color: "#6B7280" }} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-2"
              style={{ background: "linear-gradient(135deg, var(--green-600), var(--green-700))" }}>
              <i className="ti ti-sparkles text-white" style={{ fontSize: 12 }} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm border"
              style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#0F6E56" }}>WealthOS AI</p>
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: "#9CA3AF", animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && !loading && (
        <div className="flex gap-2 flex-wrap mb-3">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="text-xs px-3 py-2 rounded-full border transition-colors hover:border-green-500 hover:text-green-700"
              style={{ borderColor: "#E5E7EB", color: "#6B7280", background: "white" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end bg-white rounded-2xl border p-2"
        style={{ borderColor: "#E5E7EB" }}>
        <textarea ref={inputRef} rows={1} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your finances... (Enter to send, Shift+Enter for new line)"
          className="flex-1 text-xs outline-none resize-none px-2 py-1.5 leading-relaxed"
          style={{ color: "#111827", maxHeight: 120 }} />
        <button onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40"
          style={{ background: "var(--green-700)" }}>
          <i className="ti ti-send text-white" style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}