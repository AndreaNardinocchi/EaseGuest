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

interface UserFilterCardProps {
  filters: {
    search: string;
    email: string;
    first_name: string;
    last_name: string;
    country: string;
    // zip_code: string;
    role: string;
    created_at: string;
  };
  setFilters: (filters: any) => void;
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

const UserFilterCard: React.FC<UserFilterCardProps> = ({
  filters,
  setFilters,
}) => {
  const handleChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      email: "",
      first_name: "",
      last_name: "",
      country: "",
      //   zip_code: "",
      role: "",
      created_at: "",
    });
  };

  return (
    <Card sx={styles.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          <FilterAltIcon fontSize="large" /> User Filters
        </Typography>

        {/* Search */}
        <TextField
          sx={styles.formControl}
          label="Search all fields"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* Email */}
        <TextField
          sx={styles.formControl}
          label="Email"
          value={filters.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

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

        {/* Country */}
        <TextField
          sx={styles.formControl}
          label="Country"
          value={filters.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />

        {/* ZIP Code */}
        {/* <TextField
          sx={styles.formControl}
          label="ZIP Code"
          value={filters.zip_code}
          onChange={(e) => handleChange("zip_code", e.target.value)}
        /> */}

        {/* Role */}
        <FormControl sx={styles.formControl}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
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

export default UserFilterCard;
