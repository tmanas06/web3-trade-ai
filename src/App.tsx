import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Markets from "./pages/Markets";
import Wallet from "./pages/Wallet";
import Trading from "./pages/Trading";
import Swap from "./pages/Swap";
import Network from "./pages/Network";
import Data from "./pages/Data";
import Settings from "./pages/Settings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WalletProvider } from "./contexts/WalletContext";
import { AiSuggestionsProvider } from "@/contexts/AiSuggestionsContext";
const queryClient = new QueryClient();

// Layout component to maintain consistent structure across routes
const Layout = ({ children }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <AiSuggestionsProvider>
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
                  <Trading />
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
              path="/network" 
              element={
                <Layout>
                  <Network />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AiSuggestionsProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
