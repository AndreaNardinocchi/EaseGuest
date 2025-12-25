import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface ReviewFilterCardProps {
  filters: {
    search: string;
    room_id: string;
    rating: string;
    created_at: string;
  };
  setFilters: (filters: any) => void;

  // bookings: { id: string; room_id: string }[]; // ✅ added
  rooms: { id: string; name: string }[]; // ✅ added
}

const styles = {
  root: {
    width: "100%",
    marginBottom: 20,
  },
  formControl: {
    marginTop: 2,
    width: "100%",
    backgroundColor: "#fff",
  },
};

const ReviewFilterCard: React.FC<ReviewFilterCardProps> = ({
  filters,
  setFilters,
  rooms,
}) => {
  const handleChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      room_id: "",
      rating: "",
      created_at: "",
    });
  };

  // ✅ Correct helper
  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name || `Unknown room (${roomId})`;

  return (
    <Card sx={styles.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          <FilterAltIcon fontSize="large" /> Review Filters
        </Typography>

        {/* Search */}
        <TextField
          sx={styles.formControl}
          label="Search all fields"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        <FormControl sx={styles.formControl}>
          <InputLabel>Room Name</InputLabel>
          <Select
            label="Room Name"
            value={filters.room_id}
            onChange={(e) => handleChange("room_id", e.target.value)}
          >
            <MenuItem value="">All Rooms</MenuItem>

            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {getRoomName(r.id)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* {console.log("Selected room_id:", filters.room_id)} */}

        {/* Rating */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Rating</InputLabel>
          <Select
            label="Rating"
            value={filters.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
          >
            <MenuItem value="">All Ratings</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
          </Select>
        </FormControl>

        {/* Created At */}
        <TextField
          sx={styles.formControl}
          label="Created at"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.created_at}
          onChange={(e) => handleChange("created_at", e.target.value)}
        />

        {/* Reset Button */}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewFilterCard;
