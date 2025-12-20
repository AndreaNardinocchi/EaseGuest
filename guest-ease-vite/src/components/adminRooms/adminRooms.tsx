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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
    setSelectedFiles([]);
    setOpenRoomModal(true);
  };

  const handleOpenUpdateRoom = (r: Room) => {
    setEditingRoom(r);

    const imgs = Array.isArray(r.images)
      ? r.images
      : typeof r.images === "string"
      ? JSON.parse(r.images)
      : [];
    setExistingImages(imgs); // ⭐ store existing images
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
    setSelectedFiles([]);
    setOpenRoomModal(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    await supabase.from("rooms").delete().eq("id", id);
    fetchRooms();
  };

  async function uploadRoomImages(roomId: string, files: File[]) {
    const uploadedPaths: string[] = [];

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;

      console.log("➡️ Uploading:", safeName, "→", filePath);

      const { data, error } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      console.log("📦 Upload response:", { data, error });

      if (error) {
        console.error("❌ Upload failed:", error);
      } else {
        uploadedPaths.push(filePath);
      }
    }

    return uploadedPaths;
  }

  const handleRemoveExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  // ⭐ Add this right here

  function getPublicUrl(path: string) {
    return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
  }

  const handleSaveRoom = async () => {
    try {
      const payload = {
        name: roomForm.name.trim(),
        description: roomForm.description.trim(),
        amenities: roomForm.amenities,
        capacity: Number(roomForm.capacity),
        price: Number(roomForm.price),
      };

      let roomId = editingRoom?.id;

      // Create or update room
      if (!editingRoom) {
        const { data, error } = await supabase
          .from("rooms")
          .insert([payload])
          .select("id")
          .single();

        if (error) throw error;
        roomId = data.id;
      } else {
        const { error } = await supabase
          .from("rooms")
          .update(payload)
          .eq("id", roomId);

        if (error) throw error;
      }

      // Upload new images
      let uploadedImages: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedImages = await uploadRoomImages(roomId!, selectedFiles);
      }

      // ⭐ FINAL IMAGES = existingImages state + new uploads
      const finalImages = [...existingImages, ...uploadedImages];

      // Save images
      const { error: imgError } = await supabase
        .from("rooms")
        .update({ images: finalImages })
        .eq("id", roomId);

      if (imgError) throw imgError;

      await fetchRooms();
      setOpenRoomModal(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error("❌ Error in handleSaveRoom:", err);
    }
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
                  {Array.isArray(r.images)
                    ? r.images.join(", ")
                    : typeof r.images === "string"
                    ? JSON.parse(r.images).join(", ")
                    : "No images"}
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

                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            )}
          />
          {editingRoom && existingImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Existing Images</Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                {existingImages.map((img) => (
                  <Box
                    key={img}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    <img
                      src={getPublicUrl(img)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={() => handleRemoveExistingImage(img)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        minWidth: 0,
                        padding: "2px 6px",
                        fontSize: "0.7rem",
                      }}
                    >
                      X
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles(files);
            }}
            style={{ marginTop: "1rem" }}
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
