import type { SubscriptionPlan } from "../api/types";

export function formatMoney(priceCents: number, currency = "PKR") {
  const amount = priceCents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatDuration(days: number) {
  if (days % 365 === 0) {
    const y = days / 365;
    return y === 1 ? "1 year" : `${y} years`;
  }
  if (days % 30 === 0 && days >= 30) {
    const m = days / 30;
    return m === 1 ? "1 month" : `${m} months`;
  }
  return days === 1 ? "1 day" : `${days} days`;
}

export function planPriceLabel(plan: Pick<SubscriptionPlan, "priceCents" | "currency" | "durationDays">) {
  return `${formatMoney(plan.priceCents, plan.currency)} / ${formatDuration(plan.durationDays)}`;
}
