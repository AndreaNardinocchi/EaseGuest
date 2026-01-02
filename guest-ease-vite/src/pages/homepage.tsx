import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import BookingForm from "../components/bookingForm/bookingForm";
import StickyBox from "../components/stickyComp/stickyComp";
import HeroImage from "../components/HeroImage/HeroImage";
import ThreeCardComponent from "../components/homepageThreeCards/homePageThreeCards";
import ExperienceCarousel from "../components/ExperienceCarousel/ExperienceCarousel";
import ResponsiveBookingWrapper from "../components/responsiveBookingWrapper/responsiveBookingWrapper";

const experiences = [
  {
    id: 1,
    title: "Explore Cliff Trails",
    description:
      "Beautiful paths perfect for hiking with a stunning view of the Atlantic Ocean.",
    image: "/assets/hiking-experience.jpg",
  },
  {
    id: 2,
    title: "Seaweed Soak, Sure Why Not",
    description:
      "Slip into a warm Atlantic seaweed bath and let the stress melt away. Pure Irish wellness, with a bit of salty magic.",
    image: "/assets/seaweed-bath.jpg",
  },
  {
    id: 3,
    title: "A Drop of the Good Stuff",
    description:
      "Taste local Irish whiskey and soak up the stories behind every sip. A relaxed, friendly way to connect with the coast and its culture.",
    image: "/assets/whiskey-tasting.jpg",
  },
  {
    id: 4,
    title: "Paddle Your Own Way",
    description:
      "Explore calm bays, hidden inlets, or open water at your own pace. Perfect for a gentle adventure and a fresh Atlantic breeze.",
    image: "/assets/kayaking-experience.jpg",
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
      <HeroImage imageUrl="/assets/BrigidsHavenRoom1.jpg" />

      <Box textAlign="center" sx={{ backgroundColor: "#EFF5E0" }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ pt: 5 }}>
            Welcome to GuestEase
          </Typography>

          <Typography
            variant="h5"
            color="textSecondary"
            paragraph
            sx={{ pb: 5, mb: 0 }}
          >
            Your comfort is our priority. Nestled in a peaceful location, our
            guesthouse offers cozy rooms, friendly service, and a relaxing
            atmosphere.
          </Typography>
        </Container>
      </Box>

      {/* Sticky box below nav */}
      <StickyBox>
        <ResponsiveBookingWrapper>
          <BookingForm />
        </ResponsiveBookingWrapper>
      </StickyBox>

      {/* Main content container */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h2" gutterBottom>
            Enjoy your stay
          </Typography>

          <Typography variant="body1" color="textSecondary">
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
                  height: 330, // fixed height
                  width: "100%", // fills the column
                  maxWidth: 560, // optional: ensures cards don’t stretch
                  margin: "0 auto", // centers in column
                }}
              >
                <CardMedia
                  component="img"
                  image="/assets/rich-and-abundant-irish-complimentary-breakfast-enjoy.jpg"
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
              </Card>
            </Grid>

            {/* Snacks */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 330,
                  width: "100%",
                  maxWidth: 560,
                  margin: "0 auto",
                }}
              >
                <CardMedia
                  component="img"
                  image="/assets/snacks-refreshments-enjoy-complimentary-snacks-coffee.jpg"
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
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions> */}
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
            src="/assets/GuestEaseLogo.png" // placeholder logo
            alt="GuestEase"
            sx={{ width: 80, height: "auto" }}
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
