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
    <div className="flex flex-col h-full max-h-[90vh] w-full bg-[#121212] rounded-3xl shadow-2xl p-0 overflow-hidden border border-[#232a3b]">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-[#222] bg-gradient-to-r from-[#181f1b]/80 to-[#181f2b]/70">
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4359196a-1bc4-4d5e-9675-959667382b70/dju56b1-1496f59a-4fc6-404a-953c-2a1ac548ccae.jpg/v1/fill/w_894,h_894,q_70,strp/alien_human_by_captain773_dju56b1-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTAyNCIsInBhdGgiOiJcL2ZcLzQzNTkxOTZhLTFiYzQtNGQ1ZS05Njc1LTk1OTY2NzM4MmI3MFwvZGp1NTZiMS0xNDk2ZjU5YS00ZmM2LTQwNGEtOTUzYy0yYTFhYzU0OGNjYWUuanBnIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.PKygStponPDUK_VDQHx41eA-2RofJHlZXobBXy9W8Tw"
          alt="Drac"
          className="h-14 w-14 rounded-2xl object-cover border-4 border-[#00ff88] shadow-lg"
        />
        <div>
          <div className="font-bold text-white text-xl tracking-wide">Drac</div>
          <div className="text-xs text-[#00ff88] font-mono">Online</div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-5 bg-black/80 backdrop-blur-md">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`
                max-w-[75%] px-5 py-4 rounded-2xl text-base shadow-lg
                ${msg.role === "user"
                  ? "bg-gradient-to-br from-[#00ff88]/90 to-[#00cc6a]/90 text-black rounded-br-none font-semibold"
                  : "bg-[#181f1b]/80 border border-[#00ff88]/20 text-[#eaffea] rounded-bl-none"
                }
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-5 py-4 rounded-2xl bg-[#181f1b]/80 border border-[#00ff88]/20 text-[#eaffea] rounded-bl-none shadow-lg">
              <span className="animate-pulse">Drac is typing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-3 px-8 py-5 border-t border-[#232a3b] bg-[#161a1e]/80">
        <input
          className="flex-1 bg-[#181f1b] border border-[#222] rounded-full px-5 py-3 text-[#00ff88] placeholder-[#00ff88]/50 font-medium outline-none focus:ring-2 focus:ring-[#00ff88] transition"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="ml-2 h-12 w-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center text-black text-2xl font-bold shadow-lg hover:from-[#00cc6a] hover:to-[#00ff88] transition"
        >
          {loading ? (
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default DracChat;
