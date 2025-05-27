import React from 'react';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from 'lucide-react';
import ConnectWalletButton from '@/components/crypto/ConnectWalletButton';

export function Header() {
  return (
    <header className="border-b border-white/10 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <div className="ml-4 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search markets, assets..."
              className="bg-secondary/50 border border-white/10 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-crypto-accent w-64"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
