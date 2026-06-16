import mercadolivre from "./mercadolivre";
import stripe from "./stripe";
import shopify from "./shopify";
import zenvia from "./zenvia";

export const integrations = [
  mercadolivre,
  stripe,
  shopify,
  zenvia,
] as const;
