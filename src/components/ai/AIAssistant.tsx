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
        <div className="w-80 h-[500px] bg-card rounded-lg shadow-xl border border-border overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Drac AI Assistant</span>
              <div className="flex items-center text-xs text-primary-foreground/80">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                <span>Online</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground/70 hover:bg-primary/90 hover:text-primary-foreground"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
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
                      "rounded-lg px-4 py-2 max-w-[80%]",
                      message.sender === 'ai' 
                        ? 'bg-background border' 
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about DeFi..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className="rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
