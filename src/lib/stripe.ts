import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe com chave pública
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// Preço do plano premium (em centavos)
export const PREMIUM_PRICE = 2990; // R$ 29,90
export const PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '';
