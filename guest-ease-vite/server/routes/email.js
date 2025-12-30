import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/send_email", async (req, res) => {
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
      data = await response.text();
    }

    if (response.ok) {
      console.log("Resend success:", data);
      return res.json({ status: "Email sent", data });
    } else {
      console.error("Resend ERROR:", { status: response.status, data });
      return res.status(response.status).json({ status: "error", data });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      error: err.message,
    });
  }
});

export default router;
