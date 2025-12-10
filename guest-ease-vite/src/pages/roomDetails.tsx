// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   Typography,
//   Grid,
//   CircularProgress,
//   Alert,
//   TextField,
// } from "@mui/material";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import BookingReviews from "../components/bookingReviews/bookingReview";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   // Fetch rooms on mount or date change
//   useEffect(() => {
//     if (!roomId) {
//       setError("Room ID is missing");
//       return;
//     }

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) {
//           setRooms(result.rooms);
//         } else {
//           setError(result.message || "Failed to fetch rooms.");
//         }
//       } catch {
//         setError("Unexpected error occurred while fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   // Set selected room
//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const foundRoom = rooms.find((r: any) => String(r.id) === String(roomId));
//       if (foundRoom) setRoom(foundRoom);
//       else setError("No room found");
//     }
//   }, [rooms, roomId]);

//   // Set page title
//   useEffect(() => {
//     if (room) {
//       document.title = `${room.name} details | GuestEase`;
//     }
//   }, [room]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (guests <= 0) {
//       setError("Please select a valid number of guests.");
//       return;
//     }
//     if (!checkIn || !checkOut) {
//       setError("Please select valid check-in and check-out dates.");
//       return;
//     }
//     if (new Date(checkIn) >= new Date(checkOut)) {
//       setError("Check-out date must be after check-in date.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       const newBooking = {
//         room_id: roomId!,
//         user_id: user!.id,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//       };
//       const result = await bookRoom(newBooking);
//       if (result.success) {
//         navigate("/booking-confirmation", {
//           state: {
//             room,
//             booking: { check_in: checkIn, check_out: checkOut, guests },
//           },
//         });
//       } else {
//         setError(result.message || "Booking failed after payment.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   if (!room) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         No room details available.
//       </Alert>
//     );
//   }

//   if (showPayment) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Complete Payment
//         </Typography>
//         <StripeCheckout
//           amount={
//             (room.price *
//               100 *
//               (new Date(checkOut).getTime() - new Date(checkIn).getTime())) /
//             (1000 * 60 * 60 * 24)
//           }
//           onSuccess={handlePaymentSuccess}
//         />
//         <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//           Cancel
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Grid container spacing={4}>
//         {/* Left Column */}
//         <Grid item xs={12} md={7}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//                 {room.name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{ mt: 2, color: "text.secondary" }}
//               >
//                 {room.description ||
//                   "A cozy and comfortable room designed for your perfect stay."}
//               </Typography>

//               <Grid container spacing={2} sx={{ mt: 3 }}>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">
//                     Capacity:
//                   </Typography>
//                   <Typography variant="body1">
//                     {room.capacity || "N/A"} guests
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">
//                     Price:
//                   </Typography>
//                   <Typography variant="h6" color="primary">
//                     €{room.price} / night
//                   </Typography>
//                 </Grid>
//               </Grid>

//               {room.amenities?.length > 0 && (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Available Services:
//                   </Typography>
//                   <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
//                     {room.amenities.map((amenity: string, i: number) => (
//                       <Box
//                         component="li"
//                         key={i}
//                         sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}
//                       >
//                         {amenity}
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               )}

//               {/* Booking Form */}
//               <Box sx={{ mt: 3 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Check-in Date"
//                       type="date"
//                       value={checkIn}
//                       onChange={(e) => setCheckIn(e.target.value)}
//                       fullWidth
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Check-out Date"
//                       type="date"
//                       value={checkOut}
//                       onChange={(e) => setCheckOut(e.target.value)}
//                       fullWidth
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                 </Grid>
//                 <TextField
//                   label="Guests"
//                   type="number"
//                   value={guests}
//                   onChange={(e) => setGuests(Number(e.target.value))}
//                   fullWidth
//                   sx={{ mt: 2 }}
//                   inputProps={{ min: 1 }}
//                 />
//               </Box>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 sx={{ mt: 3 }}
//                 onClick={handleStartPayment}
//               >
//                 Pay & Book Now
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column */}
//         <Grid item xs={12} md={6}>
//           <Grid container spacing={2} justifyContent="center">
//             {[1, 2].map((i) => (
//               <Grid item xs={6} key={i}>
//                 <CardMedia
//                   component="img"
//                   image={`https://placehold.net/400x400.png?text=Image+${i}`}
//                   alt={`Room placeholder ${i}`}
//                   sx={{
//                     width: 300,
//                     height: 300,
//                     borderRadius: 2,
//                     objectFit: "cover",
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//           <Grid
//             container
//             spacing={2}
//             sx={{ marginTop: 2 }}
//             justifyContent="center"
//           >
//             {[1, 2].map((i) => (
//               <Grid item xs={6} key={i}>
//                 <CardMedia
//                   component="img"
//                   image={`https://placehold.net/400x400.png?text=Image+${i}`}
//                   alt={`Room placeholder ${i}`}
//                   sx={{
//                     width: 300,
//                     height: 300,
//                     borderRadius: 2,
//                     objectFit: "cover",
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid>

//           {/* Reviews below images */}
//           <Box sx={{ mt: 3 }}>
//             <BookingReviews roomId={roomId!} />
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   Typography,
//   Grid,
//   CircularProgress,
//   Alert,
//   TextField,
// } from "@mui/material";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import BookingReviews from "../components/bookingReviews/bookingReview";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   // Fetch rooms on mount or date change
//   useEffect(() => {
//     if (!roomId) {
//       setError("Room ID is missing");
//       return;
//     }

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);

//         if (result.success) {
//           const parsed = result.rooms.map((room: any) => ({
//             ...room,
//             images: Array.isArray(room.images) ? room.images : [],
//             amenities: Array.isArray(room.amenities) ? room.amenities : [],
//           }));

//           setRooms(parsed);
//         } else {
//           setError(result.message || "Failed to fetch rooms.");
//         }
//       } catch {
//         setError("Unexpected error occurred while fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   // Set selected room
//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const foundRoom = rooms.find((r: any) => String(r.id) === String(roomId));
//       if (foundRoom) setRoom(foundRoom);
//       else setError("No room found");
//     }
//   }, [rooms, roomId]);

//   // Set page title
//   useEffect(() => {
//     if (room) {
//       document.title = `${room.name} details | GuestEase`;
//     }
//   }, [room]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (guests <= 0) {
//       setError("Please select a valid number of guests.");
//       return;
//     }
//     if (!checkIn || !checkOut) {
//       setError("Please select valid check-in and check-out dates.");
//       return;
//     }
//     if (new Date(checkIn) >= new Date(checkOut)) {
//       setError("Check-out date must be after check-in date.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async () => {
//     try {
//       const newBooking = {
//         room_id: roomId!,
//         user_id: user!.id,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//       };
//       const result = await bookRoom(newBooking);
//       if (result.success) {
//         navigate("/booking-confirmation", {
//           state: {
//             room,
//             booking: { check_in: checkIn, check_out: checkOut, guests },
//           },
//         });
//       } else {
//         setError(result.message || "Booking failed after payment.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   if (!room) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         No room details available.
//       </Alert>
//     );
//   }

//   if (showPayment) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Complete Payment
//         </Typography>
//         <StripeCheckout
//           amount={
//             (room.price *
//               100 *
//               (new Date(checkOut).getTime() - new Date(checkIn).getTime())) /
//             (1000 * 60 * 60 * 24)
//           }
//           onSuccess={handlePaymentSuccess}
//         />
//         <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//           Cancel
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Grid container spacing={4}>
//         {/* Left Column */}
//         <Grid item xs={12} md={7}>
//           <Card sx={{ borderRadius: 2 }}>
//             <CardContent>
//               <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//                 {room.name}
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{ mt: 2, color: "text.secondary" }}
//               >
//                 {room.description ||
//                   "A cozy and comfortable room designed for your perfect stay."}
//               </Typography>

//               <Grid container spacing={2} sx={{ mt: 3 }}>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">
//                     Capacity:
//                   </Typography>
//                   <Typography variant="body1">
//                     {room.capacity || "N/A"} guests
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">
//                     Price:
//                   </Typography>
//                   <Typography variant="h6" color="primary">
//                     €{room.price} / night
//                   </Typography>
//                 </Grid>
//               </Grid>

//               {room.amenities?.length > 0 && (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Available Services:
//                   </Typography>
//                   <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
//                     {room.amenities.map((amenity: string, i: number) => (
//                       <Box
//                         component="li"
//                         key={i}
//                         sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}
//                       >
//                         {amenity}
//                       </Box>
//                     ))}
//                   </Box>
//                 </Box>
//               )}

//               {/* Booking Form */}
//               <Box sx={{ mt: 3 }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Check-in Date"
//                       type="date"
//                       value={checkIn}
//                       onChange={(e) => setCheckIn(e.target.value)}
//                       fullWidth
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       label="Check-out Date"
//                       type="date"
//                       value={checkOut}
//                       onChange={(e) => setCheckOut(e.target.value)}
//                       fullWidth
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                 </Grid>
//                 <TextField
//                   label="Guests"
//                   type="number"
//                   value={guests}
//                   onChange={(e) => setGuests(Number(e.target.value))}
//                   fullWidth
//                   sx={{ mt: 2 }}
//                   inputProps={{ min: 1 }}
//                 />
//               </Box>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 sx={{ mt: 3 }}
//                 onClick={handleStartPayment}
//               >
//                 Pay & Book Now
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column (IMAGES) */}
//         {/* <Grid item xs={12} md={6}> */}
//         {/* <Grid container spacing={2} justifyContent="center">
//             {room.images?.slice(0, 4).map((img: string, index: number) => (
//               <Grid item xs={6} key={index}>
//                 <CardMedia
//                   component="img"
//                   image={`/assets/${img}`} // <— FIXED HERE
//                   alt={`Room image ${index + 1}`}
//                   sx={{
//                     width: 300,
//                     height: 300,
//                     borderRadius: 2,
//                     objectFit: "cover",
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid> */}
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "repeat(2, 1fr)",
//               gap: 4,
//             }}
//           >
//             {room.images?.slice(0, 4).map((img: string, index: number) => (
//               <Box
//                 key={index}
//                 sx={{
//                   width: "100%",
//                   aspectRatio: "1 / 1",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   image={`/assets/${img}`}
//                   alt={`Room image ${index + 1}`}
//                   sx={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </Box>
//             ))}
//           </Box>

//           {/* </Grid> */}

//           {/* Reviews */}
//           <Box sx={{ mt: 3 }}>
//             <BookingReviews roomId={roomId!} />
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetails;

//

// import React, { useState, useEffect } from "react";
// import { Box, Grid, CircularProgress, Alert } from "@mui/material";
// import roomDetails from "../components/roomDetails/roomDetails";
// import roomDetailsGallery from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const [room, setRoom] = useState<any>({
//     id: 1,
//     name: "Luxury Room",
//     description: "Beautiful room with sea view.",
//     capacity: 2,
//     price: 120,
//     images: [
//       "/assets/room1.jpg",
//       "/assets/room2.jpg",
//       "/assets/room3.jpg",
//       "/assets/room4.jpg",
//     ],
//     amenities: ["WiFi", "Air conditioning", "Breakfast included"],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [guests, setGuests] = useState(1);
//   const [checkIn, setCheckIn] = useState("2025-12-01");
//   const [checkOut, setCheckOut] = useState("2025-12-02");

//   const handleBook = () => {
//     alert(
//       `Booking ${room.name} for ${guests} guests from ${checkIn} to ${checkOut}`
//     );
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Grid container spacing={4} alignItems="flex-start">
//         <Grid item xs={12} md={6}>
//           <RoomDetails
//             room={room}
//             guests={guests}
//             checkIn={checkIn}
//             checkOut={checkOut}
//             setGuests={setGuests}
//             setCheckIn={setCheckIn}
//             setCheckOut={setCheckOut}
//             onBook={handleBook}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <roomDetailsGallery images={room.images} />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { Box, Grid, CircularProgress, Alert } from "@mui/material";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";
// import { useAuth } from "../context/useAuth";

// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import RoomDetailsGallery from "../components/roomDetailsGallery/roomDetailsGallery";
// import BookingReviews from "../components/bookingReviews/bookingReview";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user } = useAuth();
//   const { searchAvailableRooms, loading } = useBooking();

//   const [rooms, setRooms] = useState<any[]>([]);
//   const [room, setRoom] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [guests, setGuests] = useState(1);
//   const [checkIn, setCheckIn] = useState("2025-12-01");
//   const [checkOut, setCheckOut] = useState("2025-12-02");

//   // Load available rooms
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);

//         if (!result.success) {
//           setError(result.message || "Failed to fetch rooms");
//           return;
//         }

//         const parsed = result.rooms.map((r: any) => ({
//           ...r,
//           images: Array.isArray(r.images) ? r.images : [],
//           amenities: Array.isArray(r.amenities) ? r.amenities : [],
//         }));

//         setRooms(parsed);
//       } catch (err) {
//         setError("Unexpected error loading rooms.");
//       }
//     };

//     fetchRooms();
//   }, [checkIn, checkOut, searchAvailableRooms]);

//   // Find selected room by ID
//   useEffect(() => {
//     if (!roomId) return;

//     const found = rooms.find((r) => String(r.id) === String(roomId));
//     setRoom(found || null);
//   }, [rooms, roomId]);

//   const onBook = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     alert(`Booking ${room.name}`);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Grid container spacing={4}>
//         {/* Left Column */}
//         <Grid item xs={12} md={6}>
//           <RoomDetailsCard
//             room={room}
//             guests={guests}
//             checkIn={checkIn}
//             checkOut={checkOut}
//             setGuests={setGuests}
//             setCheckIn={setCheckIn}
//             setCheckOut={setCheckOut}
//             onBook={onBook}
//           />
//         </Grid>

//         {/* Right Column (Images) */}
//         <Grid item xs={12} md={6}>
//           <RoomDetailsGallery images={room.images} />
//           {/* Reviews Section */}
//           <Box sx={{ mt: 3 }}>
//             <BookingReviews roomId={roomId!} />
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { Box, Grid, CircularProgress, Alert } from "@mui/material";
// import { useParams, useNavigate, useLocation } from "react-router-dom";

// import { useBooking } from "../context/bookingContext";
// import { useAuth } from "../context/useAuth";

// import HeroImage from "../components/HeroImage/HeroImage";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import RoomDetailsGallery from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user } = useAuth();
//   const { searchAvailableRooms, loading } = useBooking();

//   const [rooms, setRooms] = useState<any[]>([]);
//   const [room, setRoom] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [guests, setGuests] = useState(1);
//   const [checkIn, setCheckIn] = useState("2025-12-01");
//   const [checkOut, setCheckOut] = useState("2025-12-02");

//   // Load available rooms
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);

//         if (!result.success) {
//           setError(result.message || "Failed to fetch rooms");
//           return;
//         }

//         const parsed = result.rooms.map((r: any) => {
//           let images: string[] = [];
//           let amenities: string[] = [];

//           // ---- Parse IMAGES ----
//           try {
//             if (typeof r.images === "string") {
//               images = JSON.parse(r.images).map(
//                 (img: string) => `/assets/${img}` // <-- CORRECT PATH HERE
//               );
//             } else if (Array.isArray(r.images)) {
//               images = r.images.map((img: string) => `/assets/${img}`);
//             }
//           } catch {
//             images = [];
//           }

//           // ---- Parse AMENITIES ----
//           try {
//             if (typeof r.amenities === "string") {
//               amenities = JSON.parse(r.amenities);
//             } else if (Array.isArray(r.amenities)) {
//               amenities = r.amenities;
//             }
//           } catch {
//             amenities = [];
//           }

//           return { ...r, images, amenities };
//         });

//         console.log("Parsed rooms:", parsed);
//         setRooms(parsed);
//       } catch (err) {
//         setError("Unexpected error loading rooms.");
//       }
//     };

//     fetchRooms();
//   }, [checkIn, checkOut, searchAvailableRooms]);

//   // Find selected room by ID
//   useEffect(() => {
//     if (!roomId) return;

//     const found = rooms.find((r) => String(r.id) === String(roomId));
//     setRoom(found || null);
//   }, [rooms, roomId]);

//   const onBook = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     alert(`Booking ${room.name}`);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box sx={{ pb: 6 }}>
//       {/* HERO IMAGE */}
//       {room.images?.length > 0 && <HeroImage imageUrl={room.images[0]} />}

//       {/* ROOM DETAILS CARD */}
//       <Box sx={{ px: 3, mb: 5 }}>
//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={onBook}
//         />
//       </Box>

//       {/* IMAGE GALLERY — 2 per row */}
//       {/* `url(${img})` */}
//       <Box sx={{ px: 3, mb: 5 }}>
//         <RoomDetailsGallery images={room.images} />
//         {/* <Grid container spacing={2}>
//           {room.images?.slice(1, 5).map((img: string, idx: number) => (
//             <Grid item xs={12} sm={6} key={idx}>
//               <Box
//                 sx={{
//                   width: "100%",
//                   pt: "66%",
//                   backgroundImage: `/assets/${img}`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   borderRadius: 2,
//                 }}
//               />
//             </Grid>
//           ))}
//         </Grid> */}
//       </Box>

//       {/* REVIEWS (placed after gallery) */}
//       <Box sx={{ px: 3, mt: 4 }}>
//         <BookingReviews roomId={roomId!} />
//       </Box>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { Box, CircularProgress, Alert, Container } from "@mui/material";
// import { useParams, useNavigate, useLocation } from "react-router-dom";

// import { useBooking } from "../context/bookingContext";
// import { useAuth } from "../context/useAuth";

// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user } = useAuth();
//   const { searchAvailableRooms, loading } = useBooking();

//   const [rooms, setRooms] = useState<any[]>([]);
//   const [room, setRoom] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [guests, setGuests] = useState(1);
//   const [checkIn, setCheckIn] = useState("2025-12-01");
//   const [checkOut, setCheckOut] = useState("2025-12-02");

//   // Load available rooms
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);

//         if (!result.success) {
//           setError(result.message || "Failed to fetch rooms");
//           return;
//         }

//         const parsed = result.rooms.map((r: any) => {
//           let images: string[] = [];
//           let amenities: string[] = [];

//           // Parse images
//           try {
//             if (typeof r.images === "string") {
//               images = JSON.parse(r.images).map(
//                 (img: string) => `/assets/${img}`
//               );
//             } else if (Array.isArray(r.images)) {
//               images = r.images.map((img: string) => `/assets/${img}`);
//             }
//           } catch {
//             images = [];
//           }

//           // Parse amenities
//           try {
//             if (typeof r.amenities === "string") {
//               amenities = JSON.parse(r.amenities);
//             } else if (Array.isArray(r.amenities)) {
//               amenities = r.amenities;
//             }
//           } catch {
//             amenities = [];
//           }

//           return { ...r, images, amenities };
//         });

//         setRooms(parsed);
//       } catch (err) {
//         setError("Unexpected error loading rooms.");
//       }
//     };

//     fetchRooms();
//   }, [checkIn, checkOut, searchAvailableRooms]);

//   // Find selected room by ID
//   useEffect(() => {
//     if (!roomId) return;

//     const found = rooms.find((r) => String(r.id) === String(roomId));
//     setRoom(found || null);
//   }, [rooms, roomId]);

//   const onBook = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     alert(`Booking ${room.name}`);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box sx={{ pb: 6 }}>
//       {/* CAROUSEL HERO */}
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       {/* ROOM DETAILS CARD */}
//       <Container maxWidth="lg">
//         <Box sx={{ px: 3, mb: 5 }}>
//           <RoomDetailsCard
//             room={room}
//             guests={guests}
//             checkIn={checkIn}
//             checkOut={checkOut}
//             setGuests={setGuests}
//             setCheckIn={setCheckIn}
//             setCheckOut={setCheckOut}
//             onBook={onBook}
//           />
//         </Box>

//         {/* OPTIONAL: IMAGE GALLERY (below carousel) */}
//         {/* <Box sx={{ px: 3, mb: 5 }}>
//         <RoomDetailsGallery images={room.images} />
//       </Box> */}

//         {/* REVIEWS */}
//         <Box sx={{ px: 3, mt: 4 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   Grid,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery"; // the full-width carousel

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async () => {
//     if (!room || !user) return;
//     try {
//       const newBooking = {
//         room_id: roomId!,
//         user_id: user.id,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//       };
//       const result = await bookRoom(newBooking);
//       if (result.success) {
//         navigate("/booking-confirmation", {
//           state: {
//             room,
//             booking: { check_in: checkIn, check_out: checkOut, guests },
//           },
//         });
//       } else {
//         setError(result.message || "Booking failed after payment.");
//       }
//     } catch {
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;
//   if (showPayment)
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Complete Payment
//         </Typography>
//         <StripeCheckout
//           amount={
//             (room.price *
//               100 *
//               (new Date(checkOut).getTime() - new Date(checkIn).getTime())) /
//             (1000 * 60 * 60 * 24)
//           }
//           onSuccess={handlePaymentSuccess}
//         />
//         <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//           Cancel
//         </Button>
//       </Box>
//     );

//   return (
//     <Box>
//       {/* Full-width image carousel */}
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="lg">
//         {/* Room details + booking */}
//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment} // triggers Stripe
//         />

//         {/* Reviews */}
//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

// RoomDetails.tsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";

// import { supabase } from "../supabaseClient";
// import type { PaymentIntent } from "@stripe/stripe-js";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   // Fetch available rooms
//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   // Select room by ID
//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   // Start payment flow
//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
//     if (!room || !user) return;

//     const nights =
//       (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
//       (1000 * 60 * 60 * 24);

//     const total = room.price * nights * guests;

//     // Call bookRoom from context
//     const { success, message } = await bookRoom({
//       room_id: roomId!,
//       user_id: user.id,
//       check_in: checkIn,
//       check_out: checkOut,
//       guests,
//       total_price: total,
//     });

//     if (!success) {
//       console.error("Booking failed:", message);
//       setError(message || "Booking failed");
//       return;
//     }

//     // Navigate to confirmation page
//     navigate("/booking-confirmation", {
//       state: {
//         room,
//         booking: {
//           check_in: checkIn,
//           check_out: checkOut,
//           guests,
//           total_price: total,
//         },
//       },
//     });
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   if (showPayment) {
//     const nights =
//       (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
//       (1000 * 60 * 60 * 24);
//     const totalInCents = Math.round(room.price * guests * nights * 100);

//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Complete Payment
//         </Typography>
//         <StripeCheckout
//           amount={totalInCents}
//           onSuccess={handlePaymentSuccess} // passes PaymentIntent
//         />
//         <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//           Cancel
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}
//       <Container maxWidth="lg">
//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment}
//         />
//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

//////////// PERFECTION ??????????????????????????????
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   Grid,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async () => {
//     if (!room || !user) return;
//     try {
//       const newBooking = {
//         room_id: roomId!,
//         user_id: user.id,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//       };
//       const result = await bookRoom(newBooking);
//       if (result.success) {
//         navigate("/booking-confirmation", {
//           state: {
//             room,
//             booking: { check_in: checkIn, check_out: checkOut, guests },
//           },
//         });
//       } else {
//         setError(result.message || "Booking failed after payment.");
//       }
//     } catch {
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box>
//       {/* Full-width image carousel */}
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="lg">
//         {/* Stripe Payment Section */}
//         {showPayment && (
//           <Box sx={{ p: 4, mb: 4, border: "1px solid #ddd", borderRadius: 2 }}>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Complete Payment
//             </Typography>
//             <StripeCheckout
//               amount={
//                 (room.price *
//                   100 *
//                   (new Date(checkOut).getTime() -
//                     new Date(checkIn).getTime())) /
//                 (1000 * 60 * 60 * 24)
//               }
//               onSuccess={handlePaymentSuccess}
//             />
//             <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//               Cancel
//             </Button>
//           </Box>
//         )}

//         {/* Room details + booking */}
//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment}
//         />

//         {/* Reviews */}
//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   /* Fetch rooms for selected dates */
//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   /* Select current room */
//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   /* Start payment */
//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   /* Payment success handler */
//   const handlePaymentSuccess = async () => {
//     if (!room || !user) return;

//     try {
//       // Calculate nights
//       const nights =
//         (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
//         (1000 * 60 * 60 * 24);

//       const totalPrice = room.price * nights * guests;

//       // Create booking via context
//       const result = await bookRoom({
//         room_id: roomId!,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//       });

//       if (!result.success) {
//         setError(result.message || "Booking failed after payment.");
//         return;
//       }

//       // Navigate to confirmation page with booking info
//       navigate("/booking-confirmation", {
//         state: {
//           room,
//           booking: {
//             check_in: checkIn,
//             check_out: checkOut,
//             guests,
//             total_price: totalPrice,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Payment booking error:", err);
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box>
//       {/* Full-width image carousel */}
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="lg">
//         {/* Stripe Payment Section */}
//         {showPayment && (
//           <Box
//             sx={{
//               p: 4,
//               mb: 4,
//               border: "1px solid #ddd",
//               borderRadius: 2,
//             }}
//           >
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Complete Payment
//             </Typography>
//             <StripeCheckout
//               amount={
//                 (room.price *
//                   100 *
//                   (new Date(checkOut).getTime() -
//                     new Date(checkIn).getTime())) /
//                 (1000 * 60 * 60 * 24)
//               }
//               onSuccess={handlePaymentSuccess}
//             />
//             <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//               Cancel
//             </Button>
//           </Box>
//         )}

//         {/* Room details + booking */}
//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment}
//         />

//         {/* Reviews */}
//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useBooking } from "../context/bookingContext";

// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
// import BookingReviews from "../components/bookingReviews/bookingReview";
// import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
// import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";

// const RoomDetails: React.FC = () => {
//   const { roomId } = useParams();
//   const { searchAvailableRooms, loading, bookRoom } = useBooking();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [room, setRoom] = useState<any | null>(null);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [guests, setGuests] = useState<number>(1);
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");
//   const [showPayment, setShowPayment] = useState(false);

//   useEffect(() => {
//     if (!roomId) return;

//     const fetchRoomDetails = async () => {
//       try {
//         const result = await searchAvailableRooms(checkIn, checkOut);
//         if (result.success) setRooms(result.rooms);
//         else setError(result.message || "Failed to fetch rooms.");
//       } catch {
//         setError("Unexpected error fetching rooms.");
//       }
//     };

//     fetchRoomDetails();
//   }, [roomId, checkIn, checkOut, searchAvailableRooms]);

//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const found = rooms.find((r) => String(r.id) === String(roomId));
//       setRoom(found || null);
//     }
//   }, [rooms, roomId]);

//   const handleStartPayment = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//       return;
//     }
//     if (
//       guests <= 0 ||
//       !checkIn ||
//       !checkOut ||
//       new Date(checkIn) >= new Date(checkOut)
//     ) {
//       setError("Please enter valid guests and dates.");
//       return;
//     }
//     setShowPayment(true);
//   };

//   const handlePaymentSuccess = async () => {
//     if (!room || !user) return;

//     try {
//       const nights =
//         (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
//         (1000 * 60 * 60 * 24);

//       const totalPrice = room.price * nights * guests;

//       const result = await bookRoom({
//         room_id: roomId!,
//         check_in: checkIn,
//         check_out: checkOut,
//         guests,
//         total_price: totalPrice, // 🔥 REQUIRED
//       });

//       if (!result.success) {
//         setError(result.message || "Booking failed after payment.");
//         return;
//       }

//       navigate("/booking-confirmation", {
//         state: {
//           room,
//           booking: {
//             check_in: checkIn,
//             check_out: checkOut,
//             guests,
//             total_price: totalPrice,
//           },
//         },
//       });
//     } catch (err) {
//       console.error("Payment booking error:", err);
//       setError("Unexpected error after payment.");
//     }
//   };

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!room) return <Alert severity="error">Room not found.</Alert>;

//   return (
//     <Box>
//       {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

//       <Container maxWidth="lg">
//         {showPayment && (
//           <Box sx={{ p: 4, mb: 4, border: "1px solid #ddd", borderRadius: 2 }}>
//             <Typography variant="h5" sx={{ mb: 2 }}>
//               Complete Payment
//             </Typography>

//             <StripeCheckout
//               amount={
//                 (room.price *
//                   100 *
//                   (new Date(checkOut).getTime() -
//                     new Date(checkIn).getTime())) /
//                 (1000 * 60 * 60 * 24)
//               }
//               onSuccess={() => handlePaymentSuccess()}
//             />

//             <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//               Cancel
//             </Button>
//           </Box>
//         )}

//         <RoomDetailsCard
//           room={room}
//           guests={guests}
//           checkIn={checkIn}
//           checkOut={checkOut}
//           setGuests={setGuests}
//           setCheckIn={setCheckIn}
//           setCheckOut={setCheckOut}
//           onBook={handleStartPayment}
//         />

//         <Box sx={{ mt: 6, mb: 12 }}>
//           <BookingReviews roomId={roomId!} />
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default RoomDetails;

// src/pages/roomDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Container,
} from "@mui/material";
import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
import BookingReviews from "../components/bookingReviews/bookingReview";
import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
import RoomImageCarousel from "../components/roomDetailsGallery/roomDetailsGallery";
import { useBooking } from "../context/bookingContext";
import { useAuth } from "../context/useAuth";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { searchAvailableRooms, loading, bookRoom, storePayment } =
    useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [room, setRoom] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [checkIn, setCheckIn] = useState<string>("2025-12-01");
  const [checkOut, setCheckOut] = useState<string>("2025-12-02");
  const [showPayment, setShowPayment] = useState(false);

  // Fetch available rooms for the selected dates
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      try {
        const result = await searchAvailableRooms(checkIn, checkOut);
        if (result.success) setRooms(result.rooms);
        else setError(result.message || "Failed to fetch rooms.");
      } catch {
        setError("Unexpected error fetching rooms.");
      }
    };

    fetchRoomDetails();
  }, [roomId, checkIn, checkOut, searchAvailableRooms]);

  // Find the current room from the rooms array
  useEffect(() => {
    if (rooms.length && roomId) {
      const found = rooms.find((r) => String(r.id) === String(roomId));
      setRoom(found || null);
    }
  }, [rooms, roomId]);

  const handleStartPayment = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (
      guests <= 0 ||
      !checkIn ||
      !checkOut ||
      new Date(checkIn) >= new Date(checkOut)
    ) {
      setError("Please enter valid guests and dates.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    if (!room || !user) return;

    try {
      const nights =
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24);

      const totalPrice = room.price * nights * guests;

      // ✅ Create booking first
      const result = await bookRoom({
        room_id: roomId!,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
      });

      if (!result.success || !result.booking) {
        setError(result.message || "Booking failed after payment.");
        return;
      }

      const bookingId = result.booking.id;

      // ✅ Store payment with bookingId
      const paymentResult = await storePayment({
        payment_intent_id: paymentIntent.id,
        amount: totalPrice,
        booking_id: bookingId,
        user_id: user.id,
      });

      if (!paymentResult.success) {
        setError(paymentResult.message || "Payment recording failed.");
        return;
      }

      // Navigate to confirmation
      navigate("/booking-confirmation", {
        state: {
          room,
          booking: {
            check_in: checkIn,
            check_out: checkOut,
            guests,
            total_price: totalPrice,
          },
        },
      });
    } catch (err) {
      console.error("Payment booking error:", err);
      setError("Unexpected error after payment.");
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return <Alert severity="error">Room not found.</Alert>;

  return (
    <Box>
      {room.images?.length > 0 && <RoomImageCarousel images={room.images} />}

      <Container maxWidth="lg">
        {showPayment && (
          <Box sx={{ p: 4, mb: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Complete Payment
            </Typography>

            <StripeCheckout
              amount={
                (room.price *
                  100 *
                  (new Date(checkOut).getTime() -
                    new Date(checkIn).getTime())) /
                (1000 * 60 * 60 * 24)
              }
              onSuccess={handlePaymentSuccess}
            />

            <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
              Cancel
            </Button>
          </Box>
        )}

        <RoomDetailsCard
          room={room}
          guests={guests}
          checkIn={checkIn}
          checkOut={checkOut}
          setGuests={setGuests}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          onBook={handleStartPayment}
        />

        <Box sx={{ mt: 6, mb: 12 }}>
          <BookingReviews roomId={roomId!} />
        </Box>
      </Container>
    </Box>
  );
};

export default RoomDetails;
