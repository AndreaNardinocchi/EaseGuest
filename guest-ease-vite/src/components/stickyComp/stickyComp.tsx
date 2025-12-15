import React from "react";
import { Box } from "@mui/material";

interface StickyNavigationBarProps {
  children: React.ReactNode;
}

const StickyBox: React.FC<StickyNavigationBarProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0, // stick to top of viewport
        left: 0,
        width: "100%",
        zIndex: 1200,
        backgroundColor: "#e26d5c",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Box maxWidth="md" mx="auto">
        {children}
      </Box>
    </Box>
  );
};

export default StickyBox;
