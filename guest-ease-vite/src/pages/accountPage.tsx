import React, { useEffect, useState, useMemo } from "react";
import {
  TextField, // <-- NEW
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Stack,
  // Link as MuiLink,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/useAuth";
import { useBooking } from "../context/bookingContext";
// import { Link } from "react-router-dom"; // assuming react-router
import SubNav from "../components/accountSubNav/accountSubNav";
// import { error } from "console";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { bookings, updateBooking, cancelBooking, fetchBookings, loading } =
    useBooking();
  const [tabValue, setTabValue] = useState(0);
  // state for popup
  const [open, setOpen] = useState(false); // <-- NEW
  const [selectedBooking, setSelectedBooking] = useState<any>(null); // <-- NEW
  const [cancelOpen, setCancelOpen] = useState(false); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchBookings();
  }, [user, fetchBookings]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const today = useMemo(() => new Date(), []);
  const upcomingBookings = useMemo(
    () => bookings.filter((b) => new Date(b.check_out) >= today),
    [bookings, today]
  );
  const pastBookings = useMemo(
    () => bookings.filter((b) => new Date(b.check_out) < today),
    [bookings, today]
  );

  // const handleUpdate = (id: string) => alert(`Update booking ${id}`);
  // Use updateBooking instead of alert
  const handleUpdate = (booking: any) => {
    // <-- CHANGED: pass booking object, not just id
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleSave = async () => {
    // <-- NEW
    if (!selectedBooking) return;
    const result = await updateBooking(selectedBooking.id, {
      check_in: selectedBooking.check_in,
      check_out: selectedBooking.check_out,
      guests: selectedBooking.guests,
    });
    alert(result.message);
    setOpen(false);
  };

  const handleCancel = (booking: any) => {
    setSelectedBooking(booking);
    setCancelOpen(true); // open confirmation popup
    console.log("Selected booking:", selectedBooking);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    const result = await cancelBooking(selectedBooking.id);
    alert(result.message);
    setCancelOpen(false);
  };

  const handleReview = (id: string) => {
    navigate(`/review/${id}`);
  };

  if (!user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          Please log in to view your account.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const renderBookings = (data: typeof bookings, type: "upcoming" | "past") =>
    data.length === 0 ? (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No {type === "upcoming" ? "upcoming" : "past"} reservations.
      </Typography>
    ) : (
      <Grid container spacing={3} mt={2}>
        {data.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
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
                image={`https://via.placeholder.com/400x200?text=Room+${b.room_id.slice(
                  0,
                  6
                )}`}
                alt="Room"
                sx={{
                  height: 200,
                  objectFit: "cover",
                }}
              />
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" sx={{ color: "#8E4585", mb: 1 }}>
                  Room {b.room_id}
                </Typography>
                <Typography>
                  <strong>Check-in:</strong> {b.check_in}
                </Typography>
                <Typography>
                  <strong>Check-out:</strong> {b.check_out}
                </Typography>
                <Typography>
                  <strong>Guests:</strong> {b.guests}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Booked on: {new Date(b.created_at || "").toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
                  {type === "upcoming" ? (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        // onClick={() => handleUpdate(b.id!)}
                        onClick={() => handleUpdate(b)} // <-- CHANGED: pass whole booking
                        fullWidth
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancel(b)}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReview(b.id!)}
                      // onClick={() => navigate(`/review/${b.id}`)}
                      fullWidth
                    >
                      Write Review
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
      {/* Sub-navigation */}

      <SubNav />

      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#8E4585", mb: 1, mt: 3 }}
      >
        My Reservations
      </Typography>
      <Typography align="center" sx={{ mb: 3 }}>
        Hey {user.firstName}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ "& .MuiTab-root": { fontWeight: 600 }, mb: 2 }}
      >
        <Tab label="Upcoming" />
        <Tab label="Past" />
      </Tabs>

      {tabValue === 0 && renderBookings(upcomingBookings, "upcoming")}
      {tabValue === 1 && renderBookings(pastBookings, "past")}

      {/* Update Booking Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <TextField
                margin="dense"
                label="Check-in"
                type="date"
                fullWidth
                value={selectedBooking.check_in}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    check_in: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Check-out"
                type="date"
                fullWidth
                value={selectedBooking.check_out}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    check_out: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Guests"
                type="number"
                fullWidth
                value={selectedBooking.guests}
                onChange={(e) =>
                  setSelectedBooking({
                    ...selectedBooking,
                    guests: Number(e.target.value),
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Typography>
              Are you sure you want to cancel your booking for room{" "}
              <strong>{selectedBooking.room_id}</strong> from{" "}
              <strong>{selectedBooking.check_in}</strong> to{" "}
              <strong>{selectedBooking.check_out}</strong>?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Keep Booking</Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
