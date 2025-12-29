import React from "react";
import { Box, Grid, Typography, Link, Container, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "grey.900", color: "common.white", pt: 4 }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        <Grid
          container
          spacing={4}
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="stretch" // ensures all columns stretch to same height
        >
          {/* Left Column: Address */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: "100%", // stretch box to match tallest column
                textAlign: { md: "left" },
              }}
            >
              <Typography variant="h4" gutterBottom>
                Address
              </Typography>
              <Typography sx={{ fontSize: "1.3rem" }}>
                204 Dundanion,
                <br />
                Blackrock
                <br />
                Cork
                <br />
                Republic of Ireland
              </Typography>
            </Box>
          </Grid>

          {/* Middle Column: Projects */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: "100%", // stretch box
                textAlign: { md: "left" },
              }}
            >
              <Typography variant="h4" gutterBottom>
                Projects
              </Typography>
              {[
                {
                  label: "MoviesApp GitHub",
                  href: "https://github.com/AndreaNardinocchi/MoviesApp",
                },
                { label: "#instaPi", href: "https://instapi.glitch.me/" },
                {
                  label: "(Whether) Weather",
                  href: "https://whether-weather-an.netlify.app/",
                },
                {
                  label: "Weather Top App",
                  href: "https://evanescent-mercury-naranja.glitch.me/",
                },
                {
                  label: "CN Psychology",
                  href: "https://cinzianardinocchi.netlify.app/",
                },
                {
                  label: "PlaceMark",
                  href: "https://placemarkyourjourney.netlify.app/",
                },
              ].map((project) => (
                <Link
                  key={project.label}
                  href={project.href}
                  target="_blank"
                  rel="noopener"
                  color="inherit"
                  underline="hover"
                  display="block"
                >
                  <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                    {project.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Right Column: Logo */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "center" }, // center logo horizontally
                alignItems: "center", // center logo vertically
                height: "100%", // stretch to match other columns
              }}
            >
              <img
                src="/assets/GuestEaseLogo.png"
                alt="GuestEase logo"
                style={{
                  maxHeight: "200px", // or any value that fits your design
                  width: "auto",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ my: 0.01, borderColor: "grey.700" }} />

      <Box
        sx={{
          textAlign: "center",
          pb: 2,
          backgroundColor: "#363636",
        }}
      >
        <Box sx={{ height: 12, verticalAlign: "middle", mr: 1 }} />
        <Link
          component={RouterLink}
          to="/"
          rel="noopener"
          sx={{ color: "inherit" }}
        >
          <img
            src="/assets/GuestEaseLogo.svg"
            alt="GuestEase logo"
            style={{
              height: "25px",
              width: "auto",
              marginLeft: "2%",
              position: "relative",
              top: "10px", // move logo down visually without increasing Toolbar heigh
            }}
          />
        </Link>
        <Typography
          variant="body2"
          component="span"
          sx={{ color: "inherit", paddingLeft: 0.5 }}
        >
          | © {new Date().getFullYear()} GuestEase. All rights reserved.
        </Typography>
        <Link
          href="https://www.linkedin.com/in/andrea-nardinocchi-53084056/"
          target="_blank"
          rel="noopener"
          sx={{ color: "grey", ml: 0.5 }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#ebebeb" }}
          >
            Andrea Nardinocchi
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
