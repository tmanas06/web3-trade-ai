import React, { useEffect, useState } from "react";

const ConnectInjectedWallet: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check initial connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.okxwallet?.solana?.isConnected) {
        try {
          const accounts = await window.okxwallet.solana.connect();
          setPublicKey(accounts.publicKey.toBase58());
          setIsConnected(true);
        } catch (err) {
          console.error("Connection check failed:", err);
        }
      }
    };
    
    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      if (!window.okxwallet?.solana) {
        console.error("OKX Wallet not found.");
        return;
      }

      if (isConnected) {
        // Handle disconnect
        await window.okxwallet.solana.disconnect();
        setIsConnected(false);
        setPublicKey(null);
        return;
      }

      console.log("[OKX] Attempting to connect...");
      const response = await window.okxwallet.solana.connect();
      console.log("[OKX] Connected:", response?.publicKey?.toBase58?.());

      setPublicKey(response.publicKey.toBase58());
      setIsConnected(true);
    } catch (err) {
      console.error("[OKX] Connection failed:", err);
    }
  };

  useEffect(() => {
    const provider = window.okxwallet?.solana;
    if (!provider) return;

    const handleConnect = () => {
      console.log("[OKX] Wallet connected!");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("[OKX] Wallet disconnected!");
      setIsConnected(false);
      setPublicKey(null);
    };

    const handleAccountChanged = (publicKey: { toBase58: () => string }) => {
      if (publicKey) {
        const newKey = publicKey.toBase58();
        console.log(`[OKX] Switched to account ${newKey}`);
        setPublicKey(newKey);
      } else {
        console.warn("[OKX] No account available after change");
        handleDisconnect();
      }
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);
    provider.on("accountChanged", handleAccountChanged);

    return () => {
      provider.removeListener("connect", handleConnect);
      provider.removeListener("disconnect", handleDisconnect);
      provider.removeListener("accountChanged", handleAccountChanged);
    };
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={handleConnect}
        className={`px-4 py-2 rounded ${
          isConnected 
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isConnected ? "Disconnect Wallet" : "Connect OKX Wallet"}
      </button>
      
      {publicKey && (
        <div className="mt-4">
          <p className="text-sm font-mono">
            Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectInjectedWallet;