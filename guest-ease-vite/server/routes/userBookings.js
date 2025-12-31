import express from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import Stripe from "stripe";

const router = express.Router();

/* ---------------------------------------
   USER UPDATE BOOKING (with payment update)
---------------------------------------- */
// router.post("/user/update_booking", async (req, res) => {
//   const { bookingId, updates, userId } = req.body;

//   // Basic validation
//   if (!bookingId || !updates || !userId) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   // Validate dates
//   const checkIn = new Date(updates.check_in);
//   const checkOut = new Date(updates.check_out);

//   if (checkOut <= checkIn) {
//     return res.status(400).json({
//       error: "Check-out must be at least 1 day after check-in",
//     });
//   }

//   try {
//     /* -----------------------------
//        1. Get room price
//     ----------------------------- */
//     const { data: room, error: roomError } = await supabaseAdmin
//       .from("rooms")
//       .select("price")
//       .eq("id", updates.room_id)
//       .single();

//     if (roomError || !room) {
//       return res.status(400).json({ error: "Room not found" });
//     }

//     /* -----------------------------
//        2. Calculate total price
//     ----------------------------- */
//     const nights =
//       (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

//     const total_price = nights * room.price;

//     /* -----------------------------
//        3. Update booking
//     ----------------------------- */
//     const { data: updated, error: updateError } = await supabaseAdmin
//       .from("bookings")
//       .update({ ...updates, total_price })
//       .eq("id", bookingId)
//       .eq("user_id", userId)
//       .select();

//     if (updateError) {
//       return res.status(500).json({ error: updateError.message });
//     }

//     /* -----------------------------
//        4. Update payment
//     ----------------------------- */
//     const { error: paymentError } = await supabaseAdmin
//       .from("payments")
//       .update({
//         amount: total_price,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("booking_id", bookingId);

//     if (paymentError) {
//       console.error("Payment update failed:", paymentError.message);
//     }

//     /* -----------------------------
//        5. Return updated booking
//     ----------------------------- */
//     return res.json({
//       success: true,
//       booking: updated[0],
//       total_price,
//     });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

router.post("/user/update_booking", async (req, res) => {
  const { bookingId, updates, userId } = req.body;

  if (!bookingId || !updates || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const checkIn = new Date(updates.check_in);
  const checkOut = new Date(updates.check_out);

  if (checkOut <= checkIn) {
    return res.status(400).json({
      error: "Check-out must be at least 1 day after check-in",
    });
  }

  try {
    // 1. Get room price
    const { data: room } = await supabaseAdmin
      .from("rooms")
      .select("price")
      .eq("id", updates.room_id)
      .single();

    if (!room) return res.status(400).json({ error: "Room not found" });

    // 2. Calculate new total price
    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

    const newTotal = nights * room.price;

    // 3. Get original payment
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("amount, payment_intent_id")
      .eq("booking_id", bookingId)
      .single();

    if (!payment) {
      return res.status(400).json({ error: "Payment record not found" });
    }

    const oldTotal = payment.amount;
    const difference = newTotal - oldTotal;

    let clientSecret = null;

    // 4. If price increased → create new PaymentIntent for the difference
    if (difference > 0) {
      //   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const intent = await stripe.paymentIntents.create({
        amount: Math.round(difference * 100), // cents
        currency: "eur",
        metadata: {
          booking_id: bookingId,
          type: "booking_adjustment",
        },
      });

      clientSecret = intent.client_secret;
    }
    if (difference < 0) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      await stripe.refunds.create({
        payment_intent: payment.payment_intent_id,
        amount: Math.abs(difference * 100),
      });
    }

    // 5. Update booking
    const { data: updated } = await supabaseAdmin
      .from("bookings")
      .update({ ...updates, total_price: newTotal })
      .eq("id", bookingId)
      .eq("user_id", userId)
      .select();

    // 6. Update payment record
    await supabaseAdmin
      .from("payments")
      .update({
        amount: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", bookingId);

    return res.json({
      success: true,
      booking: updated[0],
      newTotal,
      difference,
      requiresAdditionalPayment: difference > 0,
      clientSecret,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
