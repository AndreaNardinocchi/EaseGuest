// src/api/bookings.ts

export const createBookingApi = async (
  bookingData: {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
  },
  userId: string
) => {
  const res = await fetch("/user/create_booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...bookingData, userId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }
  return data;
  // { // success: true, // booking, // clientSecret // }
};

export const updateBookingApi = async (
  bookingId: string,
  updates: any,
  userId: string
) => {
  const res = await fetch("/user/update_booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, updates, userId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update booking");
  }

  return res.json();
};

export const cancelBookingApi = async (bookingId: string, userId: string) => {
  const res = await fetch("/user/cancel_booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, userId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to cancel booking");
  }

  return res.json();
};
