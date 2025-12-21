import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { createClient } from "@supabase/supabase-js";
import AdminSubNav from "../components/adminSubNav/adminSubNav";

import type { Review, Room } from "../types/interfaces";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch Reviews
  // -----------------------------
  const fetchReviews = async () => {
    const { data, error } = await supabase.from("reviews").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setReviews(data || []);
  };

  // -----------------------------
  // Fetch Rooms
  // -----------------------------
  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setRooms(data || []);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchReviews(), fetchRooms()]);
      setLoading(false);
    })();
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name || "Unknown";

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading)
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );

  // -----------------------------
  // Page UI
  // -----------------------------
  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />
      <Container sx={{ pb: 8, overflow: "visible" }}>
        <Box my={4}>
          <Typography variant="h4">Reviews</Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Review ID</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.booking_id}</TableCell>
                  <TableCell>{getRoomName(r.room_id)}</TableCell>
                  <TableCell>{r.rating}</TableCell>
                  <TableCell>{r.comment}</TableCell>
                  <TableCell>
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default AdminReviewsPage;
