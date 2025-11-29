// import Reaconst supabase =t, { useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import { Box, Button, Typography, Stack, Paper } from "@mui/material";

// const AdminDashboard: React.FC = () => {
//   const auth = useContext(AuthContext);

//   // Protect non-admins
//   if (!auth?.user || auth.user.role !== "admin") {
//     return (
//       <Box textAlign="center" mt={10}>
//         <Typography variant="h5" color="error">
//           Access Denied
//         </Typography>
//         <Typography>You are not an admin.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         Admin Dashboard
//       </Typography>
//       <Typography variant="subtitle1" gutterBottom>
//         Welcome, {auth.user.firstName}!
//       </Typography>

//       <Stack spacing={2} direction="row" mt={4}>
//         <Button variant="contained" color="primary">
//           Manage Reservations
//         </Button>
//         <Button variant="contained" color="secondary">
//           View Users
//         </Button>
//         <Button variant="contained" color="success">
//           System Settings
//         </Button>
//       </Stack>

//       <Paper elevation={2} sx={{ mt: 6, p: 3 }}>
//         <Typography variant="h6">Quick Stats</Typography>
//         <Typography>Total Reservations: 42</Typography>
//         <Typography>Registered Users: 123</Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default AdminDashboard;

//

// src/pages/AdminDashboard.tsx
// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const { data, error } = await supabase.from("bookings").select("*");
//         if (error) throw error;
//         setBookings(data || []);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, []);

//   if (loading) return <p>Loading bookings...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h2>All Bookings</h2>
//       {bookings.length === 0 && <p>No bookings found.</p>}
//       <ul>
//         {bookings.map((b: any) => (
//           <li key={b.id}>
//             Booking ID: {b.id} — Check-in: {b.check_in} — Check-out:{" "}
//             {b.check_out}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Paper,
//   Stack,
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // useEffect(() => {
//   //   const fetchBookings = async () => {
//   //     try {
//   //       const { data, error } = await supabase.from("bookings").select("*");
//   //       if (error) throw error;
//   //       setBookings(data || []);
//   //     } catch (err: any) {
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchBookings();
//   // }, []);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const { data, error } = await supabase.from("bookings").select("*"); // ← IMPORTANT: no join

//         if (error) throw error;
//         setBookings(data || []);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   // useEffect(() => {
//   //   const fetchBookings = async () => {
//   //     try {
//   //       const { data, error } = await supabase.from("bookings").select(`
//   //         *,
//   //         user:user_id (
//   //           id,
//   //           email
//   //         )
//   //       `);

//   //       if (error) throw error;
//   //       setBookings(data || []);
//   //     } catch (err: any) {
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchBookings();
//   // }, []);

//   const handleCreate = () => {
//     alert("Create booking clicked");
//   };

//   const handleUpdate = (id: string) => {
//     alert(`Update booking ${id}`);
//   };

//   const handleCancel = (id: string) => {
//     alert(`Cancel booking ${id}`);
//   };

//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading bookings...</Typography>
//         </Box>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       </Container>
//     );

//   return (
//     <Container>
//       <Box my={4}>
//         <Typography variant="h4" gutterBottom>
//           Admin Dashboard
//         </Typography>
//         <Button variant="contained" color="primary" onClick={handleCreate}>
//           Create Booking
//         </Button>
//       </Box>

//       {bookings.length === 0 ? (
//         <Typography>No bookings found.</Typography>
//       ) : (
//         <List>
//           {bookings.map((b) => (
//             <Paper key={b.id} sx={{ mb: 2, p: 2 }}>
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <ListItemText
//                   primary={`Booking ID: ${b.id}`}
//                   secondary={`Room: ${b.room_id} — Check-in: ${b.check_in} — Check-out: ${b.check_out} — Guests: ${b.guests}`}
//                 />
//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     variant="outlined"
//                     color="info"
//                     onClick={() => handleUpdate(b.id)}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleCancel(b.id)}
//                   >
//                     Cancel
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Paper>
//           ))}
//         </List>
//       )}
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   Box,
//   CircularProgress,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
//       try {
//         // 1️⃣ Get current user
//         const { data: userData, error: userError } =
//           await supabase.auth.getUser();
//         if (userError) throw userError;
//         if (!userData.user) throw new Error("Not authenticated");

//         const role = userData.user.user_metadata?.role;
//         if (role !== "admin") {
//           setIsAdmin(false);
//           setError("You are not authorized to view this page.");
//           return;
//         }
//         setIsAdmin(true);

//         // 2️⃣ Fetch all bookings via the RPC function
//         const { data: bookingsData, error: bookingsError } = await supabase.rpc(
//           "get_all_bookings"
//         );

//         if (bookingsError) throw bookingsError;

//         setBookings((bookingsData as Booking[]) || []);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading bookings...</Typography>
//         </Box>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       </Container>
//     );

//   if (!isAdmin)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">You are not authorized.</Typography>
//         </Box>
//       </Container>
//     );

//   return (
//     <Container>
//       <Box my={4}>
//         <Typography variant="h4" gutterBottom>
//           Admin Dashboard
//         </Typography>
//       </Box>

//       {bookings.length === 0 ? (
//         <Typography>No bookings found.</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Booking ID</TableCell>
//                 <TableCell>Room ID</TableCell>
//                 <TableCell>First Name</TableCell>
//                 <TableCell>User Email</TableCell>
//                 <TableCell>Check-in</TableCell>
//                 <TableCell>Check-out</TableCell>
//                 <TableCell>Guests</TableCell>
//                 <TableCell>Created At</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bookings.map((b) => (
//                 <TableRow key={b.id}>
//                   <TableCell>{b.id}</TableCell>
//                   <TableCell>{b.room_id}</TableCell>
//                   <TableCell>{b.first_name}</TableCell>
//                   <TableCell>{b.user_email}</TableCell>
//                   <TableCell>{b.check_in}</TableCell>
//                   <TableCell>{b.check_out}</TableCell>
//                   <TableCell>{b.guests}</TableCell>
//                   <TableCell>
//                     {new Date(b.created_at).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();
//       if (userError) throw userError;
//       if (!userData.user) throw new Error("Not authenticated");

//       const role = userData.user.user_metadata?.role;
//       if (role !== "admin") {
//         setIsAdmin(false);
//         setError("You are not authorized to view this page.");
//         return;
//       }

//       setIsAdmin(true);
//       const { data, error: bookingsError } = await supabase.rpc(
//         "get_all_bookings"
//       );
//       if (bookingsError) throw bookingsError;

//       setBookings((data as Booking[]) || []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // 🔹 CREATE BOOKING
//   const handleCreate = async () => {
//     const room_id = prompt("Room ID:");
//     const user_email = prompt("User Email:");
//     const check_in = prompt("Check-in (YYYY-MM-DD):");
//     const check_out = prompt("Check-out (YYYY-MM-DD):");
//     const guests = prompt("Guests:");

//     if (!room_id || !user_email || !check_in || !check_out || !guests) return;

//     const { error } = await supabase.from("bookings").insert([
//       {
//         room_id,
//         user_email,
//         check_in,
//         check_out,
//         guests: Number(guests),
//       },
//     ]);

//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   // 🔹 UPDATE BOOKING
//   const handleUpdate = async (b: Booking) => {
//     const check_in = prompt("New check-in:", b.check_in);
//     const check_out = prompt("New check-out:", b.check_out);
//     const guests = prompt("New guests:", b.guests.toString());

//     if (!check_in || !check_out || !guests) return;

//     const { error } = await supabase
//       .from("bookings")
//       .update({
//         check_in,
//         check_out,
//         guests: Number(guests),
//       })
//       .eq("id", b.id);

//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   // 🔹 DELETE BOOKING
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;

//     const { error } = await supabase.from("bookings").delete().eq("id", id);

//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading bookings...</Typography>
//         </Box>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       </Container>
//     );

//   if (!isAdmin)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">You are not authorized.</Typography>
//         </Box>
//       </Container>
//     );

//   return (
//     <Container>
//       <Box
//         my={4}
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         <Typography variant="h4">Admin Dashboard</Typography>

//         <Button variant="contained" color="success" onClick={handleCreate}>
//           + Create Booking
//         </Button>
//       </Box>

//       {bookings.length === 0 ? (
//         <Typography>No bookings found.</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Booking ID</TableCell>
//                 <TableCell>Room ID</TableCell>
//                 <TableCell>First Name</TableCell>
//                 <TableCell>User Email</TableCell>
//                 <TableCell>Check-in</TableCell>
//                 <TableCell>Check-out</TableCell>
//                 <TableCell>Guests</TableCell>
//                 <TableCell>Created At</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bookings.map((b) => (
//                 <TableRow key={b.id}>
//                   <TableCell>{b.id}</TableCell>
//                   <TableCell>{b.room_id}</TableCell>
//                   <TableCell>{b.first_name}</TableCell>
//                   <TableCell>{b.user_email}</TableCell>
//                   <TableCell>{b.check_in}</TableCell>
//                   <TableCell>{b.check_out}</TableCell>
//                   <TableCell>{b.guests}</TableCell>
//                   <TableCell>
//                     {new Date(b.created_at).toLocaleString()}
//                   </TableCell>

//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       size="small"
//                       onClick={() => handleUpdate(b)}
//                       sx={{ mr: 1 }}
//                     >
//                       Update
//                     </Button>

//                     <Button
//                       variant="outlined"
//                       color="error"
//                       size="small"
//                       onClick={() => handleDelete(b.id)}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
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
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Modal state
//   const [openModal, setOpenModal] = useState(false);
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

//   // Form fields
//   const [form, setForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();
//       if (userError) throw userError;
//       if (!userData.user) throw new Error("Not authenticated");

//       const role = userData.user.user_metadata?.role;
//       if (role !== "admin") {
//         setIsAdmin(false);
//         setError("You are not authorized.");
//         return;
//       }

//       setIsAdmin(true);

//       const { data, error: bookingsError } = await supabase.rpc(
//         "get_all_bookings"
//       );
//       if (bookingsError) throw bookingsError;

//       setBookings((data as Booking[]) || []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // 🔹 OPEN CREATE MODAL
//   const handleOpenCreate = () => {
//     setEditingBooking(null);
//     setForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenModal(true);
//   };

//   // 🔹 OPEN UPDATE MODAL
//   const handleOpenUpdate = (b: Booking) => {
//     setEditingBooking(b);
//     setForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenModal(true);
//   };

//   // 🔹 SAVE (Create or Update)
//   const handleSave = async () => {
//     const payload = {
//       room_id: form.room_id,
//       user_email: form.user_email,
//       check_in: form.check_in,
//       check_out: form.check_out,
//       guests: Number(form.guests),
//     };

//     let error;

//     if (editingBooking) {
//       // UPDATE
//       const res = await supabase
//         .from("bookings")
//         .update(payload)
//         .eq("id", editingBooking.id);

//       error = res.error;
//     } else {
//       // CREATE
//       const res = await supabase.from("bookings").insert([payload]);
//       error = res.error;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchBookings();
//   };

//   // 🔹 DELETE
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;

//     const { error } = await supabase.from("bookings").delete().eq("id", id);

//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading bookings...</Typography>
//         </Box>
//       </Container>
//     );

//   if (error)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       </Container>
//     );

//   if (!isAdmin)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">You are not authorized.</Typography>
//         </Box>
//       </Container>
//     );

//   return (
//     <Container>
//       <Box
//         my={4}
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         <Typography variant="h4">Admin Dashboard</Typography>

//         <Button variant="contained" color="success" onClick={handleOpenCreate}>
//           + Create Booking
//         </Button>
//       </Box>

//       {/* TABLE */}
//       {bookings.length === 0 ? (
//         <Typography>No bookings found.</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Booking ID</TableCell>
//                 <TableCell>Room ID</TableCell>
//                 <TableCell>First Name</TableCell>
//                 <TableCell>User Email</TableCell>
//                 <TableCell>Check-in</TableCell>
//                 <TableCell>Check-out</TableCell>
//                 <TableCell>Guests</TableCell>
//                 <TableCell>Created At</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bookings.map((b) => (
//                 <TableRow key={b.id}>
//                   <TableCell>{b.id}</TableCell>
//                   <TableCell>{b.room_id}</TableCell>
//                   <TableCell>{b.first_name}</TableCell>
//                   <TableCell>{b.user_email}</TableCell>
//                   <TableCell>{b.check_in}</TableCell>
//                   <TableCell>{b.check_out}</TableCell>
//                   <TableCell>{b.guests}</TableCell>
//                   <TableCell>
//                     {new Date(b.created_at).toLocaleString()}
//                   </TableCell>

//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       size="small"
//                       onClick={() => handleOpenUpdate(b)}
//                       sx={{ mr: 1 }}
//                     >
//                       Update
//                     </Button>

//                     <Button
//                       variant="outlined"
//                       color="error"
//                       size="small"
//                       onClick={() => handleDelete(b.id)}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* MODAL FORM */}
//       <Dialog
//         open={openModal}
//         onClose={() => setOpenModal(false)}
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
//             value={form.room_id}
//             onChange={(e) => setForm({ ...form, room_id: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="User Email"
//             fullWidth
//             value={form.user_email}
//             onChange={(e) => setForm({ ...form, user_email: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-in"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_in}
//             onChange={(e) => setForm({ ...form, check_in: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-out"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_out}
//             onChange={(e) => setForm({ ...form, check_out: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="Guests"
//             type="number"
//             fullWidth
//             value={form.guests}
//             onChange={(e) => setForm({ ...form, guests: e.target.value })}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             {editingBooking ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
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
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// interface AdminUser {
//   id: string;
//   email: string;
//   role: string | null;
//   created_at: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Modal state
//   const [openModal, setOpenModal] = useState(false);
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

//   const [form, setForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   const fetchBookings = async () => {
//     const { data, error } = await supabase.rpc("get_all_bookings");
//     if (error) throw error;
//     setBookings((data as Booking[]) || []);
//   };

//   const fetchUsers = async () => {
//     const { data, error } = await supabase.rpc("admin_get_users");
//     if (error) throw error;

//     setUsers(data as AdminUser[]);
//   };

//   const init = async () => {
//     try {
//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();
//       if (userError) throw userError;
//       if (!userData.user) throw new Error("Not authenticated");

//       if (userData.user.user_metadata?.role !== "admin") {
//         setIsAdmin(false);
//         setError("You are not authorized.");
//         return;
//       }

//       setIsAdmin(true);

//       await Promise.all([fetchBookings(), fetchUsers()]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   // CREATE
//   const handleOpenCreate = () => {
//     setEditingBooking(null);
//     setForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenModal(true);
//   };

//   // UPDATE
//   const handleOpenUpdate = (b: Booking) => {
//     setEditingBooking(b);
//     setForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenModal(true);
//   };

//   // SAVE
//   const handleSave = async () => {
//     const payload = {
//       room_id: form.room_id,
//       user_email: form.user_email,
//       check_in: form.check_in,
//       check_out: form.check_out,
//       guests: Number(form.guests),
//     };

//     let error;

//     if (editingBooking) {
//       const res = await supabase
//         .from("bookings")
//         .update(payload)
//         .eq("id", editingBooking.id);

//       error = res.error;
//     } else {
//       const res = await supabase.from("bookings").insert([payload]);
//       error = res.error;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchBookings();
//   };

//   // DELETE
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;

//     const { error } = await supabase.from("bookings").delete().eq("id", id);

//     if (error) alert(error.message);
//     else fetchBookings();
//   };

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
//         <Button variant="contained" color="success" onClick={handleOpenCreate}>
//           + Create Booking
//         </Button>
//       </Box>

//       {/* BOOKINGS TABLE */}
//       <Typography variant="h5" gutterBottom>
//         Bookings
//       </Typography>

//       <TableContainer component={Paper} sx={{ mb: 6 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Booking ID</TableCell>
//               <TableCell>Room ID</TableCell>
//               <TableCell>First Name</TableCell>
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
//                 <TableCell>{b.room_id}</TableCell>
//                 <TableCell>{b.first_name}</TableCell>
//                 <TableCell>{b.user_email}</TableCell>
//                 <TableCell>{b.check_in}</TableCell>
//                 <TableCell>{b.check_out}</TableCell>
//                 <TableCell>{b.guests}</TableCell>
//                 <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>

//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1 }}
//                     onClick={() => handleOpenUpdate(b)}
//                   >
//                     Update
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDelete(b.id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* USERS TABLE */}
//       <Typography variant="h5" gutterBottom>
//         Users
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Created At</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {users.map((u) => (
//               <TableRow key={u.id}>
//                 <TableCell>{u.id}</TableCell>
//                 <TableCell>{u.email}</TableCell>
//                 <TableCell>{u.role}</TableCell>
//                 <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* MODAL */}
//       <Dialog
//         open={openModal}
//         onClose={() => setOpenModal(false)}
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
//             value={form.room_id}
//             onChange={(e) => setForm({ ...form, room_id: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="User Email"
//             fullWidth
//             value={form.user_email}
//             onChange={(e) => setForm({ ...form, user_email: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-in"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_in}
//             onChange={(e) => setForm({ ...form, check_in: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-out"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_out}
//             onChange={(e) => setForm({ ...form, check_out: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="Guests"
//             type="number"
//             fullWidth
//             value={form.guests}
//             onChange={(e) => setForm({ ...form, guests: e.target.value })}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             {editingBooking ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
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
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// interface AdminUser {
//   id: string;
//   email: string;
//   role: string | null;
//   created_at: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Modal
//   const [openModal, setOpenModal] = useState(false);
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

//   const [form, setForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   // FETCH BOOKINGS
//   const fetchBookings = async () => {
//     const { data, error } = await supabase.rpc("get_all_bookings");
//     if (error) throw error;
//     setBookings(data || []);
//   };

//   // FETCH USERS FROM profiles TABLE
//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;
//     setUsers(data as AdminUser[]);
//   };

//   // INIT
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

//       await Promise.all([fetchBookings(), fetchUsers()]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   // CREATE
//   const handleOpenCreate = () => {
//     setEditingBooking(null);
//     setForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenModal(true);
//   };

//   // UPDATE
//   const handleOpenUpdate = (b: Booking) => {
//     setEditingBooking(b);
//     setForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenModal(true);
//   };

//   // SAVE (create or update)
//   const handleSave = async () => {
//     const payload = {
//       room_id: form.room_id,
//       user_email: form.user_email,
//       check_in: form.check_in,
//       check_out: form.check_out,
//       guests: Number(form.guests),
//     };

//     let error;

//     if (editingBooking) {
//       const res = await supabase
//         .from("bookings")
//         .update(payload)
//         .eq("id", editingBooking.id);
//       error = res.error;
//     } else {
//       const res = await supabase.from("bookings").insert([payload]);
//       error = res.error;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchBookings();
//   };

//   // DELETE
//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;

//     const { error } = await supabase.from("bookings").delete().eq("id", id);
//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   // LOADING
//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//           <Typography mt={2}>Loading…</Typography>
//         </Box>
//       </Container>
//     );

//   // ERROR
//   if (error)
//     return (
//       <Container>
//         <Typography color="error" textAlign="center" mt={4}>
//           {error}
//         </Typography>
//       </Container>
//     );

//   // NOT ADMIN
//   if (!isAdmin)
//     return (
//       <Container>
//         <Typography color="error" textAlign="center" mt={4}>
//           You are not authorized.
//         </Typography>
//       </Container>
//     );

//   // MAIN UI
//   return (
//     <Container sx={{ pb: 8 }}>
//       <Box my={4} display="flex" justifyContent="space-between">
//         <Typography variant="h4">Admin Dashboard</Typography>
//         <Button variant="contained" color="success" onClick={handleOpenCreate}>
//           + Create Booking
//         </Button>
//       </Box>

//       {/* BOOKINGS TABLE */}
//       <Typography variant="h5" gutterBottom>
//         Bookings
//       </Typography>

//       <TableContainer component={Paper} sx={{ mb: 6 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Booking ID</TableCell>
//               <TableCell>Room ID</TableCell>
//               <TableCell>First Name</TableCell>
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
//                 <TableCell>{b.room_id}</TableCell>
//                 <TableCell>{b.first_name}</TableCell>
//                 <TableCell>{b.user_email}</TableCell>
//                 <TableCell>{b.check_in}</TableCell>
//                 <TableCell>{b.check_out}</TableCell>
//                 <TableCell>{b.guests}</TableCell>
//                 <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>

//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1 }}
//                     onClick={() => handleOpenUpdate(b)}
//                   >
//                     Update
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDelete(b.id)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* USERS TABLE */}
//       <Typography variant="h5" gutterBottom>
//         Users
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Created At</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {users.map((u) => (
//               <TableRow key={u.id}>
//                 <TableCell>{u.id}</TableCell>
//                 <TableCell>{u.email}</TableCell>
//                 <TableCell>{u.role}</TableCell>
//                 <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* MODAL */}
//       <Dialog
//         open={openModal}
//         onClose={() => setOpenModal(false)}
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
//             value={form.room_id}
//             onChange={(e) => setForm({ ...form, room_id: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="User Email"
//             fullWidth
//             value={form.user_email}
//             onChange={(e) => setForm({ ...form, user_email: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-in"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_in}
//             onChange={(e) => setForm({ ...form, check_in: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             type="date"
//             label="Check-out"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.check_out}
//             onChange={(e) => setForm({ ...form, check_out: e.target.value })}
//           />

//           <TextField
//             margin="dense"
//             label="Guests"
//             type="number"
//             fullWidth
//             value={form.guests}
//             onChange={(e) => setForm({ ...form, guests: e.target.value })}
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             {editingBooking ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
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
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// interface AdminUser {
//   id: string;
//   email: string;
//   role: string | null;
//   created_at: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Modal state
//   const [openModal, setOpenModal] = useState(false);

//   // Bookings form state
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
//   const [form, setForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   // Users form state
//   const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
//   const [userForm, setUserForm] = useState({
//     email: "",
//     role: "guest",
//   });

//   // --- Fetch Bookings ---
//   const fetchBookings = async () => {
//     const { data, error } = await supabase.rpc("get_all_bookings");

//     // const { data, error } = await supabase
//     //   .from("bookings")
//     //   .select("*")
//     //   .order("created_at", { ascending: false });

//     if (error) throw error;
//     setBookings(data || []);
//   };

//   // --- Fetch Users ---
//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) throw error;
//     setUsers(data as AdminUser[]);
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
//       await Promise.all([fetchBookings(), fetchUsers()]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   // --- Booking CRUD ---
//   const handleOpenCreateBooking = () => {
//     setEditingBooking(null);
//     setForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenModal(true);
//   };

//   const handleOpenUpdateBooking = (b: Booking) => {
//     setEditingBooking(b);
//     setForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenModal(true);
//   };

//   const handleSaveBooking = async () => {
//     const payload = {
//       room_id: form.room_id,
//       // user_email: form.user_email,
//       check_in: form.check_in,
//       check_out: form.check_out,
//       guests: Number(form.guests),
//        // Include user_id if creating
//   ...(editingBooking ? {} : { user_id: user.id }),
//     };

//     let error;

//     if (editingBooking) {
//       const res = await supabase
//         .from("bookings")
//         .update(payload)
//         .eq("id", editingBooking.id);
//       error = res.error;
//     } else {
//       // When creating a booking, convert email → user_id
//       // const { data: user } = await supabase
//       //   .from("profiles")
//       //   .select("id")
//       //   .eq("email", form.user_email)
//       //   .single();

//       // if (!user) {
//       //   alert("User not found");
//       //   return;
//       // }

//       // const res = await supabase
//       //   .from("bookings")
//       //   .insert([{ ...payload, user_id: user.id }]);

//       const res = await supabase.from("bookings").insert([payload]);
//       error = res.error;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchBookings();
//   };

//   const handleDeleteBooking = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;
//     const { error } = await supabase.from("bookings").delete().eq("id", id);
//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   // --- User CRUD ---
//   const handleOpenCreateUser = () => {
//     setEditingUser(null);
//     setUserForm({ email: "", role: "guest" });
//     setOpenModal(true);
//   };

//   const handleOpenUpdateUser = (u: AdminUser) => {
//     setEditingUser(u);
//     setUserForm({ email: u.email, role: u.role || "guest" });
//     setOpenModal(true);
//   };

//   const handleSaveUser = async () => {
//     const payload = { email: userForm.email, role: userForm.role };

//     // Prevent changing admin role
//     if (
//       editingUser &&
//       editingUser.role === "admin" &&
//       userForm.role !== "admin"
//     ) {
//       alert("Cannot change admin role!");
//       return;
//     }

//     let error;

//     if (editingUser) {
//       const res = await supabase
//         .from("profiles")
//         .update(payload)
//         .eq("id", editingUser.id);
//       error = res.error;
//     } else {
//       // Create new user via Supabase Admin API
//       const { data, error: insertError } = await supabase.auth.admin.createUser(
//         {
//           email: userForm.email,
//           password: Math.random().toString(36).slice(-8),
//           email_confirm: true,
//           user_metadata: { role: userForm.role },
//         }
//       );
//       error = insertError;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchUsers();
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

//   // --- Loading/Error/Not Admin UI ---
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

//   // --- Main Dashboard UI ---
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
//               <TableCell>Room ID</TableCell>
//               <TableCell>First Name</TableCell>
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
//                 <TableCell>{b.room_id}</TableCell>
//                 <TableCell>{b.first_name}</TableCell>
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

//       <Box my={4} display="flex" justifyContent="flex-end">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenCreateUser}
//         >
//           + Create User
//         </Button>
//       </Box>

//       {/* Users Table */}
//       <Typography variant="h5" gutterBottom>
//         Users
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Email</TableCell>
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

//       {/* Modal for Bookings & Users */}
//       <Dialog
//         open={openModal}
//         onClose={() => setOpenModal(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {editingBooking
//             ? "Update Booking"
//             : editingUser
//             ? "Update User"
//             : "Create Booking / User"}
//         </DialogTitle>
//         <DialogContent>
//           {editingBooking || (!editingUser && !editingBooking) ? (
//             <>
//               {/* Booking Form */}
//               <TextField
//                 margin="dense"
//                 label="Room ID"
//                 fullWidth
//                 value={form.room_id}
//                 onChange={(e) => setForm({ ...form, room_id: e.target.value })}
//               />
//               <TextField
//                 margin="dense"
//                 label="User Email"
//                 fullWidth
//                 value={form.user_email}
//                 onChange={(e) =>
//                   setForm({ ...form, user_email: e.target.value })
//                 }
//               />

//               {/* Show user_email ONLY when creating
//               {!editingBooking && (
//                 <TextField
//                   margin="dense"
//                   label="User Email"
//                   fullWidth
//                   value={form.user_email}
//                   onChange={(e) =>
//                     setForm({ ...form, user_email: e.target.value })
//                   }
//                 />
//               )} */}
//               <TextField
//                 margin="dense"
//                 type="date"
//                 label="Check-in"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={form.check_in}
//                 onChange={(e) => setForm({ ...form, check_in: e.target.value })}
//               />
//               <TextField
//                 margin="dense"
//                 type="date"
//                 label="Check-out"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={form.check_out}
//                 onChange={(e) =>
//                   setForm({ ...form, check_out: e.target.value })
//                 }
//               />
//               <TextField
//                 margin="dense"
//                 label="Guests"
//                 type="number"
//                 fullWidth
//                 value={form.guests}
//                 onChange={(e) => setForm({ ...form, guests: e.target.value })}
//               />
//             </>
//           ) : (
//             <>
//               {/* User Form */}
//               <TextField
//                 margin="dense"
//                 label="Email"
//                 fullWidth
//                 value={userForm.email}
//                 onChange={(e) =>
//                   setUserForm({ ...userForm, email: e.target.value })
//                 }
//               />
//               <TextField
//                 margin="dense"
//                 label="Role"
//                 fullWidth
//                 select
//                 SelectProps={{ native: true }}
//                 value={userForm.role}
//                 onChange={(e) =>
//                   setUserForm({ ...userForm, role: e.target.value })
//                 }
//                 disabled={editingUser?.role === "admin"} // Prevent admin role change
//               >
//                 <option value="guest">guest</option>
//                 <option value="admin">admin</option>
//               </TextField>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={
//               editingBooking || (!editingUser && !editingBooking)
//                 ? handleSaveBooking
//                 : handleSaveUser
//             }
//           >
//             {editingBooking
//               ? "Update Booking"
//               : editingUser
//               ? "Update User"
//               : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
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
// } from "@mui/material";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface Booking {
//   id: string;
//   room_id: string;
//   user_id: string;
//   user_email: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at: string;
//   first_name: string;
// }

// interface AdminUser {
//   id: string;
//   email: string;
//   role: string | null;
//   created_at: string;
// }

// const AdminDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Modal state
//   const [openModal, setOpenModal] = useState(false);

//   // Bookings form state
//   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
//   const [form, setForm] = useState({
//     room_id: "",
//     user_email: "",
//     check_in: "",
//     check_out: "",
//     guests: "",
//   });

//   // Users form state
//   const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
//   const [userForm, setUserForm] = useState({
//     email: "",
//     role: "guest",
//   });

//   // --- Fetch Bookings ---
//   const fetchBookings = async () => {
//     const { data, error } = await supabase.rpc("get_all_bookings");

//     // const { data, error } = await supabase
//     //   .from("bookings")
//     //   .select("*")
//     //   .order("created_at", { ascending: false });

//     if (error) throw error;
//     setBookings(data || []);
//   };

//   // --- Fetch Users ---
//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (error) throw error;
//     setUsers(data as AdminUser[]);
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
//       await Promise.all([fetchBookings(), fetchUsers()]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     init();
//   }, []);

//   // --- Booking CRUD ---
//   const handleOpenCreateBooking = () => {
//     setEditingBooking(null);
//     setForm({
//       room_id: "",
//       user_email: "",
//       check_in: "",
//       check_out: "",
//       guests: "",
//     });
//     setOpenModal(true);
//   };

//   const handleOpenUpdateBooking = (b: Booking) => {
//     setEditingBooking(b);
//     setForm({
//       room_id: b.room_id,
//       user_email: b.user_email,
//       check_in: b.check_in,
//       check_out: b.check_out,
//       guests: String(b.guests),
//     });
//     setOpenModal(true);
//   };

//   const handleSaveBooking = async () => {
//     const payload: any = {
//       room_id: form.room_id,
//       check_in: form.check_in,
//       check_out: form.check_out,
//       guests: Number(form.guests),
//     };

//     let error;

//     if (editingBooking) {
//       // --- Update existing booking ---
//       const res = await supabase
//         .from("bookings")
//         .update(payload)
//         .eq("id", editingBooking.id);
//       error = res.error;
//     } else {
//       // --- Create booking ---
//       // Convert user email → user_id
//       const { data: user, error: userError } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("email", form.user_email)
//         .single();

//       if (userError || !user) {
//         alert("User not found");
//         return;
//       }

//       payload.user_id = user.id;

//       const res = await supabase.from("bookings").insert([payload]);
//       error = res.error;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchBookings();
//   };

//   const handleDeleteBooking = async (id: string) => {
//     if (!confirm("Delete this booking?")) return;
//     const { error } = await supabase.from("bookings").delete().eq("id", id);
//     if (error) alert(error.message);
//     else fetchBookings();
//   };

//   // --- User CRUD ---
//   const handleOpenCreateUser = () => {
//     setEditingUser(null);
//     setUserForm({ email: "", role: "guest" });
//     setOpenModal(true);
//   };

//   const handleOpenUpdateUser = (u: AdminUser) => {
//     setEditingUser(u);
//     setUserForm({ email: u.email, role: u.role || "guest" });
//     setOpenModal(true);
//   };

//   const handleSaveUser = async () => {
//     const payload = { email: userForm.email, role: userForm.role };

//     // Prevent changing admin role
//     if (
//       editingUser &&
//       editingUser.role === "admin" &&
//       userForm.role !== "admin"
//     ) {
//       alert("Cannot change admin role!");
//       return;
//     }

//     let error;

//     if (editingUser) {
//       const res = await supabase
//         .from("profiles")
//         .update(payload)
//         .eq("id", editingUser.id);
//       error = res.error;
//     } else {
//       // Create new user via Supabase Admin API
//       const { data, error: insertError } = await supabase.auth.admin.createUser(
//         {
//           email: userForm.email,
//           password: Math.random().toString(36).slice(-8),
//           email_confirm: true,
//           user_metadata: { role: userForm.role },
//         }
//       );
//       error = insertError;
//     }

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setOpenModal(false);
//     fetchUsers();
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

//   // --- Loading/Error/Not Admin UI ---
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

//   // --- Main Dashboard UI ---
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
//               <TableCell>Room ID</TableCell>
//               <TableCell>First Name</TableCell>
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
//                 <TableCell>{b.room_id}</TableCell>
//                 <TableCell>{b.first_name}</TableCell>
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

//       <Box my={4} display="flex" justifyContent="flex-end">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenCreateUser}
//         >
//           + Create User
//         </Button>
//       </Box>

//       {/* Users Table */}
//       <Typography variant="h5" gutterBottom>
//         Users
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>User ID</TableCell>
//               <TableCell>Email</TableCell>
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

//       {/* Modal for Bookings & Users */}
//       <Dialog
//         open={openModal}
//         onClose={() => setOpenModal(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           {editingBooking
//             ? "Update Booking"
//             : editingUser
//             ? "Update User"
//             : "Create Booking / User"}
//         </DialogTitle>
//         <DialogContent>
//           {editingBooking || (!editingUser && !editingBooking) ? (
//             <>
//               {/* Booking Form */}
//               <TextField
//                 margin="dense"
//                 label="Room ID"
//                 fullWidth
//                 value={form.room_id}
//                 onChange={(e) => setForm({ ...form, room_id: e.target.value })}
//               />
//               <TextField
//                 margin="dense"
//                 label="User Email"
//                 fullWidth
//                 value={form.user_email}
//                 onChange={(e) =>
//                   setForm({ ...form, user_email: e.target.value })
//                 }
//               />

//               {/* Show user_email ONLY when creating
//               {!editingBooking && (
//                 <TextField
//                   margin="dense"
//                   label="User Email"
//                   fullWidth
//                   value={form.user_email}
//                   onChange={(e) =>
//                     setForm({ ...form, user_email: e.target.value })
//                   }
//                 />
//               )} */}
//               <TextField
//                 margin="dense"
//                 type="date"
//                 label="Check-in"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={form.check_in}
//                 onChange={(e) => setForm({ ...form, check_in: e.target.value })}
//               />
//               <TextField
//                 margin="dense"
//                 type="date"
//                 label="Check-out"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={form.check_out}
//                 onChange={(e) =>
//                   setForm({ ...form, check_out: e.target.value })
//                 }
//               />
//               <TextField
//                 margin="dense"
//                 label="Guests"
//                 type="number"
//                 fullWidth
//                 value={form.guests}
//                 onChange={(e) => setForm({ ...form, guests: e.target.value })}
//               />
//             </>
//           ) : (
//             <>
//               {/* User Form */}
//               <TextField
//                 margin="dense"
//                 label="Email"
//                 fullWidth
//                 value={userForm.email}
//                 onChange={(e) =>
//                   setUserForm({ ...userForm, email: e.target.value })
//                 }
//               />
//               <TextField
//                 margin="dense"
//                 label="Role"
//                 fullWidth
//                 select
//                 SelectProps={{ native: true }}
//                 value={userForm.role}
//                 onChange={(e) =>
//                   setUserForm({ ...userForm, role: e.target.value })
//                 }
//                 disabled={editingUser?.role === "admin"} // Prevent admin role change
//               >
//                 <option value="guest">guest</option>
//                 <option value="admin">admin</option>
//               </TextField>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={
//               editingBooking || (!editingUser && !editingBooking)
//                 ? handleSaveBooking
//                 : handleSaveUser
//             }
//           >
//             {editingBooking
//               ? "Update Booking"
//               : editingUser
//               ? "Update User"
//               : "Create"}
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

  const handleSaveBooking = async () => {
    try {
      const payload = {
        bookingId: editingBooking?.id || null,
        updates: {
          room_id: form.room_id,
          check_in: form.check_in,
          check_out: form.check_out,
          guests: Number(form.guests),
        },
      };

      // --- Creating booking uses Supabase directly ---
      if (!editingBooking) {
        const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", form.user_email)
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

        setOpenModal(false);
        fetchBookings();
        return;
      }

      // --- Updating booking uses Node server ---
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

      console.log("Updated", data);

      setOpenModal(false);
      fetchBookings();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // const handleDeleteBooking = async (id: string) => {
  //   if (!confirm("Delete this booking?")) return;
  //   const { error } = await supabase.from("bookings").delete().eq("id", id);
  //   if (error) alert(error.message);
  //   else fetchBookings();
  // };

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
