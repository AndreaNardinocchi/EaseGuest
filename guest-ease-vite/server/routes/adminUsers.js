import express from "express";
import fetch from "node-fetch";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const router = express.Router();

/* ---------------------------
   Admin update user
---------------------------- */
router.post("/api/admin/update_user", async (req, res) => {
  try {
    const updates = req.body;

    const email = updates.email;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const { data: list, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return res.status(404).json({ error: "Auth user not found" });
    }

    const user = list.users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ error: "Auth user not found" });
    }

    const authId = user.id;

    const { error: authUpdateError } =
      await supabaseAdmin.auth.admin.updateUserById(authId, {
        user_metadata: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          role: updates.role,
          country: updates.country,
          zip_code: updates.zip_code,
        },
      });

    if (authUpdateError) {
      return res.status(400).json({ error: authUpdateError.message });
    }

    const { email: _, ...fieldsToUpdate } = updates;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(fieldsToUpdate)
      .eq("email", email)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      message: "User updated successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Admin delete user
---------------------------- */
router.post("/admin/delete_user", async (req, res) => {
  const { userId } = req.body;

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );
  if (authError) return res.status(400).json({ error: authError.message });

  const { error: dbError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (dbError) return res.status(400).json({ error: dbError.message });

  res.json({ success: true });
});

/* ---------------------------
   Get user by email
---------------------------- */
router.post("/admin/get_user_by_email", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, first_name, last_name")
      .eq("email", email)
      .single();

    if (error) return res.status(404).json({ error: "User not found" });

    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
   Create user
---------------------------- */
router.post("/api/admin/create_user", async (req, res) => {
  try {
    const { email, role, first_name, last_name, country, zip_code } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const password = Math.random().toString(36).slice(-10);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        first_name,
        last_name,
        country,
        zip_code,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const authUser = data.user;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        from: "onboarding@resend.dev",
        subject: "Your GuestEase Account",
        html: `
      <h2>Welcome to GuestEase!</h2>
      <p>Your temporary password is:</p>
      <p><strong>${password}</strong></p>
    `,
      }),
    });

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: authUser.id,
        email: authUser.email,
        role: role || "user",
        first_name,
        last_name,
        country,
        zip_code,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    return res.status(201).json({
      success: true,
      user: data.user,
      tempPassword: password,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
