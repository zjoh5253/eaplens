import Stripe from "stripe";

// Integration skeleton — not activated in MVP.
// Set STRIPE_SECRET_KEY in .env to enable billing.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 299,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    maxEmployees: 500,
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 499,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID ?? "",
    maxEmployees: 1000,
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 799,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "",
    maxEmployees: 2000,
  },
} as const;

export async function createCheckoutSession(
  organizationId: string,
  planKey: keyof typeof PLANS,
  userEmail: string
): Promise<string> {
  const plan = PLANS[planKey];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/dashboard`,
    customer_email: userEmail,
    metadata: { organizationId },
  });

  return session.url ?? appUrl;
}
