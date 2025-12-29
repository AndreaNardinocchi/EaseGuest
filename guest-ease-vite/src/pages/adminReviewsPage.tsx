// import React, { useEffect, useState } from "react";
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

// import { createClient } from "@supabase/supabase-js";
// import AdminSubNav from "../components/adminSubNav/adminSubNav";

// import type { Review, Room } from "../types/interfaces";
// import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
// import ReviewFilterUI from "../components/reviewFilterUI/ReviewFilterUI";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// const AdminReviewsPage: React.FC = () => {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     search: "",
//     booking_id: "",
//     rating: "",
//     created_at: "",
//   });

//   // -----------------------------
//   // Fetch Reviews
//   // -----------------------------
//   const fetchReviews = async () => {
//     const { data, error } = await supabase.from("reviews").select("*");

//     if (error) {
//       console.error(error);
//       return;
//     }

//     setReviews(data || []);
//   };

//   // -----------------------------
//   // Fetch Rooms
//   // -----------------------------
//   const fetchRooms = async () => {
//     const { data, error } = await supabase.from("rooms").select("*");

//     if (error) {
//       console.error(error);
//       return;
//     }

//     setRooms(data || []);
//   };

//   useEffect(() => {
//     (async () => {
//       await Promise.all([fetchReviews(), fetchRooms()]);
//       setLoading(false);
//     })();
//   }, []);

//   // -----------------------------
//   // Helpers
//   // -----------------------------
//   const getRoomName = (roomId: string) =>
//     rooms.find((r) => r.id === roomId)?.name || "Unknown";

//   /** Apply all active filters to the bookings list */
//   const filteredReviews = reviews.filter((r) => {
//     /** Normalize the global search text */
//     const search = filters.search.toLowerCase();

//     /** Build a combined string so the global search can match any field */
//     const searchString = [
//       r.booking_id,
//       r.rating,
//       new Date(r.created_at).toLocaleString(),
//     ]
//       .join(" ")
//       .toLowerCase();

//     /** Global search filter */
//     const matchesSearch = searchString.includes(search);

//     /** Room filter (exact match) */
//     const matchesBookingId = filters.booking_id
//       ? String(r.booking_id) === String(filters.booking_id)
//       : true;

//     /** First name filter (partial match) */
//     const matchesRating = filters.rating
//       ? r.rating === Number(filters.rating)
//       : true;

//     /** Created‑at filter (exact day match) */
//     const matchesCreatedAt = filters.created_at
//       ? new Date(r.created_at).toDateString() ===
//         new Date(filters.created_at).toDateString()
//       : true;

//     /** Only include bookings that match ALL filters */
//     return (
//       matchesSearch && matchesBookingId && matchesRating && matchesCreatedAt
//     );
//   });

//   // -----------------------------
//   // Loading State
//   // -----------------------------
//   if (loading)
//     return (
//       <Container>
//         <Box textAlign="center" mt={4}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );

//   // -----------------------------
//   // Page UI
//   // -----------------------------
//   return (
//     <>
//       <AdminDashboardHeader />
//       <AdminSubNav />
//       <Container sx={{ pb: 8, overflow: "visible" }}>
//         <Box my={4}>
//           <Typography variant="h4">Reviews</Typography>
//         </Box>

//         <ReviewFilterUI filters={filters} setFilters={setFilters} />

//         <TableContainer
//           component={Paper}
//           sx={{
//             mb: 6,
//             overflowX: "auto",
//             borderRadius: 2,
//             boxShadow: 3,
//             "&::-webkit-scrollbar": { height: 8 },
//             "&::-webkit-scrollbar-thumb": {
//               backgroundColor: "#bbb",
//               borderRadius: 4,
//             },
//           }}
//         >
//           <Table sx={{ minWidth: 900 }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell sx={{ fontWeight: "bold" }}>Review ID</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>

//                 {/* Hide on mobile */}
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     display: { xs: "none", sm: "table-cell" },
//                   }}
//                 >
//                   Comment
//                 </TableCell>

//                 {/* Hide on mobile */}
//                 <TableCell
//                   sx={{
//                     fontWeight: "bold",
//                     display: { xs: "none", sm: "table-cell" },
//                   }}
//                 >
//                   Created At
//                 </TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredReviews.map((r) => (
//                 <TableRow
//                   key={r.id}
//                   sx={{
//                     "&:hover": { backgroundColor: "#fafafa" },
//                     transition: "0.2s",
//                   }}
//                 >
//                   <TableCell sx={{ fontWeight: 500 }}>{r.id}</TableCell>

//                   <TableCell>{r.booking_id}</TableCell>
//                   <TableCell>{getRoomName(r.room_id)}</TableCell>
//                   <TableCell>{r.rating}</TableCell>

//                   {/* WRAPPED COMMENT */}
//                   <TableCell
//                     sx={{
//                       display: { xs: "none", sm: "table-cell" },
//                       // whiteSpace: "normal",
//                       // wordBreak: "break-word",
//                       maxWidth: 250,
//                     }}
//                   >
//                     {r.comment}
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       display: { xs: "none", sm: "table-cell" },
//                       // whiteSpace: "nowrap",
//                     }}
//                   >
//                     {new Date(r.created_at).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Container>
//     </>
//   );
// };

// export default AdminReviewsPage;

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
import ReviewFilterUI from "../components/reviewFilterUI/ReviewFilterUI";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    room_id: "",
    rating: "",
    created_at: "",
  });

  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `Reviews Admin Dashboard | GuestEase`;
    //   }, [t]);
  });

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

  const fetchBookings = async () => {
    const { data, error } = await supabase.from("bookings").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setBookings(data || []);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchReviews(), fetchRooms(), fetchBookings()]);
      setLoading(false);
    })();
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name || "Unknown";

  /** Apply all active filters to the bookings list */
  const filteredReviews = reviews.filter((r) => {
    /** Normalize the global search text */
    const search = filters.search.toLowerCase();

    /** Build a combined string so the global search can match any field */
    const searchString = [
      r.room_id,
      r.rating,
      r.comment,
      getRoomName(r.room_id),
      new Date(r.created_at).toLocaleString(),
    ]
      .join(" ")
      .toLowerCase();

    /** Global search filter */
    const matchesSearch = searchString.includes(search);

    /** Room filter (exact match) */
    const matchesRoomId = filters.room_id
      ? String(r.room_id) === String(filters.room_id)
      : true;

    /** First name filter (partial match) */
    const matchesRating = filters.rating
      ? r.rating === Number(filters.rating)
      : true;

    /** Created‑at filter (exact day match) */
    const matchesCreatedAt = filters.created_at
      ? new Date(r.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    /** Only include bookings that match ALL filters */
    return matchesSearch && matchesRoomId && matchesRating && matchesCreatedAt;
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
        <Box my={4}>
          <Typography variant="h4">Reviews</Typography>
        </Box>

        <ReviewFilterUI
          filters={filters}
          setFilters={setFilters}
          bookings={bookings}
          rooms={rooms}
        />

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
                <TableCell sx={{ fontWeight: "bold" }}>Review ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Comment
                </TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredReviews.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{r.id}</TableCell>

                  <TableCell>{r.booking_id}</TableCell>
                  <TableCell>{getRoomName(r.room_id)}</TableCell>
                  <TableCell>{r.rating}</TableCell>

                  {/* WRAPPED COMMENT */}
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      maxWidth: 250,
                    }}
                  >
                    {r.comment}
                  </TableCell>

                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      // whiteSpace: "nowrap",
                    }}
                  >
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
