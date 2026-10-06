import { AgentPay } from '../index.js';

export async function getVaultAllowance(sdk: AgentPay) {
  const status = await sdk.getSessionStatus();
  return {
    dailyLimitUsdc: status.dailyLimit,
    spentTodayUsdc: status.spentToday,
    remainingTodayUsdc: status.remainingToday,
    isPolicyActive: status.isActive,
  };
}
