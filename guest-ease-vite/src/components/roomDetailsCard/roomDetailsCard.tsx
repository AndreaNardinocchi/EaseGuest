import React from "react";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Review } from "../../types/interfaces";
import { calculateAverageRating } from "../../utils/calculateAverageRating";

interface RoomDetailsCardProps {
  room: {
    name: string;
    description: string;
    amenities: string[];
    price: number;
    capacity: number;
  };
  guests: number;
  checkIn: string;
  checkOut: string;
  setGuests: (n: number) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  onBook: () => void;
  reviews?: Review[];
}

const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
  room,
  guests,
  checkIn,
  checkOut,
  setGuests,
  setCheckIn,
  setCheckOut,
  onBook,
  reviews = [],
}) => {
  const today = new Date().toISOString().split("T")[0];

  /**
   * Ensure reviews is always an array before calculating the average,
   * otherwise the room name will give an error
   **/

  const safeReviews = reviews ?? [];
  const avgRating = calculateAverageRating(safeReviews);

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        mb: 8,
      }}
    >
      {/* Room Title */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        <strong> {room.name} </strong>
      </Typography>

      <Box sx={{ mb: 1 }}>
        {reviews && reviews.length > 0 ? (
          <Typography variant="body2" color="text.secondary">
            ★ {avgRating} ({reviews.length}{" "}
            {reviews.length > 1 ? <span>reviews</span> : <span>review</span>})
            {/* ({reviews?.length ?? 0}) */}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No reviews yet
            {/* ({reviews?.length ?? 0}) */}
          </Typography>
        )}
      </Box>

      {/* Room Description */}
      <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
        {room.description}
      </Typography>
      {/* Check-in / Check-out */}
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Capacity: <br />
            <span style={{ color: "#000000de" }}>
              {" "}
              {room.capacity} Guests (max)
            </span>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Price: <br />
            <span style={{ color: "#000000de" }}>
              {" "}
              {room.price} Euro / night
            </span>
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Check-in / Check-out */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Check In"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  fullWidth
                  inputProps={{ min: today }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Check Out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  fullWidth
                  inputProps={{ min: checkIn || today }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Guests + Book button */}
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= room.capacity) {
                    setGuests(value);
                  }
                }}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onBook}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT COLUMN: Available Services (single column list) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", pl: { md: 35 }, boxSizing: "border-box" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
            >
              Available Services
            </Typography>

            <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
              {room.amenities.map((service: string, idx: number) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <CheckCircleIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">{service}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomDetailsCard;
