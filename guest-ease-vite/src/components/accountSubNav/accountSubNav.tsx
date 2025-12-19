// components/SubNav.tsx
import React from "react";
import { AppBar, Toolbar, Link as MuiLink } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const SubNav: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: "My Trips", path: "/account" },
    { label: "Profile", path: "/account/profile" },
    { label: "Favorites", path: "/account/favorites" },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
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

export default SubNav;
