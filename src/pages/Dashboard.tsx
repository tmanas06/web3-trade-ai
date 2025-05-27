import React from 'react';
import { DracChat } from '@/components/crypto/DracChat';

export default function Dashboard() {
  return (
    <div className="flex h-[calc(100vh-64px)]"> {/* 64px = header height, adjust as needed */}
      {/* Left: Main dashboard content */}
      <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard & AI</h1>
        {/* ...other dashboard widgets/content here... */}
      </div>
      {/* Right: Drac Chat */}
      <div className="w-1/2 h-full flex flex-col bg-gradient-to-br from-[#6c63ff] to-[#4e54c8]">
        <DracChat />
      </div>
    </div>
  );
}
