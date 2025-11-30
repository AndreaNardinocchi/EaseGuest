import { useEffect, useState } from "react";
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

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);

  // Bookings form state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    room_id: "",
    user_email: "",
    check_in: "",
    check_out: "",
    guests: "",
  });

  // Users form state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    email: "",
    role: "guest",
  });

  // --- Fetch Bookings ---
  const fetchBookings = async () => {
    const { data, error } = await supabase.rpc("get_all_bookings");

    // const { data, error } = await supabase
    //   .from("bookings")
    //   .select("*")
    //   .order("created_at", { ascending: false });

    if (error) throw error;
    setBookings(data || []);
  };

  // --- Fetch Users ---
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setUsers(data as AdminUser[]);
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
      await Promise.all([fetchBookings(), fetchUsers()]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // --- Booking CRUD ---
  const handleOpenCreateBooking = () => {
    setEditingBooking(null);
    setForm({
      room_id: "",
      user_email: "",
      check_in: "",
      check_out: "",
      guests: "",
    });
    setOpenModal(true);
  };

  const handleOpenUpdateBooking = (b: Booking) => {
    setEditingBooking(b);
    setForm({
      room_id: b.room_id,
      user_email: b.user_email,
      check_in: b.check_in,
      check_out: b.check_out,
      guests: String(b.guests),
    });
    setOpenModal(true);
  };

  // const handleSaveBooking = async () => {
  //   try {
  //     const payload = {
  //       bookingId: editingBooking?.id || null,
  //       updates: {
  //         room_id: form.room_id,
  //         check_in: form.check_in,
  //         check_out: form.check_out,
  //         guests: Number(form.guests),
  //       },
  //     };

  // // --- Creating booking uses Supabase directly ---
  // if (!editingBooking) {
  //   const { data: user, error: userError } = await supabase
  //     .from("profiles")
  //     .select("id")
  //     .eq("email", form.user_email)
  //     .single();

  //   if (userError || !user) {
  //     alert("User not found");
  //     return;
  //   }

  //   const createRes = await supabase.from("bookings").insert([
  //     {
  //       ...payload.updates,
  //       user_id: user.id,
  //     },
  //   ]);

  //   if (createRes.error) {
  //     alert(createRes.error.message);
  //     return;
  //   }

  //       setOpenModal(false);
  //       fetchBookings();
  //       return;
  //     }

  //     // --- Updating booking uses Node server ---
  //     const res = await fetch("http://localhost:3000/admin/update_booking", {
  //    method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.error || "Update failed");
  //       return;
  //     }

  //     console.log("Updated", data);

  //     setOpenModal(false);
  //     fetchBookings();
  //   } catch (err: any) {
  //     alert(err.message);
  //   }
  // };

  // const handleDeleteBooking = async (id: string) => {
  //   if (!confirm("Delete this booking?")) return;
  //   const { error } = await supabase.from("bookings").delete().eq("id", id);
  //   if (error) alert(error.message);
  //   else fetchBookings();
  // };

  // const handleSaveBooking = async () => {
  //   try {
  //     const payload = {
  //       bookingId: editingBooking?.id || null,
  //       updates: {
  //         room_id: form.room_id,
  //         check_in: form.check_in,
  //         check_out: form.check_out,
  //         guests: Number(form.guests),
  //       },
  //     };

  //     // --- Creating booking uses Supabase directly ---
  //     if (!editingBooking) {
  //       const { data: user, error: userError } = await supabase
  //         .from("profiles")
  //         .select("id")
  //         .eq("email", form.user_email)
  //         .single();

  //       if (userError || !user) {
  //         alert("User not found");
  //         return;
  //       }

  //       const createRes = await supabase.from("bookings").insert([
  //         {
  //           ...payload.updates,
  //           user_id: user.id,
  //         },
  //       ]);

  //       if (createRes.error) {
  //         alert(createRes.error.message);
  //         return;
  //       }

  //       setOpenModal(false);
  //       fetchBookings();
  //       return;
  //     }

  //     // --- Updating booking uses Node server ---
  //     const res = await fetch("http://localhost:3000/admin/update_booking", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.error || "Update failed");
  //       return;
  //     }

  //     console.log("Updated", data);

  //     setOpenModal(false);
  //     fetchBookings();
  //   } catch (err: any) {
  //     alert(err.message);
  //   }
  // };

  const handleSaveBooking = async () => {
    try {
      // Prepare payload
      const payload = {
        bookingId: editingBooking?.id || null,
        updates: {
          room_id: form.room_id,
          check_in: form.check_in,
          check_out: form.check_out,
          guests: Number(form.guests),
        },
      };

      // --- Creating booking branch ---
      if (!editingBooking) {
        // Find user by email
        const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", form.user_email)
          .single();

        if (userError || !user) {
          alert("User not found");
          return;
        }

        // Insert booking
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

        // --- SEND EMAIL ---
        const emailHtml = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; background-color: #f5f5f5;">
    <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed ✨</h1>
    </div>

    <div style="background: white; padding: 30px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
      <p style="font-size: 16px; color: #333;">Hi ${
        user.first_name || "there"
      },</p>

      <p style="font-size: 16px; color: #333;">
        Your booking has been successfully confirmed! Here are the details:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #555;">Room ID</td>
          <td style="padding: 10px; color: #333;">${form.room_id}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #555;">Check-in</td>
          <td style="padding: 10px; color: #333;">${form.check_in}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #555;">Check-out</td>
          <td style="padding: 10px; color: #333;">${form.check_out}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #555;">Guests</td>
          <td style="padding: 10px; color: #333;">${form.guests}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://yourwebsite.com/bookings" 
           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          View Your Booking
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        Thank you for choosing GuestEase! We look forward to hosting you.
      </p>
    </div>
  </div>
`;

        await fetch("http://localhost:3000/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.user_email,
            subject: "✨ Your Booking Is Confirmed — GuestEase",
            body: emailHtml,
          }),
        });

        setOpenModal(false);
        fetchBookings();
        return;
      }

      // --- Updating booking branch ---
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

      setOpenModal(false);
      fetchBookings();
    } catch (err: any) {
      alert(err.message);
    }
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

      console.log("Deleted booking:", data);
      fetchBookings();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- User CRUD ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({ email: "", role: "guest" });
    setOpenModal(true);
  };

  const handleOpenUpdateUser = (u: AdminUser) => {
    setEditingUser(u);
    setUserForm({ email: u.email, role: u.role || "guest" });
    setOpenModal(true);
  };

  const handleSaveUser = async () => {
    const payload = { email: userForm.email, role: userForm.role };

    // Prevent changing admin role
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
      // Create new user via Supabase Admin API
      const { data, error: insertError } = await supabase.auth.admin.createUser(
        {
          email: userForm.email,
          password: Math.random().toString(36).slice(-8),
          email_confirm: true,
          user_metadata: { role: userForm.role },
        }
      );
      error = insertError;
    }

    if (error) {
      alert(error.message);
      return;
    }

    setOpenModal(false);
    fetchUsers();
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

  // --- Loading/Error/Not Admin UI ---
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

  // --- Main Dashboard UI ---
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

      <Box my={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateUser}
        >
          + Create User
        </Button>
      </Box>

      {/* Users Table */}
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

      {/* Modal for Bookings & Users */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingBooking
            ? "Update Booking"
            : editingUser
            ? "Update User"
            : "Create Booking / User"}
        </DialogTitle>
        <DialogContent>
          {editingBooking || (!editingUser && !editingBooking) ? (
            <>
              {/* Booking Form */}
              <TextField
                margin="dense"
                label="Room ID"
                fullWidth
                value={form.room_id}
                onChange={(e) => setForm({ ...form, room_id: e.target.value })}
              />
              <TextField
                margin="dense"
                label="User Email"
                fullWidth
                value={form.user_email}
                onChange={(e) =>
                  setForm({ ...form, user_email: e.target.value })
                }
              />

              {/* Show user_email ONLY when creating
              {!editingBooking && (
                <TextField
                  margin="dense"
                  label="User Email"
                  fullWidth
                  value={form.user_email}
                  onChange={(e) =>
                    setForm({ ...form, user_email: e.target.value })
                  }
                />
              )} */}
              <TextField
                margin="dense"
                type="date"
                label="Check-in"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.check_in}
                onChange={(e) => setForm({ ...form, check_in: e.target.value })}
              />
              <TextField
                margin="dense"
                type="date"
                label="Check-out"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.check_out}
                onChange={(e) =>
                  setForm({ ...form, check_out: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Guests"
                type="number"
                fullWidth
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
              />
            </>
          ) : (
            <>
              {/* User Form */}
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                select
                SelectProps={{ native: true }}
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
                disabled={editingUser?.role === "admin"} // Prevent admin role change
              >
                <option value="guest">guest</option>
                <option value="admin">admin</option>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={
              editingBooking || (!editingUser && !editingBooking)
                ? handleSaveBooking
                : handleSaveUser
            }
          >
            {editingBooking
              ? "Update Booking"
              : editingUser
              ? "Update User"
              : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
