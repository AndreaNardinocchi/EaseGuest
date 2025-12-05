// import React from "react";
// import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

// interface CardItem {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// const cards: CardItem[] = [
//   {
//     id: 1,
//     title: "Card One",
//     description: "This is the description for card one.",
//     image: "/assets/brigidshaven1.png",
//   },
//   {
//     id: 2,
//     title: "Card Two",
//     description: "This is the description for card two.",
//     image: "/assets/brigidshaven1.png",
//   },
//   {
//     id: 3,
//     title: "Card Three",
//     description: "This is the description for card three.",
//     image: "/assets/brigidshaven1.png",
//   },
// ];

// const ThreeCardComponent: React.FC = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         flexWrap: "wrap",
//         mt: 4,
//         width: "100%", // ensure container uses full width
//         maxWidth: "1200px", // optional max width
//         margin: "0 auto", // center horizontally
//         gap: "16px", // space between cards
//       }}
//     >
//       {cards.map((card) => (
//         <Card
//           key={card.id}
//           sx={{
//             flex: "0 0 calc(33.333% - 16px)", // 3 cards per row with gap accounted
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <CardMedia
//             component="img"
//             image={card.image}
//             alt={card.title}
//             sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
//           />
//           <CardContent>
//             <Typography variant="h6" component="h3" gutterBottom>
//               {card.title}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {card.description}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default ThreeCardComponent;

import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

interface CardItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const cards: CardItem[] = [
  {
    id: 1,
    title: "Card One",
    description: "This is the description for card one.",
    image: "/assets/brigidshaven1.png",
  },
  {
    id: 2,
    title: "Card Two",
    description: "This is the description for card two.",
    image: "/assets/brigidshaven1.png",
  },
  {
    id: 3,
    title: "Card Three",
    description: "This is the description for card three.",
    image: "/assets/brigidshaven1.png",
  },
];

const ThreeCardComponent: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        mt: 4,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        gap: 2, // 16px gap
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          sx={{
            flex: {
              xs: "0 0 100%", // 1 per row on mobile
              sm: "0 0 calc(50% - 16px)", // 2 per row on small screens
              md: "0 0 calc(33.333% - 16px)", // 3 per row on md+
            },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            image={card.image}
            alt={card.title}
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
            }}
          />
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              {card.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {card.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ThreeCardComponent;
