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

/** Friendly copy when API returns Stripe-not-configured 503s. */
export function formatBillingError(err: unknown, fallback = "Request failed"): string {
  const msg = err instanceof Error ? err.message : fallback;
  if (/billing is not enabled|stripe is not configured|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET/i.test(msg)) {
    return "Billing is not enabled yet. Checkout and Sync Stripe will work after Stripe keys are set on the server.";
  }
  return msg || fallback;
}
