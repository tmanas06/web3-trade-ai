import React, { useRef, useState, useEffect } from "react";

// For Vite env variables
const SENSAY_REPLICA_ID = "deed723e-62f0-4416-8cec-4be4d0a8692e";
const SENSAY_API_URL = `https://api.sensay.io/v1/replicas/${SENSAY_REPLICA_ID}/chat/completions`;
const SENSAY_API_VERSION = "2025-03-25";
const SENSAY_ORG_SECRET = import.meta.env.VITE_SENSAY_ORG_SECRET as string;

// Replace with your actual user id (wallet address or username)
const SENSAY_USER_ID = "photon";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const DracChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hey 👋 I'm Drac. How can I help you with your DeFi portfolio today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(SENSAY_API_URL, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "X-API-Version": SENSAY_API_VERSION,
          "X-ORGANIZATION-SECRET": SENSAY_ORG_SECRET,
          "X-USER-ID": SENSAY_USER_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: userMsg.content,
          skip_chat_history: false,
          source: "embed",
        }),
      });

      const data = await response.json();
      const dracReply = data?.choices?.[0]?.message?.content || data?.content || "Sorry, I didn't get that.";
      setMessages((prev) => [...prev, { role: "assistant", content: dracReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error connecting to Drac." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] w-full bg-gradient-to-br from-[#6c63ff] to-[#4e54c8] rounded-3xl shadow-xl p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#6c63ff]/80">
        <img
          src="https://cdn.mos.cms.futurecdn.net/JBmrUyimnDL4eUZij2iC6k-600-80.jpg.webp"
          alt="Drac"
          className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
        />
        <div>
          <div className="font-semibold text-white">Drac</div>
          <div className="text-xs text-white/70">Online</div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-base shadow
                ${msg.role === "user"
                  ? "bg-white text-indigo-800 rounded-br-none"
                  : "bg-indigo-400/90 text-white rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-indigo-400/90 text-white rounded-bl-none shadow">
              <span className="animate-pulse">Drac is typing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 px-6 py-4 border-t border-white/10 bg-[#6c63ff]/80">
        <input
          className="flex-1 bg-white/90 rounded-full px-4 py-2 text-indigo-800 placeholder-indigo-400 outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="ml-2 h-10 w-10 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center text-white text-xl shadow transition"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default DracChat;
