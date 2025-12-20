import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Container,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/useAuth";
import { Link as RouterLink } from "react-router-dom";

const ReviewPage: React.FC = () => {
  const { id } = useParams(); // booking ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState<any | null>(null);
  const [room, setRoom] = useState<any | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("Guest");
  const [firstName, setFirstName] = useState<string>("Guest");
  const [guestAccount, setGuestAccount] = useState<string>("Guest");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single();

        if (bookingError || !bookingData) {
          setError("Booking not found.");
          return;
        }

        setBooking(bookingData);

        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", bookingData.room_id)
          .single();

        if (roomError || !roomData) {
          setError("Room not found.");
          return;
        }

        const parsedRoom = {
          ...roomData,
          images:
            typeof roomData.images === "string"
              ? JSON.parse(roomData.images)
              : roomData.images,
        };

        setRoom(parsedRoom);

        if (bookingData.user_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", bookingData.user_id)
            .single();

          if (profileData) {
            const name = `${profileData.first_name || ""} ${
              profileData.last_name || ""
            }`.trim();
            setGuestAccount(bookingData.user_id.slice(-8));
            setFirstName(profileData.first_name || "Guest");
            setGuestName(name || "Guest");
          }
        }
      } catch {
        setError("Unexpected error fetching data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment.");
      return;
    }

    if (!booking || !user) {
      alert("Unable to submit review.");
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        booking_id: booking.id,
        room_id: booking.room_id,
        user_id: user.id,
        rating,
        comment,
        created_at: new Date(),
      });

      if (error) throw error;

      alert("Review submitted!");
      navigate("/account");
    } catch (err: any) {
      alert("Error submitting review: " + err.message);
    }
  };

  if (!user)
    return <Alert severity="warning">Please log in to write a review.</Alert>;

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!booking || !room)
    return <Alert severity="error">Booking or room not found.</Alert>;

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <Typography variant="h3" component={"h1"}>
        Hello <strong>{firstName}</strong>!
      </Typography>
      <Typography variant="h5" component={"h2"} sx={{ mb: 8, fontWeight: 300 }}>
        Account <strong>#{guestAccount}</strong>
      </Typography>

      <Grid container spacing={8}>
        {/* LEFT COLUMN — IMAGE * */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: {
              xs: "100%", // full width on mobile
              sm: "100%", // slightly smaller on small tablets
              md: "45%", // back to full width on desktop
              lg: "45%", // adjust for large screens
            },
          }}
        >
          <Box
            component="img"
            // src={`/assets/${room.images?.[0]}`}
            src={getPublicUrl(room.images[0])}
            alt={room.name}
            sx={{
              width: "100%",

              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
          <Typography sx={{ mt: "8%", mb: "1%" }}>
            <strong>Reservation Number:</strong> #{booking.id.slice(-12)}
          </Typography>

          <Typography sx={{ mb: "3.5%" }}>
            <strong>Stay:</strong> from {booking.check_in} to{" "}
            {booking.check_out}.
          </Typography>
          <Typography sx={{ mb: "5%", color: "text.primary" }}>
            We were delighted to have you stay in{" "}
            <MuiLink
              component={RouterLink}
              to={`/booking-confirmation/${booking.id}`}
              sx={{
                textDecoration: "none",
                color: "#000000de",
                "&:hover": {
                  // textDecoration: "underline",
                  color: "#EFF5E0",
                },
              }}
            >
              <strong>{room.name}</strong>
            </MuiLink>{" "}
            and we would really be glad to know more about your journey
            experience with us!
          </Typography>
        </Grid>

        {/* RIGHT COLUMN — REVIEW CARD */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: {
              xs: "100%", // full width on mobile
              sm: "100%", // slightly smaller on small tablets
              md: "45%", // back to full width on desktop
              lg: "45%", // adjust for large screens
            },
            height: "300%",
            mb: 10,
            maxHeight: {
              xs: "100%",
              sm: "100%",
              md: 400, // 👈 KEY FIX
              lg: 350,
            },
          }}
        >
          <Card sx={{ width: "100%" }} elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ color: "#000000de", mb: 2 }}>
                Tell us about your stay in {room.name} 😀!
              </Typography>

              <Typography>
                Guest: <strong>{guestName}</strong>
              </Typography>

              <Typography sx={{ mb: 2 }}></Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" mb={1}>
                  Your Rating
                </Typography>
                <Rating
                  value={rating}
                  onChange={(_, value) => setRating(value)}
                  size="large"
                />
              </Box>

              <TextField
                label="Your Comment"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mb: 1,
                  backgroundColor: "#E26D5C",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#c95b4d",
                  },
                }}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>

              <Button
                fullWidth
                onClick={() => navigate("/account")}
                color="error"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReviewPage;
