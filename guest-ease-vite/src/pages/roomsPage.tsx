// import React, { useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const rooms = [
//   {
//     id: "441a0898-1daa-4c30-9143-aa3a020e7379",
//     name: "Room 102",
//     description: "Double room with balcony",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "46e852d3-82a6-4264-af74-14cd6d4b3bf9",
//     name: "Room 108",
//     description: "Compact single",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "4cee2fe3-b64d-4960-bb5f-3212f08ee226",
//     name: "Room 104",
//     description: "Family suite",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "4e13ae85-89d6-4eb6-bec8-dfcaa84b3ee8",
//     name: "Room 103",
//     description: "Suite",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "7493d68c-8fbc-4d32-91f1-6325fc383349",
//     name: "Room 101",
//     description: "Cozy single room",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "7c894d52-c4a6-4635-a8e3-02a972d762d7",
//     name: "Room 107",
//     description: "Single room with balcony",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "a41cd07f-7603-4b1e-ac26-a5155e835745",
//     name: "Room 105",
//     description: "Executive room with balcony",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
//   {
//     id: "ffc71220-301e-4351-ac50-68e293845057",
//     name: "Room 106",
//     description: "Penthouse suite",
//     image:
//       "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
//   },
// ];

// const RoomsPage: React.FC = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.title = `Our Rooms | GuestEase`;
//   }, []);

//   const handleBookNow = (roomId: string) => {
//     navigate(`/room/${roomId}`);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
//       <Box textAlign="center" mb={5}>
//         <Typography variant="h3" component="h1" gutterBottom>
//           Our Rooms
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           Choose from a variety of cozy, comfortable, and well-equipped rooms.
//         </Typography>
//       </Box>

//       <Grid container spacing={4} justifyContent="center">
//         {rooms.map((room) => (
//           <Grid item xs={12} sm={6} key={room.id}>
//             <Card
//               sx={{
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: 3,
//                 boxShadow: 4,
//                 overflow: "hidden",
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 image={room.image}
//                 alt={room.name}
//                 sx={{
//                   height: 260,
//                   objectFit: "cover",
//                 }}
//               />

//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   {room.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {room.description}
//                 </Typography>
//               </CardContent>

//               <CardActions
//                 sx={{
//                   justifyContent: "space-between",
//                   px: 2,
//                   pb: 2,
//                 }}
//               >
//                 <Button
//                   size="small"
//                   color="primary"
//                   onClick={() => handleBookNow(room.id)}
//                 >
//                   View Details
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default RoomsPage;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import type { Room } from "../types/interfaces";

// const RoomsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     document.title = "Our Rooms | GuestEase";
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     const { data, error } = await supabase
//       .from("rooms")
//       .select("*")
//       .order("price");

//     if (error) {
//       console.error("Error fetching rooms:", error);
//       return;
//     }

//     // 🔧 Convert json strings → arrays
//     // const parsedRooms: Room[] = data.map((room: any) => ({
//     //   ...room,
//     //   images: room.images ? JSON.parse(room.images) : [],
//     //   amenities: room.amenities ? JSON.parse(room.amenities) : [],
//     // }));
//     const parsedRooms: Room[] = data.map((room: any) => ({
//       ...room,
//       images: Array.isArray(room.images) ? room.images[0] : [],
//       amenities: Array.isArray(room.amenities) ? room.amenities : [],
//     }));

//     console.log("Images:", parsedRooms[0].images);
//     setRooms(parsedRooms);
//     setLoading(false);
//   };

//   const handleBookNow = (roomId: string) => {
//     navigate(`/room/${roomId}`);
//   };

//   if (loading) {
//     return (
//       <Container sx={{ mt: 10, textAlign: "center" }}>
//         <Typography>Loading rooms…</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
//       <Box textAlign="center" mb={5}>
//         <Typography variant="h3" gutterBottom>
//           Our Rooms
//         </Typography>
//         <Typography color="text.secondary">
//           Choose from a variety of cozy, comfortable, and well-equipped rooms.
//         </Typography>
//       </Box>

//       <Grid container spacing={4}>
//         {rooms.map((room) => (
//           <Grid item xs={12} sm={6} key={room.id}>
//             <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 4 }}>
//               <CardMedia
//                 component="img"
//                 height="260"
//                 image={
//                   room.images?.[0]
//                     ? `/assets/${room.images}`
//                     : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
//                 }
//                 alt={room.name}
//               />

//               <CardContent>
//                 <Typography variant="h6">{room.name}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {room.description}
//                 </Typography>
//                 <Typography variant="subtitle2" sx={{ mt: 1 }}>
//                   Sleeps {room.capacity} · €{room.price}/night
//                 </Typography>
//               </CardContent>

//               <CardActions sx={{ px: 2, pb: 2 }}>
//                 <Button onClick={() => handleBookNow(room.id)}>
//                   View Details
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default RoomsPage;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import type { Room } from "../types/interfaces";

// const RoomsPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     document.title = "Our Rooms | GuestEase";
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     const { data, error } = await supabase
//       .from("rooms")
//       .select("*")
//       .order("price");

//     if (error) {
//       console.error("Error fetching rooms:", error);
//       return;
//     }

//     const parsedRooms: Room[] = data.map((room: any) => ({
//       ...room,
//       images: Array.isArray(room.images) ? room.images[0] : [],
//       amenities: Array.isArray(room.amenities) ? room.amenities : [],
//     }));

//     setRooms(parsedRooms);
//     setLoading(false);
//   };

//   const handleBookNow = (roomId: string) => {
//     navigate(`/room/${roomId}`);
//   };

//   if (loading) {
//     return (
//       <Container sx={{ mt: 10, textAlign: "center" }}>
//         <Typography>Loading rooms…</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
//       <Box textAlign="center" mb={5}>
//         <Typography variant="h3" gutterBottom>
//           Our Rooms
//         </Typography>
//         <Typography color="text.secondary">
//           Choose from a variety of cozy, comfortable, and well-equipped rooms.
//         </Typography>
//       </Box>

//       {/* SAME GRID LAYOUT AS REVIEW PAGE */}
//       <Grid container spacing={4}>
//         {rooms.map((room) => (
//           <Grid
//             item
//             xs={12}
//             md={6}
//             key={room.id}
//             sx={{
//               width: {
//                 xs: "100%",
//                 sm: "100%",
//                 md: "45%",
//                 lg: "45%",
//               },
//             }}
//           >
//             <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 4 }}>
//               <CardMedia
//                 component="img"
//                 height="260"
//                 image={
//                   room.images?.[0]
//                     ? `/assets/${room.images}`
//                     : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
//                 }
//                 alt={room.name}
//               />

//               <CardContent>
//                 <Typography variant="h6">{room.name}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {room.description}
//                 </Typography>
//                 <Typography variant="subtitle2" sx={{ mt: 1 }}>
//                   Sleeps {room.capacity} · €{room.price}/night
//                 </Typography>
//               </CardContent>

//               <CardActions sx={{ px: 2, pb: 2 }}>
//                 <Button onClick={() => handleBookNow(room.id)}>
//                   View Details
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default RoomsPage;

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import type { Room } from "../types/interfaces";

const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Our Rooms | GuestEase";
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("price");

    if (error) {
      console.error("Error fetching rooms:", error);
      return;
    }

    const parsedRooms: Room[] = data.map((room: any) => ({
      ...room,
      images: Array.isArray(room.images) ? room.images[0] : [],
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
    }));

    setRooms(parsedRooms);
    setLoading(false);
  };

  const handleBookNow = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography>Loading rooms…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" gutterBottom>
          Our Rooms
        </Typography>
        <Typography color="text.secondary">
          Choose from a variety of cozy, comfortable, and well-equipped rooms.
        </Typography>
      </Box>

      {/* SAME GRID LAYOUT AS REVIEW PAGE */}
      <Grid container spacing={4}>
        {rooms.map((room) => (
          <Grid
            item
            xs={12}
            md={6}
            key={room.id}
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "45%",
                lg: "45%",
              },
            }}
          >
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "scale(1.04)", // 👈 bulge effect
                  boxShadow: 10,
                },
              }}
            >
              <CardMedia
                component="img"
                height="260"
                image={
                  room.images?.[0]
                    ? `/assets/${room.images}`
                    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                }
                alt={room.name}
              />

              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>

                {/* 3-line clamp */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {room.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Guests {room.capacity} · €{room.price}/night
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={() => handleBookNow(room.id)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomsPage;
