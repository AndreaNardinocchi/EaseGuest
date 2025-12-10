// import React, { useState } from "react";
// import { Box, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// interface roomDetailsGalleryProps {
//   images: string[];
// }

// const roomDetailsGallery: React.FC<roomDetailsGalleryProps> = ({ images }) => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [modalOpen, setModalOpen] = useState(false);
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevImage = () => {
//     setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
//   };
//   const nextImage = () => {
//     setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "grid",
//           gap: 2,
//           gridTemplateColumns: {
//             xs: "repeat(2,1fr)",
//             sm: "repeat(2,1fr)",
//             md: "repeat(2,1fr)",
//           },
//         }}
//       >
//         {images.map((img, index) => (
//           <Box
//             key={index}
//             sx={{
//               width: "100%",
//               aspectRatio: "1/1",
//               cursor: "pointer",
//               borderRadius: 2,
//               overflow: "hidden",
//             }}
//             onClick={() => {
//               setCurrentIndex(index);
//               setModalOpen(true);
//             }}
//           >
//             <img
//               src={img}
//               alt={`Room ${index}`}
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           </Box>
//         ))}
//       </Box>

//       {modalOpen && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.85)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1500,
//           }}
//         >
//           <IconButton
//             onClick={() => setModalOpen(false)}
//             sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
//           >
//             <CloseIcon fontSize="large" />
//           </IconButton>

//           <IconButton
//             onClick={prevImage}
//             sx={{ position: "absolute", top: "50%", left: 20, color: "white" }}
//           >
//             <ArrowBackIosNewIcon fontSize="large" />
//           </IconButton>

//           <img
//             src={images[currentIndex]}
//             alt="Modal"
//             style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: 4 }}
//           />

//           <IconButton
//             onClick={nextImage}
//             sx={{ position: "absolute", top: "50%", right: 20, color: "white" }}
//           >
//             <ArrowForwardIosIcon fontSize="large" />
//           </IconButton>
//         </Box>
//       )}
//     </>
//   );
// };

// export default roomDetailsGallery;

// import React from "react";
// import { Grid, CardMedia } from "@mui/material";

// const RoomDetailsGallery = ({ images }: { images: string[] }) => {
//   return (
//     <Grid container spacing={2}>
//       {images.slice(0, 4).map((img, index) => (
//         <Grid item xs={6} key={index}>
//           <CardMedia
//             component="img"
//             image={img.startsWith("/") ? img : `/assets/${img}`}
//             alt={`Room image ${index + 1}`}
//             sx={{
//               width: "100%",
//               aspectRatio: "1 / 1", // <-- perfect square
//               borderRadius: 2,
//               objectFit: "cover",
//             }}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default RoomDetailsGallery;

// import React from "react";
// import { Grid, CardMedia } from "@mui/material";

// const RoomDetailsGallery = ({ images }: { images: string[] }) => {
//   return (
//     <Grid container spacing={2}>
//       {images.slice(0, 4).map((img, index) => (
//         <Grid item xs={6} sm={6} md={6} lg={6} key={index}>
//           <CardMedia
//             component="img"
//             image={img.startsWith("/") ? img : `/assets/${img}`}
//             alt={`Room image ${index + 1}`}
//             sx={{
//               width: "100%",
//               aspectRatio: "1 / 1",
//               borderRadius: 2,
//               objectFit: "cover",
//             }}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default RoomDetailsGallery;

import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const RoomImageCarousel = ({ images }: { images: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (direction: "next" | "prev") => {
    let newIndex = currentIndex;

    if (direction === "next" && currentIndex < images.length - 1) {
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
    <Box
      sx={{ position: "relative", width: "100%", overflow: "hidden", mb: 4 }}
    >
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
            bgcolor: "rgba(255,255,255,0.7)",
            boxShadow: 2,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/* SCROLL CONTAINER */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              width: "100%", // full width slide
              flexShrink: 0,
              height: { xs: "50vh", md: "70vh" },
              backgroundImage: `url(${
                img.startsWith("/") ? img : `/assets/${img}`
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </Box>

      {/* RIGHT ARROW */}
      {currentIndex < images.length - 1 && (
        <IconButton
          onClick={() => goTo("next")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.7)",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default RoomImageCarousel;
