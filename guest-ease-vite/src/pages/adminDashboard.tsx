// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { Box, CircularProgress, Container, Typography } from "@mui/material";

// import AdminBookings from "../components/adminBookings/adminBookingsPage";
// import AdminUsers from "../components/adminUsers/adminUsers";
// import AdminRooms from "../components/adminRooms/adminRooms";
// import AdminReviews from "../components/adminReviews/adminReviews";

// import type { Booking, Room, Review, User } from "../types/interfaces";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// const AdminDashboard = () => {
//   const BASE_URL = "http://localhost:3000";

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [reviews, setReviews] = useState<Review[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // --- Fetch functions (unchanged) ---
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

//   // --- Init (unchanged) ---
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await supabase.auth.getUser();
//         if (data.user?.user_metadata?.role !== "admin") {
//           setError("You are not authorized.");
//           return;
//         }
//         setIsAdmin(true);
//         await Promise.all([
//           fetchBookings(),
//           fetchUsers(),
//           fetchRooms(),
//           fetchReviews(),
//         ]);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

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
//       </Box>

//       <AdminBookings
//         bookings={bookings}
//         rooms={rooms}
//         fetchBookings={fetchBookings}
//         BASE_URL={BASE_URL}
//       />

//       <AdminUsers
//         users={users}
//         fetchUsers={fetchUsers}
//         BASE_URL={BASE_URL}
//         supabase={supabase}
//       />

//       <AdminRooms rooms={rooms} fetchRooms={fetchRooms} supabase={supabase} />

//       <AdminReviews reviews={reviews} rooms={rooms} />
//     </Container>
//   );
// };

// export default AdminDashboard;

import { Container, Typography, Box } from "@mui/material";
import SubNav from "../components/adminSubNav/adminSubNav";

export default function AdminDashboardPage() {
  return (
    <Container sx={{ pb: 8 }}>
      <SubNav />

      <Box my={4}>
        <Typography variant="h4">Admin Dashboard</Typography>
      </Box>

      <Typography variant="body1">
        Welcome to the admin panel. Choose a section from the navigation above.
      </Typography>
    </Container>
  );
}
