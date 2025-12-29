import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import SubNav from "../components/accountSubNav/accountSubNav";
import { supabase } from "../supabaseClient";
import type { User } from "../types/interfaces";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  zip_code: string;
}

const ProfilePage: React.FC = () => {
  const { user, authenticate, deleteUser } = useAuth();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    zip_code: "",
  });

  // ---------------------------------------------------
  // FETCH USER
  // ---------------------------------------------------
  const fetchUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) return;

      const sUser = data.user;

      const updatedUser: User = {
        id: sUser.id,
        email: sUser.email || "",
        first_name: sUser.user_metadata?.first_name || "",
        last_name: sUser.user_metadata?.last_name || "",
        country: sUser.user_metadata?.country || "",
        zip_code: sUser.user_metadata?.zip_code || "",
        avatarUrl: sUser.user_metadata?.avatar_url || "",
        role: sUser.role,
        created_at: sUser.created_at,
      };

      setFormData({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        country: updatedUser.country || "",
        zip_code: updatedUser.zip_code || "",
      });

      authenticate?.(updatedUser as any);
    } catch (err: any) {
      console.error("Error fetching user:", err.message);
    }
  }, [authenticate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------------------------------------------
  // SAVE PROFILE
  // ---------------------------------------------------
  const handleSave = async () => {
    try {
      // 1. Update Auth metadata (NOT email)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          country: formData.country,
          zip_code: formData.zip_code,
        },
      });
      if (authError) throw authError;

      // 2. Get REAL authenticated user ID
      const { data: sessionData } = await supabase.auth.getSession();
      const authId = sessionData.session?.user?.id;

      if (!authId) throw new Error("No authenticated user ID found");

      // 3. Prepare DB fields
      const fieldsToUpdate = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        zip_code: formData.zip_code,
      };

      // 4. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update(fieldsToUpdate)
        .eq("id", authId)
        .select("*")
        .single();

      if (profileError) throw profileError;

      await fetchUser();
      handleClose();
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  // ---------------------------------------------------
  // DELETE ACCOUNT
  // ---------------------------------------------------
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteUser?.();
    } catch (err: any) {
      alert("Failed to delete account: " + err.message);
    }
  };

  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `${user?.first_name}'s Profile Page | GuestEase`;
    //   }, [t]);
  });

  if (!user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          Please log in to view your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box maxWidth="1200px" mx="auto" px={2}>
        <Typography variant="h3">Hey {user.first_name}</Typography>
        <Typography variant="h5">Account #{user.id.slice(-8)}</Typography>
      </Box>

      <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
        <SubNav />

        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#472d30", mb: 1, mt: 3 }}
        >
          My Profile
        </Typography>

        <Grid container spacing={8} sx={{ mt: 6 }}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6} pt={4}>
            <Stack spacing={2}>
              <Typography>
                <strong>First Name:</strong> {formData.first_name}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {formData.last_name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography>
                <strong>Country:</strong> {formData.country || "-"}
              </Typography>
              <Typography>
                <strong>Zip Code:</strong> {formData.zip_code || "-"}
              </Typography>
              <Typography>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography>
                <strong>Joined:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>

              {/* BUTTONS */}
              <Box mt={6}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpen}
                    fullWidth
                    sx={{
                      backgroundColor: "#472d30",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#EFF5E0",
                        color: "#472d30",
                      },
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteAccount}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                mb: 12,
                py: 6,
                px: "5%",
                ml: { xs: 0, md: "20%" }, // responsive alignment
                bgcolor: "background.paper",
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/GuestEaseLogo.png"
                alt="GuestEase"
                sx={{
                  width: { xs: "60%", sm: "50%", md: "40%" },
                  height: "auto",
                }}
              />

              <Typography variant="h6" color="text.primary" gutterBottom>
                Comfort, Convenience, and Care
              </Typography>

              <Typography variant="body2" color="text.secondary" maxWidth={600}>
                At GuestEase, we make sure every stay feels like home. Enjoy
                cozy rooms, complimentary breakfast, and curated experiences
                around our guesthouse.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* UPDATE DIALOG */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Update Profile</DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                fullWidth
              />

              <TextField
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                fullWidth
              />

              <TextField
                label="Email (cannot change here)"
                value={formData.email}
                disabled
                fullWidth
              />

              <TextField
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                fullWidth
              />

              <TextField
                label="Zip Code"
                value={formData.zip_code}
                onChange={(e) => handleChange("zip_code", e.target.value)}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ProfilePage;
