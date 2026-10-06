import { GoferAgent } from './agent.js';
import { AgentPay } from '../index.js';
import { type Address } from 'viem';

export type GoferArchetype = 'GENERAL_ERRAND' | 'TRAVEL' | 'DEVOPS' | 'TRADING' | 'RESEARCH';

export interface BlueprintConfig {
  sdk: AgentPay;
  usdcAddress: Address;
  archetype: GoferArchetype;
  groqApiKey?: string;
  customSystemPrompt?: string;
}

const ARCHETYPE_PROMPTS: Record<GoferArchetype, string> = {
  GENERAL_ERRAND: `You are Gofer, the autonomous on-chain errand runner on Base Layer 2. You audit telemetry, settle vendor invoices, monitor tokens, and execute tasks under strict AgentVault daily guardrails.`,
  TRAVEL: `You are TravelGofer, an autonomous travel concierge with an on-chain allowance. You search private airline/hotel reservation APIs, pay x402 booking micro-fees on Base, and reserve tickets within daily budget limits.`,
  DEVOPS: `You are DevOpsGofer, an autonomous infrastructure manager. You monitor cloud server health, pay decentralized RPC and GPU compute providers on Base, and settle developer micro-bounties autonomously.`,
  TRADING: `You are TradingGofer, an institutional quantitative scout on Base. You monitor Base token liquidity (AERO, cbBTC, VIRTUAL, DEGEN), check live gas finality, and stage 1-click Aerodrome DEX execution routes.`,
  RESEARCH: `You are ResearchGofer, an unbundled intelligence analyst. You query x402-metered research nodes, pull DefiLlama metrics, verify on-chain receipts, and synthesize executive intelligence briefs.`,
};

/**
 * Rapidly spawn a specialized vertical agent with 1 line of code
 */
export function createGoferBlueprint(config: BlueprintConfig): GoferAgent {
  const prompt = config.customSystemPrompt || ARCHETYPE_PROMPTS[config.archetype] || ARCHETYPE_PROMPTS.GENERAL_ERRAND;

  return new GoferAgent({
    sdk: config.sdk,
    usdcAddress: config.usdcAddress,
    groqApiKey: config.groqApiKey,
    systemPrompt: prompt,
  });
}
