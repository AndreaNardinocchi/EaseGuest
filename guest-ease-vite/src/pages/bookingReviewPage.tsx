// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Rating,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import { useBooking } from "../context/bookingContext";

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { bookings, fetchBookings, submitReview } = useBooking();

//   const [booking, setBooking] = useState<any>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       await fetchBookings();
//       const found = bookings.find((b) => b.id === id);
//       setBooking(found);
//       setLoading(false);
//     }
//     load();
//   }, [id, bookings, fetchBookings]);

//   const handleSubmit = async () => {
//     if (!rating || comment.trim().length === 0) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     if (!booking) {
//       alert("Booking not found.");
//       return;
//     }

//     // Corrected: submitReview expects 3 arguments (bookingId, rating, comment)
//     const result = await submitReview(
//       booking.id, // booking_id
//       rating, // rating
//       comment // comment
//     );

//     alert(result.message || "Review submitted!");
//     navigate("/account");
//   };

//   if (!user)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Please log in to write a review.</Typography>
//       </Box>
//     );

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={6}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!booking)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Booking not found.</Typography>
//       </Box>
//     );

//   return (
//     <Box maxWidth="600px" mx="auto" mt={5}>
//       <Typography variant="h4" sx={{ color: "#8E4585", mb: 2 }}>
//         Write a Review for {booking.room_id}
//       </Typography>

//       <Card elevation={4}>
//         <CardContent>
//           <Typography variant="h6">Room {booking.room_id}</Typography>
//           <Typography>
//             Stayed from <strong>{booking.check_in}</strong> to{" "}
//             <strong>{booking.check_out}</strong>
//           </Typography>

//           <Box mt={3}>
//             <Typography variant="subtitle1" mb={1}>
//               Your Rating
//             </Typography>
//             <Rating
//               value={rating}
//               onChange={(_, value) => setRating(value)}
//               size="large"
//             />
//           </Box>

//           <TextField
//             label="Your Comment"
//             multiline
//             rows={4}
//             fullWidth
//             sx={{ mt: 3 }}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />

//           <Button
//             variant="contained"
//             color="secondary"
//             fullWidth
//             sx={{ mt: 3 }}
//             onClick={handleSubmit}
//           >
//             Submit Review
//           </Button>

//           <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/account")}>
//             Cancel
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ReviewPage;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Rating,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import { useBooking } from "../context/bookingContext";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// // Full rooms list (from your JSON)
// const rooms = [
//   { id: "226e37bb-f10a-45fd-9ae3-6579192a29e7", name: "High King’s Quarters" },
//   { id: "46d8a3e1-1505-4fd9-bd4a-629685107b4a", name: "Druid’s Rest" },
//   { id: "933dd269-7b78-4be8-9126-e1c9871dda3e", name: "Skellig Study Loft" },
//   { id: "972aaf24-f4bd-403a-95a6-1dd1ec32b7ab", name: "Seanchaí Nook" },
//   { id: "bf271074-a42f-44be-9004-81f854aed668", name: "Clan Suite" },
//   { id: "d4e9dda6-e374-4d2f-9b94-30d86c25b421", name: "Brigid’s Haven" },
//   { id: "eeaa0565-c8b1-4194-8654-5f25ce17ce9e", name: "Éire Penthouse" },
//   {
//     id: "f0121662-a059-4abb-9d10-43248d535990",
//     name: "Fionn Executive Chamber",
//   },
// ];

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { bookings, fetchBookings, submitReview } = useBooking();

//   const [booking, setBooking] = useState<any>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [roomName, setRoomName] = useState<string>("");

//   useEffect(() => {
//     async function load() {
//       await fetchBookings();
//       const found = bookings.find((b) => b.id === id);
//       setBooking(found);

//       if (found) {
//         const room = rooms.find((r) => r.id === found.room_id);
//         setRoomName(room ? room.name : "Unknown Room");
//       }

//       setLoading(false);
//     }
//     load();
//   }, [id, bookings, fetchBookings]);

//   const handleSubmit = async () => {
//     if (!rating || comment.trim().length === 0) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     if (!booking) {
//       alert("Booking not found.");
//       return;
//     }

//     const result = await submitReview(
//       booking.id, // booking_id
//       rating, // rating
//       comment // comment
//     );

//     alert(result.message || "Review submitted!");
//     navigate("/account");
//   };

//   if (!user)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Please log in to write a review.</Typography>
//       </Box>
//     );

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={6}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!booking)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Booking not found.</Typography>
//       </Box>
//     );

//   return (
//     <>{room.images?.length > 0 && <RoomImageCarousel images={room.images} />}
//       <Box maxWidth="600px" mx="auto" mt={5}>
//         <Typography variant="h5" sx={{ color: "#8E4585", mb: 2 }}>
//           Tell us about your stay in {roomName} 😀 !
//         </Typography>

//         <Card elevation={4}>
//           <CardContent>
//             <Typography variant="h6">{roomName}</Typography>
//             <Typography>
//               Stayed from <strong>{booking.check_in}</strong> to{" "}
//               <strong>{booking.check_out}</strong>
//             </Typography>

//             <Box mt={3}>
//               <Typography variant="subtitle1" mb={1}>
//                 Your Rating
//               </Typography>
//               <Rating
//                 value={rating}
//                 onChange={(_, value) => setRating(value)}
//                 size="large"
//               />
//             </Box>

//             <TextField
//               label="Your Comment"
//               multiline
//               rows={4}
//               fullWidth
//               sx={{ mt: 3 }}
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />

//             <Button
//               variant="contained"
//               color="secondary"
//               fullWidth
//               sx={{ mt: 3 }}
//               onClick={handleSubmit}
//             >
//               Submit Review
//             </Button>

//             <Button
//               fullWidth
//               sx={{ mt: 1 }}
//               onClick={() => navigate("/account")}
//             >
//               Cancel
//             </Button>
//           </CardContent>
//         </Card>
//       </Box>
//     </>
//   );
// };

// export default ReviewPage;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Rating,
//   Card,
//   CardContent,
//   CircularProgress,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import { supabase } from "../supabaseClient";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [booking, setBooking] = useState<any>(null);
//   const [room, setRoom] = useState<any>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       setLoading(true);

//       // Fetch booking directly
//       const { data: bookingData, error: bookingError } = await supabase
//         .from("bookings")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (bookingError) {
//         console.error("Error fetching booking:", bookingError);
//         setLoading(false);
//         return;
//       }

//       setBooking(bookingData);

//       // Fetch room info
//       const { data: roomData, error: roomError } = await supabase
//         .from("rooms")
//         .select("*")
//         .eq("id", bookingData.room_id)
//         .single();

//       if (roomError) console.error("Error fetching room:", roomError);
//       else setRoom(roomData);

//       setLoading(false);
//     }

//     load();
//   }, [id]);

//   const handleSubmit = async () => {
//     if (!rating || comment.trim().length === 0) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     // Here you would call your submitReview function or Supabase insert
//     // Example: await supabase.from("reviews").insert({...})
//     alert("Review submitted!");
//     navigate("/account");
//   };

//   if (!user)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Please log in to write a review.</Typography>
//       </Box>
//     );

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={6}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!booking || !room)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Booking or room not found.</Typography>
//       </Box>
//     );

//   return (
//     <Box maxWidth="600px" mx="auto" mt={5}>
//       {room.images && room.images.length > 0 && (
//         <RoomImageCarousel
//           images={
//             Array.isArray(room.images) ? room.images : JSON.parse(room.images)
//           }
//         />
//       )}

//       <Typography variant="h5" sx={{ color: "#8E4585", mt: 3, mb: 2 }}>
//         Tell us about your stay in {room.name} 😀!
//       </Typography>

//       <Card elevation={4}>
//         <CardContent>
//           <Typography variant="h6">{room.name}</Typography>
//           <Typography>
//             Stayed from <strong>{booking.check_in}</strong> to{" "}
//             <strong>{booking.check_out}</strong>
//           </Typography>

//           <Box mt={3}>
//             <Typography variant="subtitle1" mb={1}>
//               Your Rating
//             </Typography>
//             <Rating
//               value={rating}
//               onChange={(_, value) => setRating(value)}
//               size="large"
//             />
//           </Box>

//           <TextField
//             label="Your Comment"
//             multiline
//             rows={4}
//             fullWidth
//             sx={{ mt: 3 }}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />

//           <Button
//             variant="contained"
//             color="secondary"
//             fullWidth
//             sx={{ mt: 3 }}
//             onClick={handleSubmit}
//           >
//             Submit Review
//           </Button>

//           <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/account")}>
//             Cancel
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ReviewPage;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Rating,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth";
// import { supabase } from "../supabaseClient";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [booking, setBooking] = useState<any>(null);
//   const [room, setRoom] = useState<any>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       console.log("📌 Starting load()... Booking ID:", id);
//       setLoading(true);

//       // Fetch booking
//       const { data: bookingData, error: bookingError } = await supabase
//         .from("bookings")
//         .select("*")
//         .eq("id", id)
//         .single();

//       console.log("📘 Booking response:", bookingData, bookingError);

//       if (bookingError) {
//         console.error("❌ Error fetching booking:", bookingError);
//         setLoading(false);
//         return;
//       }

//       setBooking(bookingData);

//       // Fetch room
//       const { data: roomData, error: roomError } = await supabase
//         .from("rooms")
//         .select("*")
//         .eq("id", bookingData.room_id)
//         .single();

//       console.log("📗 Raw roomData:", roomData, roomError);

//       if (roomError) {
//         console.error("❌ Error fetching room:", roomError);
//         setLoading(false);
//         return;
//       }

//       // Parse images
//       let parsedImages = roomData.images;

//       console.log("📙 Room images BEFORE parsing:", parsedImages);

//       try {
//         if (typeof parsedImages === "string") {
//           parsedImages = JSON.parse(parsedImages);
//         }
//       } catch (err) {
//         console.error("❌ JSON.parse FAILED for room.images:", roomData.images);
//       }

//       console.log("📒 Room images AFTER parsing:", parsedImages);

//       const finalRoom = {
//         ...roomData,
//         images: parsedImages,
//       };

//       setRoom(finalRoom);
//       setLoading(false);
//     }

//     load();
//   }, [id]);

//   const handleSubmit = async () => {
//     if (!rating || comment.trim().length === 0) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     alert("Review submitted!");
//     navigate("/account");
//   };

//   if (!user)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Please log in to write a review.</Typography>
//       </Box>
//     );

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={6}>
//         <CircularProgress />
//       </Box>
//     );

//   if (!booking || !room)
//     return (
//       <Box textAlign="center" mt={6}>
//         <Typography>Booking or room not found.</Typography>
//       </Box>
//     );

//   console.log("📸 Final images sent to carousel:", room.images);

//   return (
//     // <Grid container spacing={4}>
//     //   <Grid item xs={12} md={6}>
//     //     {/* IMAGE CAROUSEL */}
//     //     {room.images &&
//     //       Array.isArray(room.images) &&
//     //       room.images.length > 0 && <RoomImageCarousel images={room.images} />}

//     //     {/* DEBUG IMAGES – TEMPORARY */}
//     //     <div style={{ marginTop: "10px" }}>
//     //       <h4>DEBUG IMAGES</h4>
//     //       {room.images.map((img, i) => (
//     //         <img key={i} src={img} width="200" style={{ margin: 10 }} />
//     //       ))}
//     //     </div>
//     //   </Grid>

//     //   <Grid item xs={12} md={6}>
//     //     <Typography variant="h5" sx={{ color: "#8E4585", mt: 3, mb: 2 }}>
//     //       Tell us about your stay in {room.name} 😀!
//     //     </Typography>

//     //     <Card elevation={4}>
//     //       <CardContent>
//     //         <Typography variant="h6">{room.name}</Typography>
//     //         <Typography>
//     //           Stayed from <strong>{booking.check_in}</strong> to{" "}
//     //           <strong>{booking.check_out}</strong>
//     //         </Typography>

//     //         <Box mt={3}>
//     //           <Typography variant="subtitle1" mb={1}>
//     //             Your Rating
//     //           </Typography>
//     //           <Rating
//     //             value={rating}
//     //             onChange={(_, value) => setRating(value)}
//     //             size="large"
//     //           />
//     //         </Box>

//     //         <TextField
//     //           label="Your Comment"
//     //           multiline
//     //           rows={4}
//     //           fullWidth
//     //           sx={{ mt: 3 }}
//     //           value={comment}
//     //           onChange={(e) => setComment(e.target.value)}
//     //         />

//     //         <Button
//     //           variant="contained"
//     //           color="secondary"
//     //           fullWidth
//     //           sx={{ mt: 3 }}
//     //           onClick={handleSubmit}
//     //         >
//     //           Submit Review
//     //         </Button>

//     //         <Button
//     //           fullWidth
//     //           sx={{ mt: 1 }}
//     //           onClick={() => navigate("/account")}
//     //         >
//     //           Cancel
//     //         </Button>
//     //       </CardContent>
//     //     </Card>
//     //     {/* </Box> */}
//     //   </Grid>
//     // </Grid>

//     <Box maxWidth="900px" mx="auto" mt={5}>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           {room.images?.length > 0 && (
//             <Box sx={{ mb: 2 }}>
//               <RoomImageCarousel images={room.images} />
//             </Box>
//           )}

//           {/* DEBUG IMAGES */}
//           <Box sx={{ mt: 2 }}>
//             {room.images?.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 width="120"
//                 height="80"
//                 style={{ objectFit: "cover", margin: 5, borderRadius: 6 }}
//               />
//             ))}
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h5" sx={{ color: "#8E4585", mt: 1, mb: 2 }}>
//             Tell us about your stay in {room.name} 😀!
//           </Typography>

//           <Card elevation={4}>
//             <CardContent>
//               <Typography variant="h6">{room.name}</Typography>
//               <Typography>
//                 Stayed from <strong>{booking.check_in}</strong> to{" "}
//                 <strong>{booking.check_out}</strong>
//               </Typography>

//               <Box mt={3}>
//                 <Typography variant="subtitle1" mb={1}>
//                   Your Rating
//                 </Typography>
//                 <Rating
//                   value={rating}
//                   onChange={(_, value) => setRating(value)}
//                   size="large"
//                 />
//               </Box>

//               <TextField
//                 label="Your Comment"
//                 multiline
//                 rows={4}
//                 fullWidth
//                 sx={{ mt: 3 }}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               />

//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mt: 3 }}
//                 onClick={handleSubmit}
//               >
//                 Submit Review
//               </Button>

//               <Button
//                 fullWidth
//                 sx={{ mt: 1 }}
//                 onClick={() => navigate("/account")}
//               >
//                 Cancel
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ReviewPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Container,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/useAuth";
import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

const ReviewPage: React.FC = () => {
  const { id } = useParams(); // booking ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState<any | null>(null);
  const [room, setRoom] = useState<any | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("Guest");

  // useEffect(() => {
  //   async function loadData() {
  //     setLoading(true);
  //     try {
  //       // Fetch booking
  //       const { data: bookingData, error: bookingError } = await supabase
  //         .from("bookings")
  //         .select("*")
  //         .eq("id", id)
  //         .single();

  //       if (bookingError || !bookingData) {
  //         setError("Booking not found.");
  //         setLoading(false);
  //         return;
  //       }
  //       setBooking(bookingData);

  //       // Fetch room
  //       const { data: roomData, error: roomError } = await supabase
  //         .from("rooms")
  //         .select("*")
  //         .eq("id", bookingData.room_id)
  //         .single();

  //       if (roomError || !roomData) {
  //         setError("Room not found.");
  //         setLoading(false);
  //         return;
  //       }

  //       // Parse images if needed
  //       const parsedRoom = {
  //         ...roomData,
  //         images:
  //           typeof roomData.images === "string"
  //             ? JSON.parse(roomData.images)
  //             : roomData.images,
  //       };
  //       setRoom(parsedRoom);

  //       // ✅ Fetch guest name from profiles table
  //       const { data: profileData, error: profileError } = await supabase
  //         .from("public.profiles")
  //         .select("first_name, last_name")
  //         .eq("id", bookingData.user_id)
  //         .single();

  //       if (profileError || !profileData) {
  //         console.warn("Guest not found, defaulting to 'Guest'");
  //         setGuestName("Guest");
  //       } else {
  //         const { first_name, last_name } = profileData;
  //         setGuestName(
  //           first_name || last_name
  //             ? `${first_name || ""} ${last_name || ""}`.trim()
  //             : "Guest"
  //         );
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setError("Unexpected error fetching data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadData();
  // }, [id]);

  useEffect(() => {
    async function loadData() {
      console.log("Starting loadData for booking ID:", id);
      setLoading(true);
      try {
        // Fetch booking
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single();

        console.log("Booking response:", bookingData, "Error:", bookingError);

        if (bookingError || !bookingData) {
          setError("Booking not found.");
          setLoading(false);
          return;
        }
        setBooking(bookingData);

        // Fetch room
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", bookingData.room_id)
          .single();

        console.log("Raw roomData:", roomData, "Error:", roomError);

        if (roomError || !roomData) {
          setError("Room not found.");
          setLoading(false);
          return;
        }

        // Parse images if needed
        const parsedRoom = {
          ...roomData,
          images:
            typeof roomData.images === "string"
              ? JSON.parse(roomData.images)
              : roomData.images,
        };
        console.log("Room images AFTER parsing:", parsedRoom.images);
        setRoom(parsedRoom);

        // Fetch guest name from profiles table
        if (bookingData.user_id) {
          console.log(
            "Fetching guest profile for user_id:",
            bookingData.user_id
          );

          const { data: profileData, error: profileError } = await supabase
            .from("profiles") // public.profiles table
            .select("first_name, last_name")
            .eq("id", bookingData.user_id)
            .single();

          console.log(
            "Guest profile response:",
            profileData,
            "Error:",
            profileError
          );

          if (profileError || !profileData) {
            console.warn("Guest not found, defaulting to 'Guest'");
            setGuestName("Guest");
          } else {
            const { first_name, last_name } = profileData;
            const name =
              first_name || last_name
                ? `${first_name || ""} ${last_name || ""}`.trim()
                : "Guest";
            console.log("Guest name resolved:", name);
            setGuestName(name);
          }
        } else {
          console.log("Booking has no user_id, defaulting to 'Guest'");
          setGuestName("Guest");
        }
      } catch (err) {
        console.error("Unexpected error fetching data:", err);
        setError("Unexpected error fetching data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // const handleSubmit = async () => {
  //   if (!rating || !comment.trim()) {
  //     alert("Please provide both rating and comment.");
  //     return;
  //   }

  //   if (!booking) {
  //     alert("Booking not found.");
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase.from("reviews").insert({
  //       booking_id: booking.id,
  //       rating,
  //       comment,
  //       created_at: new Date(),
  //     });

  //     if (error) throw error;
  //     alert("Review submitted!");
  //     navigate("/account");
  //   } catch (err: any) {
  //     alert("Error submitting review: " + err.message);
  //   }
  // };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment.");
      return;
    }

    if (!booking) {
      alert("Booking not found.");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        booking_id: booking.id,
        room_id: booking.room_id, // ✅ include the room id
        user_id: user.id, // ✅ include the logged-in user id
        rating,
        comment,
        created_at: new Date(),
      });

      if (error) throw error;
      alert("Review submitted!");
      navigate("/account");
    } catch (err: any) {
      alert("Error submitting review: " + err.message);
    }
  };

  if (!user)
    return <Alert severity="warning">Please log in to write a review.</Alert>;
  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!booking || !room)
    return <Alert severity="error">Booking or room not found.</Alert>;

  return (
    <Box>
      {/* IMAGE CAROUSEL */}
      {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ color: "#8E4585", mb: 3 }}>
          Tell us about your stay in {room.name} 😀!
        </Typography>

        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6">{room.name}</Typography>
            {/* Guest name */}
            <Typography>
              Guest: <strong>{guestName}</strong>
            </Typography>

            <Typography sx={{ mb: 2 }}>
              Stayed from <strong>{booking.check_in}</strong> to{" "}
              <strong>{booking.check_out}</strong>
            </Typography>

            <Box sx={{ mb: 3 }}>
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
              sx={{ mb: 3 }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mb: 1 }}
              onClick={handleSubmit}
            >
              Submit Review
            </Button>

            <Button fullWidth onClick={() => navigate("/account")}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ReviewPage;
