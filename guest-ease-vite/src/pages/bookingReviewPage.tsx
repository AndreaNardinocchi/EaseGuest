import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useBooking } from "../context/bookingContext";

const ReviewPage: React.FC = () => {
  const { id } = useParams(); // booking ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, fetchBookings, submitReview } = useBooking();

  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await fetchBookings();
      const found = bookings.find((b) => b.id === id);
      setBooking(found);
      setLoading(false);
    }
    load();
  }, [id, bookings, fetchBookings]);

  const handleSubmit = async () => {
    if (!rating || comment.trim().length === 0) {
      alert("Please provide both rating and comment.");
      return;
    }

    const result = await submitReview(id!, {
      rating,
      comment,
      user_id: user?.id,
    });

    alert(result.message || "Review submitted!");
    navigate("/account"); // go back after submitting
  };

  if (!user)
    return (
      <Box textAlign="center" mt={6}>
        <Typography>Please log in to write a review.</Typography>
      </Box>
    );

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (!booking)
    return (
      <Box textAlign="center" mt={6}>
        <Typography>Booking not found.</Typography>
      </Box>
    );

  return (
    <Box maxWidth="600px" mx="auto" mt={5}>
      <Typography variant="h4" sx={{ color: "#8E4585", mb: 2 }}>
        Write a Review
      </Typography>

      <Card elevation={4}>
        <CardContent>
          <Typography variant="h6">Room {booking.room_id}</Typography>
          <Typography>
            Stayed from <strong>{booking.check_in}</strong> to{" "}
            <strong>{booking.check_out}</strong>
          </Typography>

          <Box mt={3}>
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
            sx={{ mt: 3 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>

          <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/account")}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewPage;
