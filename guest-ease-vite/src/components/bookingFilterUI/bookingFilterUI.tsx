import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterBookingsCard from "../filters/bookingFilters"; // your new card component
import { Box } from "@mui/material";

interface BookingFilterUIProps {
  filters: any;
  setFilters: (filters: any) => void;
  rooms: { id: string; name: string }[];
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

const BookingFilterUI: React.FC<BookingFilterUIProps> = ({
  filters,
  setFilters,
  rooms,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Filter Button */}
      <Fab
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          ...styles.fab,
          "&:hover": {
            bgcolor: "#EFF5E0",
            color: "#000000de",
          },
        }}
      >
        <FilterAltIcon />
        {/* Filters */}
      </Fab>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
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
            <FilterBookingsCard
              filters={filters}
              setFilters={setFilters}
              rooms={rooms}
            />
          </Box>
        </Drawer>
      </Drawer>
    </>
  );
};

export default BookingFilterUI;
