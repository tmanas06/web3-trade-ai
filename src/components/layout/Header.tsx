import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from 'lucide-react';
import ConnectWalletButton from '@/components/crypto/ConnectWalletButton';

export function Header() {
  return (
    <header className="border-b border-[#1a1a1a] bg-black py-3 px-8 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar and Search */}
        <div className="flex items-center">
          <SidebarTrigger />
          <div className="ml-6 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-[#00ff88]" />
            </div>
            <input
              type="text"
              placeholder="Search markets, assets..."
              className="bg-[#161a1e] border border-[#222] rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder:text-[#00ff88]/60 focus:outline-none focus:ring-2 focus:ring-[#00ff88] w-72 transition"
            />
          </div>
        </div>
        {/* Right: Connect Wallet */}
        <div className="flex items-center space-x-4">
          <ConnectWalletButton walletAddress={''} solanaDevnetBalance={0} solanaDevnetUsd={0} multiChainAssets={[]} chainsMap={undefined} totalValue={''}/>
        </div>
      </div>
    </header>
  );
}
