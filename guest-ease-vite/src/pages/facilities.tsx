import React, { useEffect } from "react";
import { Container, Typography, Box, Grid } from "@mui/material";

const FacilitiesPage: React.FC = () => {
  useEffect(() => {
    document.title = "Facilities | GuestEase";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 10 }}>
      {/* HERO */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Facilities
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", fontWeight: 300 }}
        >
          At GuestEase Guesthouse, we provide everything you need for a
          comfortable, relaxing, and convenient stay.
        </Typography>
      </Box>

      {/* FACILITIES LIST */}
      <Box mb={10}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Comfort & Convenience
        </Typography>

        <Grid
          container
          spacing={4}
          sx={{
            mt: 4,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {/* Left column */}
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography color="text.secondary">
                  Comfortable beds with fresh linens
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Private bathrooms with complimentary toiletries
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Heating and hot water throughout the year
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  High-speed Wi-Fi and desk setups
                </Typography>
              </li>
            </Box>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography color="text.secondary">
                  Complimentary breakfast daily
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Tea and coffee available for guests
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Luggage storage before check-in or after check-out
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Free on-site parking and easy access to local attractions
                </Typography>
              </li>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CLOSING */}
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Experience GuestEase
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Our facilities are designed to make your stay effortless and
          enjoyable. From cozy rooms to thoughtful amenities, we take care of
          the details so you can focus on relaxing and enjoying your time with
          us.
        </Typography>
      </Box>
    </Container>
  );
};

export default FacilitiesPage;
