// // server.js
// import express from "express";
// import fetch from "node-fetch";
// import dotenv from "dotenv";

// dotenv.config(); // Load .env variables

// const app = express();
// app.use(express.json());

// // Ensure RESEND_API_KEY is set
// if (!process.env.RESEND_API_KEY) {
//   console.error("Error: RESEND_API_KEY is not set in .env");
//   process.exit(1);
// }

// // Single, robust /send_email route
// app.post("/send_email", async (req, res) => {
//   const { email, subject, body } = req.body;

//   if (!email || !subject || !body) {
//     return res
//       .status(400)
//       .json({ status: "error", error: "Missing email, subject, or body" });
//   }

//   try {
//     // Call Resend API
//     const response = await fetch("https://api.resend.com/send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         from: "andrea.nardinocchi76@gmail.com", // VERIFIED in Resend
//         to: email,
//         subject,
//         html: body,
//       }),
//     });

//     console.log("HTTP status:", response.status);
//     const data = await response.json();
//     console.log("Resend API response:", data);

//     if (response.ok) {
//       res.json({ status: "Email sent", data });
//     } else {
//       res.status(response.status).json({ status: "error", data });
//     }
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ status: "error", error: err.message });
//   }
// });

// // Start server
// app.listen(3000, () => {
//   console.log("Email server running on http://localhost:3000");
// });

// // server.js
// import express from "express";
// import fetch from "node-fetch";
// import dotenv from "dotenv";

// dotenv.config(); // Load .env variables

// const app = express();
// app.use(express.json());

// // Ensure RESEND_API_KEY is set
// if (!process.env.RESEND_API_KEY) {
//   console.error("Error: RESEND_API_KEY is not set in .env");
//   process.exit(1);
// }

// // /send_email route
// app.post("/send_email", async (req, res) => {
//   const { email, subject, body } = req.body;

//   if (!email || !subject || !body) {
//     return res
//       .status(400)
//       .json({ status: "error", error: "Missing email, subject, or body" });
//   }

//   try {
//     // Call Resend API
//     const response = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         from: "onboarding@resend.dev", // VERIFIED sender
//         to: email,
//         subject,
//         html: body,
//       }),
//     });

//     // Log HTTP status and API response
//     console.log("HTTP status:", response.status);
//     const data = await response.json();
//     console.log("Resend API response:", data);

//     // Respond to caller
//     if (response.ok) {
//       res.json({ status: "Email sent", data });
//     } else {
//       res.status(response.status).json({ status: "error", data });
//     }
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ status: "error", error: err.message });
//   }
// });

// // Start server
// app.listen(3000, () => {
//   console.log("Email server running on http://localhost:3000");
// });

// server.js
//

// server.js
// server.js
// server.js
// server.js
// import express from "express";
// import fetch from "node-fetch";
// import "dotenv/config";

// const app = express();
// app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// app.post("/send_email", async (req, res) => {
//   const { email, subject, body, from } = req.body;

//   if (!email || !subject || !body) {
//     return res
//       .status(400)
//       .json({ status: "error", error: "Missing email, subject, or body" });
//   }

//   try {
//     // Call Resend API
//     const response = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         to: email,
//         from: from || "onboarding@resend.dev", // sandbox sender
//         subject,
//         html: body,
//       }),
//     });

//     const data = await response.json();
//     console.log("Resend API response:", data);

//     if (response.ok) {
//       res.json({ status: "Email sent", data });
//     } else {
//       res.status(response.status).json({ status: "error", data });
//     }
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ status: "error", error: err.message });
//   }
// });

// app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// import express from "express";
// import fetch from "node-fetch";
// import "dotenv/config";
// import pkg from "pg";
// const { Pool } = pkg;

// const app = express();
// app.use(express.json());

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Supabase DB URL
//   ssl: { rejectUnauthorized: false },
// });

// app.post("/send_email_queue", async (req, res) => {
//   try {
//     const client = await pool.connect();

//     const { rows } = await client.query(
//       "SELECT * FROM public.mail_queue WHERE sent = false ORDER BY created_at ASC"
//     );

//     for (let mail of rows) {
//       try {
//         // Send email via Resend API
//         const response = await fetch("https://api.resend.com/emails", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//           },
//           body: JSON.stringify({
//             to: mail.recipient,
//             from: "onboarding@resend.dev",
//             subject: mail.subject,
//             html: mail.body,
//           }),
//         });

//         if (response.ok) {
//           await client.query(
//             "UPDATE public.mail_queue SET sent = true, sent_at = now() WHERE id = $1",
//             [mail.id]
//           );
//           console.log("Email sent to", mail.recipient);
//         } else {
//           const err = await response.json();
//           console.error("Failed to send email", err);
//         }
//       } catch (err) {
//         console.error("Error sending email", err);
//       }
//     }

//     client.release();
//     res.json({ status: "done" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", error: err.message });
//   }
// });

// app.listen(3000, () =>
//   console.log("Email server running on http://localhost:3000")
// );

import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

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
   Email endpoint
---------------------------- */
// app.post("/send_email", async (req, res) => {
//   const { email, subject, body, from } = req.body;

//   if (!email || !subject || !body) {
//     return res.status(400).json({
//       status: "error",
//       error: "Missing email, subject or body",
//     });
//   }

//   try {
//     const response = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         to: email,
//         from: from || "onboarding@resend.dev",
//         subject,
//         html: body,
//       }),
//     });

//     const data = await response.json();

//     console.log("Resend API Response:", data);

//     if (response.ok) {
//       return res.json({ status: "Email sent", data });
//     } else {
//       return res.status(500).json({ status: "error", data });
//     }
//   } catch (err) {
//     console.error("Email error:", err);
//     return res.status(500).json({
//       status: "error",
//       error: err.message,
//     });
//   }
// });

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
   Email endpoint
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
      .select();

    if (error) {
      console.error("Admin update failed:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Booking updated successfully", data });
  } catch (err) {
    console.error("Admin update error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Start server
---------------------------- */
app.listen(3000, () => {
  console.log("Email server running on http://localhost:3000");
});

// import express from "express";
// import fetch from "node-fetch";
// import "dotenv/config";

// const app = express();
// app.use(express.json());

// // -------------------------------------------------------------
// // ⭐ ADD THIS FUNCTION HERE (top of file, before routes)
// // -------------------------------------------------------------
// function buildBookingEmail({ room_id, check_in, check_out, guests }) {
//   return `
//   <!DOCTYPE html>
//   <html lang="en" style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
//     <body style="background-color: #f5f6f7; padding: 20px;">
//       <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
//         <tr>
//           <td style="background-color: #4f46e5; padding: 24px; text-align: center; color: white;">
//             <h1 style="margin: 0; font-size: 24px;">Booking Confirmed 🎉</h1>
//           </td>
//         </tr>

//         <tr>
//           <td style="padding: 24px;">
//             <p style="font-size: 16px; color: #333;">
//               Hi 👋,<br/><br/>
//               Your booking has been successfully confirmed. Here are your details:
//             </p>

//             <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//               <tr><td style="padding: 10px 0; font-weight: bold;">🏨 Room ID:</td><td>${room_id}</td></tr>
//               <tr><td style="padding: 10px 0; font-weight: bold;">📅 Check-in:</td><td>${check_in}</td></tr>
//               <tr><td style="padding: 10px 0; font-weight: bold;">📅 Check-out:</td><td>${check_out}</td></tr>
//               <tr><td style="padding: 10px 0; font-weight: bold;">👤 Guests:</td><td>${guests}</td></tr>
//             </table>

//             <p style="font-size: 16px; color: #333; margin-top: 20px;">
//               If you have any questions or want to modify your reservation, simply reply to this email.
//             </p>

//             <p style="font-size: 16px; color: #333; margin-top: 20px;">
//               Thanks for choosing GuestEase ❤️
//             </p>
//           </td>
//         </tr>

//         <tr>
//           <td style="background-color: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #888;">
//             GuestEase • Powered by Supabase & Resend
//           </td>
//         </tr>
//       </table>
//     </body>
//   </html>`;
// }

// // -------------------------------------------------------------
// // Logging middleware
// // -------------------------------------------------------------
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);

//   // Handle CORS preflight
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

// // -------------------------------------------------------------
// // MAIN SEND EMAIL ROUTE
// // -------------------------------------------------------------
// app.post("/send_email", async (req, res) => {
//   const { email, subject, bookingDetails } = req.body;

//   if (!email || !subject || !bookingDetails) {
//     return res.status(400).json({
//       status: "error",
//       error: "Missing email, subject, or bookingDetails",
//     });
//   }

//   // Build the HTML email
//   const htmlBody = buildBookingEmail(bookingDetails);

//   try {
//     const response = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         to: email,
//         from: "onboarding@resend.dev",
//         subject,
//         html: htmlBody,
//       }),
//     });

//     const data = await response.json();
//     console.log("Resend API response:", data);

//     if (response.ok) {
//       res.json({ status: "Email sent", data });
//     } else {
//       res.status(response.status).json({ status: "error", data });
//     }
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ status: "error", error: err.message });
//   }
// });

// // -------------------------------------------------------------
// // Start server
// // -------------------------------------------------------------
// app.listen(3000, () =>
//   console.log("Email server running on http://localhost:3000")
// );
