// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Divider,
// } from "@mui/material";

// type BookingConfirmationState = {
//   room: {
//     id: string;
//     name: string;
//     price: number;
//     image_url?: string;
//   };
//   booking: {
//     check_in: string;
//     check_out: string;
//     guests: number;
//   };
// };

// const BookingConfirmation: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const state = location.state as BookingConfirmationState | undefined;

//   useEffect(() => {
//     if (!state) {
//       // No data passed → redirect back to home or booking page
//       navigate("/", { replace: true });
//     }
//   }, [state, navigate]);

//   if (!state) return null;

//   const { room, booking } = state;

//   const totalNights =
//     (new Date(booking.check_out).getTime() -
//       new Date(booking.check_in).getTime()) /
//     (1000 * 60 * 60 * 24);

//   const totalPrice = totalNights * room.price;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 3,
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       <Card
//         sx={{
//           maxWidth: 600,
//           width: "100%",
//           boxShadow: 3,
//           borderRadius: 3,
//           overflow: "hidden",
//         }}
//       >
//         <CardContent sx={{ padding: 4 }}>
//           <Typography
//             variant="h4"
//             sx={{
//               textAlign: "center",
//               fontWeight: "bold",
//               color: "primary.main",
//               marginBottom: 3,
//             }}
//           >
//             Booking Confirmed 🎉
//           </Typography>

//           <Typography
//             variant="body1"
//             sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
//           >
//             Thank you for your reservation. We’re excited to host you!
//           </Typography>

//           <Divider sx={{ mb: 3 }} />

//           <Box sx={{ textAlign: "center" }}>
//             <img
//               src={room.image_url || "/default-room-image.jpg"}
//               alt={room.name}
//               style={{
//                 width: "100%",
//                 height: "250px",
//                 objectFit: "cover",
//                 borderRadius: "8px",
//                 marginBottom: "1rem",
//               }}
//             />
//           </Box>

//           <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//             {room.name}
//           </Typography>

//           <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
//             Booking Details:
//           </Typography>

//           <Box sx={{ mb: 2 }}>
//             <Typography variant="body2">
//               <strong>Check-in:</strong> {booking.check_in}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Check-out:</strong> {booking.check_out}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Guests:</strong> {booking.guests}
//             </Typography>
//             <Typography variant="body2">
//               <strong>Nights:</strong> {totalNights}
//             </Typography>
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Total Price: €{totalPrice.toFixed(2)}
//           </Typography>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 4 }}
//             onClick={() => navigate("/account")}
//           >
//             View My Bookings
//           </Button>

//           <Button
//             variant="outlined"
//             fullWidth
//             sx={{ mt: 2 }}
//             onClick={() => navigate("/")}
//           >
//             Back to Home
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default BookingConfirmation;

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
  Alert,
} from "@mui/material";
import { supabase } from "../supabaseClient";

const BookingConfirmation: React.FC = () => {
  const { id } = useParams(); // booking ID from URL
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
        // Fetch booking
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

        // Fetch room
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "primary.main",
              marginBottom: 3,
            }}
          >
            Booking Confirmed 🎉
          </Typography>

          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mb: 4 }}
          >
            Thank you for your reservation. We’re excited to host you!
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <img
              src={`/assets/${room.images?.[0]}`}
              alt={room.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {room.name}
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            Booking Details:
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Reservation Number:</strong> #{booking.id.slice(-12)}
            </Typography>
            <Typography variant="body2">
              <strong>Check-in:</strong> {booking.check_in}
            </Typography>
            <Typography variant="body2">
              <strong>Check-out:</strong> {booking.check_out}
            </Typography>
            <Typography variant="body2">
              <strong>Guests:</strong> {booking.guests}
            </Typography>
            <Typography variant="body2">
              <strong>Nights:</strong> {totalNights}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Price: €{totalPrice.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4 }}
            onClick={() => navigate("/account")}
          >
            View My Bookings
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingConfirmation;
