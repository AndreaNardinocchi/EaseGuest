import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
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

import { createClient } from "@supabase/supabase-js";
import AdminSubNav from "../components/adminSubNav/adminSubNav";

import type { Room } from "../types/interfaces";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const AdminRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

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

  // -----------------------------
  // Fetch Rooms
  // -----------------------------
  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setRooms(data || []);
  };

  useEffect(() => {
    (async () => {
      await fetchRooms();
      setLoading(false);
    })();
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getPublicUrl = (path: string) =>
    supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;

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
    setExistingImages([]);
    setOpenRoomModal(true);
  };

  const handleOpenUpdateRoom = (r: Room) => {
    setEditingRoom(r);

    const imgs = Array.isArray(r.images)
      ? r.images
      : typeof r.images === "string"
      ? JSON.parse(r.images)
      : [];

    setExistingImages(imgs);

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

  const uploadRoomImages = async (roomId: string, files: File[]) => {
    const uploadedPaths: string[] = [];

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;

      const { data, error } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      if (!error && data) {
        uploadedPaths.push(filePath);
      }
    }

    return uploadedPaths;
  };

  const handleRemoveExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  // -----------------------------
  // Save Room
  // -----------------------------
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

      let uploadedImages: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedImages = await uploadRoomImages(roomId!, selectedFiles);
      }

      const finalImages = [...existingImages, ...uploadedImages];

      const { error: imgError } = await supabase
        .from("rooms")
        .update({ images: finalImages })
        .eq("id", roomId);

      if (imgError) throw imgError;

      await fetchRooms();
      setOpenRoomModal(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading)
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );

  // -----------------------------
  // Page UI
  // -----------------------------
  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />
      <Container sx={{ pb: 8, overflow: "visible" }}>
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Rooms</Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreateRoom}
            sx={{ backgroundColor: "#e26d5c" }}
          >
            + Create Room
          </Button>
        </Box>

        {/* <TableContainer component={Paper} sx={{ mb: 6 }}>
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
        </TableContainer> */}

        <TableContainer
          component={Paper}
          sx={{
            mb: 6,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
            "&::-webkit-scrollbar": { height: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: 4,
            },
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Room ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Description
                </TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Amenities
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>

                {/* Hide on mobile */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Images
                </TableCell>

                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rooms.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    transition: "0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{r.id}</TableCell>

                  <TableCell>{r.name}</TableCell>

                  {/* WRAPPED DESCRIPTION */}
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      maxWidth: 250,
                    }}
                  >
                    {r.description}
                  </TableCell>

                  {/* WRAPPED AMENITIES */}
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      maxWidth: 200,
                    }}
                  >
                    {r.amenities?.join(", ")}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {r.capacity}
                  </TableCell>

                  <TableCell>€{r.price}</TableCell>

                  {/* WRAPPED IMAGES */}
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      maxWidth: 200,
                    }}
                  >
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
          <DialogTitle>
            {editingRoom ? "Update Room" : "Create Room"}
          </DialogTitle>

          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
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
              onChange={(event, newValue) =>
                setRoomForm({ ...roomForm, amenities: newValue })
              }
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
      </Container>
    </>
  );
};

export default AdminRoomsPage;
