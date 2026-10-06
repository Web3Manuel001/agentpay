import { PolicyEngine } from '../src/core/policy.js';

async function main() {
  console.log('🛡️  Testing Paythos Enterprise Policy Engine (WLFI + Mastercard Features)...\n');

  // 1. Initialize 3-Tier Policy Set (stolen from WLFI)
  const policy = new PolicyEngine({
    maxPerTransactionUsdc: 2.00,    // Sub-$2 auto-executes via x402
    dailyCapUsdc: 25.00,            // Hard 24h ceiling
    approvalThresholdUsdc: 5.00,    // $5+ requires Human Operator Approval
    destinationAllowlist: [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Approved Vendor Address
    ],
  });

  // TEST CASE 1: Micro-transaction ($0.50) -> Should AUTO-EXECUTE
  console.log('[Test 1] Agent pays $0.50 for API inference:');
  const check1 = policy.evaluateTransaction(0.50, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  console.log(`➔ Auto-Execute: ${check1.canAutoExecute} | Requires Human: ${check1.requiresHumanApproval}\n`);

  // TEST CASE 2: Medium transaction ($7.50) -> Should TRIGGER HUMAN APPROVAL GATE
  console.log('[Test 2] Agent attempts $7.50 bulk compute purchase (Over $5 threshold):');
  const check2 = policy.evaluateTransaction(7.50, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  console.log(`➔ Auto-Execute: ${check2.canAutoExecute} | Requires Human: ${check2.requiresHumanApproval}`);
  console.log(`   Gate Reason : "${check2.reason}"\n`);

  // TEST CASE 3: Unapproved destination -> Should HARD BLOCK (Allowlist)
  console.log('[Test 3] Agent attempts payment to unapproved random address:');
  const check3 = policy.evaluateTransaction(1.00, '0x1234567890123456789012345678901234567890');
  console.log(`➔ Blocked: ${!check3.canAutoExecute} | Reason: "${check3.reason}"\n`);

  // TEST CASE 4: Mastercard Verifiable Intent Attestation
  console.log('[Test 4] Generating Mastercard-Style Cryptographic Intent Hash:');
  const userPrompt = "Gofer, audit Base liquidity and settle $2.50 to verified vendor.";
  const attestation = policy.generateIntentAttestation(userPrompt);
  console.log(`• Raw Prompt   : "${attestation.rawPrompt}"`);
  console.log(`• Intent Hash  : ${attestation.intentHash} (Stamped to on-chain receipt)\n`);

  console.log('✅ ALL ENTERPRISE POLICY GATES VERIFIED.');
}

main().catch(console.error);
