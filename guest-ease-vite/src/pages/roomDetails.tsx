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

  // Query params
  const params = new URLSearchParams(location.search);
  const paramCheckIn = params.get("checkIn") || "";
  const paramCheckOut = params.get("checkOut") || "";
  const paramGuests = Number(params.get("guests")) || 1;

  const [room, setRoom] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState<string>(paramCheckIn);
  const [checkOut, setCheckOut] = useState<string>(paramCheckOut);
  const [guests, setGuests] = useState<number>(paramGuests);

  const [showPayment, setShowPayment] = useState(false);

  // Convert Supabase storage path → public URL
  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `${room?.name}'s Details Page | GuestEase`;
    //   }, [t]);
  });

  /* 
  React error: "The final argument passed to useEffect changed size."

  Cause:
  A function (fetchRoomById) was recreated on every render, so the 
  useEffect dependency array changed length — which React forbids.

  Fix:
  Wrap the function in useCallback so its reference stays stable.

  Sources:
  - React Docs: https://react.dev/reference/react/useEffect
  - useCallback Docs: https://react.dev/reference/react/useCallback
*/
  const fetchRoomById = React.useCallback(async () => {
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
  }, [roomId]);

  useEffect(() => {
    fetchRoomById();
  }, [fetchRoomById]);

  useEffect(() => {
    if (!roomId) return;

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("room_id", roomId);

      if (!error && data) {
        setReviews(data);
      }
    };

    fetchReviews();
  }, [roomId]);

  // Fetch availability
  useEffect(() => {
    const validDates =
      /^\d{4}-\d{2}-\d{2}$/.test(checkIn) &&
      /^\d{4}-\d{2}-\d{2}$/.test(checkOut) &&
      new Date(checkIn) < new Date(checkOut);

    if (!validDates) {
      setAvailability([]);
      return;
    }

    const fetchRooms = async () => {
      try {
        const result = await searchAvailableRooms(checkIn, checkOut, guests);
        if (result.success) {
          setAvailability(result.rooms);
        } else {
          setError(result.message || "Failed availability fetch.");
        }
      } catch {
        setError("Unexpected availability error.");
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, guests, searchAvailableRooms]);

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

    // NEW:   Check if room is available
    const isAvailable = availability.some((r) => r.id === room.id);
    console.log("Room", room.id);

    if (!isAvailable) {
      setError("This room is already booked for the selected dates.");
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
  // This useEffact() will ensure the message will disappear as soon as some available dates are selected
  useEffect(() => {
    if (!room) return;

    const isAvailable = availability.some((r) => r.id === room.id);

    // Only clear the error if the room is now available
    if (isAvailable && error) {
      setError(null);
    }
  }, [availability, room, error]);

  useEffect(() => {
    // Only close Stripe when dates change
    if (showPayment) {
      setShowPayment(false);
    }

    /**
     * Clear error only if room becomes available.
     * Then, when we click on 'Book Now', the showPayment will be set to 'true' as per
     * handleStartPayment()
     * */
    if (room) {
      const isAvailable = availability.some((r) => r.id === room.id);
      if (isAvailable && error) {
        setError(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

  if (bookingLoading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;

  // if (error) return <Alert severity="error">{error}</Alert>;

  if (!room) return <Alert severity="error">Room not found.</Alert>;

  // Normalize images → convert to public URLs
  const normalizedImages = Array.isArray(room.images)
    ? room.images.map((img: string) => getPublicUrl(img))
    : typeof room.images === "string"
    ? JSON.parse(room.images).map((img: string) => getPublicUrl(img))
    : [];

  return (
    <Box>
      {/* IMAGE CAROUSEL */}
      {normalizedImages.length > 0 && (
        <RoomImageCarousel images={normalizedImages} />
      )}

      <Container maxWidth="lg">
        {/* SHOW ERRORS HERE */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        {/* PAYMENT SECTION */}
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

            <Button
              sx={{ mt: 2, color: "#472d30" }}
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </Button>
          </Box>
        )}

        {/* ROOM DETAILS */}
        <RoomDetailsCard
          room={room}
          guests={guests}
          checkIn={checkIn}
          checkOut={checkOut}
          setGuests={setGuests}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          onBook={handleStartPayment}
          reviews={reviews}
        />

        {/* REVIEWS */}
        <Box sx={{ mt: 6, mb: 12 }}>
          <BookingReviews roomId={roomId!} />
        </Box>
      </Container>
    </Box>
  );
};

export default RoomDetails;
