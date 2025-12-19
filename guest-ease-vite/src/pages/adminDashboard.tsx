// import { useEffect, useState, type ReactNode } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Autocomplete,
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );
// import type { Booking } from "../types/interfaces";
// import type { Room } from "../types/interfaces";
// import type { Review } from "../types/interfaces";
// import type { User } from "../types/interfaces";

// const AdminDashboard = () => {
//   // In your React app
//   const BASE_URL = "http://localhost:3000";

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   // const [users, setUsers] = useState<AdminUser[]>([]);
//   const [users, setUsers] = useState<User[]>([]);

//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [reviews, setReviews] = useState<Review[]>([]);

//   // --- Modals State ---
//   const [openBookingModal, setOpenBookingModal] = useState(false);
//   const [openUserModal, setOpenUserModal] = useState(false);
//   const [openRoomModal, setOpenRoomModal] = useState(false);

//   // --- Editing Entities ---
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
//   // const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
//   const [editingUser, setEditingUser] = useState<User | null>(null);

//   const [editingRoom, setEditingRoom] = useState<Room | null>(null);

//   // --- Forms ---
//   const [bookingForm, setBookingForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   const [userForm, setUserForm] = useState({
//     first_name: "",
//     last_name: "",
//     country: "",
//     zip_code: "",
//     email: "",
//     role: "guest",
//   });

//   const [roomForm, setRoomForm] = useState({
//     name: "",
//     description: "",
//     amenities: [] as string[], // ✅ initialize as empty array
//     capacity: "",
//     price: "",
//   });

//   // --- Fetch Functions ---
//   const fetchBookings = async () => {
//     const { data, error } = await supabase.rpc("get_all_bookings");
//     if (error) throw error;
//     setBookings(data || []);
//   };

//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) throw error;
//     // setUsers(data as AdminUser[]);
//     setUsers(data as User[]);
//   };

//   const fetchRooms = async () => {
//     const { data, error } = await supabase
//       .from("rooms")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) throw error;
//     setRooms(data as Room[]);
//   };

//   const fetchReviews = async () => {
//     const { data, error } = await supabase
//       .from("reviews")
//       .select("*")
//       .order("room_id", { ascending: false });
//     if (error) throw error;
//     setReviews(data as Review[]);
//   };

//   // --- Initialization ---
//   const init = async () => {
//     try {
//       const { data: authUser, error: userError } =
//         await supabase.auth.getUser();
//       if (userError) throw userError;
//       if (!authUser.user) throw new Error("Not authenticated");

//       if (authUser.user.user_metadata?.role !== "admin") {
//         setError("You are not authorized.");
//         setIsAdmin(false);
//         return;
//       }

//       setIsAdmin(true);
//       await Promise.all([
//         fetchBookings(),
//         fetchUsers(),
//         fetchRooms(),
//         fetchReviews(),
//       ]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   // --- Booking Handlers ---
//   const handleOpenCreateBooking = () => {
//     setEditingBooking(null);
//     setBookingForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenBookingModal(true);
//   };

//   const handleOpenUpdateBooking = (b: Booking) => {
//     setEditingBooking(b);
//     setBookingForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenBookingModal(true);
//   };

//   const handleSaveBooking = async () => {
//     try {
//       const updates = {
//         room_id: bookingForm.room_id,
//         check_in: bookingForm.check_in,
//         check_out: bookingForm.check_out,
//         guests: Number(bookingForm.guests),
//       };

//       if (!editingBooking) {
//         // --- CREATE BOOKING ---

//         // 1️⃣ Get the user by email
//         const resUser = await fetch(`${BASE_URL}/admin/get_user_by_email`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: bookingForm.user_email }),
//         });

//         const textUser = await resUser.text();
//         let userData;
//         try {
//           userData = JSON.parse(textUser);
//         } catch {
//           console.error("Non-JSON response from get_user_by_email:", textUser);
//           alert(
//             "Server error: expected JSON, got HTML. Check backend URL/port."
//           );
//           return;
//         }

//         if (!resUser.ok || !userData.user) {
//           alert(userData.error || "User not found");
//           return;
//         }

//         const user = userData.user;

//         const resBooking = await fetch(`${BASE_URL}/admin/create_booking`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             room_id: updates.room_id,
//             user_email: bookingForm.user_email, // ✅ send email, not user_id
//             check_in: updates.check_in,
//             check_out: updates.check_out,
//             guests: updates.guests,
//           }),
//         });

//         const textBooking = await resBooking.text();
//         let bookingData;
//         try {
//           bookingData = JSON.parse(textBooking);
//         } catch {
//           console.error("Non-JSON response from create_booking:", textBooking);
//           alert(
//             "Server error: expected JSON, got HTML. Check backend URL/port."
//           );
//           return;
//         }

//         if (!resBooking.ok) {
//           alert(bookingData.error || "Failed to create booking");
//           return;
//         }

//         alert("Booking created successfully and confirmation email sent!");
//       } else {
//         // --- UPDATE BOOKING ---
//         const resUpdate = await fetch(`${BASE_URL}/admin/update_booking`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             bookingId: editingBooking.id,
//             updates,
//           }),
//         });

//         const textUpdate = await resUpdate.text();
//         let updateData;
//         try {
//           updateData = JSON.parse(textUpdate);
//         } catch {
//           console.error("Non-JSON response from update_booking:", textUpdate);
//           alert(
//             "Server error: expected JSON, got HTML. Check backend URL/port."
//           );
//           return;
//         }

//         if (!resUpdate.ok) {
//           alert(updateData.error || "Update failed");
//           return;
//         }

//         alert("Booking updated successfully!");
//       }

//       // Close modal and refresh bookings table
//       setOpenBookingModal(false);
//       fetchBookings();
//     } catch (err: any) {
//       console.error("Booking error:", err);
//       alert(err.message || "Something went wrong");
//     }
//   };

//   const handleDeleteBooking = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;
//     try {
//       const res = await fetch(`${BASE_URL}/admin/delete_booking`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ bookingId: id }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.error || "Delete failed");
//         return;
//       }
//       fetchBookings();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   // --- User Handlers ---
//   const handleOpenCreateUser = () => {
//     setEditingUser(null);
//     setUserForm({
//       first_name: "",
//       last_name: "",
//       email: "",
//       role: "guest",
//       country: "",
//       zip_code: "",
//     });
//     setOpenUserModal(true);
//   };

//   // const handleOpenUpdateUser = (u: AdminUser) => {
//   const handleOpenUpdateUser = (u: User) => {
//     setEditingUser(u);
//     setUserForm({
//       first_name: u.first_name,
//       last_name: u.last_name,
//       email: u.email ?? "",
//       role: u.role || "guest",
//       country: u.country,
//       zip_code: u.zip_code,
//     });
//     setOpenUserModal(true);
//   };

//   const handleSaveUser = async () => {
//     try {
//       const url = `${BASE_URL}/api/admin/create_user`;

//       const payload = {
//         email: userForm.email,
//         first_name: userForm.first_name,
//         last_name: userForm.last_name,
//         role: userForm.role,
//         country: userForm.country,
//         zip_code: userForm.zip_code,
//       };

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to create user");
//       }

//       alert(`User created successfully: ${data.user?.id}`);
//       setOpenUserModal(false);
//       fetchUsers();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleDeleteUser = async (id: string, role: string | null) => {
//     if (role === "admin") {
//       alert("Cannot delete admin user!");
//       return;
//     }
//     if (!confirm("Delete this user?")) return;
//     const { error } = await supabase.auth.admin.deleteUser(id);
//     if (error) alert(error.message);
//     else fetchUsers();
//   };

//   // --- Room Handlers ---
//   const handleOpenCreateRoom = () => {
//     setEditingRoom(null);
//     setRoomForm({
//       name: "",
//       description: "",
//       amenities: [] as string[], // initialize as empty array
//       capacity: "",
//       price: "",
//     });
//     setOpenRoomModal(true);
//   };

//   const handleOpenUpdateRoom = (r: Room) => {
//     setEditingRoom(r);

//     setRoomForm({
//       name: r.name,
//       description: r.description ?? "",
//       amenities: Array.isArray(r.amenities)
//         ? r.amenities
//         : typeof r.amenities === "string"
//         ? JSON.parse(r.amenities)
//         : [],
//       capacity: String(r.capacity),
//       price: String(r.price),
//     });
//     console.log("UI room:", r.id, r.description);

//     setOpenRoomModal(true);
//   };

//   const handleSaveRoom = async () => {
//     try {
//       if (!roomForm.name.trim()) {
//         alert("Room name is required");
//         return;
//       }

//       const payload = {
//         name: roomForm.name.trim(),
//         description: roomForm.description.trim(),
//         amenities: roomForm.amenities?.length ? roomForm.amenities : [], // text[] or jsonb
//         capacity: Number(roomForm.capacity),
//         price: Number(roomForm.price),
//       };

//       if (editingRoom) {
//         console.log("Attempting update for room ID:", editingRoom.id);
//         const { data, error } = await supabase
//           .from("rooms")
//           .update(payload)
//           .eq("id", editingRoom.id)
//           .select("*")
//           .maybeSingle();

//         if (error) console.error("Update error:", error);
//         else console.log("Updated room:", data);

//         console.log("Supabase update data:", data, "error:", error);

//         // sanity check
//         const check = await supabase
//           .from("rooms")
//           .select("*")
//           .eq("id", editingRoom.id);
//         console.log(
//           "Rows with this ID in DB:",
//           check.data,
//           "error:",
//           check.error
//         );

//         console.log("Editing room:", editingRoom);
//         console.log("Editing room ID:", editingRoom.id);
//         console.log("editingRoom.id trimmed:", editingRoom.id.trim());

//         console.log("Supabase update data:", data, "error:", error);

//         if (error) throw error;
//         console.log("Room updated successfully");
//         console.log("Updated room:", data);
//       } else {
//         const { data, error } = await supabase
//           .from("rooms")
//           .insert([payload])
//           .select(); // ✅ include select to get inserted row

//         if (error) throw error;
//         console.log("Created room:", data);
//       }

//       await fetchRooms();
//       setOpenRoomModal(false);
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleDeleteRoom = async (id: string) => {
//     if (!confirm("Delete this room?")) return;
//     const { error } = await supabase.from("rooms").delete().eq("id", id);
//     if (error) alert(error.message);
//     else fetchRooms();
//   };

//   const getRoomName = (roomId: string) =>
//     rooms.find((r) => r.id === roomId)?.name || `Unknown room (${roomId})`;

//   // --- Loading/Error ---
//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading…</Typography>
//         </Box>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container>
//         <Typography color="error" textAlign="center" mt={4}>
//           {error}
//         </Typography>
//       </Container>
//     );

//   if (!isAdmin)
//     return (
//       <Container>
//         <Typography color="error" textAlign="center" mt={4}>
//           You are not authorized.
//         </Typography>
//       </Container>
//     );

//   return (
//     <Container sx={{ pb: 8 }}>
//       <Box my={4} display="flex" justifyContent="space-between">
//         <Typography variant="h4">Admin Dashboard</Typography>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleOpenCreateBooking}
//         >
//           + Create Booking
//         </Button>
//       </Box>

//       {/* Bookings Table */}
//       <Typography variant="h5" gutterBottom>
//         Bookings
//       </Typography>
//       <TableContainer component={Paper} sx={{ mb: 6 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Booking ID</TableCell>
//               <TableCell>Room Name</TableCell>
//               <TableCell>First Name</TableCell>
//               <TableCell>Last Name</TableCell>
//               <TableCell>User Email</TableCell>
//               <TableCell>Check-in</TableCell>
//               <TableCell>Check-out</TableCell>
//               <TableCell>Guests</TableCell>
//               <TableCell>Created At</TableCell>

//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {bookings.map((b) => (
//               <TableRow key={b.id}>
//                 <TableCell>{b.id}</TableCell>
//                 <TableCell>{getRoomName(b.room_id)}</TableCell>
//                 <TableCell>{b.first_name}</TableCell>
//                 <TableCell>{b.last_name}</TableCell>
//                 <TableCell>{b.user_email}</TableCell>
//                 <TableCell>{b.check_in}</TableCell>
//                 <TableCell>{b.check_out}</TableCell>
//                 <TableCell>{b.guests}</TableCell>
//                 <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>

//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1 }}
//                     onClick={() => handleOpenUpdateBooking(b)}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeleteBooking(b.id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Users */}
//       <Box my={4} display="flex" justifyContent="flex-end">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenCreateUser}
//         >
//           + Create User
//         </Button>
//       </Box>
//       <Typography variant="h5" gutterBottom>
//         Users
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>First Name</TableCell>
//               <TableCell>Last Name</TableCell>
//               <TableCell>Country</TableCell>
//               <TableCell>Zip Code</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Created At</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((u) => (
//               <TableRow key={u.id}>
//                 <TableCell>{u.id}</TableCell>
//                 <TableCell>{u.email}</TableCell>
//                 <TableCell>{u.first_name}</TableCell>
//                 <TableCell>{u.last_name}</TableCell>
//                 <TableCell>{u.country}</TableCell>
//                 <TableCell>{u.zip_code}</TableCell>
//                 <TableCell>{u.role}</TableCell>
//                 <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1 }}
//                     onClick={() => handleOpenUpdateUser(u)}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeleteUser(u.id, u.role)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Rooms */}
//       <Box my={4} display="flex" justifyContent="flex-end">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenCreateRoom}
//         >
//           + Create Room
//         </Button>
//       </Box>
//       <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
//         Rooms
//       </Typography>
//       <TableContainer component={Paper} sx={{ mb: 6 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Room ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Amenities</TableCell>
//               <TableCell>Capacity</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Images</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rooms.map((r) => (
//               <TableRow key={r.id}>
//                 <TableCell>{r.id}</TableCell>
//                 <TableCell>{r.name}</TableCell>
//                 <TableCell>{r.description}</TableCell>
//                 <TableCell>{r.amenities?.join(", ")}</TableCell>
//                 <TableCell>{r.capacity}</TableCell>
//                 <TableCell>€{r.price}</TableCell>
//                 <TableCell>
//                   {r.images?.length ? r.images.join(", ") : "No images"}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1 }}
//                     onClick={() => handleOpenUpdateRoom(r)}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeleteRoom(r.id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Typography variant="h5" gutterBottom>
//         Reviews
//       </Typography>
//       <TableContainer component={Paper} sx={{ mb: 6 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Review ID</TableCell>
//               <TableCell>Booking ID</TableCell>
//               <TableCell>Room Name</TableCell>
//               <TableCell>Rating</TableCell>
//               <TableCell>Comment</TableCell>
//               <TableCell>Created at</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {reviews.map((r) => (
//               <TableRow key={r.id}>
//                 <TableCell>{r.id}</TableCell>
//                 <TableCell>{r.booking_id}</TableCell>
//                 <TableCell>{getRoomName(r.room_id)}</TableCell>
//                 <TableCell>{r.rating}</TableCell>
//                 <TableCell>{r.comment}</TableCell>
//                 <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* --- Booking Modal --- */}
//       <Dialog
//         open={openBookingModal}
//         onClose={() => setOpenBookingModal(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {editingBooking ? "Update Booking" : "Create Booking"}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Room ID"
//             fullWidth
//             value={bookingForm.room_id}
//             onChange={(e) =>
//               setBookingForm({ ...bookingForm, room_id: e.target.value })
//             }
//           />
//           {!editingBooking && (
//             <TextField
//               margin="dense"
//               label="User Email"
//               fullWidth
//               value={bookingForm.user_email}
//               onChange={(e) =>
//                 setBookingForm({ ...bookingForm, user_email: e.target.value })
//               }
//             />
//           )}
//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-in"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={bookingForm.check_in}
//             onChange={(e) =>
//               setBookingForm({ ...bookingForm, check_in: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-out"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={bookingForm.check_out}
//             onChange={(e) =>
//               setBookingForm({ ...bookingForm, check_out: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             type="number"
//             label="Guests"
//             fullWidth
//             value={bookingForm.guests}
//             onChange={(e) =>
//               setBookingForm({ ...bookingForm, guests: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenBookingModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveBooking}>
//             {editingBooking ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* --- User Modal --- */}
//       <Dialog
//         open={openUserModal}
//         onClose={() => setOpenUserModal(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>{editingUser ? "Update User" : "Create User"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="First Name"
//             fullWidth
//             value={userForm.first_name}
//             onChange={(e) =>
//               setUserForm({ ...userForm, first_name: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Last Name"
//             fullWidth
//             value={userForm.last_name}
//             onChange={(e) =>
//               setUserForm({ ...userForm, last_name: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Email"
//             fullWidth
//             value={userForm.email}
//             onChange={(e) =>
//               setUserForm({ ...userForm, email: e.target.value })
//             }
//             disabled={!!editingUser} // email is fixed when updating
//           />
//           <TextField
//             margin="dense"
//             label="Role"
//             fullWidth
//             value={userForm.role}
//             onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Country"
//             fullWidth
//             value={userForm.country}
//             onChange={(e) =>
//               setUserForm({ ...userForm, country: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             label="Zip Code"
//             fullWidth
//             value={userForm.zip_code}
//             onChange={(e) =>
//               setUserForm({ ...userForm, zip_code: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveUser}>
//             {editingUser ? "Update User" : "Create User"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* --- Room Modal --- */}
//       <Dialog
//         open={openRoomModal}
//         onClose={() => setOpenRoomModal(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>{editingRoom ? "Update Room" : "Create Room"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Name"
//             fullWidth
//             value={roomForm.name}
//             onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="Description"
//             fullWidth
//             value={roomForm.description}
//             onChange={(e) =>
//               setRoomForm({ ...roomForm, description: e.target.value })
//             }
//           />

//           <Autocomplete
//             multiple
//             freeSolo
//             options={[]}
//             value={roomForm.amenities}
//             onChange={(event, newValue) => {
//               setRoomForm({ ...roomForm, amenities: newValue });
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Amenities"
//                 placeholder="Type and press Enter"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" || e.key === ",") {
//                     e.preventDefault();
//                     const input = (e.target as HTMLInputElement).value
//                       .split(",")
//                       .map((a) => a.trim())
//                       .filter((a) => a.length > 0);

//                     setRoomForm({
//                       ...roomForm,
//                       amenities: [...roomForm.amenities, ...input],
//                     });

//                     // Clear the input field
//                     (e.target as HTMLInputElement).value = "";
//                   }
//                 }}
//               />
//             )}
//           />

//           <TextField
//             margin="dense"
//             type="number"
//             label="Capacity"
//             fullWidth
//             value={roomForm.capacity}
//             onChange={(e) =>
//               setRoomForm({ ...roomForm, capacity: e.target.value })
//             }
//           />
//           <TextField
//             margin="dense"
//             type="number"
//             label="Price"
//             fullWidth
//             value={roomForm.price}
//             onChange={(e) =>
//               setRoomForm({ ...roomForm, price: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenRoomModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveRoom}>
//             {editingRoom ? "Update Room" : "Create Room"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import AdminBookings from "../components/adminBookings/adminBookings";
import AdminUsers from "../components/adminUsers/adminUsers";
import AdminRooms from "../components/adminRooms/adminRooms";
import AdminReviews from "../components/adminReviews/adminReviews";

import type { Booking, Room, Review, User } from "../types/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const AdminDashboard = () => {
  const BASE_URL = "http://localhost:3000";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Fetch functions (unchanged) ---
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
    setUsers(data as User[]);
  };

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setRooms(data as Room[]);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("room_id", { ascending: false });
    if (error) throw error;
    setReviews(data as Review[]);
  };

  // --- Init (unchanged) ---
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user?.user_metadata?.role !== "admin") {
          setError("You are not authorized.");
          return;
        }
        setIsAdmin(true);
        await Promise.all([
          fetchBookings(),
          fetchUsers(),
          fetchRooms(),
          fetchReviews(),
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      </Box>

      <AdminBookings
        bookings={bookings}
        rooms={rooms}
        fetchBookings={fetchBookings}
        BASE_URL={BASE_URL}
      />

      <AdminUsers
        users={users}
        fetchUsers={fetchUsers}
        BASE_URL={BASE_URL}
        supabase={supabase}
      />

      <AdminRooms rooms={rooms} fetchRooms={fetchRooms} supabase={supabase} />

      <AdminReviews reviews={reviews} rooms={rooms} />
    </Container>
  );
};

export default AdminDashboard;
