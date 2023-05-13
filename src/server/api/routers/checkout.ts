import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    return stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        userId: ctx.session.user.id,
      },
      success_url: `${env.HOST_NAME}`,
      line_items: [{ price: "price_1N7KuXJr66qpZG9ndV8CAPqd", quantity: 1 }],
      mode: "payment",
    });
  }),
});
