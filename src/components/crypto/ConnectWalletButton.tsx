import React, { useEffect, useState } from "react";
const SENSAY_API_BASE = "https://api.sensay.io/v1/users";
const SENSAY_API_VERSION = "2025-03-25";
const SENSAY_ORG_SECRET = import.meta.env.VITE_SENSAY_ORG_SECRET as string;

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

   // Sensay user check/create logic
const handleSensayUser = async (walletAddress: string) => {
    try {
      // 1. Check if user exists
      const checkResponse = await fetch(`${SENSAY_API_BASE}/${walletAddress}`, {
        headers: {
          "X-ORGANIZATION-SECRET": SENSAY_ORG_SECRET,
          "X-API-Version": SENSAY_API_VERSION,
        },
      });

      if (checkResponse.status === 200) {
        console.log("[Sensay] User exists.");
        return true;
      }

      // 2. If not found (404), create user
      if (checkResponse.status === 404) {
        const requestBody = {
          name: walletAddress,
          id: walletAddress,
          linkedAccounts: []
        };

        const createResponse = await fetch(SENSAY_API_BASE, {
          method: "POST",
          headers: {
            "X-ORGANIZATION-SECRET": SENSAY_ORG_SECRET,
            "Content-Type": "application/json",
            "X-API-Version": SENSAY_API_VERSION,
          },
          body: JSON.stringify(requestBody),
        });

        if (createResponse.ok) {
          console.log("[Sensay] User created.");
          return true;
        } else {
          console.error("[Sensay] User creation failed.", await createResponse.text());
        }
      } else {
        console.error("[Sensay] Unexpected response:", checkResponse.status);
      }
    } catch (error) {
      console.error("[Sensay] Error checking/creating user:", error);
    }
    return false;
  };


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
      
const pubKey = response.publicKey.toBase58();
      console.log("[OKX] Connected:", pubKey);

      setPublicKey(pubKey);      
      setIsConnected(true);
      // Sensay user check/create
      if (SENSAY_ORG_SECRET) {
        await handleSensayUser(pubKey);
      } else {
        console.warn("[Sensay] Org secret missing, skipping Sensay user setup.");
      }

    } catch (err) {
      console.error("[OKX] Connection failed:", err);
      setIsConnected(false);
      setPublicKey(null);
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