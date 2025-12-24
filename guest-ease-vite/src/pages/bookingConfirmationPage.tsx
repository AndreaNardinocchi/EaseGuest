import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Alert,
  Grid,
  Container,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { Link as RouterLink } from "react-router-dom";

const BookingConfirmation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any | null>(null);
  const [room, setRoom] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        navigate("/", { replace: true });
        return;
      }

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
      } catch {
        setError("Unexpected error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!booking || !room) return null;

  const totalNights =
    (new Date(booking.check_out).getTime() -
      new Date(booking.check_in).getTime()) /
    (1000 * 60 * 60 * 24);

  const totalPrice = totalNights * room.price;

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: { xs: 180, sm: 240, md: 300 },
          overflow: "hidden",
          mb: 6,
          borderRadius: 0,
        }}
      >
        <Box
          component="img"
          src={getPublicUrl(room.images[0])}
          alt={room.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ px: 4, py: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 8, color: "#000000de", textAlign: "center" }}
          >
            Your Booking at <strong>{room.name}</strong> Is Confirmed 🎉
          </Typography>

          <Grid container spacing={4}>
            {/* LEFT COLUMN — DETAILS CARD */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "45%",
                  lg: "45%",
                },
              }}
            >
              <Card sx={{ width: "100%" }} elevation={3}>
                <CardContent>
                  <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 4 }}>
                    <strong>Reservation Number:</strong> #
                    {booking.id.slice(-12)}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  {/* ⭐ INTERNAL 2-COLUMN GRID */}
                  <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ mt: 4 }}>
                    {/* LEFT SIDE */}
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Room name:</strong> {room.name}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Check-in:</strong> {booking.check_in}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Check-out:</strong> {booking.check_out}
                      </Typography>
                    </Grid>

                    {/* RIGHT SIDE */}
                    <Grid item xs={12} sm={6}>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Guests:</strong> {booking.guests}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Price per night:</strong> €
                        {room.price.toFixed(2)}
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        <strong>Nights:</strong> {totalNights}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                    Total Price: €{totalPrice.toFixed(2)}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mb: 2,
                      backgroundColor: "#E26D5C",
                      "&:hover": { backgroundColor: "#c95b4d" },
                    }}
                    onClick={() => navigate("/account")}
                  >
                    View My Bookings
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate("/")}
                    sx={{
                      mb: 2,
                      color: "#000000de",
                    }}
                  >
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* RIGHT COLUMN — IMAGE */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "45%",
                  lg: "45%",
                },
                height: "300%",
                mb: 10,
                maxHeight: {
                  xs: "100%",
                  sm: "100%",
                  md: 400,
                  lg: 350,
                },
              }}
            >
              <Box
                component="img"
                src={getPublicUrl(room.images[0])}
                alt={room.name}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: 3,
                  height: 370,
                }}
              />
              <Typography sx={{ mb: "5%", mt: 4, color: "text.primary" }}>
                Thank you for choosing{" "}
                <MuiLink
                  component={RouterLink}
                  to={`/room/${booking.room_id}`}
                  sx={{
                    textDecoration: "none",
                    color: "#000000de",
                    "&:hover": { color: "#EFF5E0" },
                  }}
                >
                  <strong>{room.name}</strong>
                </MuiLink>
                . We’re excited to welcome you and hope you enjoy your stay!
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default BookingConfirmation;
