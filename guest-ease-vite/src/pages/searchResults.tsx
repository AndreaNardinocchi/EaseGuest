import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useBooking } from "../context/bookingContext";
import RoomCardHorizontal from "../components/RoomCardHorizontal.tsx/RoomCardHorizontal";

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

type Booking = {
  check_in: string;
  check_out: string;
};

type Room = {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  price?: number;
  images?: string[]; // ← FIXED: always an array
  amenities?: string[]; // jsonb array
  bookings?: Booking[];
};

const SearchResults: React.FC = () => {
  const location = useLocation();
  const { searchAvailableRooms } = useBooking();

  const state = location.state as
    | {
        searchParams: { checkIn: string; checkOut: string };
        availableRooms?: Room[];
      }
    | undefined;

  const [rooms, setRooms] = useState<Room[]>(state?.availableRooms || []);
  const [loading, setLoading] = useState(!state?.availableRooms);
  const [error, setError] = useState<string | null>(null);

  const checkIn = state?.searchParams.checkIn;
  const checkOut = state?.searchParams.checkOut;

  // Helper function to detect overlapping bookings
  const bookingsOverlap = (
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ) => {
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();
    return aStart < bEnd && bStart < aEnd;
  };

  useEffect(() => {
    if (!checkIn || !checkOut || state?.availableRooms) return;

    const loadRooms = async () => {
      try {
        setLoading(true);

        const result = await searchAvailableRooms(checkIn, checkOut);

        if (result.success) {
          // FIXED: jsonb comes as array → no JSON.parse
          const parsedRooms = result.rooms.map((room: Room) => ({
            ...room,
            images: Array.isArray(room.images) ? room.images : [],
            amenities: Array.isArray(room.amenities) ? room.amenities : [],
          }));

          setRooms(parsedRooms);
        } else {
          setError(result.message || "Failed to load rooms");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [checkIn, checkOut, searchAvailableRooms, state?.availableRooms]);

  return (
    <>
      {/* HEADER */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <HotelIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Search Results
          </Typography>
          {checkIn && checkOut && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon />
              <Typography variant="body2">
                {checkIn} → {checkOut}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Container sx={{ py: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : rooms.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No rooms available for these dates.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Try New Dates
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {rooms.map((room) => (
              <Grid item key={room.id} xs={12}>
                <RoomCardHorizontal
                  id={room.id}
                  name={room.name}
                  description={room.description}
                  price={room.price}
                  images={room.images}
                  amenities={room.amenities}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
