import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ExperienceCardHorizontal from "../ExperienceCardHorizontal/ExperienceCardHorizontal";

type Experience = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const ExperienceCarousel = ({ experiences }: { experiences: Experience[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (direction: "next" | "prev") => {
    let newIndex = currentIndex;

    if (direction === "next" && currentIndex < experiences.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative", my: 4, width: "100%" }}>
      {/* LEFT ARROW */}
      {currentIndex > 0 && (
        <IconButton
          onClick={() => goTo("prev")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/* 📌 SCROLL CONTAINER */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* 📌 HERE IS THE BLOCK YOU ARE ASKING ABOUT */}
        {experiences.map((exp) => (
          <Box
            key={exp.id}
            sx={{
              width: "100%", // FULL WIDTH SLIDE
              flexShrink: 0, // PREVENT SHRINKING
            }}
          >
            <ExperienceCardHorizontal
              title={exp.title}
              description={exp.description}
              image={exp.image}
            />
          </Box>
        ))}
      </Box>

      {/* RIGHT ARROW */}
      {currentIndex < experiences.length - 1 && (
        <IconButton
          onClick={() => goTo("next")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ExperienceCarousel;
