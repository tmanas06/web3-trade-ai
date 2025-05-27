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
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-crypto-accent to-crypto-accent-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <Link to="/" className="font-bold text-lg text-white">CryptoAI</Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? 'bg-accent/20' : ''}
                  >
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
