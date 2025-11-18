// import React, { createContext, useCallback, useContext, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { searchAvailableRooms as searchRoomsService } from "../supabase/roomService";

// /* -------------------------
//  * Types
//  * ------------------------- */

// type Booking = {
//   id?: string;
//   room_id: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   created_at?: string;
//   // 🟩 ADDED: user_id field to match Supabase schema
//   user_id?: string;
// };

// type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;
//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ success: boolean; message?: string }>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
// };

// /* -------------------------
//  * Context
//  * ------------------------- */
// const BookingContext = createContext<BookingContextType | undefined>(undefined);

// /* -------------------------
//  * Provider
//  * ------------------------- */
// export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(false);

//   // /* Fetch bookings */
//   // const fetchBookings = async (roomId?: string) => {
//   //   setLoading(true);
//   //   try {
//   //     // 🟩 ADDED: Get current authenticated user
//   //     const {
//   //       data: { user },
//   //     } = await supabase.auth.getUser();
//   //     if (!user) {
//   //       setBookings([]);
//   //       setLoading(false);
//   //       return;
//   //     }

//   /* ✅ FIXED: Memoize fetchBookings to avoid flickering */
//   // const fetchBookings = useCallback(async (roomId?: string) => {
//   //   setLoading(true);
//   //   try {
//   //     const { data: { user } } = await supabase.auth.getUser();
//   //     if (!user) {
//   //       setBookings([]);
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     // 🟩 CHANGED: Filter bookings by current user's ID
//   //     let query = supabase.from("bookings").select("*");
//   //     if (roomId) query = query.eq("room_id", roomId);
//   //     const { data, error } = await query;
//   //     if (error) {
//   //       console.error("fetchBookings error:", error);
//   //       setBookings([]);
//   //     } else {
//   //       setBookings((data as Booking[]) || []);
//   //     }
//   //   } catch (err) {
//   //     console.error("fetchBookings unexpected error:", err);
//   //     setBookings([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   //  } , []); // 👈 Empty dependency array keeps it stable across renders
//   // };

//   /* ✅ FIXED: Memoize fetchBookings to avoid flickering */
//   const fetchBookings = useCallback(async (roomId?: string) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         setBookings([]);
//         setLoading(false);
//         return;
//       }

//       // ✅ Filter bookings by current user's ID
//       let query = supabase.from("bookings").select("*").eq("user_id", user.id);

//       if (roomId) query = query.eq("room_id", roomId);

//       const { data, error } = await query;

//       if (error) {
//         console.error("fetchBookings error:", error);
//         setBookings([]);
//       } else {
//         setBookings((data as Booking[]) || []);
//       }
//     } catch (err) {
//       console.error("fetchBookings unexpected error:", err);
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []); // ✅ stable reference, no flicker

//   /* Overlap check */
//   const bookingsOverlap = (
//     aStartISO: string,
//     aEndISO: string,
//     bStartISO: string,
//     bEndISO: string
//   ) => {
//     const aStart = new Date(aStartISO).getTime();
//     const aEnd = new Date(aEndISO).getTime();
//     const bStart = new Date(bStartISO).getTime();
//     const bEnd = new Date(bEndISO).getTime();
//     return aStart < bEnd && bStart < aEnd;
//   };

//   /* Book room */
//   const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//     setLoading(true);
//     try {
//       // 🟩 ADDED: Get user and attach user_id to booking
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();
//       if (userError || !user) {
//         return { success: false, message: "User not authenticated." };
//       }

//       // 🟩 ADDED: Include user_id when inserting
//       const bookingWithUser = { ...newBooking, user_id: user.id };
//       const { data: inserted, error: insertError } = await supabase
//         .from("bookings")
//         .insert([bookingWithUser])
//         .select();
//       console.log("Booking payload for insert:", bookingWithUser);

//       if (insertError) {
//         if (
//           insertError.code === "23505" ||
//           insertError.message?.includes("no_overlapping_bookings")
//         ) {
//           return {
//             success: false,
//             message: "Selected dates overlap with an existing booking.",
//           };
//         }
//         console.error(
//           "Error inserting booking:",
//           JSON.stringify(insertError, null, 2)
//         );

//         return { success: false, message: "Failed to create booking." };
//       }

//       if (inserted)
//         setBookings((prev) => [...prev, ...(inserted as Booking[])]);
//       return { success: true, message: "Booking created successfully." };
//     } catch (err) {
//       console.error("bookRoom unexpected error:", err);
//       return {
//         success: false,
//         message: "Unexpected error while creating booking.",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Search available rooms */
//   const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
//     return searchRoomsService(checkIn, checkOut);
//   };

//   /* Provide context */
//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         bookRoom,
//         searchAvailableRooms,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// /* -------------------------
//  * Hook to use context
//  * ------------------------- */
// // eslint-disable-next-line react-refresh/only-export-components
// export const useBooking = (): BookingContextType => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
// };

// /* -------------------------
//  * Default export
//  * ------------------------- */
// export default {
//   BookingProvider,
//   useBooking,
// };

import React, { createContext, useCallback, useContext, useState } from "react";
import { supabase } from "../supabaseClient";
import { searchAvailableRooms as searchRoomsService } from "../supabase/roomService";

/* -------------------------
 * Types
 * ------------------------- */

type Booking = {
  id?: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  created_at?: string;
  user_id?: string; // must match your DB schema
};

type BookingContextType = {
  bookings: Booking[];
  loading: boolean;
  fetchBookings: (roomId?: string) => Promise<void>;
  bookRoom: (
    b: Omit<Booking, "id" | "created_at">
  ) => Promise<{ success: boolean; message?: string }>;
  searchAvailableRooms: (
    checkIn: string,
    checkOut: string
  ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
  updateBooking: (
    bookingId: string,
    updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
  ) => Promise<{ success: boolean; message?: string }>;
  cancelBooking: (
    bookingId: string
  ) => Promise<{ success: boolean; message?: string }>; // <-- NEW
};

/* -------------------------
 * Context
 * ------------------------- */
const BookingContext = createContext<BookingContextType | undefined>(undefined);

/* -------------------------
 * Provider
 * ------------------------- */
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  /* Fetch user's bookings */
  const fetchBookings = useCallback(async (roomId?: string) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      let query = supabase.from("bookings").select("*").eq("user_id", user.id);
      if (roomId) query = query.eq("room_id", roomId);

      const { data, error } = await query;

      if (error) {
        console.error("fetchBookings error:", error);
        setBookings([]);
      } else {
        setBookings((data as Booking[]) || []);
      }
    } catch (err) {
      console.error("fetchBookings unexpected error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Book a room */
  const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { success: false, message: "User not authenticated." };
      }

      // attach the user_id
      const bookingWithUser = { ...newBooking, user_id: user.id };
      console.log("Booking payload for insert:", bookingWithUser);

      const { data: inserted, error: insertError } = await supabase
        .from("bookings")
        .insert([bookingWithUser])
        .select();

      if (insertError) {
        if (
          insertError.code === "23505" ||
          insertError.message?.includes("no_overlapping_bookings")
        ) {
          return {
            success: false,
            message: "Selected dates overlap with an existing booking.",
          };
        }

        console.error(
          "Error inserting booking:",
          JSON.stringify(insertError, null, 2)
        );
        return { success: false, message: "Failed to create booking." };
      }

      if (inserted) {
        setBookings((prev) => [...prev, ...(inserted as Booking[])]);
      }

      /* ---------------------------------------
       * SEND EMAIL THROUGH LOCAL NODE SERVER
       * --------------------------------------- */
      try {
        const emailPayload = {
          email: user.email,
          subject: "Your Booking Confirmation",
          body: `
            <h2>Your Booking is Confirmed!</h2>
            <p><strong>Check-in:</strong> ${newBooking.check_in}</p>
            <p><strong>Check-out:</strong> ${newBooking.check_out}</p>
            <p><strong>Guests:</strong> ${newBooking.guests}</p>
          `,
        };

        console.log("Sending email to:", user.email);

        const response = await fetch("http://localhost:3000/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        const data = await response.json();
        console.log("Email API response:", data);
      } catch (emailErr) {
        console.error("Failed to send booking email:", emailErr);
      }

      return { success: true, message: "Booking created successfully." };
    } catch (err) {
      console.error("bookRoom unexpected error:", err);
      return {
        success: false,
        message: "Unexpected error while creating booking.",
      };
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
    return searchRoomsService(checkIn, checkOut);
  };

  /* -------------------------
   * Update a booking
   * ------------------------- */
  const updateBooking = async (
    bookingId: string,
    updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { success: false, message: "User not authenticated." };
      }

      // Ensure only the owner can update
      const { data: updated, error: updateError } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .select();

      if (updateError) {
        if (
          updateError.code === "23505" ||
          updateError.message?.includes("no_overlapping_bookings")
        ) {
          return {
            success: false,
            message: "Selected dates overlap with an existing booking.",
          };
        }
        console.error("Error updating booking:", updateError);
        return { success: false, message: "Failed to update booking." };
      }

      if (updated) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? (updated[0] as Booking) : b))
        );
      }

      // Optional: send update confirmation email
      try {
        const emailPayload = {
          email: user.email,
          subject: "Your Booking Update",
          body: `
          <h2>Your Booking Has Been Updated!</h2>
          <p><strong>Check-in:</strong> ${updates.check_in}</p>
          <p><strong>Check-out:</strong> ${updates.check_out}</p>
          <p><strong>Guests:</strong> ${updates.guests}</p>
        `,
        };

        await fetch("http://localhost:3000/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailErr) {
        console.error("Failed to send update email:", emailErr);
      }

      return { success: true, message: "Booking updated successfully." };
    } catch (err) {
      console.error("updateBooking unexpected error:", err);
      return {
        success: false,
        message: "Unexpected error while updating booking.",
      };
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
   * Cancel a booking
   * ------------------------- */
  const cancelBooking = async (
    bookingId: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { success: false, message: "User not authenticated." };
      }

      const { error: deleteError } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error cancelling booking:", deleteError);
        return { success: false, message: "Failed to cancel booking." };
      }

      // Update local state
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));

      // Optional: send cancellation email
      try {
        const emailPayload = {
          email: user.email,
          subject: "Your Booking Cancellation",
          body: `
          <h2>Your Booking Has Been Cancelled</h2>
          <p>Booking ID: ${bookingId}</p>
        `,
        };

        await fetch("http://localhost:3000/send_email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailErr) {
        console.error("Failed to send cancellation email:", emailErr);
      }

      return { success: true, message: "Booking cancelled successfully." };
    } catch (err) {
      console.error("cancelBooking unexpected error:", err);
      return {
        success: false,
        message: "Unexpected error while cancelling booking.",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        fetchBookings,
        bookRoom,
        searchAvailableRooms,
        updateBooking, // <-- add here
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

/* Hook */
// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = (): BookingContextType => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
  return ctx;
};

export default {
  BookingProvider,
  useBooking,
};
