import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Default Solana devnet connection
const connection = new Connection('https://api.devnet.solana.com');

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is connected on mount
  useEffect(() => {
    const checkConnected = async () => {
      try {
        const provider = window.phantom?.solana || window.solana;
        if (provider?.isPhantom && provider.isConnected) {
          const response = await provider.connect();
          const address = response.publicKey.toString();
          setWalletAddress(address);
          setConnected(true);
          await fetchWalletData(address);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnected();
  }, []);

  const fetchWalletData = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch balance
      const publicKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / 1e9; // Convert lamports to SOL
      setBalance(balanceInSOL);
      
      // Fetch recent transactions (simplified - in a real app, you'd want to index transactions)
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
      setTransactions(signatures);
      
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    try {
      const provider = window.phantom?.solana || window.solana;
      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await provider.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setConnected(true);
      await fetchWalletData(address);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    }
  };

  const disconnect = async () => {
    try {
      const provider = window.phantom?.solana || window.solana;
      if (provider?.disconnect) {
        await provider.disconnect();
      }
      setConnected(false);
      setWalletAddress(null);
      setBalance(0);
      setTransactions([]);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  return (
    <WalletContext.Provider 
      value={{
        connected,
        walletAddress,
        balance,
        connect,
        disconnect,
        transactions,
        loading,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
