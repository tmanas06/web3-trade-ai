import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, X, Bot, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey 👋 I'm Drac. How can I help you with your DeFi portfolio today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you analyze your portfolio performance.",
        "Would you like me to check the latest market trends?",
        "I can suggest some DeFi strategies based on your holdings.",
        "Let me know if you want to optimize your yield farming positions.",
        "I can help you identify potential risks in your portfolio."
      ];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {isOpen && (
        <div className="w-96 h-[600px] bg-[#0a0a0a] rounded-2xl shadow-2xl border border-[#00ff88]/20 overflow-hidden flex flex-col backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-black" />
              <span className="font-bold text-black">Drac AI Assistant</span>
              <div className="flex items-center text-xs text-black/80">
                <div className="w-2 h-2 rounded-full bg-black mr-1"></div>
                <span>Online</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-black/80 hover:bg-black/10 hover:text-black rounded-xl"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#121212]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === 'ai' ? 'justify-start' : 'justify-end'
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[85%] relative",
                      message.sender === 'ai' 
                        ? 'bg-[#1a1f1b] border border-[#00ff88]/20 text-[#eaffea]' 
                        : 'bg-gradient-to-br from-[#00ff88] to-[#00cc6a] text-black'
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={cn(
                      "text-xs mt-1 text-right",
                      message.sender === 'ai' ? 'text-[#00ff88]/60' : 'text-black/70'
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 pl-4">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#00ff88]/20 bg-[#0a0a0a]">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about DeFi..."
                className="flex-1 bg-[#1a1f1b] border-[#00ff88]/20 text-[#00ff88] placeholder-[#00ff88]/50 rounded-xl focus:ring-2 focus:ring-[#00ff88] focus:border-transparent"
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-br from-[#00ff88] to-[#00cc6a] text-black rounded-xl px-4 hover:from-[#00cc6a] hover:to-[#00ff88] transition-all shadow-lg"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] hover:from-[#00cc6a] hover:to-[#00ff88] transition-all"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <MessageCircle className="h-6 w-6 text-black" />
        )}
      </Button>
    </div>
  );
}
