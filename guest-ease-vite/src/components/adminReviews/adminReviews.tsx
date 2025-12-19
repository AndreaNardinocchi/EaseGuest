import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { Review, Room } from "../../types/interfaces";

export default function AdminReviews({
  reviews,
  rooms,
}: {
  reviews: Review[];
  rooms: Room[];
}) {
  const getRoomName = (roomId: string) =>
    rooms.find((r) => r.id === roomId)?.name || "Unknown";

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Review ID</TableCell>
              <TableCell>Booking ID</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.booking_id}</TableCell>
                <TableCell>{getRoomName(r.room_id)}</TableCell>
                <TableCell>{r.rating}</TableCell>
                <TableCell>{r.comment}</TableCell>
                <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
