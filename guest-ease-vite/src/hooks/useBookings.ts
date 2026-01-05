import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBookingApi,
  updateBookingApi,
  cancelBookingApi,
} from "../api/bookings";
import { supabase } from "../supabaseClient";

export const useBookings = (userId?: string) => {
  const queryClient = useQueryClient();

  /* ---------------------------------------
     READ BOOKINGS (with room join)
  ---------------------------------------- */
  const bookingsQuery = useQuery({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, room:rooms!room_id(name, images, price)")
        .eq("user_id", userId)
        .order("check_in", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });

  /* ---------------------------------------
     CREATE BOOKING (backend)
  ---------------------------------------- */
  const createBooking = useMutation({
    mutationFn: (bookingData: any) => createBookingApi(bookingData, userId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings", userId],
      });
    },
  });

  /* ---------------------------------------
     UPDATE BOOKING (backend)
  ---------------------------------------- */
  const updateBooking = useMutation({
    mutationFn: ({ bookingId, updates }: any) =>
      updateBookingApi(bookingId, updates, userId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings", userId],
      });
    },
  });

  /* ---------------------------------------
     CANCEL BOOKING (backend)
  ---------------------------------------- */
  const cancelBooking = useMutation({
    mutationFn: (bookingId: string) => cancelBookingApi(bookingId, userId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings", userId],
      });
    },
  });

  return {
    bookingsQuery,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};
