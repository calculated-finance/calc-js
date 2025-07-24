import type { Amount } from "@template/domain/src/assets";
import type { Action } from "@template/domain/src/calc";

export const getDefaultDeposits = (action: Action): Record<string, Amount> => {
  if ("many" in action) {
    return action.many.reduce(
      (acc, action) =>
        Object.values(getDefaultDeposits(action)).reduce(
          (acc, deposit) => ({
            ...acc,
            [deposit.denom]: acc[deposit.denom]
              ? {
                  ...deposit,
                  amount: acc[deposit.denom].amount + deposit.amount,
                }
              : deposit,
          }),
          acc,
        ),
      {} as Record<string, Amount>,
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
