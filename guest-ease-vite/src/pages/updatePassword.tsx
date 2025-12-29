import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `Update Password | GuestEase`;
    //   }, [t]);
  });

  /**
   * Handles Supabase's password‑reset flow.
   * When the user opens the reset link, Supabase sends a temporary
   * recovery access_token in the URL and triggers a "PASSWORD_RECOVERY" event.
   * Listening for this event ensures the recovery session is active before
   * calling updateUser({ password }), preventing the "Auth session missing!" error.
   *
   * Source: https://supabase.com/docs/guides/auth/password-reset
   */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          console.log("Recovery session loaded:", session);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const updatePassword = async () => {
    if (!password.trim()) {
      setMessage("PASSWORD CANNOT BE EMPTY.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message.toUpperCase());
    } else {
      setMessage("PASSWORD UPDATED SUCCESSFULLY.");
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        backgroundColor: "#ffffff",
        py: 8,
        mt: 10,
        px: { xs: 0, md: 4, lg: 8 },
      }}
    >
      {/* LEFT COLUMN — FORM */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Update Your Password
          </Typography>

          <Typography sx={{ mb: 3, color: "#555" }}>
            Enter your new password below to complete the reset process.
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              required
              label="New Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={updatePassword}
              sx={{
                mt: 3,
                bgcolor: "#472d30",
                color: "#ffffff",
                textTransform: "uppercase",
                fontWeight: 600,
                "&:hover": { bgcolor: "#e26d5c" },
              }}
            >
              Update Password
            </Button>

            {message && (
              <Typography
                sx={{
                  mt: 2,
                  color: message.includes("SUCCESS") ? "green" : "error.main",
                  fontWeight: 600,
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* RIGHT COLUMN — IMAGE */}
      <Container
        sx={{
          maxWidth: { xs: "lg", sm: "sm", lg: "lg" },
          mb: { sm: 6, xs: 6 },
        }}
      >
        <Box
          component="img"
          src="/assets/view-of-an-irish-bed-and-breakfast-with-eight-rooms-a.jpg"
          alt="Irish Bed and Breakfast"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: { md: "block", xs: "block" },
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            mt: { lg: 0, md: 0, sm: 6, xs: 6 },
            mb: { lg: 0, md: 0, sm: 6, xs: 6 },
          }}
        />
      </Container>
    </Box>
  );
};

export default UpdatePasswordPage;
