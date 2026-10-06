export const GOFER_TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'get_vault_budget',
      description: 'Check available USDC spending allowance and active limits in AgentVault.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_base_network_telemetry',
      description: 'Check live Base Layer 2 gas fees, block number, and settlement congestion.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_institutional_market_data',
      description: 'Fetch real-time ETH spot price and Base network Total Value Locked (TVL).',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'track_base_token',
      description: 'Fetch live on-chain price, liquidity, and 24h volume for any token on Base (e.g. AERO, VIRTUAL, DEGEN, cbBTC, or any 0x contract address).',
      parameters: {
        type: 'object',
        properties: {
          tokenOrAddress: { type: 'string', description: 'Symbol like "AERO", "VIRTUAL", "DEGEN" or 0x contract address' },
        },
        required: ['tokenOrAddress'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'execute_outbound_payment',
      description: 'Execute an on-chain USDC payment to an address on Base under vault limits.',
      parameters: {
        type: 'object',
        properties: {
          recipient: { type: 'string', description: '0x destination address' },
          amountUsdc: { type: 'string', description: 'Amount in USDC (e.g. "2.50")' },
          memo: { type: 'string', description: 'Payment memo' },
        },
        required: ['recipient', 'amountUsdc'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'stage_dex_swap',
      description: 'Stage an on-chain Aerodrome DEX swap on Base for user approval.',
      parameters: {
        type: 'object',
        properties: {
          amountInUsdc: { type: 'string', description: 'Amount in USDC' },
        },
        required: ['amountInUsdc'],
      },
    },
  },
];
