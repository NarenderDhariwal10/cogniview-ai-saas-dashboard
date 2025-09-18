// server/config/stripePlans.js
export const PLAN_MAPPING = {
  [process.env.STRIPE_PRO_PRICE_ID]: "pro",
  [process.env.STRIPE_ENTERPRISE_PRICE_ID]: "enterprise",
  
};
