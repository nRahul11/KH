/** @format */

import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_API_KEY);
  }

  return stripePromise;
};
