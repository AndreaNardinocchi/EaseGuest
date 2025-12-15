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
  const cardHeight = 450;

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
          width: { xs: "100%", sm: "50%", lg: "100%" },
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
          paddingTop: { xs: "0%", sm: "13%", lg: "13%" },
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
