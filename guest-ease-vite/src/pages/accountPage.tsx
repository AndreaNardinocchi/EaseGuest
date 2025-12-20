import React, { useEffect, useState, useMemo } from "react";
import {
  TextField, // <-- NEW
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Grid,
  Button,
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
import BookingCard from "../components/BookingCard/BookingCard";

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const {
    bookings,
    updateBooking,
    cancelBooking,
    fetchBookings,
    getRoomInfo,
    roomsLoading,
    loading,
  } = useBooking();

  const [tabValue, setTabValue] = useState(0);
  // state for popup
  const [open, setOpen] = useState(false); // <-- NEW
  const [selectedBooking, setSelectedBooking] = useState<any>(null); // <-- NEW
  const [cancelOpen, setCancelOpen] = useState(false); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchBookings();
    console.log("Fetching bookings for user:", user?.id);
  }, [user, fetchBookings]);

  // <-- ADD THIS
  useEffect(() => {
    console.log("Current bookings array:", bookings);
  }, [bookings]);

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

  if (loading || roomsLoading) {
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
        {data.map((b) => {
          // const room = getRoomInfo(b.room_id);

          const room = getRoomInfo(b.room_id);

          return (
            <Grid item xs={12} sm={6} md={4} key={b.id}>
              <BookingCard
                booking={b}
                room={room}
                type={type}
                handleUpdate={handleUpdate}
                handleCancel={handleCancel}
                handleReview={handleReview}
              />
            </Grid>
          );
        })}
      </Grid>
    );

  return (
    <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
      {/* Sub-navigation */}

      <SubNav />

      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#000000de", mb: 1, mt: 3 }}
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
        textColor="secondary" // keep current inactive look
        indicatorColor="secondary" // keep default behavior
        sx={{
          mb: 2,
          "& .MuiTab-root.Mui-selected": {
            color: "#000000de", // active tab color only
            fontWeight: 600,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#000000de", // active underline
            height: 3,
            borderRadius: 2,
          },
        }}
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
