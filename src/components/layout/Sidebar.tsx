import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  Settings, 
  CircleDollarSign,
  Bitcoin,
  Database
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/"
  },
  {
    title: "Wallet",
    icon: Wallet,
    path: "/wallet"
  },
  {
    title: "Markets",
    icon: BarChart3,
    path: "/markets"
  },
  {
    title: "Swap",
    icon: Bitcoin,
    path: "/swap"
  },
  {
    title: "Data",
    icon: Database,
    path: "/data"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="bg-black border-r border-[#1a1a1a]">
      <SidebarHeader className="px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-xl">H</span>
          </div>
          <span className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-2xl font-bold text-transparent">
            HODLHub
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#666] text-xs font-medium uppercase tracking-wider px-4 mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`group rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]' 
                          : 'hover:bg-[#ffffff]/05 text-[#64f79f]'
                      }`}
                    >
                      <Link 
                        to={item.path} 
                        className="flex items-center px-4 py-3 no-underline"
                      >
                        <item.icon 
                          className={`h-5 w-5 mr-3 ${
                            isActive ? 'text-[#00ff88]' : 'text-[#666] group-hover:text-[#00ff88]'
                          }`} 
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
