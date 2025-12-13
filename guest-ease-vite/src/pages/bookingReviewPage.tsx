// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Rating,
//   Container,
// } from "@mui/material";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/useAuth";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [booking, setBooking] = useState<any | null>(null);
//   const [room, setRoom] = useState<any | null>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [guestName, setGuestName] = useState<string>("Guest");

//   useEffect(() => {
//     async function loadData() {
//       console.log("Starting loadData for booking ID:", id);
//       setLoading(true);
//       try {
//         // Fetch booking
//         const { data: bookingData, error: bookingError } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("id", id)
//           .single();

//         console.log("Booking response:", bookingData, "Error:", bookingError);

//         if (bookingError || !bookingData) {
//           setError("Booking not found.");
//           setLoading(false);
//           return;
//         }
//         setBooking(bookingData);

//         // Fetch room
//         const { data: roomData, error: roomError } = await supabase
//           .from("rooms")
//           .select("*")
//           .eq("id", bookingData.room_id)
//           .single();

//         console.log("Raw roomData:", roomData, "Error:", roomError);

//         if (roomError || !roomData) {
//           setError("Room not found.");
//           setLoading(false);
//           return;
//         }

//         // Parse images if needed
//         const parsedRoom = {
//           ...roomData,
//           images:
//             typeof roomData.images === "string"
//               ? JSON.parse(roomData.images)
//               : roomData.images,
//         };
//         console.log("Room images AFTER parsing:", parsedRoom.images);
//         setRoom(parsedRoom);

//         // Fetch guest name from profiles table
//         if (bookingData.user_id) {
//           console.log(
//             "Fetching guest profile for user_id:",
//             bookingData.user_id
//           );

//           const { data: profileData, error: profileError } = await supabase
//             .from("profiles") // public.profiles table
//             .select("first_name, last_name")
//             .eq("id", bookingData.user_id)
//             .single();

//           console.log(
//             "Guest profile response:",
//             profileData,
//             "Error:",
//             profileError
//           );

//           if (profileError || !profileData) {
//             console.warn("Guest not found, defaulting to 'Guest'");
//             setGuestName("Guest");
//           } else {
//             const { first_name, last_name } = profileData;
//             const name =
//               first_name || last_name
//                 ? `${first_name || ""} ${last_name || ""}`.trim()
//                 : "Guest";
//             console.log("Guest name resolved:", name);
//             setGuestName(name);
//           }
//         } else {
//           console.log("Booking has no user_id, defaulting to 'Guest'");
//           setGuestName("Guest");
//         }
//       } catch (err) {
//         console.error("Unexpected error fetching data:", err);
//         setError("Unexpected error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [id]);

//   const handleSubmit = async () => {
//     if (!rating || !comment.trim()) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     if (!booking) {
//       alert("Booking not found.");
//       return;
//     }

//     if (!user) {
//       alert("You must be logged in to submit a review.");
//       return;
//     }

//     try {
//       const { error } = await supabase.from("reviews").insert({
//         booking_id: booking.id,
//         room_id: booking.room_id, // ✅ include the room id
//         user_id: user.id, // ✅ include the logged-in user id
//         rating,
//         comment,
//         created_at: new Date(),
//       });

//       if (error) throw error;
//       alert("Review submitted!");
//       navigate("/account");
//     } catch (err: any) {
//       alert("Error submitting review: " + err.message);
//     }
//   };

//   if (!user)
//     return <Alert severity="warning">Please log in to write a review.</Alert>;
//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!booking || !room)
//     return <Alert severity="error">Booking or room not found.</Alert>;

//   return (
//     <Box>
//       {/* IMAGE CAROUSEL */}
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="md" sx={{ mt: 8 }}>
//         <Typography variant="h5" sx={{ color: "#8E4585", mb: 3 }}>
//           Tell us about your stay in {room.name} 😀!
//         </Typography>

//         <Card elevation={3}>
//           <CardContent>
//             <Typography variant="h6">{room.name}</Typography>
//             {/* Guest name */}
//             <Typography>
//               Guest: <strong>{guestName}</strong>
//             </Typography>

//             <Typography sx={{ mb: 2 }}>
//               Stayed from <strong>{booking.check_in}</strong> to{" "}
//               <strong>{booking.check_out}</strong>
//             </Typography>

//             <Box sx={{ mb: 3 }}>
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
//               sx={{ mb: 3 }}
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />

//             <Button
//               variant="contained"
//               color="secondary"
//               fullWidth
//               sx={{ mb: 1 }}
//               onClick={handleSubmit}
//             >
//               Submit Review
//             </Button>

//             <Button fullWidth onClick={() => navigate("/account")}>
//               Cancel
//             </Button>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default ReviewPage;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Rating,
//   Container,
//   Grid,
// } from "@mui/material";
// import { supabase } from "../supabaseClient";
// import { useAuth } from "../context/useAuth";

// const ReviewPage: React.FC = () => {
//   const { id } = useParams(); // booking ID
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [booking, setBooking] = useState<any | null>(null);
//   const [room, setRoom] = useState<any | null>(null);
//   const [rating, setRating] = useState<number | null>(0);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [guestName, setGuestName] = useState<string>("Guest");

//   useEffect(() => {
//     async function loadData() {
//       setLoading(true);
//       try {
//         // Fetch booking
//         const { data: bookingData, error: bookingError } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (bookingError || !bookingData) {
//           setError("Booking not found.");
//           return;
//         }

//         setBooking(bookingData);

//         // Fetch room
//         const { data: roomData, error: roomError } = await supabase
//           .from("rooms")
//           .select("*")
//           .eq("id", bookingData.room_id)
//           .single();

//         if (roomError || !roomData) {
//           setError("Room not found.");
//           return;
//         }

//         // Parse images
//         const parsedRoom = {
//           ...roomData,
//           images:
//             typeof roomData.images === "string"
//               ? JSON.parse(roomData.images)
//               : roomData.images,
//         };
//         console.log("These are the parsedRoom:", parsedRoom.images[0]);
//         setRoom(parsedRoom);

//         // Fetch guest name
//         if (bookingData.user_id) {
//           const { data: profileData } = await supabase
//             .from("profiles")
//             .select("first_name, last_name")
//             .eq("id", bookingData.user_id)
//             .single();

//           if (profileData) {
//             const name = `${profileData.first_name || ""} ${
//               profileData.last_name || ""
//             }`.trim();
//             setGuestName(name || "Guest");
//           }
//         }
//       } catch (err) {
//         setError("Unexpected error fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [id]);

//   const handleSubmit = async () => {
//     if (!rating || !comment.trim()) {
//       alert("Please provide both rating and comment.");
//       return;
//     }

//     if (!booking || !user) {
//       alert("Unable to submit review.");
//       return;
//     }

//     try {
//       const { error } = await supabase.from("reviews").insert({
//         booking_id: booking.id,
//         room_id: booking.room_id,
//         user_id: user.id,
//         rating,
//         comment,
//         created_at: new Date(),
//       });

//       if (error) throw error;

//       alert("Review submitted!");
//       navigate("/account");
//     } catch (err: any) {
//       alert("Error submitting review: " + err.message);
//     }
//   };

//   if (!user)
//     return <Alert severity="warning">Please log in to write a review.</Alert>;

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;

//   if (error) return <Alert severity="error">{error}</Alert>;

//   if (!booking || !room)
//     return <Alert severity="error">Booking or room not found.</Alert>;

//   return (
//     <Container maxWidth="lg" sx={{ mt: 8 }}>
//       <Grid container spacing={12} alignItems="stretch">
//         {/* LEFT COLUMN — IMAGE */}
//         <Grid item xs={12} md={6}>
//           {room.images?.length > 0 ? (
//             <Box
//               component="img"
//               src={`/assets/${room.images[0]}`}
//               alt={room.name}
//               sx={{
//                 width: {
//                   xs: "100%", // phones
//                   sm: "100%", // small tablets
//                   md: "100%", // desktop
//                   lg: 500, // large screens
//                 },
//                 height: 420,
//                 objectFit: "cover",
//                 borderRadius: 2,
//                 boxShadow: 3,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             />
//           ) : (
//             <Box
//               sx={{
//                 height: 420,
//                 bgcolor: "#f5f5f5",
//                 borderRadius: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography>No image available</Typography>
//             </Box>
//           )}
//         </Grid>

//         {/* RIGHT COLUMN — REVIEW */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h5" sx={{ color: "#8E4585", mb: 3 }}>
//             Tell us about your stay in {room.name} 😀
//           </Typography>

//           <Card
//             elevation={3}
//             sx={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6">{room.name}</Typography>

//               <Typography>
//                 Guest: <strong>{guestName}</strong>
//               </Typography>

//               <Typography sx={{ mb: 2 }}>
//                 Stayed from <strong>{booking.check_in}</strong> to{" "}
//                 <strong>{booking.check_out}</strong>
//               </Typography>

//               <Box sx={{ mb: 3 }}>
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
//                 sx={{ mb: 3 }}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               />

//               <Button
//                 variant="contained"
//                 color="secondary"
//                 fullWidth
//                 sx={{ mb: 1 }}
//                 onClick={handleSubmit}
//               >
//                 Submit Review
//               </Button>

//               <Button fullWidth onClick={() => navigate("/account")}>
//                 Cancel
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
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
  Grid,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/useAuth";

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
  const [firstName, setFirstName] = useState<string>("Guest");
  const [guestAccount, setGuestAccount] = useState<string>("Guest");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single();

        if (bookingError || !bookingData) {
          setError("Booking not found.");
          return;
        }

        setBooking(bookingData);

        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", bookingData.room_id)
          .single();

        if (roomError || !roomData) {
          setError("Room not found.");
          return;
        }

        const parsedRoom = {
          ...roomData,
          images:
            typeof roomData.images === "string"
              ? JSON.parse(roomData.images)
              : roomData.images,
        };

        setRoom(parsedRoom);

        if (bookingData.user_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", bookingData.user_id)
            .single();

          if (profileData) {
            const name = `${profileData.first_name || ""} ${
              profileData.last_name || ""
            }`.trim();
            setGuestAccount(bookingData.user_id.slice(-8));
            setFirstName(profileData.first_name || "Guest");
            setGuestName(name || "Guest");
          }
        }
      } catch {
        setError("Unexpected error fetching data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment.");
      return;
    }

    if (!booking || !user) {
      alert("Unable to submit review.");
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        booking_id: booking.id,
        room_id: booking.room_id,
        user_id: user.id,
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
    <Container maxWidth="lg" sx={{ mt: 1 }}>
      <Typography variant="h3" component={"h1"}>
        Hello <strong>{firstName}</strong>!
      </Typography>
      <Typography variant="h5" component={"h2"} sx={{ mb: 8, fontWeight: 300 }}>
        Account <strong>#{guestAccount}</strong>
      </Typography>

      <Grid container spacing={8}>
        {/* LEFT COLUMN — IMAGE * */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: {
              xs: "100%", // full width on mobile
              sm: "100%", // slightly smaller on small tablets
              md: "45%", // back to full width on desktop
              lg: "45%", // adjust for large screens
            },
          }}
        >
          <Box
            component="img"
            src={`/assets/${room.images?.[0]}`}
            alt={room.name}
            sx={{
              width: "100%",

              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
          <Typography sx={{ mt: "8%", mb: "1%" }}>
            <strong>Reservation number:</strong> #{booking.id.slice(-12)}
          </Typography>

          <Typography sx={{ mb: "3.5%" }}>
            <strong>Stay:</strong> from <strong>{booking.check_in}</strong> to{" "}
            <strong>{booking.check_out}</strong>.
          </Typography>
          <Typography sx={{ mb: "5%" }}>
            We were delighted to have you stay in <strong>{room.name}</strong>{" "}
            and we would really be delighted to know more about your journey
            experience with us!
          </Typography>
        </Grid>

        {/* RIGHT COLUMN — REVIEW CARD */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            width: {
              xs: "100%", // full width on mobile
              sm: "100%", // slightly smaller on small tablets
              md: "45%", // back to full width on desktop
              lg: "45%", // adjust for large screens
            },
            height: "300%",
            mb: 10,
            maxHeight: {
              xs: "100%",
              sm: "100%",
              md: 400, // 👈 KEY FIX
              lg: 350,
            },
          }}
        >
          <Card sx={{ width: "100%" }} elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ color: "#8E4585", mb: 2 }}>
                Tell us about your stay in {room.name} 😀!
              </Typography>

              <Typography>
                Guest: <strong>{guestName}</strong>
              </Typography>

              <Typography sx={{ mb: 2 }}></Typography>

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
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReviewPage;
