import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import ReviewFilterCard from "../filters/reviewFilterCard";

interface ReviewFilterUIProps {
  filters: any;
  // bookings: any[]; // ✅ add this
  rooms: any[]; // ✅ add this
  setFilters: (filters: any) => void;
}

const styles = {
  fab: {
    position: "fixed",
    top: {
      xs: "80%",
      sm: "90%",
      md: "90%",
      lg: "90%",
    },
    right: "1%",
    bgcolor: "#e26d5c",
    color: "white",
    zIndex: 2000,
  },
};

const ReviewFilterUI: React.FC<ReviewFilterUIProps> = ({
  filters,
  // bookings,
  rooms,
  setFilters,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Fab
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          ...styles.fab,
          "&:hover": {
            bgcolor: "#ffe6f0",
            color: "#000",
          },
        }}
      >
        <FilterAltIcon />
      </Fab>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: {
              xs: "80vw",
              sm: "350px",
              md: "380px",
              lg: "400px",
            },

            p: 2,
          }}
        >
          <ReviewFilterCard
            filters={filters}
            setFilters={setFilters}
            // bookings={bookings}
            rooms={rooms}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default ReviewFilterUI;
