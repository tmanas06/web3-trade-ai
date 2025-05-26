/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  fetchSupportedChains,
  fetchAllTokens,
  fetchQuote,
  fetchApproveTransaction,
  fetchSwap,
  fetchTransactionHistory,
  AggregatorToken,
  SupportedChain,
  DexQuoteResponse,
  SwapResponse,
} from "@/services/okxDexService";
import { useWallet } from "@/contexts/WalletContext";

const CYBER_CARD =
  "w-full max-w-2xl mx-auto backdrop-blur-xl bg-gradient-to-br from-[#0f2233cc] to-[#09111dcc] border border-cyan-400/40 shadow-2xl rounded-2xl p-8 mt-12";
const CYBER_INPUT =
  "bg-[#0e1a2a] text-cyan-100 border border-cyan-400/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition";
const CYBER_BTN =
  "bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:from-blue-400 hover:to-cyan-500 transition-all duration-200";
const CYBER_BTN_DISABLED =
  "bg-gradient-to-r from-gray-700 to-gray-900 text-gray-400 font-semibold rounded-xl px-6 py-3 opacity-60 cursor-not-allowed";

export default function Swap() {
  const { connected, walletAddress, connect, balance } = useWallet();
  const [chains, setChains] = useState<SupportedChain[]>([]);
  const [tokens, setTokens] = useState<AggregatorToken[]>([]);
  const [chainIndex, setChainIndex] = useState<string>("1");
  const [fromToken, setFromToken] = useState<AggregatorToken | null>(null);
  const [toToken, setToToken] = useState<AggregatorToken | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [quote, setQuote] = useState<DexQuoteResponse | null>(null);
  const [swapResult, setSwapResult] = useState<SwapResponse | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load supported chains on mount
  useEffect(() => {
    fetchSupportedChains()
      .then(setChains)
      .catch(() => setError("Failed to load chains"));
  }, []);

  // Load tokens when chain changes
  useEffect(() => {
    if (!chainIndex) return;
    fetchAllTokens(chainIndex)
      .then(setTokens)
      .catch(() => setError("Failed to load tokens"));
  }, [chainIndex]);

  // Fetch quote when user fills all fields
  useEffect(() => {
    setError(null);
    setQuote(null);
    if (!fromToken || !toToken || !amount || !chainIndex) return;
    setLoadingQuote(true);
    fetchQuote({
      chainIndex,
      amount,
      fromTokenAddress: fromToken.tokenContractAddress,
      toTokenAddress: toToken.tokenContractAddress,
    })
       
      .then((data: any) => {
        // OKX API returns code !== "0" for errors (e.g. insufficient liquidity)
        if (!data || data === undefined) {
          setError("No quote available");
          setQuote(null);
         
        } else if ((data as any).code && (data as any).code !== "0") {
           
          setError((data as any).msg || "Failed to fetch quote");
          setQuote(null);
        } else if ((data as any).toTokenAmount === undefined) {
          setError("No quote available");
          setQuote(null);
        } else {
          setQuote(data);
        }
      })
      .catch((err) => setError(err.message || "Failed to fetch quote"))
      .finally(() => setLoadingQuote(false));
  }, [fromToken, toToken, amount, chainIndex]);

  // Handle swap
  const handleSwap = async () => {
    setError(null);
    if (!connected || !walletAddress || !fromToken || !toToken || !amount || !quote) {
      setError("Missing fields or wallet not connected");
      return;
    }
    // Check user balance (for EVM/ETH, use wallet context; for ERC-20, fetch balance)
    if (Number(amount) > Number(balance)) {
      setError(`Insufficient ${fromToken.tokenSymbol} balance`);
      return;
    }
    setLoadingSwap(true);
    try {
      // Approve token if needed (for ERC-20, not native)
      if (
        fromToken.tokenSymbol !== "ETH" &&
        fromToken.tokenSymbol !== "SOL"
      ) {
        await fetchApproveTransaction(
          chainIndex,
          fromToken.tokenContractAddress,
          amount
        );
      }
      // Fetch swap data
      const swapData = await fetchSwap({
        chainIndex,
        amount,
        fromTokenAddress: fromToken.tokenContractAddress,
        toTokenAddress: toToken.tokenContractAddress,
        slippage: "0.005",
        userWalletAddress: walletAddress,
      });
      setSwapResult(swapData);

      // Send transaction using the user's wallet extension
      if (swapData.tx) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: swapData.tx.from,
              to: swapData.tx.to,
              value: swapData.tx.value,
              data: swapData.tx.data,
              gas: swapData.tx.gas,
              gasPrice: swapData.tx.gasPrice,
            },
          ],
        });
        setTxHash(hash);
      }
    } catch (err: any) {
      setError(err.message || "Swap failed");
    } finally {
      setLoadingSwap(false);
    }
  };

  // Poll transaction status if txHash is set
  useEffect(() => {
    if (!txHash) return;
    const interval = setInterval(async () => {
      try {
        const status = await fetchTransactionHistory({ chainIndex, txHash });
        setTxStatus(status.status);
        if (status.status === "success" || status.status === "fail")
          clearInterval(interval);
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [txHash, chainIndex]);

  // UI logic
  const canSwap =
    connected &&
    fromToken &&
    toToken &&
    amount &&
    Number(amount) > 0 &&
    Number(amount) <= Number(balance) &&
    !loadingQuote &&
    !loadingSwap &&
    quote &&
    !error;

return (
    <div
      className="flex-1 min-h-screen bg-gradient-to-br from-[#151e2e] to-[#0a1727] px-4"
    >
      <div className="pt-12 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-300 drop-shadow-lg tracking-tight mb-2">
          Swap
        </h1>
        <p className="text-cyan-100/80 text-lg">
          Swap tokens across chains with best prices. Powered by OKX DEX Aggregator.
        </p>
      </div>
      <div className={CYBER_CARD}>
        {/* Network selector */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-cyan-200">
            Network
          </label>
          <select
            value={chainIndex}
            onChange={(e) => setChainIndex(e.target.value)}
            className={CYBER_INPUT + " w-full"}
          >
            {chains.map((chain) => (
              <option key={chain.chainIndex} value={chain.chainIndex}>
                {chain.chainName}
              </option>
            ))}
          </select>
        </div>
        {/* Token selectors */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-cyan-200">
              From
            </label>
            <select
              value={fromToken?.tokenContractAddress || ""}
              onChange={(e) =>
                setFromToken(
                  tokens.find(
                    (t) => t.tokenContractAddress === e.target.value
                  ) || null
                )
              }
              className={CYBER_INPUT + " w-full"}
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option
                  key={token.tokenContractAddress}
                  value={token.tokenContractAddress}
                >
                  {token.tokenSymbol}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-cyan-200">
              To
            </label>
            <select
              value={toToken?.tokenContractAddress || ""}
              onChange={(e) =>
                setToToken(
                  tokens.find(
                    (t) => t.tokenContractAddress === e.target.value
                  ) || null
                )
              }
              className={CYBER_INPUT + " w-full"}
            >
              <option value="">Select token</option>
              {tokens.map((token) => (
                <option
                  key={token.tokenContractAddress}
                  value={token.tokenContractAddress}
                >
                  {token.tokenSymbol}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Amount input */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-cyan-200">
            Amount
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null); // Clear error on amount change
            }}
            className={CYBER_INPUT + " w-full"}
            placeholder="Enter amount"
          />
          {fromToken && (
            <div className="text-xs text-cyan-400 mt-1">
              Balance: {balance} {fromToken.tokenSymbol}
            </div>
          )}
        </div>
        {/* Connect wallet */}
        {!connected ? (
          <button
            onClick={connect}
            className={CYBER_BTN + " w-full mb-4"}
          >
            Connect OKX Wallet
          </button>
        ) : (
          <div className="mb-2 text-sm text-cyan-300 font-mono">
            Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </div>
        )}
        {/* Quote display */}
        {quote && !loadingQuote && (
          <div className="my-4 p-4 rounded-xl bg-[#0a1727cc] border border-cyan-400/10 shadow-inner">
            <div>
              <span className="font-semibold">Rate:</span>{" "}
              1 {fromToken?.tokenSymbol} ≈{" "}
              {Number(quote.toTokenAmount) / Number(amount || 1)}{" "}
              {toToken?.tokenSymbol}
            </div>
            <div>
              <span className="font-semibold">Minimum Received:</span>{" "}
              {quote.toTokenAmount} {toToken?.tokenSymbol}
            </div>
            <div>
              <span className="font-semibold">Estimated Fee:</span>{" "}
              {quote.tradeFee} USD
            </div>
            <div>
              <span className="font-semibold">Route:</span>{" "}
              {quote.dexRouterList
                .map((r) =>
                  r.subRouterList
                    .map((s) =>
                      s.dexProtocol.map((p) => p.dexName).join(", ")
                    )
                    .join(", ")
                )
                .join(", ")}
            </div>
          </div>
        )}
        {/* Error message */}
        {error && (
          <div className="text-pink-400 mb-2">{error}</div>
        )}
        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={!canSwap || loadingSwap}
          className={
            !canSwap || loadingSwap
              ? CYBER_BTN_DISABLED + " w-full"
              : CYBER_BTN + " w-full"
          }
        >
          {loadingSwap ? "Swapping..." : "Swap"}
        </button>
        {/* Transaction status */}
        {txHash && (
          <div className="mt-4 text-sm font-mono text-cyan-200">
            Tx Hash:{" "}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {txHash.slice(0, 8)}...{txHash.slice(-8)}
            </a>
            <div>
              Status:{" "}
              <span
                className={
                  txStatus === "success"
                    ? "text-green-400"
                    : txStatus === "fail"
                    ? "text-pink-400"
                    : "text-yellow-400"
                }
              >
                {txStatus || "Pending"}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-cyan-700/60 text-xs">
        Powered by OKX DEX Aggregator. <br />
      </div>
    </div>
  );
}
