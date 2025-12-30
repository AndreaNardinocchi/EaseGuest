import express from "express";
import Stripe from "stripe";
import { supabase } from "../supabaseClientServer.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency = "eur" } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Missing amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

router.post("/store-payment", async (req, res) => {
  try {
    const { payment_intent_id, amount, booking_id, user_id } = req.body;

    const { data, error } = await supabase.from("payments").insert([
      {
        payment_intent_id,
        amount,
        booking_id,
        user_id,
        status: "succeeded",
      },
    ]);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
