import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import type { BillingInterval, SubscriptionPlan } from "../api/types";
import { formatDuration, formatMoney } from "../lib/format";

type Draft = {
  slug: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  durationDays: string;
  sortOrder: string;
  badge: string;
  isActive: boolean;
  billingInterval: BillingInterval;
  promoActive: boolean;
  promoPercentOff: string;
  promoAmountOff: string;
  promoStartsAt: string;
  promoEndsAt: string;
  syncStripe: boolean;
};

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  description: "",
  price: "",
  currency: "PKR",
  durationDays: "30",
  sortOrder: "0",
  badge: "",
  isActive: true,
  billingInterval: "one_time",
  promoActive: false,
  promoPercentOff: "",
  promoAmountOff: "",
  promoStartsAt: "",
  promoEndsAt: "",
  syncStripe: true,
});

function toDraft(p: SubscriptionPlan): Draft {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    price: String(p.priceCents / 100),
    currency: p.currency,
    durationDays: String(p.durationDays),
    sortOrder: String(p.sortOrder),
    badge: p.badge,
    isActive: p.isActive,
    billingInterval: p.billingInterval ?? "one_time",
    promoActive: Boolean(p.promoActive),
    promoPercentOff: p.promoPercentOff != null ? String(p.promoPercentOff) : "",
    promoAmountOff:
      p.promoAmountOffCents != null ? String(p.promoAmountOffCents / 100) : "",
    promoStartsAt: p.promoStartsAt ? p.promoStartsAt.slice(0, 16) : "",
    promoEndsAt: p.promoEndsAt ? p.promoEndsAt.slice(0, 16) : "",
    syncStripe: true,
  };
}

function draftPayload(draft: Draft) {
  const priceCents = Math.round(Number(draft.price) * 100);
  const durationDays = Number(draft.durationDays);
  const sortOrder = Number(draft.sortOrder);
  if (!Number.isFinite(priceCents) || priceCents < 0) throw new Error("Invalid price");
  if (!Number.isFinite(durationDays) || durationDays < 1) throw new Error("Invalid duration");

  const promoPercentOff = draft.promoPercentOff.trim()
    ? Number(draft.promoPercentOff)
    : null;
  const promoAmountOffCents = draft.promoAmountOff.trim()
    ? Math.round(Number(draft.promoAmountOff) * 100)
    : null;

  return {
    slug: draft.slug.trim().toLowerCase(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    priceCents,
    currency: draft.currency.trim().toUpperCase() || "PKR",
    durationDays,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    badge: draft.badge.trim(),
    isActive: draft.isActive,
    billingInterval: draft.billingInterval,
    syncStripe: draft.syncStripe,
    promoActive: draft.promoActive,
    promoPercentOff,
    promoAmountOffCents,
    promoStartsAt: draft.promoStartsAt ? new Date(draft.promoStartsAt).toISOString() : null,
    promoEndsAt: draft.promoEndsAt ? new Date(draft.promoEndsAt).toISOString() : null,
  };
}

export function AdminPlansPanel({
  token,
  onMessage,
}: {
  token: string;
  onMessage: (kind: "ok" | "error", text: string) => void;
}) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await api.listAdminPlans(token);
    setPlans(res.plans);
  }

  useEffect(() => {
    void load().catch((err) =>
      onMessage("error", err instanceof Error ? err.message : "Failed to load plans")
    );
  }, [token]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function startEdit(p: SubscriptionPlan) {
    setEditingId(p.id);
    setDraft(toDraft(p));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = draftPayload(draft);
      if (editingId) {
        await api.patchPlan(token, editingId, body);
        onMessage("ok", body.syncStripe ? "Plan updated and synced to Stripe." : "Plan updated.");
      } else {
        await api.createPlan(token, body);
        onMessage("ok", body.syncStripe ? "Plan created and synced to Stripe." : "Plan created.");
        setDraft(emptyDraft());
      }
      await load();
    } catch (err) {
      onMessage("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(p: SubscriptionPlan) {
    setBusy(true);
    try {
      await api.patchPlan(token, p.id, { isActive: !p.isActive });
      onMessage("ok", p.isActive ? `“${p.title}” deactivated.` : `“${p.title}” activated.`);
      await load();
    } catch (err) {
      onMessage("error", err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function syncStripe(p: SubscriptionPlan) {
    setBusy(true);
    try {
      await api.syncPlanStripe(token, p.id);
      onMessage("ok", `Stripe sync OK for “${p.title}”.`);
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Stripe sync failed";
      onMessage(
        "error",
        /billing is not enabled|stripe is not configured|STRIPE_SECRET_KEY/i.test(msg)
          ? "Billing is not enabled yet. Add Stripe keys on the server, then Sync Stripe."
          : msg
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-cloud-panel software-shell">
      <div className="admin-cloud-head">
        <div>
          <p className="kicker">Catalog</p>
          <h2>Subscription plans</h2>
          <p className="muted">
            Public pricing + Stripe Checkout. Set billing interval, limited-time promo, and sync
            Product/Price to Stripe.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={startCreate} disabled={busy}>
          New plan
        </button>
      </div>

      <div className="admin-table-wrap" style={{ margin: "0 0 20px", boxShadow: "none" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Billing</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No plans yet — create one or run backend seed.
                </td>
              </tr>
            )}
            {plans.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="cell-strong">{p.title}</div>
                  <div className="muted small">
                    {p.slug}
                    {p.badge ? ` · ${p.badge}` : ""}
                    {p.promoActive ? " · promo" : ""}
                    {p.stripePriceId ? " · Stripe" : ""}
                  </div>
                </td>
                <td className="small">
                  {p.promoActive && p.effectivePriceCents != null && p.effectivePriceCents < p.priceCents
                    ? `${formatMoney(p.effectivePriceCents, p.currency)} (was ${formatMoney(p.priceCents, p.currency)})`
                    : formatMoney(p.priceCents, p.currency)}
                </td>
                <td className="small">
                  {p.billingInterval ?? "one_time"} · {formatDuration(p.durationDays)}
                </td>
                <td className="small">{p.isActive ? "Active" : "Inactive"}</td>
                <td className="actions">
                  <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={busy}
                    onClick={() => void syncStripe(p)}
                  >
                    Sync Stripe
                  </button>
                  <button
                    type="button"
                    className={p.isActive ? "btn btn-danger" : "btn btn-primary"}
                    disabled={busy}
                    onClick={() => void toggleActive(p)}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="admin-plan-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit plan" : "Create plan"}</h3>
        <div className="admin-cloud-grid">
          <label>
            Title
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              required
              disabled={busy}
            />
          </label>
          <label>
            Slug
            <input
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              placeholder="monthly"
              required
              disabled={busy}
            />
          </label>
          <label>
            Price ({draft.currency || "PKR"})
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              required
              disabled={busy}
            />
          </label>
          <label>
            Currency
            <input
              value={draft.currency}
              onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
              disabled={busy}
            />
          </label>
          <label>
            Duration (days)
            <input
              type="number"
              min={1}
              value={draft.durationDays}
              onChange={(e) => setDraft((d) => ({ ...d, durationDays: e.target.value }))}
              required
              disabled={busy}
            />
          </label>
          <label>
            Billing interval
            <select
              value={draft.billingInterval}
              disabled={busy}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  billingInterval: e.target.value as BillingInterval,
                }))
              }
            >
              <option value="month">month (recurring)</option>
              <option value="year">year (recurring)</option>
              <option value="one_time">one_time (Event)</option>
            </select>
          </label>
          <label>
            Sort order
            <input
              type="number"
              min={0}
              value={draft.sortOrder}
              onChange={(e) => setDraft((d) => ({ ...d, sortOrder: e.target.value }))}
              disabled={busy}
            />
          </label>
          <label>
            Badge
            <input
              value={draft.badge}
              onChange={(e) => setDraft((d) => ({ ...d, badge: e.target.value }))}
              placeholder="Best value"
              disabled={busy}
            />
          </label>
          <label className="cloud-toggle" style={{ alignSelf: "end", marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={draft.isActive}
              disabled={busy}
              onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))}
            />
            <span>Active on public pricing</span>
          </label>
          <label className="cloud-toggle" style={{ alignSelf: "end", marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={draft.syncStripe}
              disabled={busy}
              onChange={(e) => setDraft((d) => ({ ...d, syncStripe: e.target.checked }))}
            />
            <span>Sync to Stripe on save</span>
          </label>
          <label className="admin-cloud-span">
            Description
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              disabled={busy}
            />
          </label>
        </div>

        <h3 style={{ marginTop: 20 }}>Limited-time promo</h3>
        <div className="admin-cloud-grid">
          <label className="cloud-toggle" style={{ alignSelf: "end", marginBottom: 6 }}>
            <input
              type="checkbox"
              checked={draft.promoActive}
              disabled={busy}
              onChange={(e) => setDraft((d) => ({ ...d, promoActive: e.target.checked }))}
            />
            <span>Promo active</span>
          </label>
          <label>
            Percent off
            <input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={draft.promoPercentOff}
              onChange={(e) => setDraft((d) => ({ ...d, promoPercentOff: e.target.value }))}
              disabled={busy}
              placeholder="10"
            />
          </label>
          <label>
            Amount off ({draft.currency})
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.promoAmountOff}
              onChange={(e) => setDraft((d) => ({ ...d, promoAmountOff: e.target.value }))}
              disabled={busy}
              placeholder="0"
            />
          </label>
          <label>
            Promo starts
            <input
              type="datetime-local"
              value={draft.promoStartsAt}
              onChange={(e) => setDraft((d) => ({ ...d, promoStartsAt: e.target.value }))}
              disabled={busy}
            />
          </label>
          <label>
            Promo ends
            <input
              type="datetime-local"
              value={draft.promoEndsAt}
              onChange={(e) => setDraft((d) => ({ ...d, promoEndsAt: e.target.value }))}
              disabled={busy}
            />
          </label>
        </div>

        <div className="panel-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : editingId ? "Save plan" : "Create plan"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={startCreate}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
