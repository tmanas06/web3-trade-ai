
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleUser } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI trading assistant. I can help you analyze market trends, optimize your portfolio, and provide insights on your trading strategies. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "Based on current market conditions, I suggest increasing your Solana allocation by 5%. The recent protocol upgrades show promising potential for price appreciation.",
        "Your portfolio is currently 60% correlated with BTC. To reduce risk, consider diversifying into some low-correlation assets like LINK or DOT.",
        "The OKX market data shows a bullish divergence pattern on the 4h chart for SOL/USDT. This could indicate a potential reversal.",
        "I've analyzed your recent trades. Your win rate is 62%, but your risk-reward ratio could be improved. Consider setting tighter stop losses.",
        "Volatility in the market is expected to increase in the next 24 hours due to upcoming economic data releases. You might want to reduce leverage temporarily."
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <Card className="glass-effect h-full flex flex-col">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg flex items-center">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-crypto-accent to-crypto-accent-purple flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
          AI Trading Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-crypto-accent text-white rounded-br-none' 
                    : 'bg-secondary/50 border border-white/10 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, portfolio advice..."
            className="flex-1 bg-secondary/50 border border-white/10"
          />
          <Button type="submit" size="sm">Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}
