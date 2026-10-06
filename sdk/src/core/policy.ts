import { type Address, keccak256, stringToBytes } from 'viem';

export interface PolicyRuleSet {
  maxPerTransactionUsdc: number; // e.g. $2.00 (under this auto-settles)
  dailyCapUsdc: number;          // e.g. $20.00
  approvalThresholdUsdc: number; // e.g. $5.00 (over this requires human approval)
  destinationAllowlist?: Address[]; // Only approved contract addresses
}

export interface IntentAttestation {
  rawPrompt: string;
  intentHash: string;
  timestamp: number;
}

export class PolicyEngine {
  private rules: PolicyRuleSet;

  constructor(rules: PolicyRuleSet) {
    this.rules = rules;
  }

  /**
   * Evaluates if a transaction can auto-execute or requires Human Approval
   */
  evaluateTransaction(amountUsdc: number, destination: Address): {
    canAutoExecute: boolean;
    requiresHumanApproval: boolean;
    reason?: string;
  } {
    // 1. Destination Allowlist Check
    if (this.rules.destinationAllowlist && this.rules.destinationAllowlist.length > 0) {
      const isAllowed = this.rules.destinationAllowlist.some(
        (addr) => addr.toLowerCase() === destination.toLowerCase()
      );
      if (!isAllowed) {
        return {
          canAutoExecute: false,
          requiresHumanApproval: false,
          reason: `Blocked: Address ${destination} is not on the approved destination allowlist.`,
        };
      }
    }

    // 2. Hard Cap Check
    if (amountUsdc > this.rules.maxPerTransactionUsdc && amountUsdc > this.rules.approvalThresholdUsdc) {
      return {
        canAutoExecute: false,
        requiresHumanApproval: false,
        reason: `Blocked: $${amountUsdc} exceeds maximum single transaction ceiling.`,
      };
    }

    // 3. Human Approval Threshold Gate (WLFI / Mastercard Pattern)
    if (amountUsdc >= this.rules.approvalThresholdUsdc) {
      return {
        canAutoExecute: false,
        requiresHumanApproval: true,
        reason: `Threshold Exceeded: $${amountUsdc} requires 1-click operator sign-off before settlement.`,
      };
    }

    // Auto-execution permitted
    return {
      canAutoExecute: true,
      requiresHumanApproval: false,
    };
  }

  /**
   * Generates a Mastercard-style Verifiable Intent Attestation
   */
  generateIntentAttestation(userPrompt: string): IntentAttestation {
    return {
      rawPrompt: userPrompt,
      intentHash: keccak256(stringToBytes(userPrompt)),
      timestamp: Date.now(),
    };
  }
}
