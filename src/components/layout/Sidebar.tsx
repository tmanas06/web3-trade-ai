
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
  Network, 
  Settings, 
  CircleDollarSign,
  Bitcoin,
  Database
} from "lucide-react";
import { Link } from "react-router-dom";

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
    title: "Trading",
    icon: CircleDollarSign,
    path: "/trading"
  },
  {
    title: "Assets",
    icon: Bitcoin,
    path: "/assets"
  },
  {
    title: "Network",
    icon: Network,
    path: "/network"
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
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-crypto-accent to-crypto-accent-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <div className="font-bold text-lg text-white">CryptoAI</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
