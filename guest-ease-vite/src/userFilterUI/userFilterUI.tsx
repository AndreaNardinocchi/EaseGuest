import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import UserFilterCard from "../components/filters/userFilterCard";

interface UserFilterUIProps {
  filters: any;
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

const UserFilterUI: React.FC<UserFilterUIProps> = ({ filters, setFilters }) => {
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
          <UserFilterCard filters={filters} setFilters={setFilters} />
        </Box>
      </Drawer>
    </>
  );
};

export default UserFilterUI;
