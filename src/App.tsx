import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Markets from "./pages/Markets";
import Wallet from "./pages/Wallet";
import TradingPage from "./pages/Trading"; 
import Swap from "./pages/Swap";
import Data from "./pages/Data";
import Settings from "./pages/Settings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WalletProvider } from "./contexts/WalletContext";
import { AiSuggestionsProvider } from "@/contexts/AiSuggestionsContext";
import { useEffect } from 'react';
import { AIAssistant } from './components/ai/AIAssistant';
import { TradeBar } from './components/trading/TradeBar';

const queryClient = new QueryClient();

// Add theme class to the root HTML element
const useThemeClass = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    // Initial theme class
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
};

// Layout component to maintain consistent structure across routes
const Layout = ({ children }: { children: React.ReactNode }) => {
  useThemeClass();
  
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <TradeBar className="sticky top-0 z-10" />
            <div className="flex-1 overflow-auto">
              {children}
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/markets" 
                element={
                  <Layout>
                    <Markets />
                  </Layout>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <Layout>
                    <Wallet />
                  </Layout>
                } 
              />
              <Route 
                path="/trading" 
                element={
                  <Layout>
                    <TradingPage /> 
                  </Layout>
                } 
              />
              <Route 
                path="/swap" 
                element={
                  <Layout>
                    <Swap />
                  </Layout>
                } 
              />
              <Route 
                path="/data" 
                element={
                  <Layout>
                    <Data />
                  </Layout>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
