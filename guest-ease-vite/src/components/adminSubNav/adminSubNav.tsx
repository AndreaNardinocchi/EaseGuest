import React from "react";
import { AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const AdminSubNav: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Users", path: "/admin/users" },
    { label: "Rooms", path: "/admin/rooms" },
    { label: "Reviews", path: "/admin/reviews" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ top: 80, backgroundColor: "#f5f5f5", zIndex: 1200 }}
    >
      <Toolbar sx={{ justifyContent: "center", gap: 4 }}>
        {links.map((link) => (
          <MuiLink
            key={link.path}
            component={Link}
            to={link.path}
            underline="none"
            color={
              location.pathname === link.path ? "#000000de" : "textPrimary"
            }
            sx={{
              textTransform: "none",
              fontWeight: location.pathname === link.path ? "bold" : "normal",
            }}
          >
            {link.label}
          </MuiLink>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default AdminSubNav;
