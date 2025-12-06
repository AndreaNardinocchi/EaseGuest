// import React from "react";
// import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

// type ExperienceCardProps = {
//   title: string;
//   description: string;
//   image: string;
// };

// const ExperienceCardHorizontal: React.FC<ExperienceCardProps> = ({
//   title,
//   description,
//   image,
// }) => {
//   const cardHeight = 350;
//   const contentWidth = 400;

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", sm: "row" },
//         height: { xs: "auto", sm: cardHeight },
//         transition: "transform 0.2s, box-shadow 0.2s",
//         minWidth: { xs: "90%", sm: "70%", md: "55%" },
//         flexShrink: 0,
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: 6,
//         },
//       }}
//     >
//       {/* Image */}
//       <CardMedia
//         component="img"
//         image={image}
//         alt={title}
//         sx={{
//           width: { xs: "100%", sm: 500 },
//           height: { xs: 200, sm: "100%" },
//           objectFit: "cover",
//         }}
//       />

//       {/* Content */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           width: { xs: "100%", sm: contentWidth },
//           flexShrink: 0,
//         }}
//       >
//         <CardContent sx={{ flexGrow: 1, padding: "20px", overflow: "hidden" }}>
//           <Typography variant="h6" gutterBottom noWrap>
//             {title}
//           </Typography>

//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{
//               display: "-webkit-box",
//               overflow: "hidden",
//               WebkitLineClamp: 3,
//               WebkitBoxOrient: "vertical",
//             }}
//           >
//             {description}
//           </Typography>
//         </CardContent>
//       </Box>
//     </Card>
//   );
// };

// export default ExperienceCardHorizontal;

// import React from "react";
// import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

// type ExperienceCardProps = {
//   title: string;
//   description: string;
//   image: string;
// };

// const ExperienceCardHorizontal: React.FC<ExperienceCardProps> = ({
//   title,
//   description,
//   image,
// }) => {
//   const cardHeight = 350;

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", sm: "row" },
//         width: "100%",
//         maxWidth: "1200px",
//         height: { xs: "auto", sm: cardHeight },
//         mx: "auto",
//         boxShadow: 4,
//         transition: "transform 0.2s, box-shadow 0.2s",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: 6,
//         },
//       }}
//     >
//       {/* Left image */}
//       <CardMedia
//         component="img"
//         image={image}
//         alt={title}
//         sx={{
//           width: { xs: "100%", sm: "50%" },
//           height: { xs: 220, sm: "100%" },
//           objectFit: "cover",
//         }}
//       />

//       {/* Right content */}
//       <Box
//         sx={{
//           width: { xs: "100%", sm: "50%" },
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <CardContent sx={{ padding: "24px", flexGrow: 1 }}>
//           <Typography variant="h5" gutterBottom noWrap>
//             {title}
//           </Typography>

//           <Typography
//             variant="body1"
//             color="text.secondary"
//             sx={{
//               display: "-webkit-box",
//               overflow: "hidden",
//               WebkitLineClamp: 4,
//               WebkitBoxOrient: "vertical",
//             }}
//           >
//             {description}
//           </Typography>
//         </CardContent>
//       </Box>
//     </Card>
//   );
// };

// export default ExperienceCardHorizontal;

import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

type ExperienceCardProps = {
  title: string;
  description: string;
  image: string;
};

const ExperienceCardHorizontal: React.FC<ExperienceCardProps> = ({
  title,
  description,
  image,
}) => {
  const cardHeight = 350;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        width: "100%", // FULL WIDTH
        height: { xs: "auto", sm: cardHeight },
        boxShadow: 4,
      }}
    >
      {/* LEFT IMAGE */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: { xs: "100%", sm: "50%" },
          height: { xs: 220, sm: "100%" },
          objectFit: "cover",
        }}
      />

      {/* RIGHT CONTENT */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ padding: "24px", flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom noWrap>
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ExperienceCardHorizontal;
