import React, { useEffect, useState } from "react";
import { useAiSuggestions } from "@/contexts/AiSuggestionsContext";

const SENSAY_API_BASE = "https://api.sensay.io/v1/users";
const SENSAY_API_VERSION = "2025-03-25";
const SENSAY_ORG_SECRET = import.meta.env.VITE_SENSAY_ORG_SECRET as string;
const SENSAY_REPLICA_ID = "deed723e-62f0-4416-8cec-4be4d0a8692e";
const SENSAY_CHAT_URL = `https://api.sensay.io/v1/replicas/${SENSAY_REPLICA_ID}/chat/completions`;

interface TokenAsset {
  symbol: string;
  balance: string;
  tokenPrice: string;
  chainIndex: string;
}

interface ConnectInjectedWalletProps {
  walletAddress: string | null;
  solanaDevnetBalance: number;
  solanaDevnetUsd: number;
  multiChainAssets: TokenAsset[];
  chainsMap: Record<string, string>;
  totalValue: string;
}

const ConnectInjectedWallet: React.FC<ConnectInjectedWalletProps> = ({
  walletAddress,
  solanaDevnetBalance,
  solanaDevnetUsd,
  multiChainAssets,
  chainsMap,
  totalValue,
}) => {
  const [publicKey, setPublicKey] = useState<string | null>(walletAddress || null);
  const [isConnected, setIsConnected] = useState(!!walletAddress);
  const [loading, setLoading] = useState(false);
  const { setAiContent } = useAiSuggestions();

  // Sensay user check/create logic (unchanged)
  const handleSensayUser = async (walletAddress: string) => {
    try {
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

  // Build prompt and send to Sensay
  const sendPromptToSensay = async (walletAddress: string) => {
    setLoading(true);
    const hasAssets =
      solanaDevnetBalance > 0 ||
      (multiChainAssets && multiChainAssets.length > 0) ||
      (totalValue && parseFloat(totalValue) > 0);

    let prompt: string;
    if (!hasAssets) {
      prompt = [
        "I'm new to cryptocurrency and DeFi. My wallet is currently empty.",
        "Please provide 3 beginner-friendly recommendations for:",
        "1. How to safely acquire my first crypto assets",
        "2. Basic DeFi concepts I should understand",
        "3. Best practices for wallet security",
        "Make the suggestions educational and suitable for complete beginners."
      ].join('\n');
    } else {
      const solanaSection = solanaDevnetBalance > 0
        ? `- SOL (Solana Devnet): ${solanaDevnetBalance.toFixed(4)} ($${solanaDevnetUsd.toFixed(2)})`
        : "No Solana Devnet assets";

      const multiChainSection = multiChainAssets.length > 0
        ? multiChainAssets.map(token =>
            `- ${token.symbol} (${chainsMap[token.chainIndex] || 'Unknown'}): ` +
            `${parseFloat(token.balance).toFixed(4)} ($${(parseFloat(token.balance) * parseFloat(token.tokenPrice || '0')).toFixed(2)})`
          ).join('\n')
        : "No multi-chain assets";

      prompt = [
        `Hey Drac, these are my assets:`,
        `Solana Devnet:`,
        solanaSection,
        `Multi-Chain Portfolio:`,
        multiChainSection,
        `Total Portfolio Value: $${parseFloat(totalValue).toFixed(2)}`,
        "",
        "Please provide 3 personalized recommendations for:",
        "1. Asset allocation improvements",
        "2. Potential earning opportunities",
        "3. Risk management strategies",
        "Format as numbered list with brief explanations."
      ].join('\n');
    }

    try {
      const response = await fetch(SENSAY_CHAT_URL, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "X-API-Version": SENSAY_API_VERSION,
          "X-ORGANIZATION-SECRET": SENSAY_ORG_SECRET,
          "X-USER-ID": walletAddress,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: prompt,
          skip_chat_history: false,
          source: "embed"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Sensay] Error from AI:", errorText);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("[Sensay] AI Suggestions:", data);
      if (data && data.content) setAiContent(data.content);
    } catch (err) {
      console.error("[Sensay] Failed to get AI suggestions:", err);
    }
    setLoading(false);
  };

  // Call sendPromptToSensay after connect
  const handleConnect = async () => {
    try {
      if (!window.okxwallet?.solana) {
        console.error("OKX Wallet not found.");
        return;
      }

      if (isConnected) {
        await window.okxwallet.solana.disconnect();
        setIsConnected(false);
        setPublicKey(null);
        return;
      }

      const response = await window.okxwallet.solana.connect();
      const pubKey = response.publicKey.toBase58();
      setPublicKey(pubKey);
      setIsConnected(true);

      if (SENSAY_ORG_SECRET) {
        await handleSensayUser(pubKey);
        await sendPromptToSensay(pubKey);
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
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setPublicKey(null);
    };

    const handleAccountChanged = (publicKey: { toBase58: () => string }) => {
      if (publicKey) {
        setPublicKey(publicKey.toBase58());
      } else {
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
    <div className="flex flex-col items-center justify-center bg-black rounded-2xl shadow-2xl border border-[#232a3b] p-8 max-w-md mx-auto">
      <button
        onClick={handleConnect}
        disabled={loading}
        className={`w-full px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg
          ${isConnected
            ? "bg-gradient-to-br from-[#ff4e50] to-[#f9d423] text-black hover:from-[#f9d423] hover:to-[#ff4e50]"
            : "bg-gradient-to-br from-[#00ff88] to-[#00cc6a] text-black hover:from-[#00cc6a] hover:to-[#00ff88]"
          }`}
      >
        {isConnected ? "Disconnect Wallet" : loading ? "Connecting..." : "Connect OKX Wallet"}
      </button>

      {publicKey && (
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#00ff88] animate-pulse"></span>
            <span className="text-[#00ff88] font-mono text-sm">
              Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectInjectedWallet;
