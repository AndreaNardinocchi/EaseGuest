import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useBooking } from "../context/bookingContext";
import RoomCardHorizontal from "../components/RoomCardHorizontal/roomCardHorizontal";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type Room = {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  price?: number;
  images?: string[];
  amenities?: string[];
};

const SearchResults: React.FC = () => {
  const location = useLocation();
  const { searchAvailableRooms } = useBooking();

  const params = new URLSearchParams(location.search);
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = Number(params.get("guests")) || 1;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const datesAreValid =
    checkIn &&
    checkOut &&
    !isNaN(Date.parse(checkIn)) &&
    !isNaN(Date.parse(checkOut)) &&
    new Date(checkIn) < new Date(checkOut);

  useEffect(() => {
    if (!datesAreValid) {
      setError("Please provide valid check‑in and check‑out dates in the URL.");
      return;
    }

    const loadRooms = async () => {
      try {
        setLoading(true);
        const result = await searchAvailableRooms(checkIn, checkOut, guests);
        console.log("Search result:", result);

        if (result.success) {
          const parsedRooms = result.rooms.map((room: any) => ({
            ...room,
            images: Array.isArray(room.images) ? room.images : [],
            amenities: Array.isArray(room.amenities) ? room.amenities : [],
          }));
          setRooms(parsedRooms);
        } else {
          setError(result.message ?? "Failed to load rooms.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [checkIn, checkOut, datesAreValid, guests, searchAvailableRooms]);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <HotelIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Search Results
          </Typography>

          {datesAreValid && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon />
              <Typography variant="body2">
                {checkIn} → {checkOut} ({guests} guests)
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : rooms.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <Typography variant="h6" color="text.secondary">
              No rooms available for these dates.
            </Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
              Try New Dates
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => {
              const shortDescription = room.description?.includes(".")
                ? room.description.split(".")[0] + "."
                : room.description;

              return (
                <Grid item key={room.id} xs={12}>
                  <RoomCardHorizontal
                    id={room.id}
                    name={room.name}
                    description={shortDescription}
                    price={room.price}
                    images={room.images}
                    amenities={room.amenities}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                    capacity={room.capacity}
                    reviews={room.reviews}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
