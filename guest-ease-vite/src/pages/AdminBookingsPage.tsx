import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { createClient } from "@supabase/supabase-js";
import AdminSubNav from "../components/adminSubNav/adminSubNav";

import type { Booking, Room } from "../types/interfaces";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const BASE_URL = "http://localhost:3000";

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [bookingForm, setBookingForm] = useState({
    room_id: "",
    user_email: "",
    check_in: "",
    check_out: "",
    guests: "",
  });

  // -----------------------------
  // Fetch Data
  // -----------------------------
  const fetchBookings = async () => {
    const { data } = await supabase.rpc("get_all_bookings");
    setBookings(data || []);
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("*");
    setRooms(data || []);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchBookings(), fetchRooms()]);
      setLoading(false);
    })();
  }, []);

  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name || `Unknown room (${roomId})`;

  // -----------------------------
  // Modal Handlers
  // -----------------------------
  const handleOpenCreateBooking = () => {
    setEditingBooking(null);
    setBookingForm({
      room_id: "",
      user_email: "",
      check_in: "",
      check_out: "",
      guests: "",
    });
    setOpenBookingModal(true);
  };

  const handleOpenUpdateBooking = (b: Booking) => {
    setEditingBooking(b);
    setBookingForm({
      room_id: b.room_id,
      user_email: b.user_email,
      check_in: b.check_in,
      check_out: b.check_out,
      guests: String(b.guests),
    });
    setOpenBookingModal(true);
  };

  // -----------------------------
  // Save Booking
  // -----------------------------
  const handleSaveBooking = async () => {
    try {
      const updates = {
        room_id: bookingForm.room_id,
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        guests: Number(bookingForm.guests),
      };

      if (!editingBooking) {
        const resUser = await fetch(`${BASE_URL}/admin/get_user_by_email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: bookingForm.user_email }),
        });

        const userData = await resUser.json();
        if (!resUser.ok || !userData.user) {
          alert(userData.error || "User not found");
          return;
        }

        const resBooking = await fetch(`${BASE_URL}/admin/create_booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: updates.room_id,
            user_email: bookingForm.user_email,
            check_in: updates.check_in,
            check_out: updates.check_out,
            guests: updates.guests,
          }),
        });

        const bookingData = await resBooking.json();
        if (!resBooking.ok) {
          alert(bookingData.error || "Failed to create booking");
          return;
        }

        alert("Booking created successfully!");
      } else {
        const resUpdate = await fetch(`${BASE_URL}/admin/update_booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: editingBooking.id,
            updates,
          }),
        });

        const updateData = await resUpdate.json();
        if (!resUpdate.ok) {
          alert(updateData.error || "Update failed");
          return;
        }

        alert("Booking updated successfully!");
      }

      setOpenBookingModal(false);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  // -----------------------------
  // Delete Booking
  // -----------------------------
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;

    const res = await fetch(`${BASE_URL}/admin/delete_booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    fetchBookings();
  };

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
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Bookings</Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenCreateBooking}
          >
            + Create Booking
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Room Name</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>{getRoomName(b.room_id)}</TableCell>
                  <TableCell>{b.first_name}</TableCell>
                  <TableCell>{b.last_name}</TableCell>
                  <TableCell>{b.user_email}</TableCell>
                  <TableCell>{b.check_in}</TableCell>
                  <TableCell>{b.check_out}</TableCell>
                  <TableCell>{b.guests}</TableCell>
                  <TableCell>
                    {new Date(b.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenUpdateBooking(b)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteBooking(b.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Booking Modal */}
        <Dialog
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingBooking ? "Update Booking" : "Create Booking"}
          </DialogTitle>

          <DialogContent>
            <TextField
              margin="dense"
              label="Room ID"
              fullWidth
              value={bookingForm.room_id}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, room_id: e.target.value })
              }
            />

            {!editingBooking && (
              <TextField
                margin="dense"
                label="User Email"
                fullWidth
                value={bookingForm.user_email}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, user_email: e.target.value })
                }
              />
            )}

            <TextField
              margin="dense"
              type="date"
              label="Check-in"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingForm.check_in}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, check_in: e.target.value })
              }
            />

            <TextField
              margin="dense"
              type="date"
              label="Check-out"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingForm.check_out}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, check_out: e.target.value })
              }
            />

            <TextField
              margin="dense"
              type="number"
              label="Guests"
              fullWidth
              value={bookingForm.guests}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, guests: e.target.value })
              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenBookingModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveBooking}>
              {editingBooking ? "Update Booking" : "Create Booking"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminBookingsPage;
