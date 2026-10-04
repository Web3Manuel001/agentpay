// --- PROTOCOL CLIENT & TYPES ---
export { AgentPay, type SessionStatus } from './client.js';
export { createX402Paywall, type X402PaywallConfig } from './middleware.js';
export * from './types.js';

// --- GOFER AUTONOMOUS BRAIN & BLUEPRINTS ---
export { GoferAgent } from './brain/agent.js';
export { GroqClient, type GroqMessage } from './brain/groq.js';
export { 
  createGoferBlueprint, 
  type GoferArchetype, 
  type BlueprintConfig 
} from './brain/blueprints.js';

// --- EXECUTION ENGINES ---
export { GoferEngine, type ErrandResult } from './gofer-engine.js';

// --- MODULAR ON-CHAIN & MARKET TOOLS ---
export { getBaseTokenMetrics, KNOWN_BASE_TOKENS } from './tools/tokens.js';
export { getMarketMetrics } from './tools/market.js';
export { getBaseTelemetry } from './tools/telemetry.js';
export { getVaultAllowance } from './tools/vault.js';
export { executeOutboundPayment } from './tools/payments.js';
export { stageAerodromeSwap } from './tools/swaps.js';
