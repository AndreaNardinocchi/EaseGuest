import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useBooking } from "../context/bookingContext";
import RoomCardHorizontal from "../components/RoomCardHorizontal/roomCardHorizontal";
import SearchModifyBar from "../components/searchModifyBar/searchModifyBar";

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
import type { Room } from "../types/interfaces";
import StickyBox from "../components/stickyComp/stickyComp";
import AmenitiesFilter from "../components/amenitiesFilter/amenitiesFilter";

// type Room = {
//   id: string;
//   name: string;
//   description?: string;
//   capacity?: number;
//   price?: number;
//   images?: string[];
//   amenities?: string[];
// };

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

  /**
   * Extract all amenities from all rooms.
   *
   * rooms.flatMap(...) does two things:
   * 1. Maps each room to its amenities array
   * 2. Flattens the result into a single-level array
   *
   * Example:
   *   rooms = [
   *     { amenities: ["WiFi", "Parking"] },
   *     { amenities: ["TV", "WiFi"] }
   *   ]
   *
   *   rooms.flatMap(r => r.amenities)
   *   → ["WiFi", "Parking", "TV", "WiFi"]
   *
   * We then wrap it in new Set(...) to remove duplicates,
   * and Array.from(...) to convert the Set back into an array.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
   * https://tc39.es/ecma262/#sec-array.prototype.flatmap
   */
  const allAmenities = Array.from(
    new Set(rooms.flatMap((room) => room.amenities || []))
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filteredRooms = rooms.filter((room) => {
    if (selectedAmenities.length === 0) return true;

    return selectedAmenities.every((a) => room.amenities?.includes(a));
  });

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
      <AppBar position="static" sx={{ backgroundColor: "#EFF5E0" }}>
        <Toolbar>
          <HotelIcon sx={{ mr: 1, color: "#000000de" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000de" }}>
            Search Results
          </Typography>

          {datesAreValid && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonthIcon sx={{ color: "#000000de" }} />
              <Typography variant="body2" sx={{ color: "#000000de" }}>
                {checkIn} → {checkOut} ({guests} guests)
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <StickyBox>
        <SearchModifyBar
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guests}
        />
      </StickyBox>
      <Container sx={{ width: "900px" }}>
        <AmenitiesFilter
          // allAmenities={allAmenities}
          allAmenities={[
            "Comfort Bathing",
            "Tea & Coffee Tray",
            "King Bed",
            "Two double-beds",
            "Mini-fridge",
            "Microwave",
            "Kitchenette",
            "Remote‑Work Friendly",
            "Single bed",
          ]} // cherry-picked
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />
      </Container>

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
            {filteredRooms.map((room) => {
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
