import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

const result = dotenv.config({ path: ".env" }); // explicitly load .env
if (result.error) {
  console.error("Failed to load .env file:", result.error);
  process.exit(1); // stop server if .env missing
}
console.log("Loaded env variables:", Object.keys(process.env));
console.log("server.js loaded...");
process.on("exit", (code) => console.log("Process exiting with code", code));
process.on("uncaughtException", (err) =>
  console.error("Uncaught exception:", err)
);
process.on("unhandledRejection", (err) =>
  console.error("Unhandled rejection:", err)
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ---------------------------
   CORS FIX
---------------------------- */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log("Received CORS preflight:", req.method, req.url);
    return res.sendStatus(200);
  }
  next();
});

/* ---------------------------
   Logging
---------------------------- */
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

/* ---------------------------
   Email notifications
---------------------------- */
app.post("/send_email", async (req, res) => {
  const { email, subject, body, from } = req.body;

  if (!email || !subject || !body) {
    return res.status(400).json({
      status: "error",
      error: "Missing email, subject or body",
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        from: from || "onboarding@resend.dev",
        subject,
        html: body,
      }),
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // fallback for HTML responses
    }

    console.log("Resend API Response:", data);

    if (response.ok) {
      return res.json({ status: "Email sent", data });
    } else {
      return res.status(response.status).json({ status: "error", data });
    }
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

/* ---------------------------
   Delete user
---------------------------- */

app.post("/delete_user", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Node should use plain SUPABASE_URL, not VITE_ prefix

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return res.status(500).json({
        error:
          "SUPABASE_URL or SERVICE_ROLE_KEY missing in environment variables",
      });
    }

    const endpoint = `${SUPABASE_URL}/auth/v1/admin/users/${userId}`;
    console.log("Deleting user at:", endpoint);

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Delete failed:", err);
      return res.status(500).json({ error: err });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Admin update booking endpoint
---------------------------- */
// Admin update booking endpoint
app.post("/admin/update_booking", async (req, res) => {
  const { bookingId, updates } = req.body;

  if (!bookingId || !updates) {
    return res.status(400).json({ error: "Missing bookingId or updates" });
  }

  try {
    // Use Node-compatible environment variables (NOT VITE_*)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return res.status(500).json({
        error:
          "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment variables",
      });
    }

    // Create Supabase admin client (service role bypasses RLS)
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update(updates)
      .eq("id", bookingId)
      /**
       * We created a relationship between bookings.user_id and profiles.id through a
       * a foreign key constraint.
       * Every user_id in the bookings table must exist in the profiles table.
       * https://www.tutorialsteacher.com/postgresql/add-constraint
       *
       */
      .select("*, profiles!bookings_user_id_fkey(email)");
    // .select();

    if (error) {
      console.error("Admin update failed:", error);
      return res.status(500).json({ error: error.message });
    }

    /* --------------------------
       SEND EMAIL NOTIFICATION
    --------------------------- */
    /**
     * If a relationship is created between profiles and bookings, you can get the email
     * by going from bookings (take the first one in the array), then access profiles
     * (the data from the user related to the booking), and grab the email.
     */
    const email = data?.[0]?.profiles?.email;

    if (email) {
      await fetch("http://localhost:3000/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: "Your Booking Was Updated by Admin",
          body: `
            <h2>Your booking was updated</h2>
            <p><strong>New Check-in:</strong> ${updates.check_in}</p>
            <p><strong>New Check-out:</strong> ${updates.check_out}</p>
            <p><strong>Guests:</strong> ${updates.guests}</p>
          `,
        }),
      });
    }

    return res.json({ message: "Booking updated successfully", data });
  } catch (err) {
    console.error("Admin update error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Admin delete booking endpoint
---------------------------- */
app.post("/admin/delete_booking", async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Missing bookingId" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return res.status(500).json({
        error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing",
      });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Delete the booking
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      /**
       * We created a relationship between bookings.user_id and profiles.id through a
       * a foreign key constraint.
       * Every user_id in the bookings table must exist in the profiles table.
       * https://www.tutorialsteacher.com/postgresql/add-constraint
       *
       */
      .select("*, profiles!bookings_user_id_fkey(email)");
    //  .select();

    if (error) {
      console.error("Admin delete failed:", error);
      return res.status(500).json({ error: error.message });
    }

    /* --------------------------
       SEND EMAIL
    --------------------------- */
    /**
     * If a relationship is created between profiles and bookings, you can get the email
     * by going from bookings (take the first one in the array), then access profiles
     * (the data from the user related to the booking), and grab the email.
     */
    const email = data?.[0]?.profiles?.email;
    if (email) {
      await fetch("http://localhost:3000/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: "Your Booking Was Cancelled by Admin",
          body: `
            <h2>Your Booking Was Cancelled</h2>
            <p>Your booking with ID <strong>${bookingId}</strong> was removed by an administrator.</p>
          `,
        }),
      });
    }

    return res.json({
      message: "Booking deleted successfully",
      deleted: data,
    });
  } catch (err) {
    console.error("Admin delete error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Stripe Payment Intent
---------------------------- */
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Create a PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency = "usd" } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Missing amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency,
      payment_method_types: ["card"],
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

import { supabase } from "./supabaseClientServer.js";

app.post("/store-payment", async (req, res) => {
  try {
    const { payment_intent_id, amount, booking_id, user_id } = req.body;
    console.log("PAYLOAD WE ARE SENDING:", {
      payment_intent_id,
      amount,
      booking_id,
      user_id,
      status: "succeeded",
    });

    const { data, error } = await supabase.from("payments").insert([
      {
        payment_intent_id,
        amount,
        booking_id,
        user_id,
        status: "succeeded", // or "pending"
      },
    ]);
    console.log("SUPABASE ERROR RAW:", error);

    if (error) throw error;

    console.log("Payment stored:", data);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error storing payment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------------
   Start server
---------------------------- */
app.listen(3000, () => {
  console.log("Email server running on http://localhost:3000");
});

/* ---------------------------
   Start server
---------------------------- */
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Email server running on http://localhost:${PORT}`);
// });

// // Keep Node alive in case Git Bash exits immediately
// setInterval(() => {
//   // Heartbeat log every 60 seconds (optional)
//   console.log("Server heartbeat — still alive");
// }, 60000);
//
