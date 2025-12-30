import express from "express";
import fetch from "node-fetch";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const router = express.Router();

/* ---------------------------
   Admin update booking
---------------------------- */
router.post("/admin/update_booking", async (req, res) => {
  const { bookingId, updates } = req.body;

  if (!bookingId || !updates) {
    return res.status(400).json({ error: "Missing bookingId or updates" });
  }

  // Validation
  const checkInDate = new Date(updates.check_in);
  const checkOutDate = new Date(updates.check_out);
  console.log("CheckInOut: ", updates.check_in, updates.check_out);
  if (checkOutDate <= checkInDate) {
    return res
      .status(400)
      .json({ error: "Check-out must be at least 1 day after check-in" });
  }

  try {
    const { data: roomData, error: roomError } = await supabaseAdmin
      .from("rooms")
      .select("price")
      .eq("id", updates.room_id)
      .single();

    if (roomError || !roomData) {
      return res.status(400).json({ error: "Room not found" });
    }

    const nights =
      (new Date(updates.check_out) - new Date(updates.check_in)) /
      (1000 * 60 * 60 * 24);

    const total_price = nights * roomData.price;

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ ...updates, total_price })
      .eq("id", bookingId)
      .select("*, profiles!bookings_user_id_fkey(email)");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

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
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Admin delete booking
---------------------------- */
router.post("/admin/delete_booking", async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Missing bookingId" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingId)
      .select("*, profiles!bookings_user_id_fkey(email)");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

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
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Admin create booking
---------------------------- */
router.post("/admin/create_booking", async (req, res) => {
  const { room_id, user_email, check_in, check_out, guests } = req.body;

  if (!room_id || !user_email || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Validation
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  if (checkOutDate <= checkInDate) {
    return res
      .status(400)
      .json({ error: "Check-out must be at least 1 day after check-in" });
  }

  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, email")
      .eq("email", user_email)
      .single();

    if (userError || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    const { data: room, error: roomError } = await supabaseAdmin
      .from("rooms")
      .select("price")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return res.status(400).json({ error: "Room not found" });
    }

    const nights =
      (new Date(check_out).getTime() - new Date(check_in).getTime()) /
      (1000 * 60 * 60 * 24);

    const total_price = nights * room.price;

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert([
        { room_id, user_id: user.id, check_in, check_out, guests, total_price },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const subject = "✨ Your Booking Is Confirmed by Admin — GuestEase";
    const body = ` <p>Hi ${
      user.first_name || "there"
    },</p> <p>Your booking has been successfully confirmed! Here are the details:</p> <ul> <li>Room ID: ${room_id}</li> <li>Check-in: ${check_in}</li> <li>Check-out: ${check_out}</li> <li>Guests: ${guests}</li> <li>Total Price: €${total_price}</li> </ul> <p>Thank you for choosing GuestEase!</p> `;

    await fetch("http://localhost:3000/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, subject, body }),
    });

    return res.json({ success: true, booking: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
