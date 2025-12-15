// // components/HeroImage.tsx
// import React from "react";
// import { Box } from "@mui/material";

// interface HeroImageProps {
//   imageUrl: string;
// }

// const HeroImage: React.FC<HeroImageProps> = ({ imageUrl }) => {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         // 16:9 aspect ratio
//         pt: "33.33%", // padding-top = height / width * 100%
//         backgroundImage: `url(${imageUrl})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         mb: 6, // optional spacing below
//       }}
//     />
//   );
// };

// export default HeroImage;

// components/HeroImage.tsx
import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

interface HeroImageProps {
  imageUrl: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ imageUrl }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // small screens

  return (
    <Box
      sx={{
        width: "100%",
        pt: isMobile ? "100%" : "33.33%", // 1:1 for mobile, 16:9 otherwise
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // mb: 6,
      }}
    />
  );
};

export default HeroImage;
