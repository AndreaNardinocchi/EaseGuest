import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = "About Us | GuestEase";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
      {/* HERO */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          About GuestEase
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", fontWeight: 300 }}
        >
          A thoughtful stay, rooted in Irish hospitality — designed for comfort,
          calm, and connection.
        </Typography>
      </Box>

      {/* INTRO */}
      <Grid container spacing={8} mb={10}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            A Place That Feels Right
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            At <strong>GuestEase</strong>, we believe a great stay is more than
            a bed for the night — it’s a feeling. A sense of welcome. A place
            where comfort, character, and care come together effortlessly.
          </Typography>
          <Typography color="text.secondary">
            Nestled in the heart of Ireland, GuestEase was created for
            travellers who value calm over clutter, warmth over extravagance,
            and experiences that feel genuinely personal.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            alt="GuestEase interior"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: 4,
            }}
          />
        </Grid>
      </Grid>

      {/* PHILOSOPHY */}
      <Box mb={10}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Our Philosophy
        </Typography>
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 900, mx: "auto", mb: 6 }}
        >
          We design every stay around one simple idea: <strong>ease</strong>.
          From seamless booking to thoughtfully curated rooms, we remove
          friction so you can focus on what matters — your journey, your people,
          and your time.
        </Typography>

        <Grid container spacing={6}>
          {[
            {
              title: "Comfort Without Compromise",
              text: "Premium beds, quiet spaces, and modern amenities that support true rest.",
            },
            {
              title: "Character With Purpose",
              text: "Irish-inspired design that feels authentic, never themed or forced.",
            },
            {
              title: "Service That Feels Human",
              text: "Attentive, warm, and never intrusive — just the right balance.",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ROOMS STORY */}
      <Grid container spacing={8} mb={10}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2c47"
            alt="GuestEase room"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 3,
              boxShadow: 4,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Rooms With a Story
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No two GuestEase rooms are the same — and that’s intentional.
          </Typography>
          <Typography color="text.secondary">
            Each space is designed with a distinct purpose in mind, whether it’s
            focused work, restorative rest, family connection, or indulgent
            escape. Natural textures, calming tones, and locally inspired
            details create spaces that feel grounded and restorative — not
            generic.
          </Typography>
        </Grid>
      </Grid>

      {/* MODERN TRAVELLERS */}
      <Box mb={10}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Designed for Modern Travellers
        </Typography>

        <Grid container spacing={6} sx={{ mt: 2 }}>
          {[
            "Remote workers seeking inspiring, functional spaces",
            "Couples looking for warmth, privacy, and atmosphere",
            "Families who value flexibility, space, and ease",
            "Explorers wanting a calm base between adventures",
          ].map((text) => (
            <Grid item xs={12} md={6} key={text}>
              <Typography color="text.secondary">• {text}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CLOSING */}
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Welcome to GuestEase
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Whether you’re staying for a night or settling in for longer, we’re
          delighted to host you. At GuestEase, you’re not just checking in —
          you’re arriving.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
