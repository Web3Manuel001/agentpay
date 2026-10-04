import { type Address, parseUnits, encodeFunctionData } from 'viem';

const AERODROME_ROUTER_ABI = [
  {
    name: 'swapExactTokensForTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      {
        name: 'routes',
        type: 'tuple[]',
        components: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'stable', type: 'bool' },
          { name: 'factory', type: 'address' },
        ],
      },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
] as const;

export function stageAerodromeSwap(params: {
  tokenIn: Address;
  tokenOut: Address;
  amountInUsdc: string;
  recipient: Address;
}) {
  const amountInUnits = parseUnits(params.amountInUsdc, 6);

  const calldata = encodeFunctionData({
    abi: AERODROME_ROUTER_ABI,
    functionName: 'swapExactTokensForTokens',
    args: [
      amountInUnits,
      0n,
      [
        {
          from: params.tokenIn,
          to: params.tokenOut,
          stable: false,
          factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
        },
      ],
      params.recipient,
      BigInt(Math.floor(Date.now() / 1000) + 1200),
    ],
  });

  return {
    status: 'STAGED',
    dex: 'Aerodrome (Base)',
    amountIn: params.amountInUsdc,
    calldata,
    summary: `Staged $${params.amountInUsdc} USDC swap. Ready for 1-click execution.`,
  };
}
