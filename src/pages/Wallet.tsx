import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Repeat, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import {
  fetchSupportedBlockchains,
  fetchTotalValueByAddress,
  fetchAllTokenBalancesByAddress,
  fetchAllTokens,
  fetchSpecificTokenBalances,
  SupportedBlockchain,
  AggregatorToken,
  TokenAsset,
  TokenAddressQuery,
} from '@/services/okxDexService';

const Wallet = () => {
  // Solana Devnet context
  const {
    connected, walletAddress, balance, transactions,
    loading, error, connect, disconnect
  } = useWallet();

  // Multi-chain portfolio state
  const [chains, setChains] = useState<SupportedBlockchain[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [filterRisk, setFilterRisk] = useState(true);
  const [totalValue, setTotalValue] = useState<string>('0');
  const [tokenAssets, setTokenAssets] = useState<TokenAsset[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Specific token balance check state
  const [selectedChainForToken, setSelectedChainForToken] = useState<string>('');
  const [tokenList, setTokenList] = useState<AggregatorToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<AggregatorToken | null>(null);
  const [specificTokenBalance, setSpecificTokenBalance] = useState<TokenAsset | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  // Fetch supported chains on mount
  useEffect(() => {
    fetchSupportedBlockchains().then(setChains).catch(console.error);
  }, []);

  // Fetch multi-chain portfolio when address or chain selection changes
  useEffect(() => {
    if (!walletAddress || selectedChains.length === 0) return;
    setLoadingPortfolio(true);
    const chainStr = selectedChains.join(',');
    fetchTotalValueByAddress(walletAddress, chainStr, '0', filterRisk)
      .then(data => setTotalValue(data.totalValue))
      .catch(() => setTotalValue('0'));
    fetchAllTokenBalancesByAddress(walletAddress, chainStr, filterRisk ? '0' : '1')
      .then(setTokenAssets)
      .catch(() => setTokenAssets([]))
      .finally(() => setLoadingPortfolio(false));
  }, [walletAddress, selectedChains, filterRisk]);

  // When a chain is selected for token lookup, fetch its tokens
  useEffect(() => {
    if (selectedChainForToken) {
      fetchAllTokens(selectedChainForToken)
        .then(setTokenList)
        .catch(() => setTokenList([]));
    }
  }, [selectedChainForToken]);

  // Handler for checking specific token balance
  const handleCheckTokenBalance = async () => {
    if (!walletAddress || !selectedChainForToken || !selectedToken) return;
    setLoadingToken(true);
    setSpecificTokenBalance(null);
    try {
      const tokenQuery: TokenAddressQuery[] = [
        { chainIndex: selectedChainForToken, tokenAddress: selectedToken.tokenContractAddress }
      ];
      const res = await fetchSpecificTokenBalances(walletAddress, tokenQuery, "0");
      setSpecificTokenBalance(res[0] || null);
    } catch {
      setSpecificTokenBalance(null);
    } finally {
      setLoadingToken(false);
    }
  };

  // Handle chain selection for portfolio
  const handleChainToggle = (chainIndex: string) => {
    setSelectedChains(prev =>
      prev.includes(chainIndex)
        ? prev.filter(idx => idx !== chainIndex)
        : [...prev, chainIndex]
    );
    // Also set for token check if only one chain is selected
    if (!selectedChains.includes(chainIndex)) {
      setSelectedChainForToken(chainIndex);
      setSelectedToken(null);
      setSpecificTokenBalance(null);
    }
  };

  // UI helpers
  const formatAddress = (address: string | null) =>
    !address ? '' : `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">OKX Wallet</h1>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* --- Section 1: Solana Devnet --- */}
      <Card className="glass-effect mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <WalletIcon className="h-5 w-5 mr-2" />
            Solana Devnet Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {connected ? (
                <Card className="bg-secondary/30 border-crypto-accent">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">OKX Wallet</p>
                        <p className="font-mono text-xs mt-1">
                          {formatAddress(walletAddress)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{balance.toFixed(4)} SOL</div>
                        <div className="text-sm text-muted-foreground">
                          ${(balance * 150).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">OKX Wallet not connected</p>
                  <Button onClick={connect}>
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Connect OKX Wallet
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex space-x-2 mt-6">
            <Button className="flex-1" size="sm" disabled={!connected}>
              <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive
            </Button>
            <Button className="flex-1" size="sm" disabled={!connected}>
              <ArrowUpFromLine className="mr-2 h-4 w-4" /> Send
            </Button>
            <Button className="flex-1" size="sm" variant="outline" disabled={!connected}>
              <Repeat className="mr-2 h-4 w-4" /> Swap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Section 2: Multi-Chain Portfolio --- */}
      <Card className="glass-effect mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🌐</span>
            Multi-Chain Portfolio (OKX Wallet API)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-cyan-200 mr-2">Chains:</span>
            {chains.map(chain => (
              <Button
                key={chain.chainIndex}
                size="sm"
                variant={selectedChains.includes(chain.chainIndex) ? "default" : "outline"}
                onClick={() => handleChainToggle(chain.chainIndex)}
                className={`flex items-center gap-1 ${selectedChains.includes(chain.chainIndex) ? "ring-2 ring-cyan-400" : ""}`}
              >
                <img src={chain.logoUrl} alt={chain.shortName} className="h-5 w-5 rounded-full" />
                {chain.shortName}
              </Button>
            ))}
            <label className="ml-4 flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={filterRisk}
                onChange={e => setFilterRisk(e.target.checked)}
                className="accent-cyan-500"
              />
              Filter risky tokens
            </label>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-cyan-200">Total Value:</span>{" "}
            <span className="text-lg font-bold text-cyan-300">${parseFloat(totalValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          {loadingPortfolio ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700/20">
                    <th className="py-2 px-2">Token</th>
                    <th className="py-2 px-2">Chain</th>
                    <th className="py-2 px-2">Balance</th>
                    <th className="py-2 px-2">USD Value</th>
                    <th className="py-2 px-2">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenAssets.length > 0 ? tokenAssets.map(token => (
                    <tr key={token.tokenAddress + token.chainIndex} className="border-b border-cyan-700/10">
                      <td className="py-2 px-2 font-mono">{token.symbol}</td>
                      <td className="py-2 px-2">{chains.find(c => c.chainIndex === token.chainIndex)?.shortName}</td>
                      <td className="py-2 px-2">{parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                      <td className="py-2 px-2">${(parseFloat(token.balance) * parseFloat(token.tokenPrice || "0")).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="py-2 px-2">
                        {token.isRiskToken ? <span className="text-red-400">Risk</span> : <span className="text-green-400">Safe</span>}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">
                        {selectedChains.length === 0
                          ? "Select a chain to view assets."
                          : "No tokens found for selected chains/address."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Specific Token Balance Inline --- */}
          {selectedChains.length === 1 && (
            <div className="mt-8 bg-[#1a2236] rounded-xl p-4">
              <h3 className="font-bold mb-2 text-cyan-200">Check Specific Token Balance</h3>
              <div className="mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedChainForToken(selectedChains[0]);
                    setSelectedToken(null);
                    setSpecificTokenBalance(null);
                  }}
                  className="flex items-center gap-1 mb-2"
                >
                  <img src={chains.find(c => c.chainIndex === selectedChains[0])?.logoUrl} alt="" className="h-5 w-5 rounded-full" />
                  {chains.find(c => c.chainIndex === selectedChains[0])?.shortName}
                </Button>
                <select
                  className="w-full md:w-1/2 border rounded px-2 py-1 bg-[#181f2a] text-cyan-100"
                  value={selectedToken?.tokenContractAddress || ""}
                  onChange={e => {
                    const token = tokenList.find(t => t.tokenContractAddress === e.target.value);
                    setSelectedToken(token || null);
                    setSpecificTokenBalance(null);
                  }}
                  disabled={!selectedChainForToken}
                >
                  <option value="">Select token</option>
                  {/* Native token option */}
                  <option value="">
                    {chains.find(c => c.chainIndex === selectedChains[0])?.shortName} (Native)
                  </option>
                  {/* ERC-20 etc. */}
                  {tokenList.map(token => (
                    <option key={token.tokenContractAddress} value={token.tokenContractAddress}>
                      {token.tokenSymbol} - {token.tokenName}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                size="sm"
                className="mt-2"
                disabled={!selectedChainForToken || !walletAddress || !selectedToken || loadingToken}
                onClick={handleCheckTokenBalance}
              >
                {loadingToken ? "Checking..." : "Check Balance"}
              </Button>
              {specificTokenBalance && (
                <div className="mt-4 bg-[#232a3b] rounded p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-200">{specificTokenBalance.symbol}</span>
                    <span className="ml-2 text-xs text-cyan-400">
                      {chains.find(c => c.chainIndex === specificTokenBalance.chainIndex)?.shortName}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-mono">
                      {parseFloat(specificTokenBalance.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })}
                    </span>
                    <span className="ml-2 text-cyan-200">
                      {parseFloat(specificTokenBalance.tokenPrice || "0") > 0
                        ? `$${(parseFloat(specificTokenBalance.balance) * parseFloat(specificTokenBalance.tokenPrice)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                        : "No price"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs">
                    {specificTokenBalance.isRiskToken ? (
                      <span className="text-red-400">Risky Token</span>
                    ) : (
                      <span className="text-green-400">Safe</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Section 3: Transactions (existing logic or enhance as needed) --- */}
      {/* ...your existing transactions panel here... */}
    </div>
  );
};

export default Wallet;
