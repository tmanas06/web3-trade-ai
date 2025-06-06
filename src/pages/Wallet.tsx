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
import ConnectInjectedWallet from "@/components/crypto/ConnectWalletButton";

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
    <div className="p-8 space-y-10 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#00ff88] tracking-tight">Wallet Overview</h1>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* --- Section 1: Solana Devnet --- */}
      <Card className="bg-[#141a1f] border border-[#00ff88]/20 rounded-2xl shadow-2xl mb-10">
        <CardHeader>
          <CardTitle className="flex items-center text-[#00ff88]">
            <WalletIcon className="h-5 w-5 mr-2" />
            Solana Devnet Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
            </div>
          ) : (
            <div className="space-y-4">
              {connected ? (
                <Card className="bg-[#181f1b] border border-[#00ff88]/30 rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-[#00ff88]/80">OKX Wallet</p>
                        <p className="font-mono text-xs mt-1 text-[#00ff88]/70">
                          {formatAddress(walletAddress)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#00ff88]">{balance.toFixed(4)} SOL</div>
                        <div className="text-sm text-[#00ff88]/60">
                          ${(balance * 150).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#00ff88]/60 mb-4">OKX Wallet not connected</p>
                  <Button
                    onClick={connect}
                    className="bg-gradient-to-br from-[#00ff88] to-[#00cc6a] text-black font-bold px-6 py-2 rounded-xl shadow-lg hover:from-[#00cc6a] hover:to-[#00ff88] transition"
                  >
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Connect OKX Wallet
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex space-x-2 mt-6">
            <Button className="flex-1 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 rounded-xl" size="sm" disabled={!connected}>
              <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive
            </Button>
            <Button className="flex-1 bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 rounded-xl" size="sm" disabled={!connected}>
              <ArrowUpFromLine className="mr-2 h-4 w-4" /> Send
            </Button>
            <Button className="flex-1 border-[#00ff88]/30 text-[#00ff88] rounded-xl" size="sm" variant="outline" disabled={!connected}>
              <Repeat className="mr-2 h-4 w-4" /> Swap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Section 2: Multi-Chain Portfolio --- */}
      <Card className="bg-[#141a1f] border border-[#00ff88]/20 rounded-2xl shadow-2xl mb-10">
        <CardHeader>
          <CardTitle className="flex items-center text-[#00ff88]">
            <span className="mr-2">🌐</span>
            Multi-Chain Portfolio (OKX Wallet API)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-[#00ff88] mr-2">Chains:</span>
            {chains.map(chain => (
              <Button
                key={chain.chainIndex}
                size="sm"
                variant={selectedChains.includes(chain.chainIndex) ? "default" : "outline"}
                onClick={() => handleChainToggle(chain.chainIndex)}
                className={`flex items-center gap-1 rounded-lg ${
                  selectedChains.includes(chain.chainIndex)
                    ? "ring-2 ring-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]"
                    : "hover:bg-[#00ff88]/10 hover:text-[#00ff88] text-[#aaa]"
                }`}
              >
                <img src={chain.logoUrl} alt={chain.shortName} className="h-5 w-5 rounded-full" />
                {chain.shortName}
              </Button>
            ))}
            <label className="ml-4 flex items-center gap-1 text-xs cursor-pointer text-[#00ff88]/80">
              <input
                type="checkbox"
                checked={filterRisk}
                onChange={e => setFilterRisk(e.target.checked)}
                className="accent-[#00ff88]"
              />
              Filter risky tokens
            </label>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-[#00ff88]">Total Value:</span>{" "}
            <span className="text-lg font-bold text-[#00ff88]">${parseFloat(totalValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          {loadingPortfolio ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#00ff88]/20">
                    <th className="py-2 px-2 text-[#00ff88]">Token</th>
                    <th className="py-2 px-2 text-[#00ff88]">Chain</th>
                    <th className="py-2 px-2 text-[#00ff88]">Balance</th>
                    <th className="py-2 px-2 text-[#00ff88]">USD Value</th>
                    <th className="py-2 px-2 text-[#00ff88]">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenAssets.length > 0 ? tokenAssets.map(token => (
                    <tr key={token.tokenAddress + token.chainIndex} className="border-b border-[#00ff88]/10">
                      <td className="py-2 px-2 font-mono text-[#00ff88]/90">{token.symbol}</td>
                      <td className="py-2 px-2 text-[#00ff88]/80">{chains.find(c => c.chainIndex === token.chainIndex)?.shortName}</td>
                      <td className="py-2 px-2 text-[#00ff88]/80">{parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                      <td className="py-2 px-2 text-[#00ff88]/80">${(parseFloat(token.balance) * parseFloat(token.tokenPrice || "0")).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="py-2 px-2">
                        {token.isRiskToken ? <span className="text-red-400">Risk</span> : <span className="text-green-400">Safe</span>}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-[#00ff88]/50">
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
            <div className="mt-8 bg-[#181f1b] border border-[#00ff88]/20 rounded-xl p-4">
              <h3 className="font-bold mb-2 text-[#00ff88]">Check Specific Token Balance</h3>
              <div className="mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedChainForToken(selectedChains[0]);
                    setSelectedToken(null);
                    setSpecificTokenBalance(null);
                  }}
                  className="flex items-center gap-1 mb-2 text-[#00ff88] border-[#00ff88]/30"
                >
                  <img src={chains.find(c => c.chainIndex === selectedChains[0])?.logoUrl} alt="" className="h-5 w-5 rounded-full" />
                  {chains.find(c => c.chainIndex === selectedChains[0])?.shortName}
                </Button>
                <select
                  className="w-full md:w-1/2 border rounded px-2 py-1 bg-[#161a1e] text-[#00ff88]"
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
                className="mt-2 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] text-black font-bold rounded-xl shadow-lg hover:from-[#00cc6a] hover:to-[#00ff88] transition"
                disabled={!selectedChainForToken || !walletAddress || !selectedToken || loadingToken}
                onClick={handleCheckTokenBalance}
              >
                {loadingToken ? "Checking..." : "Check Balance"}
              </Button>
              {specificTokenBalance && (
                <div className="mt-4 bg-[#232a3b] border border-[#00ff88]/10 rounded p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00ff88]">{specificTokenBalance.symbol}</span>
                    <span className="ml-2 text-xs text-[#00ff88]/80">
                      {chains.find(c => c.chainIndex === specificTokenBalance.chainIndex)?.shortName}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-mono text-[#00ff88]">
                      {parseFloat(specificTokenBalance.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })}
                    </span>
                    <span className="ml-2 text-[#00ff88]/80">
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

      {/* ConnectInjectedWallet (keep this at the end, or use a modal for UX) */}
      <div className="mt-10 flex justify-center">
        <ConnectInjectedWallet
          walletAddress={walletAddress}
          solanaDevnetBalance={balance}
          solanaDevnetUsd={balance * 150}
          multiChainAssets={tokenAssets}
          chainsMap={Object.fromEntries(chains.map(c => [c.chainIndex, c.shortName]))}
          totalValue={totalValue}
        />
      </div>
      {/* --- Section 3: Transactions (add your own logic/UI here) --- */}
    </div>
  );
};

export default Wallet;
