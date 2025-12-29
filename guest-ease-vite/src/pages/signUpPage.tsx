import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  MenuItem,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // adjust path as needed
import { countries } from "../types/interfaces";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignUpPage: React.FC = () => {
  useEffect(() => {
    document.title = `Sign up | GuestEase`;
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    console.log("Starting signup process...");
    console.log("Form values:", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      country,
      zipCode,
    });

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === "" ||
      zipCode.trim() === "" ||
      country === ""
    ) {
      setNameError(true);
      console.warn("Validation failed: missing required fields");
      return;
    } else if (password !== confirmPassword) {
      setPasswordError(true);
      console.warn("Validation failed: passwords do not match");
      return;
    } else {
      setNameError(false);
      setPasswordError(false);
    }

    try {
      console.log("Calling Supabase signUp...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            country: country,
            zip_code: zipCode,
          },
        },
      });

      console.log("Supabase signUp returned:", { data, error });

      if (error) {
        console.error("Error signing up:", error);
        alert(`Sign-up failed: ${error.message}`);
        return;
      }

      console.log("User signed up successfully:", data);

      // Optional: fetch the session to confirm
      const sessionRes = await supabase.auth.getSession();
      console.log("Current session after signup:", sessionRes);

      navigate("/login");
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      alert("An unexpected error occurred. Check the console for details.");
    }
  };

  return (
    <>
      {/* TOP IMAGE STRIP */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "180px", md: "260px" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="/assets/BrigidsHavenRoom1.jpg"
          alt="Signup header"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box
        sx={{
          minHeight: "50vh",
          pb: 10,
          pt: 5,
          margin: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Create your GuestEase account
            <br />
            <span style={{ fontSize: "1rem" }}>All fields required</span>
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              required
              label="First name"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your first name" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Last name"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your last name" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your email" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Passwords do not match" : ""}
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

            <TextField
              fullWidth
              required
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Passwords do not match" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              required
              label="Country"
              margin="normal"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={nameError && country === ""}
              helperText={
                nameError && country === "" ? "Please select your country" : ""
              }
            >
              {countries.map((c) => (
                <MenuItem key={c.code} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              required
              label="Zip Code"
              margin="normal"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              error={nameError && zipCode === ""}
              helperText={
                nameError && zipCode === "" ? "Please enter your zip code" : ""
              }
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "#472d30;",
                color: "#ffffff",
                "&:hover": { bgcolor: "#e26d5c" },
              }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>

            <Button
              onClick={() => navigate("/login")}
              sx={{ color: "#472d30" }}
            >
              Already have an account? Log in
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SignUpPage;
