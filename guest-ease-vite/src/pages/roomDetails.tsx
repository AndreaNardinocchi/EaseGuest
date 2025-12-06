// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
// import { useNavigate, useParams, useLocation } from "react-router-dom"; // ✅ added useLocation
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

//   //   // Fetch movie data (including cast details) using React Query's useQuery hook
//   // const {
//   //   data: room, // The fetched movie data will be stored in 'movie'
//   //   error, // Error object if the query fails
//   //   isLoading, // Boolean flag indicating if the query is currently loading
//   //   isError, // Boolean flag indicating if there was an error during the query
//   // } = useQuery<MovieDetailsProps, Error>(
//   //   ["movie", id, lang], // Unique query key for caching and refetching
//   //   () =>
//   //     // Fetch the movie with cast information using the provided function
//   //     fetchMovieWithCast(id || "", lang)
//   // );

//   const { searchAvailableRooms, loading, bookRoom } = useBooking();

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [room, setRoom] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [guests, setGuests] = useState<number>(1);
//   // Add a state to toggle the payment popup
//   const [showPayment, setShowPayment] = useState(false);

//   // // Editable check-in and check-out dates
//   // const [checkIn, setCheckIn] = useState<string>("01/01/2025");
//   // const [checkOut, setCheckOut] = useState<string>("01/01/2025");

//   // Editable check-in and check-out dates
//   const [checkIn, setCheckIn] = useState<string>("2025-12-01");
//   const [checkOut, setCheckOut] = useState<string>("2025-12-02");

//   useEffect(() => {
//     if (rooms.length && roomId) {
//       const foundRoom = rooms.find(
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         (r: any) => String(r.id) === String(roomId)
//       );
//       if (foundRoom) {
//         setRoom(foundRoom);
//       } else {
//         setError("No room found");
//       }
//     }
//   }, [rooms, roomId]);

//   /**
//    * This is the browser title
//    * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
//    */
//   // useEffect(() => {
//   //   // document.title = `${t("login")} | MoviesApp`;
//   //   document.title = `Room ${room.name} details | GuestEase`;
//   //   //   }, [t]);
//   // });

//   useEffect(() => {
//     if (room) {
//       document.title = `${room.name} details | GuestEase`;
//     }
//   }, [room]);

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

//   useEffect(() => {
//     if (rooms.length > 0) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const foundRoom = rooms.find((r: any) => r.id === roomId);
//       if (foundRoom) {
//         setRoom(foundRoom);
//       } else {
//         setError("Room not found.");
//       }
//     }
//   }, [rooms, roomId]);

//   const { user } = useAuth(); // check if user is logged in
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ added location hook

//   const handleStartPayment = () => {
//     console.log("Current user:", user);

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

//     // Validation passed → open Stripe checkout
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
//             booking: {
//               check_in: checkIn,
//               check_out: checkOut,
//               guests,
//             },
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

//   // ✅ moved this block back OUTSIDE the function
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
//       <Alert severity="error" sx={{ marginTop: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   if (!room) {
//     return (
//       <Alert severity="error" sx={{ marginTop: 2 }}>
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
//           } // Stripe needs cents
//           onSuccess={handlePaymentSuccess}
//         />

//         <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
//           Cancel
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Card
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           borderRadius: 2,
//         }}
//       >
//         <CardMedia
//           component="img"
//           sx={{
//             width: { xs: "100%", md: 400 },
//             height: 300,
//             objectFit: "cover",
//             borderRadius: 2,
//           }}
//           image={room.image_url || "/default-room-image.jpg"}
//           alt={room.name}
//         />
//         <CardContent sx={{ padding: 4 }}>
//           <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
//             {room.name}
//           </Typography>
//           <Typography
//             variant="body1"
//             sx={{ marginTop: 2, color: "text.secondary" }}
//           >
//             {room.description ||
//               "A cozy and comfortable room designed for your perfect stay."}
//           </Typography>

//           <Grid container spacing={2} sx={{ marginTop: 3 }}>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Capacity:
//               </Typography>
//               <Typography variant="body1">
//                 {room.capacity || "N/A"} guests
//               </Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Price:
//               </Typography>
//               <Typography variant="h6" color="primary">
//                 €{room.price} / night
//               </Typography>
//             </Grid>
//           </Grid>

//           {/* <Box sx={{ marginTop: 3 }}>
//             <Typography variant="body2" color="text.secondary">
//               Available Services:
//             </Typography>
//             <Typography variant="body1" sx={{ marginTop: 1 }}>
//               - Free WiFi
//               <br />
//               - Daily housekeeping
//               <br />
//               - Complimentary breakfast
//               <br />
//               - Swimming pool access
//               <br />- 24/7 Concierge service
//             </Typography>
//           </Box> */}
//           <Box sx={{ marginTop: 3 }}>
//             {room.amenities && room.amenities.length > 0 && (
//               <>
//                 <Typography variant="body2" color="text.secondary">
//                   Available Services:
//                 </Typography>
//                 <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
//                   {room.amenities.map((amenity, index) => (
//                     <Box
//                       component="li"
//                       key={index}
//                       sx={{
//                         fontSize: "0.95rem",
//                         color: "text.primary",
//                         lineHeight: 1.5,
//                       }}
//                     >
//                       {amenity}
//                     </Box>
//                   ))}
//                 </Box>
//               </>
//             )}
//           </Box>

//           <BookingReviews roomId={roomId!} />

//           {/* Booking Form */}
//           <Box sx={{ marginTop: 3 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Check-in Date"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Check-out Date"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             <TextField
//               label="Guests"
//               type="number"
//               value={guests}
//               onChange={(e) => setGuests(Number(e.target.value))}
//               fullWidth
//               sx={{ marginTop: 2 }}
//               inputProps={{ min: 1 }}
//             />
//           </Box>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ marginTop: 3 }}
//             // onClick={handleBooking}
//             // onClick={() => setShowPayment(true)}
//             onClick={handleStartPayment}
//           >
//             Pay & Book Now
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default RoomDetails;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useBooking } from "../context/bookingContext";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { StripeCheckout } from "../components/stripeCheckOut/stripeCheckOut";
import BookingReviews from "../components/bookingReviews/bookingReview";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams();
  const { searchAvailableRooms, loading, bookRoom } = useBooking();
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

  // Fetch rooms on mount or date change
  useEffect(() => {
    if (!roomId) {
      setError("Room ID is missing");
      return;
    }

    const fetchRoomDetails = async () => {
      try {
        const result = await searchAvailableRooms(checkIn, checkOut);
        if (result.success) {
          setRooms(result.rooms);
        } else {
          setError(result.message || "Failed to fetch rooms.");
        }
      } catch {
        setError("Unexpected error occurred while fetching rooms.");
      }
    };

    fetchRoomDetails();
  }, [roomId, checkIn, checkOut, searchAvailableRooms]);

  // Set selected room
  useEffect(() => {
    if (rooms.length && roomId) {
      const foundRoom = rooms.find((r: any) => String(r.id) === String(roomId));
      if (foundRoom) setRoom(foundRoom);
      else setError("No room found");
    }
  }, [rooms, roomId]);

  // Set page title
  useEffect(() => {
    if (room) {
      document.title = `${room.name} details | GuestEase`;
    }
  }, [room]);

  const handleStartPayment = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (guests <= 0) {
      setError("Please select a valid number of guests.");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const newBooking = {
        room_id: roomId!,
        user_id: user!.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      };
      const result = await bookRoom(newBooking);
      if (result.success) {
        navigate("/booking-confirmation", {
          state: {
            room,
            booking: { check_in: checkIn, check_out: checkOut, guests },
          },
        });
      } else {
        setError(result.message || "Booking failed after payment.");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error after payment.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!room) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        No room details available.
      </Alert>
    );
  }

  if (showPayment) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Complete Payment
        </Typography>
        <StripeCheckout
          amount={
            (room.price *
              100 *
              (new Date(checkOut).getTime() - new Date(checkIn).getTime())) /
            (1000 * 60 * 60 * 24)
          }
          onSuccess={handlePaymentSuccess}
        />
        <Button sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
          Cancel
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {room.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                {room.description ||
                  "A cozy and comfortable room designed for your perfect stay."}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Capacity:
                  </Typography>
                  <Typography variant="body1">
                    {room.capacity || "N/A"} guests
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    €{room.price} / night
                  </Typography>
                </Grid>
              </Grid>

              {room.amenities?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Available Services:
                  </Typography>
                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                    {room.amenities.map((amenity: string, i: number) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{ fontSize: "0.95rem", lineHeight: 1.5 }}
                      >
                        {amenity}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Booking Form */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Check-in Date"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Check-out Date"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  fullWidth
                  sx={{ mt: 2 }}
                  inputProps={{ min: 1 }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleStartPayment}
              >
                Pay & Book Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="center">
            {[1, 2].map((i) => (
              <Grid item xs={6} key={i}>
                <CardMedia
                  component="img"
                  image={`https://placehold.net/400x400.png?text=Image+${i}`}
                  alt={`Room placeholder ${i}`}
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ marginTop: 2 }}
            justifyContent="center"
          >
            {[1, 2].map((i) => (
              <Grid item xs={6} key={i}>
                <CardMedia
                  component="img"
                  image={`https://placehold.net/400x400.png?text=Image+${i}`}
                  alt={`Room placeholder ${i}`}
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Reviews below images */}
          <Box sx={{ mt: 3 }}>
            <BookingReviews roomId={roomId!} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomDetails;
