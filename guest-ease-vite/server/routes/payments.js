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

// router.post("/store-payment", async (req, res) => {
//   try {
//     const { payment_intent_id, amount, booking_id, user_id } = req.body;

//     const { data, error } = await supabase.from("payments").insert([
//       {
//         payment_intent_id,
//         amount,
//         booking_id,
//         user_id,
//         status: "succeeded",
//       },
//     ]);

//     if (error) throw error;

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.post("/store-payment", async (req, res) => {
//   try {
//     const { payment_intent_id, amount, booking_id, user_id } = req.body;

//     // Update existing payment row
//     const { data, error } = await supabase
//       .from("payments")
//       .update({
//         status: "succeeded",
//         payment_intent_id,
//         amount,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("booking_id", booking_id)
//       .eq("user_id", user_id)
//       .select();

//     if (error) throw error;

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// // });

// router.post("/store-payment", async (req, res) => {
//   try {
//     const { payment_intent_id, amount, booking_id, user_id } = req.body;

//     const { data, error } = await supabase
//       .from("payments")
//       .update({
//         status: "succeeded",
//         payment_intent_id,
//         amount,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("booking_id", booking_id)
//       .eq("user_id", user_id)
//       .select();

//     if (error) throw error;

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

router.post("/store-payment", async (req, res) => {
  try {
    console.log("📩 /store-payment called");
    console.log("➡️ Incoming body:", req.body);

    const { payment_intent_id, amount, booking_id, user_id } = req.body;

    // 1. Update payment row
    console.log("📝 Updating payment row...");
    const { data: paymentUpdate, error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "succeeded",
        payment_intent_id,
        amount,
        updated_at: new Date().toISOString(),
      })
      .eq("booking_id", booking_id)
      .eq("user_id", user_id)
      .select();

    if (paymentError) {
      console.error("❌ Payment update failed:", paymentError);
      throw paymentError;
    }

    console.log("✅ Payment updated:", paymentUpdate);

    // 2. Fetch user profile
    console.log("👤 Fetching user profile...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, first_name")
      .eq("id", user_id)
      .single();

    if (profileError) {
      console.error("❌ Failed to fetch profile:", profileError);
      throw profileError;
    }

    console.log("✅ Profile fetched:", profile);

    // 3. Fetch booking details
    console.log("📘 Fetching booking details...");
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("check_in, check_out, guests, total_price, room_id")
      .eq("id", booking_id)
      .single();

    if (bookingError) {
      console.error("❌ Failed to fetch booking:", bookingError);
      throw bookingError;
    }

    console.log("✅ Booking fetched:", booking);

    // 4. Fetch room details
    console.log("🏨 Fetching room details...");
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", booking.room_id)
      .single();

    if (roomError) {
      console.error("❌ Failed to fetch room:", roomError);
      throw roomError;
    }

    console.log("✅ Room fetched:", room);

    // 5. Send confirmation email
    console.log("📧 Sending confirmation email to:", profile.email);

    const emailResponse = await fetch("http://localhost:3000/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: "Your Booking Has Been Confirmed",
        body: `
             <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:20px; text-align:center; background:#e26d5c;">
              <h2 style="margin:0; color:#fff;">Your Booking Has Been Confirmed</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:24px; color:#444;">
              <p>Hello <strong>${
                profile.first_name ?? profile.email
              }</strong>,</p>
              <p>Your booking has been created. Here are the details:</p>
              <div style="background:#f9f9f9; border:1px solid #e5e7eb; padding:16px; border-radius:6px;">
                <p><strong>Room:</strong> ${room.name}</p>
                <p><strong>Check-in:</strong> ${booking.check_in}</p>
                <p><strong>Check-out:</strong> ${booking.check_out}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                <p><strong>Total Price:</strong> €${booking.total_price.toFixed(
                  2
                )}</p>
              </div>
              <div style="text-align:center; margin-top:24px;">
                <a href="http://localhost:5173/account"
                   style="background:#e26d5c; color:#fff; padding:10px 20px; border-radius:5px;">
                  My Trips
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
        `,
      }),
    });

    console.log("📨 Email service response status:", emailResponse.status);

    if (!emailResponse.ok) {
      const text = await emailResponse.text();
      console.error("❌ Email service error:", text);
    } else {
      console.log("✅ Confirmation email sent successfully");
    }

    res.json({ success: true, data: paymentUpdate });
  } catch (err) {
    console.error("🔥 STORE PAYMENT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
