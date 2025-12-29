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
      images: Array.isArray(room.images) ? room.images : [],
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
    }));

    setRooms(parsedRooms);
    setLoading(false);
  };

  const handleBookNow = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography>Loading rooms…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
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
                    ? // ? `/assets/${room.images}`
                      getPublicUrl(room.images[0])
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
