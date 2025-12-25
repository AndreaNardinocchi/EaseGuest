// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
//   Typography,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import type { Room } from "../../types/interfaces";

// interface BookingsFilterProps {
//   filters: any;
//   setFilters: (f: any) => void;
//   rooms: Room[];
// }

// const BookingsFilter = ({
//   filters,
//   setFilters,
//   rooms,
// }: BookingsFilterProps) => {
//   return (
//     // <Box
//     //   sx={{
//     //     display: "flex",
//     //     flexWrap: "wrap",
//     //     gap: 2,
//     //     mb: 3,
//     //     p: 2,
//     //     borderRadius: 2,
//     //     boxShadow: 3,
//     //     backgroundColor: "#ffffff",
//     //     padding: "3%",

//     //     // Make children stack nicely on mobile
//     //     "& > *": {
//     //       width: {
//     //         xs: "100%", // full width on phones
//     //         sm: "48%", // two per row on small tablets
//     //         md: "auto", // normal sizing on desktop
//     //       },
//     //       flexGrow: { md: 0 },
//     //     },
//     //   }}
//     // >
//     //   <Box sx={{ fontSize: 18, fontWeight: 600, mb: 1 }}> Booking Filters </Box>

//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 2,
//         mb: 3,
//         p: 2,
//         borderRadius: 2,
//         boxShadow: 3,
//         backgroundColor: "#ffffff",
//         padding: "3%",
//         "& > *": {
//           width: { xs: "100%", sm: "48%", md: "auto" },
//           flexGrow: { md: 0 },
//         },
//       }}
//     >
//       {/* HEADER — override width rules */}
//       <Box sx={{ width: "100%", fontWeight: "bold", fontSize: "0.9rem" }}>
//         {" "}
//         Booking Filters{" "}
//       </Box>

//       <TextField
//         label="Search all fields"
//         value={filters.search}
//         onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//       />

//       {/* <Select
//         value={filters.room}
//         onChange={(e) => setFilters({ ...filters, room: e.target.value })}
//         displayEmpty
//       >
//         <MenuItem value="">All Rooms</MenuItem>
//         {rooms.map((r) => (
//           <MenuItem key={r.id} value={r.id}>
//             {r.name}
//           </MenuItem>
//         ))}
//       </Select> */}

//       <FormControl>
//         <InputLabel>Room</InputLabel>
//         <Select
//           value={filters.room}
//           label="Room"
//           onChange={(e) => setFilters({ ...filters, room: e.target.value })}
//           sx={{ minWidth: 250 }}
//         >
//           <MenuItem value="">All Rooms</MenuItem>
//           {rooms.map((r) => (
//             <MenuItem key={r.id} value={r.id}>
//               {r.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <TextField
//         label="First Name"
//         value={filters.first_name}
//         onChange={(e) => setFilters({ ...filters, first_name: e.target.value })}
//       />

//       <TextField
//         label="Last Name"
//         value={filters.last_name}
//         onChange={(e) => setFilters({ ...filters, last_name: e.target.value })}
//       />

//       <TextField
//         label="Email"
//         value={filters.email}
//         onChange={(e) => setFilters({ ...filters, email: e.target.value })}
//       />

//       <FormControl>
//         <InputLabel>Guests</InputLabel>
//         <Select
//           value={filters.guests}
//           label="Guests"
//           onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
//           sx={{ minWidth: 130 }}
//         >
//           <MenuItem value="">All Guests</MenuItem>
//           <MenuItem value="1">1 Guest</MenuItem>
//           <MenuItem value="2">2 Guests</MenuItem>
//           <MenuItem value="3">3 Guests</MenuItem>
//           <MenuItem value="4">4 Guests</MenuItem>
//         </Select>
//       </FormControl>

//       <TextField
//         label="Check in"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         value={filters.check_in}
//         onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
//       />

//       <TextField
//         label="Check out"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         value={filters.check_out}
//         onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
//       />

//       <TextField
//         label="Created at"
//         type="date"
//         InputLabelProps={{ shrink: true }}
//         value={filters.created_at}
//         onChange={(e) => setFilters({ ...filters, created_at: e.target.value })}
//       />

//       <Button
//         variant="outlined"
//         onClick={() =>
//           setFilters({
//             search: "",
//             room: "",
//             first_name: "",
//             last_name: "",
//             email: "",
//             guests: "",
//             check_in: "",
//             check_out: "",
//             created_at: "",
//           })
//         }
//         sx={{
//           width: {
//             xs: "100%", // full width reset button on mobile
//             sm: "48%",
//             md: "auto",
//           },
//         }}
//       >
//         Reset
//       </Button>
//     </Box>
//   );
// };

// export default BookingsFilter;

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

interface FilterBookingsCardProps {
  filters: {
    search: string;
    room: string;
    first_name: string;
    last_name: string;
    email: string;
    guests: string;
    check_in: string;
    check_out: string;
    created_at: string;
  };
  setFilters: (filters: any) => void;
  rooms: { id: string; name: string }[];
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

const FilterBookingsCard: React.FC<FilterBookingsCardProps> = ({
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
      room: "",
      first_name: "",
      last_name: "",
      email: "",
      guests: "",
      check_in: "",
      check_out: "",
      created_at: "",
    });
  };

  return (
    <Card sx={styles.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          <FilterAltIcon fontSize="large" /> Booking Filters
        </Typography>

        {/* Search */}
        <TextField
          sx={styles.formControl}
          label="Search all fields"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* Room */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Room</InputLabel>
          <Select
            label="Room"
            value={filters.room}
            onChange={(e) => handleChange("room", e.target.value)}
          >
            <MenuItem value="">All Rooms</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* First Name */}
        <TextField
          sx={styles.formControl}
          label="First Name"
          value={filters.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        {/* Last Name */}
        <TextField
          sx={styles.formControl}
          label="Last Name"
          value={filters.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        {/* Email */}
        <TextField
          sx={styles.formControl}
          label="Email"
          value={filters.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* Guests */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Guests</InputLabel>
          <Select
            label="Guests"
            value={filters.guests}
            onChange={(e) => handleChange("guests", e.target.value)}
          >
            <MenuItem value="">All Guests</MenuItem>
            <MenuItem value="1">1 Guest</MenuItem>
            <MenuItem value="2">2 Guests</MenuItem>
            <MenuItem value="3">3 Guests</MenuItem>
            <MenuItem value="4">4 Guests</MenuItem>
          </Select>
        </FormControl>

        {/* Check-in */}
        <TextField
          sx={styles.formControl}
          label="Check-in"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.check_in}
          onChange={(e) => handleChange("check_in", e.target.value)}
        />

        {/* Check-out */}
        <TextField
          sx={styles.formControl}
          label="Check-out"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.check_out}
          onChange={(e) => handleChange("check_out", e.target.value)}
        />

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

export default FilterBookingsCard;
