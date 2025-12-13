import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type RoomCardHorizontalProps = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  amenities?: string[];
};

const RoomCardHorizontal: React.FC<RoomCardHorizontalProps> = ({
  id,
  name,
  description,
  price,
  images,
  amenities,
}) => {
  const cardHeight = 350; // fixed height
  const contentWidth = 400; // fixed content width

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        height: cardHeight,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: contentWidth,
          flexShrink: 0,
        }}
      >
        <CardContent sx={{ flexGrow: 1, padding: "20px", overflow: "hidden" }}>
          <Typography variant="h6" gutterBottom noWrap>
            {name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description || "A comfortable room for your stay."}
          </Typography>

          {/* Amenities in 2 columns */}
          {amenities && amenities.length > 0 && (
            <Box
              component="ul"
              sx={{
                pl: 0,
                mt: 2,
                mb: 0,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 0.5,
                listStyle: "none",
              }}
            >
              {amenities.map((amenity, idx) => (
                <Box
                  component="li"
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircleIcon
                    fontSize="inherit"
                    sx={{ mr: 0.5, color: "primary.main" }}
                  />
                  {amenity}
                </Box>
              ))}
            </Box>
          )}

          {price !== undefined && (
            <Typography
              variant="h6"
              color="primary"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              €{price} / night
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            to={`/room/${id}`}
          >
            View Details
          </Button>
        </CardActions>
      </Box>

      {/* Right Image */}
      <CardMedia
        component="img"
        image={
          images && images.length > 0
            ? `/assets/${images[0]}`
            : "/assets/placeholder.png"
        }
        alt={name}
        sx={{
          width: 500, // image width
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Card>
  );
};

export default RoomCardHorizontal;
