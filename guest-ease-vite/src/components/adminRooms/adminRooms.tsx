import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

import type { Room } from "../../types/interfaces";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  rooms: Room[];
  fetchRooms: () => Promise<void>;
  supabase: SupabaseClient;
};

export default function AdminRooms({ rooms, fetchRooms, supabase }: Props) {
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [roomForm, setRoomForm] = useState({
    name: "",
    description: "",
    amenities: [] as string[],
    capacity: "",
    price: "",
  });

  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: "",
      description: "",
      amenities: [],
      capacity: "",
      price: "",
    });
    setOpenRoomModal(true);
  };

  const handleOpenUpdateRoom = (r: Room) => {
    setEditingRoom(r);
    setRoomForm({
      name: r.name,
      description: r.description ?? "",
      amenities: Array.isArray(r.amenities)
        ? r.amenities
        : typeof r.amenities === "string"
        ? JSON.parse(r.amenities)
        : [],
      capacity: String(r.capacity),
      price: String(r.price),
    });
    setOpenRoomModal(true);
  };

  const handleSaveRoom = async () => {
    const payload = {
      name: roomForm.name.trim(),
      description: roomForm.description.trim(),
      amenities: roomForm.amenities,
      capacity: Number(roomForm.capacity),
      price: Number(roomForm.price),
    };

    if (editingRoom) {
      await supabase.from("rooms").update(payload).eq("id", editingRoom.id);
    } else {
      await supabase.from("rooms").insert([payload]);
    }

    fetchRooms();
    setOpenRoomModal(false);
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    await supabase.from("rooms").delete().eq("id", id);
    fetchRooms();
  };

  return (
    <>
      <Box my={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleOpenCreateRoom}>
          + Create Room
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Rooms
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>{r.amenities?.join(", ")}</TableCell>
                <TableCell>{r.capacity}</TableCell>
                <TableCell>€{r.price}</TableCell>
                <TableCell>
                  {r.images?.length ? r.images.join(", ") : "No images"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenUpdateRoom(r)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteRoom(r.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Room Modal */}
      <Dialog
        open={openRoomModal}
        onClose={() => setOpenRoomModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingRoom ? "Update Room" : "Create Room"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={roomForm.description}
            onChange={(e) =>
              setRoomForm({ ...roomForm, description: e.target.value })
            }
          />

          {/* <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={roomForm.amenities}
            onChange={(e, value) =>
              setRoomForm({ ...roomForm, amenities: value })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Amenities"
                placeholder="Type and press Enter"
              /> */}

          {/* <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={roomForm.amenities}
            inputValue={amenityInput}
            onInputChange={(e, newInput) => setAmenityInput(newInput)}
            onChange={(e, value) => {
              setRoomForm({ ...roomForm, amenities: value });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Amenities"
                placeholder="Type and press Enter"
              />
            )}
          /> */}
          {/* */}

          {/* //   )} */}
          {/* // /> */}

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={roomForm.amenities}
            onChange={(event, newValue) => {
              setRoomForm({ ...roomForm, amenities: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Amenities"
                placeholder="Type and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const input = (e.target as HTMLInputElement).value
                      .split(",")
                      .map((a) => a.trim())
                      .filter((a) => a.length > 0);

                    setRoomForm({
                      ...roomForm,
                      amenities: [...roomForm.amenities, ...input],
                    });

                    // Clear the input field
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            )}
          />

          <TextField
            margin="dense"
            type="number"
            label="Capacity"
            fullWidth
            value={roomForm.capacity}
            onChange={(e) =>
              setRoomForm({ ...roomForm, capacity: e.target.value })
            }
          />

          <TextField
            margin="dense"
            type="number"
            label="Price"
            fullWidth
            value={roomForm.price}
            onChange={(e) =>
              setRoomForm({ ...roomForm, price: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenRoomModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveRoom}>
            {editingRoom ? "Update Room" : "Create Room"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
