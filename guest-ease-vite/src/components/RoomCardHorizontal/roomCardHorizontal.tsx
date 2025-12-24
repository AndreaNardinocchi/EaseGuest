import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { supabase } from "../../supabaseClient";
import { calculateAverageRating } from "../../utils/calculateAverageRating";
import type { Review } from "../../types/interfaces";
import BookingCardImageCarousel from "../BookingCardImageCarousel/BookingCardImageCarousel";

type RoomCardHorizontalProps = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  amenities?: string[];
  checkIn: string;
  checkOut: string;
  guests: number;
  capacity: number; // <-- ADD THIS
  reviews?: Review[];
};

const RoomCardHorizontal: React.FC<RoomCardHorizontalProps> = ({
  id,
  name,
  description,
  price,
  images,
  amenities,
  checkIn,
  checkOut,
  guests,
  capacity,
  reviews,
}) => {
  const location = useLocation();

  const avgRating = calculateAverageRating(reviews);
  console.log("Total ratings: ", reviews);

  const queryString = `?checkIn=${encodeURIComponent(
    checkIn
  )}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`;

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }
  console.log("RoomCard props:", { price, capacity });

  const normalizedImages = Array.isArray(images)
    ? images.map((img: string) => getPublicUrl(img))
    : typeof images === "string"
    ? JSON.parse(images).map((img: string) => getPublicUrl(img))
    : [];

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "auto", md: 330 },
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ width: { xs: "100%", md: 500 }, flexShrink: 0 }}>
        <BookingCardImageCarousel images={normalizedImages} />
      </Box>

      {/* LEFT CONTENT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: 500 },
          flexShrink: 0,
          order: { xs: 1, md: 0 }, // content second on mobile, first on desktop
        }}
      >
        <CardContent sx={{ flexGrow: 1, padding: "20px", overflow: "hidden" }}>
          <Typography
            variant="h6"
            gutterBottom
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {reviews && reviews.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                ★ {avgRating} ({reviews.length}{" "}
                {reviews.length > 1 ? (
                  <span>reviews</span>
                ) : (
                  <span>review</span>
                )}
                ){/* ({reviews?.length ?? 0}) */}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet
                {/* ({reviews?.length ?? 0}) */}
              </Typography>
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              mt: 1,
            }}
          >
            {description || "A comfortable room for your stay."}
          </Typography>

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
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  {amenity}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 2 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Grid item xs="auto">
              {price !== undefined && capacity != null && (
                <Typography
                  variant="body2"
                  // color="primary"
                  sx={{
                    // fontWeight: "bold",
                    whiteSpace: "nowrap",
                    fontSize: "1.1rem",
                    paddingBottom: "3%",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{price}</span>
                  <span style={{ fontSize: "0.7rem" }}> Euro / night</span> ·
                  guests {capacity}{" "}
                  <span style={{ fontSize: "0.7rem" }}>(max)</span>
                </Typography>
              )}
            </Grid>
            <Grid item xs="auto">
              <Typography
                // fullWidth
                variant="body2"
                color="text.secondary"
                component={Link}
                to={`/room/${id}${queryString}`}
                state={{ checkIn, checkOut, guests }}
                sx={{
                  textDecoration: "none",
                  color: "#000000de",
                  fontWeight: "bold",
                }}
              >
                View Details →
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
      </Box>
    </Card>
  );
};

export default RoomCardHorizontal;
