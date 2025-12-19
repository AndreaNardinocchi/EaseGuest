// // src/pages/roomDetails.tsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";
// import { useBooking } from "../context/bookingContext";
// import { useAuth } from "../context/useAuth";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const { searchAvailableRooms, loading, bookRoom, storePayment } =
//     useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   // Fetch available rooms for the selected dates
//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   // Find the current room from the rooms array
//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async (paymentIntent: any) => {
//     if (!room || !user) return;

//     try {
//       const nights =
//         (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
//         (1000 * 60 * 60 * 24);

//       const totalPrice = room.price * nights * guests;

//       // ✅ Create booking first
//       const result = await bookRoom({
//         room_id: roomId!,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//         total_price: totalPrice,
//       });

//       if (!result.success || !result.booking) {
//         setError(result.message || "Booking failed after payment.");
//         return;
//       }

//       const bookingId = result.booking.id;

//       // ✅ Store payment with bookingId
//       const paymentResult = await storePayment({
//         payment_intent_id: paymentIntent.id,
//         amount: totalPrice,
//         booking_id: bookingId,
//         user_id: user.id,
//       });

//       if (!paymentResult.success) {
//         setError(paymentResult.message || "Payment recording failed.");
//         return;
//       }

//       // Navigate to confirmation
//       navigate("/booking-confirmation", {
//         state: {
//           room,
//           booking: {
//             check_in: checkIn,
//             check_out: checkOut,
//             guests,
//             total_price: totalPrice,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Payment booking error:", err);
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box>
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="lg">
//         {showPayment && (
//           <Box sx={{ p: 4, mb: 4, border: "1px solid #ddd", borderRadius: 2 }}>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Complete Payment
//             </Typography>

//             <StripeCheckout
//               amount={
//                 (room.price *
//                   100 *
//                   (new Date(checkOut).getTime() -
//                     new Date(checkIn).getTime())) /
//                 (1000 * 60 * 60 * 24)
//               }
//               onSuccess={handlePaymentSuccess}
//             />

//             <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//               Cancel
//             </Button>
//           </Box>
//         )}

//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment}
//         />

//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Container,
} from "@mui/material";
import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
import BookingReviews from "../components/bookingReviews/bookingReview";
import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";
import { useBooking } from "../context/bookingContext";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabaseClient";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    searchAvailableRooms,
    loading: bookingLoading,
    bookRoom,
    storePayment,
  } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read query params (may be empty)
  const params = new URLSearchParams(location.search);
  const paramCheckIn = params.get("checkIn") || "";
  console.log("params & paramCheckIn", params, paramCheckIn);
  const paramCheckOut = params.get("checkOut") || "";
  const paramGuests = Number(params.get("guests")) || 1;

  const [room, setRoom] = useState<any | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState<string>(paramCheckIn);
  const [checkOut, setCheckOut] = useState<string>(paramCheckOut);
  const [guests, setGuests] = useState<number>(paramGuests);

  const [showPayment, setShowPayment] = useState(false);

  // Fetch basic room info *always*
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRoomById = async () => {
    if (!roomId) return;
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();
    if (error || !data) {
      setError("Room not found.");
    } else {
      setRoom(data);
    }
  };

  useEffect(() => {
    fetchRoomById();
  }, [fetchRoomById, roomId]);

  // Fetch availability only if dates are valid
  useEffect(() => {
    const validDates =
      checkIn.match(/^\d{4}-\d{2}-\d{2}$/) &&
      checkOut.match(/^\d{4}-\d{2}-\d{2}$/) &&
      new Date(checkIn) < new Date(checkOut);

    if (!validDates) {
      setAvailability([]);
      return;
    }

    const fetchRooms = async () => {
      try {
        const result = await searchAvailableRooms(checkIn, checkOut);
        if (result.success) {
          setAvailability(result.rooms);
        } else {
          setError(result.message || "Failed availability fetch.");
        }
      } catch (err) {
        setError("Unexpected availability error.");
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, searchAvailableRooms]);

  const handleStartPayment = () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    if (
      guests <= 0 ||
      !checkIn ||
      !checkOut ||
      new Date(checkIn) >= new Date(checkOut)
    ) {
      setError("Please enter valid guests and dates before booking.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    if (!room || !user) return;

    try {
      const nights =
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24);
      const totalPrice = room.price * nights * guests;

      const result = await bookRoom({
        room_id: roomId!,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
      });
      if (!result.success || !result.booking) {
        setError(result.message || "Booking failed after payment.");
        return;
      }
      const bookingId = result.booking.id;

      const paymentResult = await storePayment({
        payment_intent_id: paymentIntent.id,
        amount: totalPrice,
        booking_id: bookingId,
        user_id: user.id,
      });
      if (!paymentResult.success) {
        setError(paymentResult.message || "Payment recording failed.");
        return;
      }

      navigate(`/booking-confirmation/${bookingId}`, {
        state: {
          room,
          booking: {
            check_in: checkIn,
            check_out: checkOut,
            guests,
            total_price: totalPrice,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setError("Unexpected error after payment.");
    }
  };

  if (bookingLoading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return <Alert severity="error">Room not found.</Alert>;

  return (
    <Box>
      {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

      <Container maxWidth="lg">
        {/* Show selected dates (from URL or form) */}

        {showPayment && (
          <Box sx={{ p: 4, mb: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Complete Payment
            </Typography>
            {checkIn && checkOut ? (
              <>
                <Typography>Check‑in: {checkIn}</Typography>
                <Typography>Check‑out: {checkOut}</Typography>
                <Typography>Guests: {guests}</Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                Please choose check‑in and check‑out dates below.
              </Typography>
            )}

            <StripeCheckout
              amount={
                (room.price *
                  100 *
                  (new Date(checkOut).getTime() -
                    new Date(checkIn).getTime())) /
                (1000 * 60 * 60 * 24)
              }
              onSuccess={handlePaymentSuccess}
            />

            <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
          </Box>
        )}

        <RoomDetailsCard
          room={room}
          guests={guests}
          checkIn={checkIn}
          checkOut={checkOut}
          setGuests={setGuests}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          onBook={handleStartPayment}
        />

        <Box sx={{ mt: 6, mb: 12 }}>
          <BookingReviews roomId={roomId!} />
        </Box>
      </Container>
    </Box>
  );
};

export default RoomDetails;
