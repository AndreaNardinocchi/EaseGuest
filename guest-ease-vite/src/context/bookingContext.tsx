// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { supabase } from "../supabaseClient";
// import { searchAvailableRooms as searchRoomsService } from "../supabase/roomService";
// import type { Review, Room } from "../types/interfaces";
// import type { Booking } from "../types/interfaces";
// // import { calculateNightsPrice } from "../utils/calculateNightsPrice";

// export type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;

//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ booking?: Booking; success: boolean; message?: string }>;

//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string,
//     guests: number
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
//   updateBooking: (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ) => Promise<{ success: boolean; message?: string }>;
//   cancelBooking: (booking: {
//     id: string;
//   }) => Promise<{ success: boolean; message?: string }>;

//   submitReview: (
//     bookingId: string,
//     rating: number,
//     comment: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
//   rooms: any[];
//   roomsLoading: boolean;
//   getRoomInfo: (roomId: string) => any | null;
//   fetchRooms: () => Promise<void>; // ⭐ add this
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
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [roomsLoading, setRoomsLoading] = useState(true);

//   const fetchRooms = useCallback(async () => {
//     setRoomsLoading(true);

//     const { data, error } = await supabase
//       .from("rooms")
//       .select("id, name, images, price, amenities");

//     if (!error && data) {
//       const parsedRooms = data.map((room: any) => ({
//         ...room,
//         images:
//           typeof room.images === "string"
//             ? JSON.parse(room.images)
//             : room.images ?? [],
//         amenities:
//           typeof room.amenities === "string"
//             ? JSON.parse(room.amenities)
//             : room.amenities ?? [],
//       }));

//       setRooms(parsedRooms);
//     }

//     setRoomsLoading(false);
//   }, []);

//   const fetchBookings = useCallback(
//     async (roomId?: string) => {
//       setLoading(true);
//       try {
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();
//         if (!user) return setBookings([]);

//         // ⭐ Load rooms FIRST
//         await fetchRooms();

//         // Then load bookings
//         let query = supabase
//           .from("bookings")
//           .select("*")
//           .eq("user_id", user.id);
//         if (roomId) query = query.eq("room_id", roomId.trim());

//         const { data: bookingsData } = await query;
//         setBookings(bookingsData || []);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchRooms]
//   );

//   /* ---------------------------------------
//    * EMAIL HELPER FUNCTION
//    * --------------------------------------- */
//   const sendEmail = async (email: string, subject: string, body: string) => {
//     try {
//       await fetch("http://localhost:3000/send_email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, subject, body }),
//       });
//     } catch (err) {
//       console.error("Email send failed:", err);
//     }
//   };

// const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//   setLoading(true);
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return { success: false, message: "User not authenticated." };

//     // ⭐ Ensure rooms are loaded
//     if (rooms.length === 0) {
//       await fetchRooms();
//     }

//     // get room price
//     const room = rooms.find((r) => r.id === newBooking.room_id);
//     const roomPrice = room?.price ?? 0;
//     console.log("Room price:", roomPrice);

//     // calculate total price
//     const { total: total_price } = calculateNightsPrice(
//       newBooking.check_in,
//       newBooking.check_out,
//       roomPrice
//     );

//     const sanitized = {
//       ...newBooking,
//       user_id: user.id,
//       total_price,
//     };

//     const { data: inserted, error: insertError } = await supabase
//       .from("bookings")
//       .insert([sanitized])
//       .select();
//     if (insertError) return { success: false, message: insertError.message };
//     if (!inserted || inserted.length === 0)
//       return { success: false, message: "Booking insertion failed" };

//     const bookingInserted = inserted[0] as Booking;
//     setBookings((prev) => [...prev, bookingInserted]);

//     // send confirmation email...

//     await sendEmail(
//       user.email!,
//       "Your Booking Has Been Confirmed",
//       `
//  <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
//    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
//           style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

//      <!-- HEADER -->
//      <tr>
//        <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
//          <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
//            Your Booking Has Been Confirmed
//          </h2>
//        </td>
//      </tr>

//      <!-- BODY -->
//      <tr>
//        <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
//          <p>Hello <strong>${
//            user.user_metadata.first_name ?? user.email
//          }</strong>,</p>

//          <p>We wanted to let you know that your booking has been confirmed. Here are the booking details:</p>

//          <!-- UPDATED BOOKING DETAILS -->
//          <div style="
//              background:#f9f9f9;
//              border:1px solid #e5e7eb;
//              padding:16px;
//              margin:18px 0;
//              border-radius:6px;
//          ">
//            <p style="margin:6px 0;"><strong>Check-in:</strong> ${
//              sanitized.check_in
//            }</p>
//            <p style="margin:6px 0;"><strong>Check-out:</strong> ${
//              sanitized.check_out
//            }</p>
//            <p style="margin:6px 0;"><strong>Guests:</strong> ${
//              sanitized.guests
//            }</p>
//          </div>

//          <p>If you have any questions or need to make changes, feel free to reply to this email or click on the below 'My Trips' button. Thank you!!!</p>

//          <!-- BUTTON -->
//          <div style="text-align:center; margin:24px 0;">
//            <a href="http://localhost:5173/account"
//              style="background:#e26d5c; color:#fff; padding:10px 20px;
//              text-decoration:none; border-radius:5px; font-size:15px;">
//              My Trips
//            </a>
//          </div>
//       </td>
//      </tr>

//      <!-- FOOTER -->
//      <tr>
//        <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
//         © ${new Date().getFullYear()} GuestEase. All rights reserved.
//        </td>
//      </tr>

//    </table>
//  </div>
//  `
//     );

//     return { success: true, booking: bookingInserted };
//   } finally {
//     setLoading(false);
//   }
// };

//   const searchAvailableRooms = async (
//     checkIn: string,
//     checkOut: string,
//     guests: number
//   ) => {
//     try {
//       const result = await searchRoomsService(checkIn, checkOut, guests);

//       if (!result.success) return result;

//       const rooms = result.rooms;

//       // ⭐ Attach reviews here — no loops, no state updates
//       const roomsWithReviews = await Promise.all(
//         rooms.map(async (room: { id: any }) => {
//           const { data: reviews } = await supabase
//             .from("reviews")
//             .select("*")
//             .eq("room_id", room.id)
//             .eq("visibility_status", "visible");

//           return {
//             ...room,
//             reviews: reviews ?? [],
//           };
//         })
//       );

//       return {
//         ...result,
//         rooms: roomsWithReviews,
//       };
//     } catch (err) {
//       return { success: false, rooms: [], message: "Error fetching rooms." };
//     }
//   };

//   const submitReview = async (
//     bookingId: string,
//     rating: number,
//     comment: string
//   ) => {
//     try {
//       const { data: booking } = await supabase
//         .from("bookings")
//         .select("room_id")
//         .eq("id", bookingId)
//         .single();
//       if (!booking) return { success: false, message: "Booking not found." };

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "Not authenticated." };

//       await supabase.from("reviews").insert({
//         booking_id: bookingId,
//         room_id: booking.room_id.trim(),
//         user_id: user.id,
//         rating,
//         comment,
//       });
//       return { success: true };
//     } catch (err: any) {
//       return { success: false, message: err.message };
//     }
//   };

//   /* Fetch reviews */
//   const fetchReviewsByRoom = async (roomId: string) => {
//     const { data, error } = await supabase
//       .from("reviews")
//       .select("*")
//       .eq("room_id", roomId.trim());
//     return error ? [] : (data as Review[]);
//   };

//   useEffect(() => {
//     const fetchRooms = async () => {
//       setRoomsLoading(true);

//       const { data, error } = await supabase
//         .from("rooms")
//         .select("id, name, images, price, amenities");

//       if (!error && data) {
//         const parsedRooms = data.map((room: any) => ({
//           ...room,
//           images:
//             typeof room.images === "string"
//               ? JSON.parse(room.images)
//               : room.images ?? [],
//           amenities:
//             typeof room.amenities === "string"
//               ? JSON.parse(room.amenities)
//               : room.amenities ?? [],
//         }));

//         setRooms(parsedRooms);
//       }

//       setRoomsLoading(false);
//     };

//     fetchRooms();
//   }, []);

//   const getRoomInfo = (roomId: string) => {
//     const room = rooms.find((r) => r.id === roomId);
//     return room || null;
//   };

//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         // bookRoom,
//         searchAvailableRooms,
//         // updateBooking,
//         // cancelBooking,
//         submitReview,
//         fetchReviewsByRoom,
//         // storePayment,
//         rooms,
//         roomsLoading,
//         getRoomInfo,
//         fetchRooms,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// /* Hook */

// // eslint-disable-next-line react-refresh/only-export-components
// export const useBooking = () => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
// };

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../supabaseClient";
import { searchAvailableRooms as searchRoomsService } from "../supabase/roomService";
import type { Review, Room } from "../types/interfaces";

export type BookingContextType = {
  rooms: Room[];
  roomsLoading: boolean;
  fetchRooms: () => Promise<void>;
  getRoomInfo: (roomId: string) => Room | null;

  searchAvailableRooms: (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;

  submitReview: (
    bookingId: string,
    rating: number,
    comment: string
  ) => Promise<{ success: boolean; message?: string }>;

  fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  /* ---------------------------------------
   * FETCH ROOMS
   * --------------------------------------- */
  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);

    const { data, error } = await supabase
      .from("rooms")
      .select("id, name, images, price, amenities");

    if (!error && data) {
      const parsedRooms = data.map((room: any) => ({
        ...room,
        images:
          typeof room.images === "string"
            ? JSON.parse(room.images)
            : room.images ?? [],
        amenities:
          typeof room.amenities === "string"
            ? JSON.parse(room.amenities)
            : room.amenities ?? [],
      }));

      setRooms(parsedRooms);
    }

    setRoomsLoading(false);
  }, []);

  /* Load rooms on mount */
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  /* ---------------------------------------
   * GET ROOM INFO
   * --------------------------------------- */
  const getRoomInfo = (roomId: string) => {
    return rooms.find((r) => r.id === roomId) || null;
  };

  /* ---------------------------------------
   * SEARCH AVAILABLE ROOMS
   * --------------------------------------- */
  const searchAvailableRooms = async (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    try {
      const result = await searchRoomsService(checkIn, checkOut, guests);
      if (!result.success) return result;

      const roomsWithReviews = await Promise.all(
        result.rooms.map(async (room: { id: string }) => {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("*")
            .eq("room_id", room.id)
            .eq("visibility_status", "visible");

          return {
            ...room,
            reviews: reviews ?? [],
          };
        })
      );

      return { ...result, rooms: roomsWithReviews };
    } catch {
      return { success: false, rooms: [], message: "Error fetching rooms." };
    }
  };

  /* ---------------------------------------
   * SUBMIT REVIEW
   * --------------------------------------- */
  const submitReview = async (
    bookingId: string,
    rating: number,
    comment: string
  ) => {
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("room_id")
        .eq("id", bookingId)
        .single();

      if (!booking) {
        return { success: false, message: "Booking not found." };
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, message: "Not authenticated." };
      }

      await supabase.from("reviews").insert({
        booking_id: bookingId,
        room_id: booking.room_id.trim(),
        user_id: user.id,
        rating,
        comment,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  /* ---------------------------------------
   * FETCH REVIEWS FOR A ROOM
   * --------------------------------------- */
  const fetchReviewsByRoom = async (roomId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("room_id", roomId.trim());

    return error ? [] : (data as Review[]);
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        roomsLoading,
        fetchRooms,
        getRoomInfo,
        searchAvailableRooms,
        submitReview,
        fetchReviewsByRoom,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

/* -------------------------
 * Hook
 * ------------------------- */
// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
  return ctx;
};
