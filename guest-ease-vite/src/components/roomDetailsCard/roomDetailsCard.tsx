// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Grid,
// } from "@mui/material";

// interface roomDetailsProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (value: number) => void;
//   setCheckIn: (value: string) => void;
//   setCheckOut: (value: string) => void;
//   onBook: () => void;
// }

// const roomDetails: React.FC<roomDetailsProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Card sx={{ borderRadius: 2 }}>
//       <CardContent>
//         <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//           {room.name}
//         </Typography>
//         <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
//           {room.description || "A cozy room designed for your perfect stay."}
//         </Typography>

//         <Grid container spacing={2} sx={{ mt: 3 }}>
//           <Grid item xs={6}>
//             <Typography variant="body2" color="text.secondary">
//               Capacity:
//             </Typography>
//             <Typography variant="body1">
//               {room.capacity || "N/A"} guests
//             </Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography variant="body2" color="text.secondary">
//               Price:
//             </Typography>
//             <Typography variant="h6" color="primary">
//               €{room.price} / night
//             </Typography>
//           </Grid>
//         </Grid>

//         <Box sx={{ mt: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Check-in Date"
//                 type="date"
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Check-out Date"
//                 type="date"
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           </Grid>
//           <TextField
//             label="Guests"
//             type="number"
//             value={guests}
//             onChange={(e) => setGuests(Number(e.target.value))}
//             fullWidth
//             sx={{ mt: 2 }}
//             inputProps={{ min: 1 }}
//           />
//         </Box>

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 3 }}
//           onClick={onBook}
//         >
//           Pay & Book Now
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default roomDetails;

// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Grid,
// } from "@mui/material";

// const RoomDetailsCard = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }: any) => {
//   return (
//     <Card sx={{ borderRadius: 2 }}>
//       <CardContent>
//         <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//           {room.name}
//         </Typography>

//         <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
//           {room.description ||
//             "A cozy and comfortable room designed for your perfect stay."}
//         </Typography>

//         <Grid container spacing={2} sx={{ mt: 3 }}>
//           <Grid item xs={6}>
//             <Typography variant="body2" color="text.secondary">
//               Capacity:
//             </Typography>
//             <Typography variant="body1">
//               {room.capacity || "N/A"} guests
//             </Typography>
//           </Grid>

//           <Grid item xs={6}>
//             <Typography variant="body2" color="text.secondary">
//               Price:
//             </Typography>
//             <Typography variant="h6" color="primary">
//               €{room.price} / night
//             </Typography>
//           </Grid>
//         </Grid>

//         {/* Amenities */}
//         {room.amenities?.length > 0 && (
//           <Box sx={{ mt: 3 }}>
//             <Typography variant="body2" color="text.secondary">
//               Available Services:
//             </Typography>

//             <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
//               {room.amenities.map((item: string, idx: number) => (
//                 <li key={idx} style={{ fontSize: "0.95rem" }}>
//                   {item}
//                 </li>
//               ))}
//             </Box>
//           </Box>
//         )}

//         {/* Form */}
//         <Box sx={{ mt: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Check-in"
//                 type="date"
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Check-out"
//                 type="date"
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           </Grid>

//           <TextField
//             label="Guests"
//             type="number"
//             value={guests}
//             onChange={(e) => setGuests(Number(e.target.value))}
//             fullWidth
//             sx={{ mt: 2 }}
//             inputProps={{ min: 1 }}
//           />

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 3 }}
//             onClick={onBook}
//           >
//             Pay & Book Now
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RoomDetailsCard;

// import React from "react";
// import {
//   Box,
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   MenuItem,
// } from "@mui/material";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT: Check-in / Check-out */}
//         <Grid item xs={12} md={6}>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Check In"
//                 type="date"
//                 value={checkIn}
//                 onChange={(e) => setCheckIn(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Check Out"
//                 type="date"
//                 value={checkOut}
//                 onChange={(e) => setCheckOut(e.target.value)}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             {/* Guests and Book Button full width under dates */}
//             <Grid item xs={12}>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Guests"
//                     type="number"
//                     value={guests}
//                     onChange={(e) => setGuests(Number(e.target.value))}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     fullWidth
//                     sx={{ height: "100%" }}
//                     onClick={onBook}
//                   >
//                     Book Now
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* RIGHT: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ pl: { md: 2 }, borderLeft: { md: "1px solid #eee" } }}>
//             <Typography variant="h6" gutterBottom>
//               Available Services
//             </Typography>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <li key={idx}>{service}</li>
//               ))}
//             </ul>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom sx={{ mb: 8 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2} sx={{ flex: 1 }}>
//         {/* LEFT COLUMN */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between", // pushes check-in/out to bottom
//           }}
//         >
//           {/* Check-in / Check-out at the bottom */}
//           <Box>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Box>
//             {/* Guests field */}
//             <TextField
//               label="Guests"
//               type="number"
//               value={guests}
//               onChange={(e) => setGuests(Number(e.target.value))}
//               fullWidth
//               sx={{ mb: 2, mt: 2 }}
//             />

//             {/* Book button directly below guests */}
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mb: 2 }}
//               onClick={onBook}
//             >
//               Book Now
//             </Button>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ pl: { md: 2 }, borderLeft: { md: "1px solid #eee" } }}>
//             <Typography variant="h6" gutterBottom>
//               Available Services
//             </Typography>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <li key={idx}>{service}</li>
//               ))}
//             </ul>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void; // Will trigger Stripe
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2} sx={{ flex: 1 }}>
//         {/* LEFT COLUMN */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* Check-in / Check-out at the bottom */}
//           <Box sx={{ mt: 3, mb: 2 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           {/* Guests + Book button */}
//           <Box>
//             <TextField
//               label="Guests"
//               type="number"
//               value={guests}
//               onChange={(e) => setGuests(Number(e.target.value))}
//               fullWidth
//               sx={{ mb: 2 }}
//               inputProps={{ min: 1 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={onBook}
//             >
//               Book Now
//             </Button>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ pl: { md: 2 }, borderLeft: { md: "1px solid #eee" } }}>
//             <Typography variant="h6" gutterBottom>
//               Available Services
//             </Typography>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <li key={idx}>{service}</li>
//               ))}
//             </ul>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             {/* Check-in / Check-out at the top */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Guests + Book button below */}
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Guests"
//                 type="number"
//                 value={guests}
//                 onChange={(e) => setGuests(Number(e.target.value))}
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 inputProps={{ min: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={onBook}
//               >
//                 Book Now
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               width: "100%",
//               pl: { md: 35 }, // push amenities more to the right
//               // borderLeft: { md: "1px solid #eee" },
//               boxSizing: "border-box",
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               Available Services
//             </Typography>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <CheckCircleIcon
//                   fontSize="inherit"
//                   sx={{ mr: 0.5, color: "primary.main" }}
//                   key={idx}
//                 >
//                   {service}
//                 </CheckCircleIcon>
//               ))}
//             </ul>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             {/* Check-in / Check-out at the top */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Guests + Book button below */}
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Guests"
//                 type="number"
//                 value={guests}
//                 onChange={(e) => setGuests(Number(e.target.value))}
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 inputProps={{ min: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={onBook}
//               >
//                 Book Now
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               width: "100%",
//               pl: { md: 35 }, // cleaner spacing
//               boxSizing: "border-box",
//             }}
//           >
//             {/* <Typography variant="h5" gutterBottom sx={{ mt: 0 }}>
//               Available Services
//             </Typography> */}

//             {/* <Typography variant="subtitle1" gutterBottom sx={{ mt: 0 }}>
//               Available Services
//             </Typography> */}
//             {/* <Typography
//               variant="h6"
//               gutterBottom
//               sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
//             >
//               Available Services
//             </Typography>

//             <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <li
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: 4,
//                   }}
//                 >
//                   <CheckCircleIcon sx={{ mr: 1, color: "primary.main" }} />
//                   <Typography variant="body2">{service}</Typography>
//                 </li>
//               ))}
//             </ul>
//           </Box>
//         </Grid> */}
//         <Typography
//   variant="h6"
//   gutterBottom
//   sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
// >
//   Available Services
// </Typography>

// <Grid container spacing={2}>
//   {room.amenities.map((service: string, idx: number) => (
//     <Grid item xs={6} key={idx}>
//       <Box sx={{ display: "flex", alignItems: "center" }}>
//         <CheckCircleIcon sx={{ mr: 1, color: "primary.main" }} />
//         <Typography variant="body2">{service}</Typography>
//       </Box>
//     </Grid>
//   ))}

//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

// {
//   /* <li key={idx}></li>; */
// }

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// interface RoomDetailsCardProps {
//   room: {
//     name: string;
//     description: string;
//     amenities: string[];
//   };
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       {/* Room Title */}
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>

//       {/* Room Description */}
//       <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             {/* Check-in / Check-out */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Guests + Book button */}
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Guests"
//                 type="number"
//                 value={guests}
//                 onChange={(e) => setGuests(Number(e.target.value))}
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 inputProps={{ min: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={onBook}
//               >
//                 Book Now
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ width: "100%", boxSizing: "border-box" }}>
//             <Typography
//               variant="h6"
//               gutterBottom
//               sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
//             >
//               Available Services
//             </Typography>

//             {/* Amenities in 2 columns */}
//             <Grid container spacing={1}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <Grid item xs={12} sm={6} key={idx}>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <CheckCircleIcon sx={{ mr: 1, color: "primary.main" }} />
//                     <Typography variant="body2">{service}</Typography>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;

import React from "react";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface RoomDetailsCardProps {
  room: {
    name: string;
    description: string;
    amenities: string[];
  };
  guests: number;
  checkIn: string;
  checkOut: string;
  setGuests: (n: number) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  onBook: () => void;
}

const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
  room,
  guests,
  checkIn,
  checkOut,
  setGuests,
  setCheckIn,
  setCheckOut,
  onBook,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        mb: 8,
      }}
    >
      {/* Room Title */}
      <Typography variant="h5" gutterBottom>
        {room.name}
      </Typography>

      {/* Room Description */}
      <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
        {room.description}
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Check-in / Check-out */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Check In"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Check Out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Guests + Book button */}
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onBook}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT COLUMN: Available Services (single column list) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", pl: { md: 35 }, boxSizing: "border-box" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
            >
              Available Services
            </Typography>

            <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
              {room.amenities.map((service: string, idx: number) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <CheckCircleIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">{service}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomDetailsCard;

// import React from "react";
// import { Box, Grid, TextField, Button, Typography } from "@mui/material";

// interface RoomDetailsCardProps {
//   room: any;
//   guests: number;
//   checkIn: string;
//   checkOut: string;
//   setGuests: (n: number) => void;
//   setCheckIn: (date: string) => void;
//   setCheckOut: (date: string) => void;
//   onBook: () => void;
// }

// const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
//   room,
//   guests,
//   checkIn,
//   checkOut,
//   setGuests,
//   setCheckIn,
//   setCheckOut,
//   onBook,
// }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         display: "flex",
//         flexDirection: "column",
//         mb: 8,
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         {room.name}
//       </Typography>
//       <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
//         {room.description}
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <Box sx={{ display: "flex", flexDirection: "column" }}>
//             {/* Check-in / Check-out at the top */}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check In"
//                   type="date"
//                   value={checkIn}
//                   onChange={(e) => setCheckIn(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   label="Check Out"
//                   type="date"
//                   value={checkOut}
//                   onChange={(e) => setCheckOut(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </Grid>

//             {/* Guests + Book button below */}
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 label="Guests"
//                 type="number"
//                 value={guests}
//                 onChange={(e) => setGuests(Number(e.target.value))}
//                 fullWidth
//                 sx={{ mb: 2 }}
//                 inputProps={{ min: 1 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={onBook}
//               >
//                 Book Now
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         {/* RIGHT COLUMN: Available Services */}
//         <Grid item xs={12} md={6}>
//           <Box
//             sx={{
//               width: "100%",
//               pl: { md: 35 }, // push amenities more to the right
//               // borderLeft: { md: "1px solid #eee" },
//               boxSizing: "border-box",
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               Available Services
//             </Typography>
//             <ul style={{ paddingLeft: 16, margin: 0 }}>
//               {room.amenities.map((service: string, idx: number) => (
//                 <li key={idx}>{service}</li>
//               ))}
//             </ul>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default RoomDetailsCard;
