// import React from "react";
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Stack,
//   Button,
//   Link as MuiLink,
//   Grid,
//   Divider,
// } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// interface BookingCardProps {
//   booking: any;
//   room: any;
//   type: "upcoming" | "past";
//   handleUpdate: (booking: any) => void;
//   handleCancel: (booking: any) => void;
//   handleReview: (id: string) => void;
// }

// const BookingCard: React.FC<BookingCardProps> = ({
//   booking,
//   room,
//   type,
//   handleUpdate,
//   handleCancel,
//   handleReview,
// }) => {
//   // console.log("Room price:", room.price);
//   const totalNights =
//     (new Date(booking.check_out).getTime() -
//       new Date(booking.check_in).getTime()) /
//     (1000 * 60 * 60 * 24);

//   console.log("Booking:", booking);

//   const totalPrice = booking.total_price ? Number(booking.total_price) : 0;

//   function getPublicUrl(path: string) {
//     return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
//   }

//   return (
//     <Card
//       elevation={4}
//       sx={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         borderRadius: 3,
//         overflow: "hidden",
//       }}
//     >
//       <CardMedia
//         component="img"
//         image={
//           room?.images && room.images.length > 0
//             ? getPublicUrl(room.images[0])
//             : "https://via.placeholder.com/400x200?text=Room"
//         }
//         alt={room?.name || "Room"}
//         sx={{
//           height: 200,
//           objectFit: "cover",
//         }}
//       />

//       <CardContent
//         sx={{
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//           padding: "7%",
//         }}
//       >
//         <Typography variant="h6" sx={{ color: "#472d30", fontWeight: "bold" }}>
//           <MuiLink
//             component={RouterLink}
//             to={`/room/${booking.room_id}`}
//             sx={{
//               textDecoration: "none",
//               color: "#472d30",
//               "&:hover": { color: "#EFF5E0" },
//             }}
//           >
//             Room: {room?.name || `Room ${booking.room_id.slice(0, 6)}`}
//           </MuiLink>
//         </Typography>
//         <Divider
//           sx={{
//             borderColor: "#ccc", // line color
//             borderBottomWidth: 1, // thickness
//             width: "70%", // ensure full width
//             my: 1.5, // space below
//             mx: "auto",
//           }}
//         />
//         <Grid container spacing={{ xs: 0, sm: 2 }}>
//           {/* LEFT COLUMN — IMAGE * */}

//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               width: {
//                 xs: "100%", // full width on mobile
//                 sm: "100%", // slightly smaller on small tablets
//                 md: "45%", // back to full width on desktop
//                 lg: "45%", // adjust for large screens
//               },
//             }}
//           >
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Reservation:</strong>
//               <MuiLink
//                 component={RouterLink}
//                 to={`/booking-confirmation/${booking.id}`}
//                 sx={{
//                   textDecoration: "none",
//                   color: "#472d30",
//                   "&:hover": {
//                     // textDecoration: "underline",
//                     color: "#EFF5E0",
//                   },
//                 }}
//               >
//                 {" "}
//                 #{booking.id.slice(-12)}
//               </MuiLink>
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Check-in: </strong>
//               {booking.check_in}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Check-out: </strong> {booking.check_out}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Guests:</strong> {booking.guests}
//             </Typography>
//           </Grid>
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               width: {
//                 xs: "100%", // full width on mobile
//                 sm: "100%", // slightly smaller on small tablets
//                 md: "45%", // back to full width on desktop
//                 lg: "45%", // adjust for large screens
//               },
//             }}
//           >
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               {/* <strong>Price:</strong> €{room.price.toFixed(2)} */}
//               <strong>Price:</strong> €{room?.price?.toFixed(2) ?? "—"}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Total nights:</strong> {totalNights}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ fontSize: "0.8rem" }}
//             >
//               <strong>Total price:</strong> €{totalPrice.toFixed(2)}
//             </Typography>
//           </Grid>
//         </Grid>
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{ mt: 1, fontSize: "0.8rem" }}
//         >
//           Booked on: {new Date(booking.created_at || "").toLocaleDateString()}
//         </Typography>

//         <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
//           {type === "upcoming" ? (
//             <>
//               <Button
//                 variant="contained"
//                 onClick={() => handleUpdate(booking)}
//                 fullWidth
//                 sx={{
//                   backgroundColor: "#472d30",
//                   color: "#fff",
//                   "&:hover": { backgroundColor: "#EFF5E0", color: "#472d30" },
//                 }}
//               >
//                 Update
//               </Button>

//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={() => handleCancel(booking)}
//                 fullWidth
//               >
//                 Cancel
//               </Button>
//             </>
//           ) : (
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#E26D5C",
//                 color: "#fff",
//                 "&:hover": { backgroundColor: "#c95b4d" },
//               }}
//               onClick={() => handleReview(booking.id!)}
//               fullWidth
//             >
//               Write Review
//             </Button>
//           )}
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default BookingCard;

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Button,
  Link as MuiLink,
  Grid,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { calculateNightsPrice } from "../../utils/calculateNightsPrice";

interface BookingCardProps {
  booking: any;
  room: any;
  type: "upcoming" | "past";
  handleUpdate: (booking: any) => void;
  handleCancel: (booking: any) => void;
  handleReview: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  room,
  type,
  handleUpdate,
  handleCancel,
  handleReview,
}) => {
  // Using the util calculateNightsPrice.ts
  const { nights: totalNights, total: totalPrice } = calculateNightsPrice(
    booking.check_in,
    booking.check_out,
    room?.price ?? 0
  );

  console.log("Booking:", booking);

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  return (
    <Card
      elevation={4}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={
          room?.images && room.images.length > 0
            ? getPublicUrl(room.images[0])
            : "https://via.placeholder.com/400x200?text=Room"
        }
        alt={room?.name || "Room"}
        sx={{
          height: 200,
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: "7%",
        }}
      >
        <Typography variant="h6" sx={{ color: "#472d30", fontWeight: "bold" }}>
          <MuiLink
            component={RouterLink}
            to={`/room/${booking.room_id}`}
            sx={{
              textDecoration: "none",
              color: "#472d30",
              "&:hover": { color: "#EFF5E0" },
            }}
          >
            Room: {room?.name || `Room ${booking.room_id.slice(0, 6)}`}
          </MuiLink>
        </Typography>
        <Divider
          sx={{
            borderColor: "#ccc",
            borderBottomWidth: 1,
            width: "70%",
            my: 1.5,
            mx: "auto",
          }}
        />
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "45%",
                lg: "45%",
              },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Reservation:</strong>
              <MuiLink
                component={RouterLink}
                to={`/booking-confirmation/${booking.id}`}
                sx={{
                  textDecoration: "none",
                  color: "#472d30",
                  "&:hover": { color: "#EFF5E0" },
                }}
              >
                {" "}
                #{booking.id.slice(-12)}
              </MuiLink>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Check-in: </strong>
              {booking.check_in}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Check-out: </strong> {booking.check_out}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Guests:</strong> {booking.guests}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "45%",
                lg: "45%",
              },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Price:</strong> €{room?.price?.toFixed(2) ?? "—"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Total nights:</strong> {totalNights}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Total price:</strong> €{totalPrice.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontSize: "0.8rem" }}
        >
          Booked on: {new Date(booking.created_at || "").toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
          {type === "upcoming" ? (
            <>
              <Button
                variant="contained"
                onClick={() => handleUpdate(booking)}
                fullWidth
                sx={{
                  backgroundColor: "#472d30",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#EFF5E0", color: "#472d30" },
                }}
              >
                Update
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCancel(booking)}
                fullWidth
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#E26D5C",
                color: "#fff",
                "&:hover": { backgroundColor: "#c95b4d" },
              }}
              onClick={() => handleReview(booking.id!)}
              fullWidth
            >
              Write Review
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
