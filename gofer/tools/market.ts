export async function getMarketMetrics() {
  let ethPrice = '2,695.50';
  let baseTvl = '6.37';
  let source = 'DefiLlama Oracle';

  try {
    const priceRes = await fetch('https://coins.llama.fi/prices/current/coingecko:ethereum', {
      signal: AbortSignal.timeout(3000),
    });
    const priceData = await priceRes.json();
    if (priceData.coins?.['coingecko:ethereum']?.price) {
      ethPrice = Number(priceData.coins['coingecko:ethereum'].price).toLocaleString();
    }
  } catch {
    source = 'Cached Fallback';
  }

  try {
    const tvlRes = await fetch('https://api.llama.fi/v2/chains', {
      signal: AbortSignal.timeout(3000),
    });
    const chains = await tvlRes.json();
    const base = chains.find((c: any) => c.name.toLowerCase() === 'base');
    if (base?.tvl) {
      baseTvl = (base.tvl / 1e9).toFixed(2);
    }
  } catch {}

  return {
    ethPriceUsd: ethPrice,
    baseTvlBillionUsd: baseTvl,
    oracleSource: source,
  };
}
