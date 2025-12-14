import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import BookingForm from "../components/bookingForm/bookingForm";
import StickyBox from "../components/stickyComp/stickyComp";
import HeroImage from "../components/HeroImage/HeroImage";
import ThreeCardComponent from "../components/homepageThreeCards/homePageThreeCards";
import ExperienceCarousel from "../components/ExperienceCarousel/ExperienceCarousel";

const rooms = [
  {
    id: 1,
    name: "Room 101",
    description: "Cozy single room with all essentials and a great view.",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e8c0d0e3b8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Room 102",
    description: "Spacious double room with modern amenities and balcony.",
    image:
      "https://images.unsplash.com/photo-1560448070-5cbdac6eaa7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Room 103",
    description: "Deluxe suite with king‑sized bed and luxurious bathroom.",
    image:
      "https://images.unsplash.com/photo-1551918120-973ff7851f76?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Room 104",
    description:
      "Family room with two double beds, smart TV and lots of space.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Room 105",
    description:
      "Executive corner room with dedicated work desk and city‑skyline view. iiiiiiiiiiiiiiii",
    image:
      "https://images.unsplash.com/photo-1551906993244-0a1a995fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Room 106",
    description:
      "Penthouse suite with private terrace, lounge area and premium finishes.",
    image:
      "https://images.unsplash.com/photo-1541717854-c0717ffb4328?auto=format&fit=crop&w=800&q=80",
  },
];

const experiences = [
  {
    id: 1,
    title: "Explore Nature Trails",
    description: "Beautiful paths perfect for walking, hiking, or cycling.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Relax by the Sea",
    description: "A short walk takes you to scenic coastal views and beaches.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
];

const HomePage: React.FC = () => {
  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    // document.title = `${t("login")} | MoviesApp`;
    document.title = `Welcome to GuestEase | Have a nice stay!`;
    //   }, [t]);
  });
  return (
    <>
      <HeroImage imageUrl="/assets/brigidshaven1.png" />

      <Container maxWidth="lg">
        <Box textAlign="center" mb={5} sx={{ mt: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to GuestEase
          </Typography>

          <Typography variant="h5" color="textSecondary" paragraph>
            Your comfort is our priority. Nestled in a peaceful location, our
            guesthouse offers cozy rooms, friendly service, and a relaxing
            atmosphere.
          </Typography>
        </Box>
      </Container>

      {/* Sticky box below nav */}
      <StickyBox>
        <BookingForm />
      </StickyBox>

      {/* Main content container */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h2" gutterBottom>
            Enjoy your stay
          </Typography>

          <Typography variant="body1" paragraph>
            Whether you're traveling for business or pleasure, GuestEase ensures
            a pleasant stay with clean, well-equipped rooms, fast Wi-Fi, and
            complimentary breakfast. Choose from a range of room options and
            enjoy facilities designed for your convenience.
          </Typography>
        </Box>
        <ThreeCardComponent />

        <Box mb={6} sx={{ mt: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Why Choose GuestEase?
          </Typography>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            ✓ Comfortable and clean accommodations
            <br />
            ✓ Fast and free Wi-Fi
            <br />
            ✓ Central location with easy access
            <br />
            ✓ Friendly and attentive staff
            <br />
            ✓ Affordable rates with flexible booking
            <br />
          </p>
        </Box>

        <Typography variant="h4" align="center" sx={{ mt: 6 }}>
          Experiences Around Us
        </Typography>

        <ExperienceCarousel experiences={experiences} />

        {/* Experience Cards Section */}
        <Box mb={8}>
          <Typography
            variant="h4"
            align="center"
            sx={{ mt: 6, mb: 4 }}
            gutterBottom
          >
            Your Experience
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Complimentary Breakfast */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 400, // fixed height
                  width: "100%", // fills the column
                  maxWidth: 560, // optional: ensures cards don’t stretch
                  margin: "0 auto", // centers in column
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80"
                  alt="Complimentary Breakfast"
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    Complimentary Breakfast
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitLineClamp: 4, // limits text lines
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Enjoy a fresh homemade breakfast with pastries, cereals, hot
                    dishes, and locally sourced ingredients to start your day
                    perfectly.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Snacks */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 400,
                  width: "100%",
                  maxWidth: 560,
                  margin: "0 auto",
                }}
              >
                <CardMedia
                  component="img"
                  image="https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80"
                  alt="Snacks & Refreshments"
                  sx={{ height: 200, objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    Snacks & Refreshments
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitLineClamp: 4, // limits text lines
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Enjoy complimentary snacks, coffee, tea, and refreshing
                    drinks available throughout the day for your comfort.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* Footer Intro Section */}
        {/* Pre-Footer Section */}
        <Box
          sx={{
            mt: 8,
            mb: 12,
            py: 6,
            bgcolor: "background.paper",
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderRadius: 2,
          }}
        >
          {/* Placeholder Logo */}
          <Box
            component="img"
            src="https://via.placeholder.com/120x60?text=Logo" // placeholder logo
            alt="GuestEase"
            sx={{ width: 120, height: "auto" }}
          />

          {/* Tagline / Intro */}
          <Typography variant="h6" color="text.primary" gutterBottom>
            Comfort, Convenience, and Care
          </Typography>

          <Typography variant="body2" color="text.secondary" maxWidth={600}>
            At GuestEase, we make sure every stay feels like home. Enjoy cozy
            rooms, complimentary breakfast, and curated experiences around our
            guesthouse.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
