import { 
  ConnectOpts, 
  PhantomProvider, 
  PublicKey, 
  Signer, 
  Transaction 
} from '@solana/web3.js';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isConnected: boolean;
      connect: (opts?: ConnectOpts) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage: (message: Uint8Array | string, display?: string) => Promise<{ signature: Uint8Array }>;
      request: (request: { method: string; params?: any }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
    phantom?: {
      solana: PhantomProvider;
    };
  }
}
