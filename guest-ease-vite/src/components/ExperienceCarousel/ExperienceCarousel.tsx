// import React, { useRef } from "react";
// import {
//   Box,
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// interface Experience {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// const ExperienceCarousel = ({ experiences }: { experiences: Experience[] }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (dir: "left" | "right") => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left:
//           dir === "left"
//             ? -scrollRef.current.clientWidth * 0.9
//             : scrollRef.current.clientWidth * 0.9,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <Box sx={{ position: "relative", my: 4, px: "3%" }}>
//       {/* Left Arrow */}
//       <IconButton
//         onClick={() => scroll("left")}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: -10,
//           transform: "translateY(-50%)",
//           zIndex: 10,
//           bgcolor: "white",
//           boxShadow: 2,
//           "&:hover": { bgcolor: "grey.200" },
//         }}
//       >
//         <ArrowBackIosNewIcon />
//       </IconButton>

//       {/* SCROLL AREA */}
//       <Box
//         ref={scrollRef}
//         sx={{
//           display: "flex",
//           overflowX: "auto",
//           gap: 3,
//           scrollBehavior: "smooth",
//           "&::-webkit-scrollbar": { display: "none" },
//           py: 2,
//         }}
//       >
//         {experiences.map((exp) => (
//           <Card
//             key={exp.id}
//             sx={{
//               minWidth: { xs: "90%", sm: "70%", md: "55%" },
//               display: "flex",
//               flexDirection: "row",
//               borderRadius: 2,
//               overflow: "hidden",
//               flexShrink: 0,
//               boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
//             }}
//           >
//             {/* LEFT IMAGE */}
//             <CardMedia
//               component="img"
//               image={exp.image}
//               alt={exp.title}
//               sx={{
//                 width: "100%",
//                 objectFit: "cover",
//               }}
//             />

//             {/* RIGHT CONTENT */}
//             <CardContent
//               sx={{
//                 width: "55%",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography variant="h5" fontWeight="bold" gutterBottom>
//                 {exp.title}
//               </Typography>

//               <Typography variant="body1" color="text.secondary">
//                 {exp.description}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>

//       {/* Right Arrow */}
//       <IconButton
//         onClick={() => scroll("right")}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           right: -10,
//           transform: "translateY(-50%)",
//           zIndex: 10,
//           bgcolor: "white",
//           boxShadow: 2,
//           "&:hover": { bgcolor: "grey.200" },
//         }}
//       >
//         <ArrowForwardIosIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default ExperienceCarousel;

// import React, { useRef } from "react";
// import { Box, IconButton } from "@mui/material";

// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// import ExperienceCardHorizontal from "../ExperienceCardHorizontal/ExperienceCardHorizontal";

// type Experience = {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// };

// const ExperienceCarousel = ({ experiences }: { experiences: Experience[] }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const scroll = (dir: "left" | "right") => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: dir === "left" ? -450 : 450,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <Box sx={{ position: "relative", my: 4, px: "3%" }}>
//       {/* Left Arrow */}
//       <IconButton
//         onClick={() => scroll("left")}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: -10,
//           transform: "translateY(-50%)",
//           zIndex: 10,
//           bgcolor: "white",
//           boxShadow: 2,
//           "&:hover": { bgcolor: "grey.200" },
//         }}
//       >
//         <ArrowBackIosNewIcon />
//       </IconButton>

//       {/* Scrollable Area */}
//       <Box
//         ref={scrollRef}
//         sx={{
//           display: "flex",
//           overflowX: "auto",
//           gap: 3,
//           scrollBehavior: "smooth",
//           "&::-webkit-scrollbar": { display: "none" },
//           py: 2,
//         }}
//       >
//         {experiences.map((exp) => (
//           <ExperienceCardHorizontal
//             key={exp.id}
//             title={exp.title}
//             description={exp.description}
//             image={exp.image}
//           />
//         ))}
//       </Box>

//       {/* Right Arrow */}
//       <IconButton
//         onClick={() => scroll("right")}
//         sx={{
//           position: "absolute",
//           top: "50%",
//           right: -10,
//           transform: "translateY(-50%)",
//           zIndex: 10,
//           bgcolor: "white",
//           boxShadow: 2,
//           "&:hover": { bgcolor: "grey.200" },
//         }}
//       >
//         <ArrowForwardIosIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default ExperienceCarousel;

// import React, { useRef, useState } from "react";
// import { Box, IconButton } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// import ExperienceCardHorizontal from "./ExperienceCardHorizontal";

// type Experience = {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// };

// const ExperienceCarousel = ({ experiences }: { experiences: Experience[] }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goTo = (direction: "next" | "prev") => {
//     let newIndex = currentIndex;

//     if (direction === "next" && currentIndex < experiences.length - 1) {
//       newIndex = currentIndex + 1;
//     }

//     if (direction === "prev" && currentIndex > 0) {
//       newIndex = currentIndex - 1;
//     }

//     setCurrentIndex(newIndex);

//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         left: scrollRef.current.clientWidth * newIndex,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <Box sx={{ position: "relative", my: 4 }}>
//       {/* Left arrow */}
//       {currentIndex > 0 && (
//         <IconButton
//           onClick={() => goTo("prev")}
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: 10,
//             transform: "translateY(-50%)",
//             zIndex: 10,
//             bgcolor: "white",
//             boxShadow: 2,
//             "&:hover": { bgcolor: "grey.200" },
//           }}
//         >
//           <ArrowBackIosNewIcon />
//         </IconButton>
//       )}

//       {/* Slide container */}
//       <Box
//         ref={scrollRef}
//         sx={{
//           display: "flex",
//           overflow: "hidden",
//           scrollBehavior: "smooth",
//           width: "100%",
//         }}
//       >
//         {experiences.map((exp, i) => (
//           <Box
//             key={exp.id}
//             sx={{
//               flexShrink: 0,
//               width: "100%", // FULL WIDTH CARD
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             <ExperienceCardHorizontal
//               title={exp.title}
//               description={exp.description}
//               image={exp.image}
//             />
//           </Box>
//         ))}
//       </Box>

//       {/* Right arrow */}
//       {currentIndex < experiences.length - 1 && (
//         <IconButton
//           onClick={() => goTo("next")}
//           sx={{
//             position: "absolute",
//             top: "50%",
//             right: 10,
//             transform: "translateY(-50%)",
//             zIndex: 10,
//             bgcolor: "white",
//             boxShadow: 2,
//             "&:hover": { bgcolor: "grey.200" },
//           }}
//         >
//           <ArrowForwardIosIcon />
//         </IconButton>
//       )}
//     </Box>
//   );
// };

// export default ExperienceCarousel;

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
