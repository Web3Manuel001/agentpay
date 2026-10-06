// Common Base Ecosystem Token Addresses
export const KNOWN_BASE_TOKENS: Record<string, string> = {
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  WETH: '0x4200000000000000000000000000000000000006',
  CBBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  AERO: '0x940181a94A35A4569E4529A3CDfB74e48FD98AE3',
  VIRTUAL: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
  DEGEN: '0x4ed4E862860be51a7536f064922AE8DDB3F41852',
};

export async function getBaseTokenMetrics(tokenOrAddress: string) {
  let targetAddress = tokenOrAddress.trim();

  // If a known symbol was passed, resolve its Base contract address
  const upper = targetAddress.toUpperCase();
  if (KNOWN_BASE_TOKENS[upper]) {
    targetAddress = KNOWN_BASE_TOKENS[upper];
  }

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${targetAddress}`, {
      signal: AbortSignal.timeout(4000),
    });
    const data = await res.json();

    if (data.pairs && data.pairs.length > 0) {
      // Find top liquidity pair on Base
      const basePairs = data.pairs.filter((p: any) => p.chainId === 'base');
      const topPair = basePairs.length > 0 ? basePairs[0] : data.pairs[0];

      return {
        success: true,
        network: 'Base L2 (eip155:8453)',
        tokenName: topPair.baseToken.name,
        symbol: topPair.baseToken.symbol,
        address: topPair.baseToken.address,
        priceUsd: `$${Number(topPair.priceUsd).toLocaleString()}`,
        dex: topPair.dexId.toUpperCase(),
        volume24h: `$${Number(topPair.volume?.h24 || 0).toLocaleString()}`,
        liquidityUsd: `$${Number(topPair.liquidity?.usd || 0).toLocaleString()}`,
        priceChange24h: `${topPair.priceChange?.h24 || 0}%`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: `Could not fetch Base market metrics: ${err.message}`,
    };
  }

  return {
    success: false,
    error: `No active Base liquidity pools discovered for: ${tokenOrAddress}`,
  };
}
