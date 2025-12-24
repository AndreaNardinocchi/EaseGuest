import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
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

interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country?: string;
  zipCode?: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  zipCode: string;
}

const ProfilePage: React.FC = () => {
  const { user, authenticate, deleteUser } = useAuth(); // <<< include deleteUser
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    zipCode: "",
  });

  const fetchUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!data.user) return;

      const sUser = data.user;

      const updatedUser: AppUser = {
        id: sUser.id,
        email: sUser.email || "",
        firstName: sUser.user_metadata?.first_name || "",
        lastName: sUser.user_metadata?.last_name || "",
        country: sUser.user_metadata?.country || "",
        zipCode: sUser.user_metadata?.zip_code || "",
        avatarUrl: sUser.user_metadata?.avatar_url || "",
        role: sUser.role,
        createdAt: sUser.created_at,
      };

      setFormData({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        country: updatedUser.country || "",
        zipCode: updatedUser.zipCode || "",
      });

      // Update context user state
      authenticate?.(updatedUser as any); // cast to match your context type
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

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
          zip_code: formData.zipCode,
        },
      });

      if (error) throw error;

      await fetchUser();
      handleClose();
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteUser?.(); // call the deleteUser function from context
    } catch (err: any) {
      alert("Failed to delete account: " + err.message);
    }
  };

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
    <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
      <SubNav />

      <Typography variant="h4" align="center" sx={{ color: "#8E4585", mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography>
              <strong>First Name:</strong> {formData.firstName}
            </Typography>
            <Typography>
              <strong>Last Name:</strong> {formData.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {formData.email}
            </Typography>
            <Typography>
              <strong>Country:</strong> {formData.country || "-"}
            </Typography>
            <Typography>
              <strong>Zip Code:</strong> {formData.zipCode || "-"}
            </Typography>
            <Typography>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography>
              <strong>Joined:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </Typography>

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                fullWidth
              >
                Update Profile
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAccount}
                fullWidth
              >
                Delete Account
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            <CardMedia
              component="img"
              image={
                user.avatarUrl ||
                "https://via.placeholder.com/500x400?text=Profile+Image"
              }
              alt="Profile"
              sx={{ height: "100%", objectFit: "cover" }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              fullWidth
            />

            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
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
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
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
  );
};

export default ProfilePage;
