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
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";

import type { Booking, Room } from "../types/interfaces";
import BookingsFilter from "../components/filters/bookingFilters";

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

  const [filters, setFilters] = useState({
    search: "",
    room: "",
    first_name: "",
    last_name: "",
    email: "",
    check_in: "",
    check_out: "",
    created_at: "",
    guests: "",
  });

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

  /** Apply all active filters to the bookings list */
  const filteredBookings = bookings.filter((b) => {
    /** Normalize the global search text */
    const search = filters.search.toLowerCase();

    /** Build a combined string so the global search can match any field */
    const searchString = [
      b.id,
      b.first_name,
      b.last_name,
      b.user_email,
      getRoomName(b.room_id),
      b.check_in,
      b.check_out,
      b.guests,
      b.total_price,
      new Date(b.created_at).toLocaleString(),
    ]
      .join(" ")
      .toLowerCase();

    /** Global search filter */
    const matchesSearch = searchString.includes(search);

    /** Room filter (exact match) */
    const matchesRoom = filters.room
      ? String(b.room_id) === String(filters.room)
      : true;

    /** First name filter (partial match) */
    const matchesFirst = filters.first_name
      ? b.first_name?.toLowerCase().includes(filters.first_name.toLowerCase())
      : true;

    /** Last name filter (partial match) */
    const matchesLast = filters.last_name
      ? b.last_name?.toLowerCase().includes(filters.last_name.toLowerCase())
      : true;

    /** Email filter (partial match) */
    const matchesEmail = filters.email
      ? b.user_email?.toLowerCase().includes(filters.email.toLowerCase())
      : true;

    /** Guests filter (exact numeric match) */
    const matchesGuests = filters.guests
      ? b.guests === Number(filters.guests)
      : true;

    /** Check‑in date filter (exact day match) */
    const matchesCheckIn = filters.check_in
      ? new Date(b.check_in).toDateString() ===
        new Date(filters.check_in).toDateString()
      : true;

    /** Check‑out date filter (exact day match) */
    const matchesCheckOut = filters.check_out
      ? new Date(b.check_out).toDateString() ===
        new Date(filters.check_out).toDateString()
      : true;

    /** Created‑at filter (exact day match) */
    const matchesCreatedAt = filters.created_at
      ? new Date(b.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    /** Only include bookings that match ALL filters */
    return (
      matchesSearch &&
      matchesRoom &&
      matchesFirst &&
      matchesLast &&
      matchesEmail &&
      matchesGuests &&
      matchesCheckIn &&
      matchesCheckOut &&
      matchesCreatedAt
    );
  });

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

        {/* <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            p: 2,

            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
            padding: 5,
          }}
        >
          <TextField
            label="Search all fields"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ flex: 1, minWidth: 150, maxWidth: 150 }}
          />

          <Select
            value={filters.room}
            onChange={(e) =>
              setFilters({ ...filters, room: e.target.value as string })
            }
            displayEmpty
            sx={{ maxWidth: 130 }}
          >
            <MenuItem value="">All Rooms</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="First Name"
            value={filters.first_name}
            onChange={(e) =>
              setFilters({ ...filters, first_name: e.target.value })
            }
            sx={{ minWidth: 100, maxWidth: 130 }}
          />

          <TextField
            label="Last Name"
            value={filters.last_name}
            onChange={(e) =>
              setFilters({ ...filters, last_name: e.target.value })
            }
            sx={{ minWidth: 100, maxWidth: 150 }}
          />

          <TextField
            label="Email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            sx={{ minWidth: 100, maxWidth: 150 }}
          />

          <Select
            label="Guests"
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            displayEmpty
            sx={{ minWidth: 130, maxWidth: 130 }}
          >
            <MenuItem value="">All Guests</MenuItem>
            <MenuItem value="1">1 Guest</MenuItem>
            <MenuItem value="2">2 Guests</MenuItem>
            <MenuItem value="3">3 Guests</MenuItem>
            <MenuItem value="4">4 Guests</MenuItem>
          </Select>

          <TextField
            label="Check in"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.check_in}
            onChange={(e) =>
              setFilters({ ...filters, check_in: e.target.value })
            }
            sx={{ minWidth: 150, maxWidth: 150 }}
          />

          <TextField
            label="Check out"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.check_out}
            onChange={(e) =>
              setFilters({ ...filters, check_out: e.target.value })
            }
            sx={{ minWidth: 150, maxWidth: 150 }}
          />

          <TextField
            label="Created at"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.created_at}
            onChange={(e) =>
              setFilters({ ...filters, created_at: e.target.value })
            }
            sx={{ minWidth: 150, maxWidth: 150 }}
          />

          <Button
            variant="outlined"
            onClick={() =>
              setFilters({
                search: "",
                room: "",
                first_name: "",
                last_name: "",
                email: "",
                guests: "",
                check_in: "",
                check_out: "",
                created_at: "",
              })
            }
          >
            Reset
          </Button>
        </Box> */}

        <BookingsFilter
          filters={filters}
          setFilters={setFilters}
          rooms={rooms}
        />

        {/* Responsive Table */}
        <TableContainer
          component={Paper}
          sx={{
            mb: 6,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: 4,
            },
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Room</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check‑in</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check‑out</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Guests</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Total Price
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Created At
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.map((b) => (
                <TableRow
                  key={b.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{b.id}</TableCell>

                  <TableCell>{getRoomName(b.room_id)}</TableCell>
                  <TableCell>{b.first_name}</TableCell>
                  <TableCell>{b.last_name}</TableCell>
                  <TableCell
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {b.user_email}
                  </TableCell>
                  <TableCell>{b.check_in}</TableCell>
                  <TableCell>{b.check_out}</TableCell>
                  <TableCell>{b.guests}</TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    €{b.total_price}
                  </TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
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
          PaperProps={{ sx: { mx: 2 } }}
        >
          <DialogTitle>
            {editingBooking ? "Update Booking" : "Create Booking"}
          </DialogTitle>

          <DialogContent>
            <InputLabel id="rooms">Rooms</InputLabel>
            <Select
              labelId="Room ID"
              value={bookingForm.room_id}
              fullWidth
              displayEmpty
              renderValue={(value) =>
                value ? value : <span style={{ color: "#aaa" }}>Rooms</span>
              }
              onChange={(e) =>
                setBookingForm({ ...bookingForm, room_id: e.target.value })
              }
            >
              {rooms.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {getRoomName(r.id)}
                </MenuItem>
              ))}
            </Select>

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
