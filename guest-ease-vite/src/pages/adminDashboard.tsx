import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Autocomplete,
} from "@mui/material";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  user_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  created_at: string;
  first_name: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: string | null;
  created_at: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  amenities: string[];
  capacity: number;
  price: number;
  created_at: string;
}

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Modals State ---
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openRoomModal, setOpenRoomModal] = useState(false);

  // --- Editing Entities ---
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // --- Forms ---
  const [bookingForm, setBookingForm] = useState({
    room_id: "",
    user_email: "",
    check_in: "",
    check_out: "",
    guests: "",
  });

  const [userForm, setUserForm] = useState({
    email: "",
    role: "guest",
  });

  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    amenities: [] as string[], // ✅ initialize as empty array
    capacity: "",
    price: "",
  });

  // --- Fetch Functions ---
  const fetchBookings = async () => {
    const { data, error } = await supabase.rpc("get_all_bookings");
    if (error) throw error;
    setBookings(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setUsers(data as AdminUser[]);
  };

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setRooms(data as Room[]);
  };

  // --- Initialization ---
  const init = async () => {
    try {
      const { data: authUser, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      if (!authUser.user) throw new Error("Not authenticated");

      if (authUser.user.user_metadata?.role !== "admin") {
        setError("You are not authorized.");
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
      await Promise.all([fetchBookings(), fetchUsers(), fetchRooms()]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // --- Booking Handlers ---
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

  const handleSaveBooking = async () => {
    try {
      const payload = {
        bookingId: editingBooking?.id || null,
        updates: {
          room_id: bookingForm.room_id,
          check_in: bookingForm.check_in,
          check_out: bookingForm.check_out,
          guests: Number(bookingForm.guests),
        },
      };

      if (!editingBooking) {
        // --- CREATE BOOKING ---
        const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("email", bookingForm.user_email)
          .single();

        if (userError || !user) {
          alert("User not found");
          return;
        }

        const createRes = await supabase.from("bookings").insert([
          {
            ...payload.updates,
            user_id: user.id,
          },
        ]);

        if (createRes.error) {
          alert(createRes.error.message);
          return;
        }

        // --- SEND CONFIRMATION EMAIL ---
        await sendBookingConfirmationEmail(user, bookingForm);
      } else {
        // --- UPDATE BOOKING (backend handles email) ---
        const res = await fetch("http://localhost:3000/admin/update_booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Update failed");
          return;
        }
      }

      setOpenBookingModal(false);
      fetchBookings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- EMAILS ---

  // Confirmation email (for new booking)
  const sendBookingConfirmationEmail = async (user: any, form: any) => {
    const subject = "✨ Your Booking Is Confirmed by Admin — GuestEase";
    const message = `
    <p>Hi ${user.first_name || "there"},</p>
    <p>Your booking has been successfully confirmed! Here are the details:</p>
    ${bookingDetailsTable(form)}
    <p>Thank you for choosing GuestEase!</p>
  `;
    await sendEmail(user.email, subject, message);
  };

  // Helper to format booking details as HTML table
  const bookingDetailsTable = (form: any) => `
  <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
    <tr>
      <td style="padding: 10px; font-weight: bold;">Room ID</td>
      <td style="padding: 10px;">${form.room_id}</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 10px; font-weight: bold;">Check-in</td>
      <td style="padding: 10px;">${form.check_in}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold;">Check-out</td>
      <td style="padding: 10px;">${form.check_out}</td>
    </tr>
    <tr style="background-color: #f9f9f9;">
      <td style="padding: 10px; font-weight: bold;">Guests</td>
      <td style="padding: 10px;">${form.guests}</td>
    </tr>
  </table>
  <div style="text-align:center; margin-top:20px;">
    <a href="http://localhost:5173/account" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;">View Your Booking</a>
  </div>
`;

  // Generic send email helper
  const sendEmail = async (email: string, subject: string, body: string) => {
    await fetch("http://localhost:3000/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, body }),
    });
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    try {
      const res = await fetch("http://localhost:3000/admin/delete_booking", {
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
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- User Handlers ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({ email: "", role: "guest" });
    setOpenUserModal(true);
  };

  const handleOpenUpdateUser = (u: AdminUser) => {
    setEditingUser(u);
    setUserForm({ email: u.email, role: u.role || "guest" });
    setOpenUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      const payload = { email: userForm.email, role: userForm.role };
      if (
        editingUser &&
        editingUser.role === "admin" &&
        userForm.role !== "admin"
      ) {
        alert("Cannot change admin role!");
        return;
      }

      let error;
      if (editingUser) {
        const res = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", editingUser.id);
        error = res.error;
      } else {
        const { error: insertError } = await supabase.auth.admin.createUser({
          email: userForm.email,
          password: Math.random().toString(36).slice(-8),
          email_confirm: true,
          user_metadata: { role: userForm.role },
        });
        error = insertError;
      }

      if (error) {
        alert(error.message);
        return;
      }

      setOpenUserModal(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id: string, role: string | null) => {
    if (role === "admin") {
      alert("Cannot delete admin user!");
      return;
    }
    if (!confirm("Delete this user?")) return;
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) alert(error.message);
    else fetchUsers();
  };

  // --- Room Handlers ---
  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: "",
      description: "",
      amenities: [] as string[], // initialize as empty array
      capacity: "",
      price: "",
    });
    setOpenRoomModal(true);
  };

  const handleOpenUpdateRoom = (r: Room) => {
    setEditingRoom(r);

    setRoomForm({
      name: r.name,
      description: r.description,
      amenities: Array.isArray(r.amenities)
        ? r.amenities
        : typeof r.amenities === "string"
        ? JSON.parse(r.amenities)
        : [],
      capacity: String(r.capacity),
      price: String(r.price),
    });

    setOpenRoomModal(true);
  };

  const handleSaveRoom = async () => {
    try {
      if (!roomForm.name.trim()) {
        alert("Room name is required");
        return;
      }

      const payload = {
        name: roomForm.name.trim(),
        description: roomForm.description.trim(),
        amenities: roomForm.amenities?.length ? roomForm.amenities : [], // text[] or jsonb
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
      };

      if (editingRoom) {
        const { data, error } = await supabase
          .from("rooms")
          .update(payload)
          .eq("id", editingRoom.id)
          .select(); // ✅ include select to get updated row

        if (error) throw error;
        console.log("Room updated successfully");
        console.log("Updated room:", data);
      } else {
        const { data, error } = await supabase
          .from("rooms")
          .insert([payload])
          .select(); // ✅ include select to get inserted row

        if (error) throw error;
        console.log("Created room:", data);
      }

      await fetchRooms();
      setOpenRoomModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchRooms();
  };

  // --- Loading/Error ---
  if (loading)
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Loading…</Typography>
        </Box>
      </Container>
    );

  if (error)
    return (
      <Container>
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      </Container>
    );

  if (!isAdmin)
    return (
      <Container>
        <Typography color="error" textAlign="center" mt={4}>
          You are not authorized.
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ pb: 8 }}>
      <Box my={4} display="flex" justifyContent="space-between">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenCreateBooking}
        >
          + Create Booking
        </Button>
      </Box>

      {/* Bookings Table */}
      <Typography variant="h5" gutterBottom>
        Bookings
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Room ID</TableCell>
              <TableCell>First Name</TableCell>
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
                <TableCell>{b.room_id}</TableCell>
                <TableCell>{b.first_name}</TableCell>
                <TableCell>{b.user_email}</TableCell>
                <TableCell>{b.check_in}</TableCell>
                <TableCell>{b.check_out}</TableCell>
                <TableCell>{b.guests}</TableCell>
                <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
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

      {/* Users */}
      <Box my={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateUser}
        >
          + Create User
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenUpdateUser(u)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUser(u.id, u.role)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rooms */}
      <Box my={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateRoom}
        >
          + Create Room
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Rooms
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>{r.amenities.join(", ")}</TableCell>
                <TableCell>{r.capacity}</TableCell>
                <TableCell>€{r.price}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenUpdateRoom(r)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteRoom(r.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Booking Modal --- */}
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

      {/* --- User Modal --- */}
      <Dialog
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingUser ? "Update User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={userForm.email}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
            disabled={!!editingUser}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Room Modal --- */}
      <Dialog
        open={openRoomModal}
        onClose={() => setOpenRoomModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingRoom ? "Update Room" : "Create Room"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={roomForm.description}
            onChange={(e) =>
              setRoomForm({ ...roomForm, description: e.target.value })
            }
          />

          {/* <TextField
            margin="dense"
            label="Amenities (comma-separated)"
            fullWidth
            value={roomForm.amenities.join(", ")}
            onChange={(e) =>
              setRoomForm({
                ...roomForm,
                amenities: e.target.value
                  .split(",")
                  .map((a) => a.trim())
                  .filter((a) => a.length > 0),
              })
            }
          /> */}

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={roomForm.amenities}
            onChange={(event, newValue) => {
              setRoomForm({ ...roomForm, amenities: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Amenities"
                placeholder="Type and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const input = (e.target as HTMLInputElement).value
                      .split(",")
                      .map((a) => a.trim())
                      .filter((a) => a.length > 0);

                    setRoomForm({
                      ...roomForm,
                      amenities: [...roomForm.amenities, ...input],
                    });

                    // Clear the input field
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            )}
          />

          <TextField
            margin="dense"
            type="number"
            label="Capacity"
            fullWidth
            value={roomForm.capacity}
            onChange={(e) =>
              setRoomForm({ ...roomForm, capacity: e.target.value })
            }
          />
          <TextField
            margin="dense"
            type="number"
            label="Price"
            fullWidth
            value={roomForm.price}
            onChange={(e) =>
              setRoomForm({ ...roomForm, price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveRoom}>
            {editingRoom ? "Update Room" : "Create Room"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
