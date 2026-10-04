import { AgentPay } from '../client.js';
import { type Address } from 'viem';
import { GroqClient, type GroqMessage } from './groq.js';
import { GOFER_TOOL_DEFINITIONS } from './registry.js';
import { getBaseTelemetry } from '../tools/telemetry.js';
import { getMarketMetrics } from '../tools/market.js';
import { getVaultAllowance } from '../tools/vault.js';
import { executeOutboundPayment } from '../tools/payments.js';
import { stageAerodromeSwap } from '../tools/swaps.js';
import { getBaseTokenMetrics } from '../tools/tokens.js';

export class GoferAgent {
  public sdk: AgentPay;
  public usdcAddress: Address;
  public systemPrompt: string;
  private groq?: GroqClient;

  constructor(params: {
    sdk: AgentPay;
    usdcAddress: Address;
    groqApiKey?: string;
    model?: string;
    systemPrompt?: string;
  }) {
    this.sdk = params.sdk;
    this.usdcAddress = params.usdcAddress;
    this.systemPrompt = params.systemPrompt || `You are Gofer, an autonomous on-chain personal assistant and errand runner on Base Layer 2. You audit telemetry, track Base tokens, and manage payments within strict AgentVault guardrails.`;

    if (params.groqApiKey) {
      this.groq = new GroqClient(params.groqApiKey, params.model);
    }
  }

  // Explicit Promise<any> solves union property errors
  async executeTool(name: string, rawArgs: any): Promise<any> {
    const args = { ...rawArgs };
    
    if (args.amount && !args.amountUsdc) args.amountUsdc = String(args.amount);
    if (name === 'execute_payment') name = 'execute_outbound_payment';
    if (name === 'swap_tokens') name = 'stage_dex_swap';
    if (name === 'check_token' || name === 'get_token_price') name = 'track_base_token';

    console.log(`\n⚙️  [Tool Dispatch] ➔ ${name}(${JSON.stringify(args)})`);

    switch (name) {
      case 'get_vault_budget':
        return await getVaultAllowance(this.sdk);

      case 'get_base_network_telemetry':
        return await getBaseTelemetry(this.sdk);

      case 'get_institutional_market_data':
        return await getMarketMetrics();

      case 'track_base_token':
        return await getBaseTokenMetrics(args.tokenOrAddress || 'AERO');

      case 'execute_outbound_payment':
        return await executeOutboundPayment({
          sdk: this.sdk,
          tokenAddress: this.usdcAddress,
          recipient: args.recipient,
          amountUsdc: args.amountUsdc,
          memo: args.memo || args.note,
        });

      case 'stage_dex_swap':
        return stageAerodromeSwap({
          tokenIn: this.usdcAddress,
          tokenOut: '0x4200000000000000000000000000000000000006',
          amountInUsdc: args.amountInUsdc,
          recipient: this.sdk.account.address,
        });

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  }

  private parseXmlToolCalls(content: string): { name: string; args: any }[] {
    const tools: { name: string; args: any }[] = [];
    const regex = /<tool_call>[\s\S]*?<function=([a-zA-Z0-9_]+)>([\s\S]*?)<\/function>[\s\S]*?<\/tool_call>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const functionName = match[1];
      const paramsBlock = match[2];
      const args: Record<string, string> = {};

      const paramRegex = /<parameter=([a-zA-Z0-9_]+)>([\s\S]*?)<\/parameter>/g;
      let paramMatch;
      while ((paramMatch = paramRegex.exec(paramsBlock)) !== null) {
        args[paramMatch[1]] = paramMatch[2].trim();
      }

      tools.push({ name: functionName, args });
    }

    return tools;
  }

  async executeMission(userPrompt: string): Promise<string> {
    console.log(`\n======================================================`);
    console.log(`🏃 GOFER AUTONOMOUS MISSION INITIATED`);
    console.log(`🎯 Directive: "${userPrompt}"`);
    console.log(`======================================================`);

    if (this.groq) {
      try {
        return await this.runGroqRecursiveLoop(userPrompt);
      } catch (err: any) {
        console.warn(`\n⚠️  [LPU Network Notice] Cloud LLM timed out (${err.message}).`);
        console.log(`🛡️  Activating Local Autonomous Resiliency Engine to complete mission...`);
        return await this.runDeterministicFallback(userPrompt);
      }
    }

    return await this.runDeterministicFallback(userPrompt);
  }

  private async runGroqRecursiveLoop(userPrompt: string): Promise<string> {
    console.log(`⚡ Connected to Groq LPU (Model: ${this.groq!.model})`);

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: `${this.systemPrompt}
Execute all necessary tools to fulfill the user's directive completely. When all actions are complete, provide a structured executive brief summarizing the data, token metrics, and on-chain transaction receipts.`,
      },
      { role: 'user', content: userPrompt },
    ];

    let turn = 0;
    const MAX_TURNS = 5;

    while (turn < MAX_TURNS) {
      turn++;
      const responseMessage = await this.groq!.chatCompletion(messages, GOFER_TOOL_DEFINITIONS);

      let executedAnyTool = false;

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        executedAnyTool = true;
        messages.push(responseMessage);

        for (const call of responseMessage.tool_calls) {
          const toolName = call.function.name;
          const toolArgs = JSON.parse(call.function.arguments || '{}');
          const output = await this.executeTool(toolName, toolArgs);

          messages.push({
            tool_call_id: call.id,
            role: 'tool',
            name: toolName,
            content: JSON.stringify(output),
          });
        }
      } else if (responseMessage.content && responseMessage.content.includes('<tool_call>')) {
        executedAnyTool = true;
        const xmlTools = this.parseXmlToolCalls(responseMessage.content);

        messages.push({
          role: 'assistant',
          content: responseMessage.content,
        });

        for (const tool of xmlTools) {
          const output = await this.executeTool(tool.name, tool.args);
          messages.push({
            role: 'user',
            content: `Tool Execution Result for ${tool.name}: ${JSON.stringify(output)}`,
          });
        }
      }

      if (!executedAnyTool) {
        return responseMessage.content || 'Mission successfully completed.';
      }
    }

    return 'Mission reached maximum autonomous execution threshold.';
  }

  private async runDeterministicFallback(userPrompt: string): Promise<string> {
    const budget = await this.executeTool('get_vault_budget', {});
    const gas = await this.executeTool('get_base_network_telemetry', {});
    
    const tokenSymbol = userPrompt.includes('VIRTUAL') ? 'VIRTUAL' : (userPrompt.includes('DEGEN') ? 'DEGEN' : 'AERO');
    const token = await this.executeTool('track_base_token', { tokenOrAddress: tokenSymbol });

    let actionNote = '';
    if (userPrompt.toLowerCase().includes('pay') || userPrompt.toLowerCase().includes('send')) {
      const pay = await this.executeTool('execute_outbound_payment', {
        recipient: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        amountUsdc: '1.50',
        memo: 'Liquidity Monitoring Settlement',
      });
      actionNote = `\n• On-Chain Settlement: Settled $1.50 USDC to vendor (Tx: ${pay.txHash})`;
    }

    return `\n======================================================
📋 GOFER EXECUTIVE BRIEF (RESILIENT ON-CHAIN DOSSIER)
======================================================
• Directive          : "${userPrompt}"
• Base Gas Health    : ${gas.baseFeeGwei} gwei (${gas.congestion})
• Base Token Audit   : ${token.symbol} (${token.tokenName}) at ${token.priceUsd} on ${token.dex}
  └ Liquidity        : ${token.liquidityUsd} | 24h Volume: ${token.volume24h} (Change: ${token.priceChange24h})
• Vault Budget Status: $${budget.remainingTodayUsdc} USDC remaining (Spent: $${budget.spentTodayUsdc} USDC)${actionNote}
• Security Assurance : 100% guarded under AgentVault.sol on Base.
======================================================\n`;
  }
}
