import type { Amount } from "@template/domain/assets";
import type { Action } from "@template/domain/calc";

export const getDefaultDeposits = (action: Action): Record<string, Amount> => {
  if ("many" in action) {
    return action.many.reduce<Record<string, Amount>>(
      (acc, action) =>
        Object.values(getDefaultDeposits(action)).reduce((acc, deposit) => {
          const existing = acc[deposit.denom] as Amount | undefined;
          return {
            ...acc,
            [deposit.denom]: existing ? { ...deposit, amount: existing.amount + deposit.amount } : deposit,
          };
        }, acc),
      {},
    );
  }

  if ("schedule" in action && action.schedule.action) {
    return getDefaultDeposits(action.schedule.action);
  }

  if ("swap" in action) {
    return {
      [action.swap.swap_amount.denom]: action.swap.swap_amount,
    };
  }

  return {};
};

export const getDefaultWithdrawalDenoms = (action: Action, escrowed: string[]): string[] => {
  if ("many" in action) {
    return action.many.flatMap((action) => getDefaultWithdrawalDenoms(action, escrowed));
  }

  if ("schedule" in action && action.schedule.action) {
    return getDefaultWithdrawalDenoms(action.schedule.action, escrowed);
  }

  if ("swap" in action) {
    return escrowed.includes(action.swap.swap_amount.denom) ? [] : [action.swap.swap_amount.denom];
  }

  return [];
};
