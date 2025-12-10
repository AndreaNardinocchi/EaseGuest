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
//   user_id?: string; // must match your DB schema
// };

// type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;
//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ success: boolean; message?: string }>;
//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
//   updateBooking: (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ) => Promise<{ success: boolean; message?: string }>;
//   cancelBooking: (
//     bookingId: string
//   ) => Promise<{ success: boolean; message?: string }>; // <-- NEW
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

//   /* Fetch user's bookings */
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
//   }, []);

//   /* Book a room */
//   const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       console.log("Current user:", user); // <--- ADD THIS

//       if (userError || !user) {
//         return { success: false, message: "User not authenticated." };
//       }

//       // attach the user_id
//       // const bookingWithUser = { ...newBooking, user_id: user.id };
//       // Ensure no user_id leaks into the payload
//       const sanitized = {
//         room_id: newBooking.room_id,
//         check_in: newBooking.check_in,
//         check_out: newBooking.check_out,
//         guests: newBooking.guests,
//         user_id: user.id, // force correct value
//       };

//       console.log("Booking payload for insert:", sanitized);

//       const { data: inserted, error: insertError } = await supabase
//         .from("bookings")
//         .insert([sanitized])
//         .select();

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

//       if (inserted) {
//         setBookings((prev) => [...prev, ...(inserted as Booking[])]);
//       }

//       /* ---------------------------------------
//        * SEND EMAIL THROUGH LOCAL NODE SERVER
//        * --------------------------------------- */
//       try {
//         const emailPayload = {
//           email: user.email,
//           subject: "Your Booking Confirmation",
//           body: `
//             <h2>Your Booking is Confirmed!</h2>
//             <p><strong>Check-in:</strong> ${newBooking.check_in}</p>
//             <p><strong>Check-out:</strong> ${newBooking.check_out}</p>
//             <p><strong>Guests:</strong> ${newBooking.guests}</p>
//           `,
//         };

//         console.log("Sending email to:", user.email);

//         const response = await fetch("http://localhost:3000/send_email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(emailPayload),
//         });

//         const data = await response.json();
//         console.log("Email API response:", data);
//       } catch (emailErr) {
//         console.error("Failed to send booking email:", emailErr);
//       }

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

//   const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
//     return searchRoomsService(checkIn, checkOut);
//   };

//   /* -------------------------
//    * Update a booking
//    * ------------------------- */
//   const updateBooking = async (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ): Promise<{ success: boolean; message?: string }> => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         return { success: false, message: "User not authenticated." };
//       }

//       // Ensure only the owner can update
//       const { data: updated, error: updateError } = await supabase
//         .from("bookings")
//         .update(updates)
//         .eq("id", bookingId)
//         .eq("user_id", user.id)
//         .select();

//       if (updateError) {
//         if (
//           updateError.code === "23505" ||
//           updateError.message?.includes("no_overlapping_bookings")
//         ) {
//           return {
//             success: false,
//             message: "Selected dates overlap with an existing booking.",
//           };
//         }
//         console.error("Error updating booking:", updateError);
//         return { success: false, message: "Failed to update booking." };
//       }

//       if (updated) {
//         setBookings((prev) =>
//           prev.map((b) => (b.id === bookingId ? (updated[0] as Booking) : b))
//         );
//       }

//       // Optional: send update confirmation email
//       try {
//         const emailPayload = {
//           email: user.email,
//           subject: "Your Booking Update",
//           body: `
//           <h2>Your Booking Has Been Updated!</h2>
//           <p><strong>Check-in:</strong> ${updates.check_in}</p>
//           <p><strong>Check-out:</strong> ${updates.check_out}</p>
//           <p><strong>Guests:</strong> ${updates.guests}</p>
//         `,
//         };

//         await fetch("http://localhost:3000/send_email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(emailPayload),
//         });
//       } catch (emailErr) {
//         console.error("Failed to send update email:", emailErr);
//       }

//       return { success: true, message: "Booking updated successfully." };
//     } catch (err) {
//       console.error("updateBooking unexpected error:", err);
//       return {
//         success: false,
//         message: "Unexpected error while updating booking.",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------------
//    * Cancel a booking
//    * ------------------------- */
//   const cancelBooking = async (
//     bookingId: string
//   ): Promise<{ success: boolean; message?: string }> => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         return { success: false, message: "User not authenticated." };
//       }

//       const { error: deleteError } = await supabase
//         .from("bookings")
//         .delete()
//         .eq("id", bookingId)
//         .eq("user_id", user.id);

//       if (deleteError) {
//         console.error("Error cancelling booking:", deleteError);
//         return { success: false, message: "Failed to cancel booking." };
//       }

//       // Update local state
//       setBookings((prev) => prev.filter((b) => b.id !== bookingId));

//       // Optional: send cancellation email
//       try {
//         const emailPayload = {
//           email: user.email,
//           subject: "Your Booking Cancellation",
//           body: `
//           <h2>Your Booking Has Been Cancelled</h2>
//           <p>Booking ID: ${bookingId}</p>
//         `,
//         };

//         await fetch("http://localhost:3000/send_email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(emailPayload),
//         });
//       } catch (emailErr) {
//         console.error("Failed to send cancellation email:", emailErr);
//       }

//       return { success: true, message: "Booking cancelled successfully." };
//     } catch (err) {
//       console.error("cancelBooking unexpected error:", err);
//       return {
//         success: false,
//         message: "Unexpected error while cancelling booking.",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         bookRoom,
//         searchAvailableRooms,
//         updateBooking, // <-- add here
//         cancelBooking,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// /* Hook */
// // eslint-disable-next-line react-refresh/only-export-components
// export const useBooking = (): BookingContextType => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
// };

// export default {
//   BookingProvider,
//   useBooking,
// };

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
//   user_id?: string;
// };

// type Review = {
//   id: string;
//   booking_id: string;
//   room_id: string;
//   user_id: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// };

// type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;
//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ success: boolean; message?: string }>;
//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
//   updateBooking: (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ) => Promise<{ success: boolean; message?: string }>;
//   cancelBooking: (
//     bookingId: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   submitReview: (
//     bookingId: string,
//     rating: number,
//     comment: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
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

//   /* Fetch bookings */
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

//       let query = supabase.from("bookings").select("*").eq("user_id", user.id);
//       if (roomId) query = query.eq("room_id", roomId.trim());

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
//   }, []);

//   /* Book a room */
//   const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();
//       if (!user || userError)
//         return { success: false, message: "User not authenticated." };

//       const sanitized = {
//         room_id: newBooking.room_id.trim(),
//         check_in: newBooking.check_in.trim(),
//         check_out: newBooking.check_out.trim(),
//         guests: newBooking.guests,
//         user_id: user.id,
//       };

//       console.log("Booking payload for insert:", sanitized);

//       const { data: inserted, error: insertError } = await supabase
//         .from("bookings")
//         .insert([sanitized])
//         .select();

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

//       if (inserted) {
//         setBookings((prev) => [...prev, ...(inserted as Booking[])]);
//       }

//       // const sanitized = {
//       //   room_id: newBooking.room_id.trim(),
//       //   check_in: newBooking.check_in,
//       //   check_out: newBooking.check_out,
//       //   guests: newBooking.guests,
//       //   user_id: user.id,
//       // };

//       // const { data: inserted, error: insertError } = await supabase
//       //   .from("bookings")
//       //   .insert([sanitized])
//       //   .select();

//       // if (insertError) {
//       //   if (
//       //     insertError.code === "23505" ||
//       //     insertError.message?.includes("no_overlapping_bookings")
//       //   ) {
//       //     return {
//       //       success: false,
//       //       message: "Selected dates overlap with an existing booking.",
//       //     };
//       //   }
//       //   return { success: false, message: "Failed to create booking." };
//       // }

//       // if (inserted)
//       //   setBookings((prev) => [...prev, ...(inserted as Booking[])]);

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

//   /* Search rooms */
//   const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
//     try {
//       return await searchRoomsService(checkIn, checkOut);
//     } catch (err) {
//       console.error("searchAvailableRooms error:", err);
//       return {
//         success: false,
//         rooms: [],
//         message: "Failed to fetch available rooms.",
//       };
//     }
//   };

//   /* Update a booking */
//   const updateBooking = async (bookingId: string, updates: any) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "User not authenticated." };

//       const { data: updated, error: updateError } = await supabase
//         .from("bookings")
//         .update(updates)
//         .eq("id", bookingId)
//         .eq("user_id", user.id)
//         .select();

//       if (updateError)
//         return { success: false, message: "Failed to update booking." };
//       if (updated)
//         setBookings((prev) =>
//           prev.map((b) => (b.id === bookingId ? updated[0] : b))
//         );

//       return { success: true, message: "Booking updated successfully." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Cancel booking */
//   const cancelBooking = async (bookingId: string) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "User not authenticated." };

//       const { error: deleteError } = await supabase
//         .from("bookings")
//         .delete()
//         .eq("id", bookingId)
//         .eq("user_id", user.id);
//       if (deleteError)
//         return { success: false, message: "Failed to cancel booking." };

//       setBookings((prev) => prev.filter((b) => b.id !== bookingId));
//       return { success: true, message: "Booking cancelled successfully." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Submit review */
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

//       const { error } = await supabase.from("reviews").insert({
//         booking_id: bookingId,
//         room_id: booking.room_id.trim(),
//         user_id: user.id,
//         rating,
//         comment,
//       });

//       if (error) throw error;
//       return { success: true, message: "Review submitted!" };
//     } catch (err: any) {
//       return { success: false, message: err.message };
//     }
//   };

//   /* Fetch reviews by room */
//   const fetchReviewsByRoom = async (roomId: string): Promise<Review[]> => {
//     const { data, error } = await supabase
//       .from("reviews")
//       .select("*")
//       .eq("room_id", roomId.trim());
//     return error ? [] : (data as Review[]);
//   };

//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         bookRoom,
//         searchAvailableRooms,
//         updateBooking,
//         cancelBooking,
//         submitReview,
//         fetchReviewsByRoom,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// /* Hook */
// // eslint-disable-next-line react-refresh/only-export-components
// export const useBooking = (): BookingContextType => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
// };

// export default { BookingProvider, useBooking };

// // ❌ invalid input syntax for type uuid: "441a0898-1daa-4c30-9143-aa3a020e7379	"

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
//   user_id?: string;
// };

// type Review = {
//   id: string;
//   booking_id: string;
//   room_id: string;
//   user_id: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// };

// type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;
//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ success: boolean; message?: string }>;
//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
//   updateBooking: (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ) => Promise<{ success: boolean; message?: string }>;
//   cancelBooking: (
//     bookingId: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   submitReview: (
//     bookingId: string,
//     rating: number,
//     comment: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
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

//   /* Fetch bookings */
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

//       let query = supabase.from("bookings").select("*").eq("user_id", user.id);
//       if (roomId) query = query.eq("room_id", roomId.trim());

//       const { data, error } = await query;
//       if (error) setBookings([]);
//       else setBookings((data as Booking[]) || []);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

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

//   /* ---------------------------------------
//    * BOOK ROOM
//    * --------------------------------------- */
//   const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//         error: authErr,
//       } = await supabase.auth.getUser();
//       if (!user || authErr)
//         return { success: false, message: "User not authenticated." };

//       const sanitized = {
//         room_id: newBooking.room_id.trim(),
//         check_in: newBooking.check_in.trim(),
//         check_out: newBooking.check_out.trim(),
//         guests: newBooking.guests,
//         user_id: user.id,
//       };

//       const { data: inserted, error: insertError } = await supabase
//         .from("bookings")
//         .insert([sanitized])
//         .select();

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
//         return { success: false, message: "Failed to create booking." };
//       }

//       if (inserted) {
//         setBookings((prev) => [...prev, ...(inserted as Booking[])]);
//       }

//       /* EMAIL CONFIRMATION */
//       // await sendEmail(
//       //   user.email!,
//       //   "Your Booking Confirmation",
//       //   `
//       //   <h2>Your Booking is Confirmed!</h2>
//       //   <p><strong>Check-in:</strong> ${sanitized.check_in}</p>
//       //   <p><strong>Check-out:</strong> ${sanitized.check_out}</p>
//       //   <p><strong>Guests:</strong> ${sanitized.guests}</p>
//       // `
//       // );

//       await sendEmail(
//         user.email!,
//         "Your Booking Has Been Confirmed",
//         `
//   <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
//     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
//            style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

//       <!-- HEADER -->
//       <tr>
//         <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
//           <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
//             Your Booking Has Been Confirmed
//           </h2>
//         </td>
//       </tr>

//       <!-- BODY -->
//       <tr>
//         <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
//           <p>Hello <strong>${user.name ?? user.email}</strong>,</p>

//           <p>We wanted to let you know that your booking has been confirmed. Here are the booking details:</p>

//           <!-- UPDATED BOOKING DETAILS -->
//           <div style="
//               background:#f9f9f9;
//               border:1px solid #e5e7eb;
//               padding:16px;
//               margin:18px 0;
//               border-radius:6px;
//           ">
//             <p style="margin:6px 0;"><strong>Check-in:</strong> ${
//               sanitized.check_in
//             }</p>
//             <p style="margin:6px 0;"><strong>Check-out:</strong> ${
//               sanitized.check_out
//             }</p>
//             <p style="margin:6px 0;"><strong>Guests:</strong> ${
//               sanitized.guests
//             }</p>
//           </div>

//           <p>If you have any questions or need to make changes, feel free to reply to this email or click on the below 'My Trips' button. Thank you!!!</p>

//           <!-- BUTTON -->
//           <div style="text-align:center; margin:24px 0;">
//             <a href="http://localhost:5173/account"
//               style="background:#e26d5c; color:#fff; padding:10px 20px;
//               text-decoration:none; border-radius:5px; font-size:15px;">
//               My Trips
//             </a>
//           </div>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
//           © ${new Date().getFullYear()} GuestEase. All rights reserved.
//         </td>
//       </tr>

//     </table>
//   </div>
//   `
//       );

//       return { success: true, message: "Booking created successfully." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Search rooms */
//   const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
//     try {
//       return await searchRoomsService(checkIn, checkOut);
//     } catch {
//       return { success: false, rooms: [], message: "Error fetching rooms." };
//     }
//   };

//   /* ---------------------------------------
//    * UPDATE BOOKING
//    * --------------------------------------- */
//   const updateBooking = async (bookingId: string, updates: any) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "User not authenticated." };

//       const { data: updated, error } = await supabase
//         .from("bookings")
//         .update(updates)
//         .eq("id", bookingId)
//         .eq("user_id", user.id)
//         .select();

//       if (error)
//         return { success: false, message: "Failed to update booking." };

//       if (updated)
//         setBookings((prev) =>
//           prev.map((b) => (b.id === bookingId ? updated[0] : b))
//         );

//       /* EMAIL NOTICE */
//       await sendEmail(
//         user.email!,
//         "Your Booking Was Updated",
//         `
//   <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
//     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
//            style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

//       <!-- HEADER -->
//       <tr>
//         <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
//           <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
//             Your Booking Has Been Updated
//           </h2>
//         </td>
//       </tr>

//       <!-- BODY -->
//       <tr>
//         <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
//           <p>Hello <strong>${user.name ?? user.email}</strong>,</p>

//           <p>We wanted to let you know that your booking has been successfully updated. Here are the latest details:</p>

//           <!-- UPDATED BOOKING DETAILS -->
//           <div style="
//               background:#f9f9f9;
//               border:1px solid #e5e7eb;
//               padding:16px;
//               margin:18px 0;
//               border-radius:6px;
//           ">
//             <p style="margin:6px 0;"><strong>Check-in:</strong> ${
//               updates.check_in
//             }</p>
//             <p style="margin:6px 0;"><strong>Check-out:</strong> ${
//               updates.check_out
//             }</p>
//             <p style="margin:6px 0;"><strong>Guests:</strong> ${
//               updates.guests
//             }</p>
//           </div>

//           <p>If you have any questions or need to make further changes, feel free to reply to this email or click on the below 'My Trips' button. Thank you!!!</p>

//           <!-- BUTTON -->
//           <div style="text-align:center; margin:24px 0;">
//             <a href="http://localhost:5173/account"
//               style="background:#e26d5c; color:#fff; padding:10px 20px;
//               text-decoration:none; border-radius:5px; font-size:15px;">
//               My Trips
//             </a>
//           </div>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
//           © ${new Date().getFullYear()} GuestEase. All rights reserved.
//         </td>
//       </tr>

//     </table>
//   </div>
//   `
//       );

//       //         <p style="margin-top:24px;">Warm regards,<br>
//       //         <strong>GuestEase</strong></p>
//       //       </td>
//       //     </tr>

//       //     <!-- FOOTER -->
//       //     <tr>
//       //       <td style="padding:12px; font-size:12px; text-align:center; color:#777; background:#fafafa;">
//       //         © GuestEase. All rights reserved.
//       //       </td>
//       //     </tr>

//       //   </table>
//       // </div>

//       //         <h2>Your Booking Has Been Updated</h2>
//       //         <p><strong>Check-in:</strong> ${updates.check_in}</p>
//       //         <p><strong>Check-out:</strong> ${updates.check_out}</p>
//       //         <p><strong>Guests:</strong> ${updates.guests}</p>
//       //       `
//       //       );

//       return { success: true, message: "Booking updated successfully." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------------------------------
//    * CANCEL BOOKING
//    * --------------------------------------- */
//   const cancelBooking = async (bookingId: string) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "User not authenticated." };

//       const { error } = await supabase
//         .from("bookings")
//         .delete()
//         .eq("id", bookingId)
//         .eq("user_id", user.id);

//       if (error)
//         return { success: false, message: "Failed to cancel booking." };

//       setBookings((prev) => prev.filter((b) => b.id !== bookingId));

//       /* EMAIL NOTICE */
//       // await sendEmail(
//       //   user.email!,
//       //   "Your Booking Has Been Cancelled",
//       //   `
//       //   <h2>Your Booking Has Been Cancelled</h2>
//       //   <p>Booking ID: ${bookingId}</p>
//       // `
//       // );

//       /* EMAIL NOTICE */
//       await sendEmail(
//         user.email!,
//         "Your Booking Has Been Cancelled 😢",
//         `
//   <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
//     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
//            style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

//       <!-- HEADER -->
//       <tr>
//         <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
//           <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
//             Your Booking Has Been Cancelled 😢
//           </h2>
//         </td>
//       </tr>

//       <!-- BODY -->
//       <tr>
//         <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
//           <p>Hello <strong>${user.name ?? user.email}</strong>,</p>

//           <p>We’re sorry to hear that you won’t be staying with GuestEase. Here are the details of your booking cancellation:</p>

//           <!-- CANCELLED BOOKING DETAILS -->
//           <div style="
//               background:#f9f9f9;
//               border:1px solid #e5e7eb;
//               padding:16px;
//               margin:18px 0;
//               border-radius:6px;
//           ">
//             <p style="margin:6px 0;"><strong>Booking ID:</strong> ${bookingId}</p>

//           </div>

//           <p>If you have any questions or want to make a new booking, feel free to reply to this email or click the 'My Trips' button below.</p>

//           <!-- BUTTON -->
//           <div style="text-align:center; margin:24px 0;">
//             <a href="http://localhost:5173/account"
//                style="background:#e26d5c; color:#fff; padding:10px 20px;
//                       text-decoration:none; border-radius:5px; font-size:15px;">
//               My Trips
//             </a>
//           </div>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
//           © ${new Date().getFullYear()} GuestEase. All rights reserved.
//         </td>
//       </tr>

//     </table>
//   </div>
//   `
//       );

//       return { success: true, message: "Booking cancelled successfully." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Submit review */
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

//       const { error } = await supabase.from("reviews").insert({
//         booking_id: bookingId,
//         room_id: booking.room_id.trim(),
//         user_id: user.id,
//         rating,
//         comment,
//       });

//       if (error) throw error;

//       return { success: true, message: "Review submitted!" };
//     } catch (err: any) {
//       return { success: false, message: err.message };
//     }
//   };

//   /* Fetch reviews */
//   const fetchReviewsByRoom = async (roomId: string): Promise<Review[]> => {
//     const { data, error } = await supabase
//       .from("reviews")
//       .select("*")
//       .eq("room_id", roomId.trim());

//     return error ? [] : (data as Review[]);
//   };

//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         bookRoom,
//         searchAvailableRooms,
//         updateBooking,
//         cancelBooking,
//         submitReview,
//         fetchReviewsByRoom,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// /* Hook */
// // eslint-disable-next-line react-refresh/only-export-components
// export const useBooking = (): BookingContextType => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
// };

// export default { BookingProvider, useBooking };

// import React, { createContext, useCallback, useContext, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { searchAvailableRooms as searchRoomsService } from "../supabase/roomService";

// export type Booking = {
//   id?: string;
//   room_id: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   total_price?: number;
//   created_at?: string;
//   user_id?: string;
// };

// export type Review = {
//   id: string;
//   booking_id: string;
//   room_id: string;
//   user_id: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// };

// export type BookingContextType = {
//   bookings: Booking[];
//   loading: boolean;
//   fetchBookings: (roomId?: string) => Promise<void>;
//   bookRoom: (
//     b: Omit<Booking, "id" | "created_at">
//   ) => Promise<{ success: boolean; message?: string }>;
//   searchAvailableRooms: (
//     checkIn: string,
//     checkOut: string
//   ) => Promise<{ success: boolean; rooms: any[]; message?: string }>;
//   updateBooking: (
//     bookingId: string,
//     updates: Partial<Omit<Booking, "id" | "created_at" | "user_id">>
//   ) => Promise<{ success: boolean; message?: string }>;
//   cancelBooking: (
//     bookingId: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   submitReview: (
//     bookingId: string,
//     rating: number,
//     comment: string
//   ) => Promise<{ success: boolean; message?: string }>;
//   fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
//   storePayment: (payment: {
//     payment_intent_id: string;
//     amount: number;
//     booking_id: string;
//     user_id: string;
//   }) => Promise<{ success: boolean; message?: string }>;
// };

// const BookingContext = createContext<BookingContextType | undefined>(undefined);

// export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchBookings = useCallback(async (roomId?: string) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return setBookings([]);

//       let query = supabase.from("bookings").select("*").eq("user_id", user.id);
//       if (roomId) query = query.eq("room_id", roomId.trim());
//       const { data, error } = await query;
//       if (error) setBookings([]);
//       else setBookings((data as Booking[]) || []);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

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

//   const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "User not authenticated." };

//       const sanitized = {
//         ...newBooking,
//         user_id: user.id,
//         total_price: newBooking.total_price || 0,
//       };

//       const { data: inserted, error: insertError } = await supabase
//         .from("bookings")
//         .insert([sanitized])
//         .select(); // ⚡ important to select inserted row
//       if (insertError) return { success: false, message: insertError.message };

//       if (!inserted || inserted.length === 0)
//         return { success: false, message: "Booking insertion failed" };

//       const bookingInserted = inserted[0] as Booking;
//       setBookings((prev) => [...prev, bookingInserted]);

//       // send confirmation email
//       await sendEmail(
//         user.email!,
//         "Booking Confirmed",
//         `<p>Your booking has been confirmed.</p>`
//       );

//       // ✅ return booking object
//       return { success: true, booking: bookingInserted };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
//     try {
//       return await searchRoomsService(checkIn, checkOut);
//     } catch {
//       return { success: false, rooms: [], message: "Error fetching rooms." };
//     }
//   };

//   const updateBooking = async (bookingId: string, updates: any) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "Not authenticated." };

//       const { data: updated, error } = await supabase
//         .from("bookings")
//         .update(updates)
//         .eq("id", bookingId)
//         .eq("user_id", user.id)
//         .select();
//       if (error)
//         return { success: false, message: "Failed to update booking." };
//       if (updated)
//         setBookings((prev) =>
//           prev.map((b) => (b.id === bookingId ? updated[0] : b))
//         );

//       return { success: true };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const storePayment = async (paymentData: any) => {
//     try {
//       const res = await fetch("http://localhost:3000/store-payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(paymentData),
//       });
//       return await res.json();
//     } catch (error) {
//       console.error("Store payment error:", error);
//       return { success: false, message: "Payment save failed" };
//     }
//   };

//   const cancelBooking = async (bookingId: string) => {
//     setLoading(true);
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return { success: false, message: "Not authenticated." };

//       await supabase
//         .from("bookings")
//         .delete()
//         .eq("id", bookingId)
//         .eq("user_id", user.id);
//       setBookings((prev) => prev.filter((b) => b.id !== bookingId));

//       return { success: true };
//     } finally {
//       setLoading(false);
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

//   const fetchReviewsByRoom = async (roomId: string) => {
//     const { data, error } = await supabase
//       .from("reviews")
//       .select("*")
//       .eq("room_id", roomId.trim());
//     return error ? [] : (data as Review[]);
//   };

//   return (
//     <BookingContext.Provider
//       value={{
//         bookings,
//         loading,
//         fetchBookings,
//         bookRoom,
//         searchAvailableRooms,
//         updateBooking,
//         cancelBooking,
//         submitReview,
//         fetchReviewsByRoom,
//         storePayment,
//       }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };

// export const useBooking = () => {
//   const ctx = useContext(BookingContext);
//   if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
//   return ctx;
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
  total_price?: number;
  created_at?: string;
  user_id?: string;
};

export type Review = {
  id: string;
  booking_id: string;
  room_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type BookingContextType = {
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
  ) => Promise<{ success: boolean; message?: string }>;
  submitReview: (
    bookingId: string,
    rating: number,
    comment: string
  ) => Promise<{ success: boolean; message?: string }>;
  fetchReviewsByRoom: (roomId: string) => Promise<Review[]>;
  storePayment: (payment: {
    payment_intent_id: string;
    amount: number;
    booking_id: string;
    user_id: string;
  }) => Promise<{ success: boolean; message?: string }>;
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

  const fetchBookings = useCallback(async (roomId?: string) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setBookings([]);

      let query = supabase.from("bookings").select("*").eq("user_id", user.id);
      if (roomId) query = query.eq("room_id", roomId.trim());
      const { data, error } = await query;
      if (error) setBookings([]);
      else setBookings((data as Booking[]) || []);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------------------------------
   * EMAIL HELPER FUNCTION
   * --------------------------------------- */
  const sendEmail = async (email: string, subject: string, body: string) => {
    try {
      await fetch("http://localhost:3000/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, body }),
      });
    } catch (err) {
      console.error("Email send failed:", err);
    }
  };

  /* ---------------------------------------
   * BOOK ROOM
   * --------------------------------------- */
  const bookRoom = async (newBooking: Omit<Booking, "id" | "created_at">) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, message: "User not authenticated." };

      const sanitized = {
        ...newBooking,
        user_id: user.id,
        total_price: newBooking.total_price || 0,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("bookings")
        .insert([sanitized])
        .select(); // ⚡ important to select inserted row
      if (insertError) return { success: false, message: insertError.message };

      if (!inserted || inserted.length === 0)
        return { success: false, message: "Booking insertion failed" };

      const bookingInserted = inserted[0] as Booking;
      setBookings((prev) => [...prev, bookingInserted]);

      // send confirmation email
      await sendEmail(
        user.email!,
        "Your Booking Has Been Confirmed",
        `
  <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

      <!-- HEADER -->
      <tr>
        <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
            Your Booking Has Been Confirmed
          </h2>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${user.name ?? user.email}</strong>,</p>

          <p>We wanted to let you know that your booking has been confirmed. Here are the booking details:</p>

          <!-- UPDATED BOOKING DETAILS -->
          <div style="
              background:#f9f9f9;
              border:1px solid #e5e7eb;
              padding:16px;
              margin:18px 0;
              border-radius:6px;
          ">
            <p style="margin:6px 0;"><strong>Check-in:</strong> ${
              sanitized.check_in
            }</p>
            <p style="margin:6px 0;"><strong>Check-out:</strong> ${
              sanitized.check_out
            }</p>
            <p style="margin:6px 0;"><strong>Guests:</strong> ${
              sanitized.guests
            }</p>
          </div>

          <p>If you have any questions or need to make changes, feel free to reply to this email or click on the below 'My Trips' button. Thank you!!!</p>

          <!-- BUTTON -->
          <div style="text-align:center; margin:24px 0;">
            <a href="http://localhost:5173/account"
              style="background:#e26d5c; color:#fff; padding:10px 20px;
              text-decoration:none; border-radius:5px; font-size:15px;">
              My Trips
            </a>
          </div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `
      );

      // ✅ return booking object
      return { success: true, booking: bookingInserted };
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableRooms = async (checkIn: string, checkOut: string) => {
    try {
      return await searchRoomsService(checkIn, checkOut);
    } catch {
      return { success: false, rooms: [], message: "Error fetching rooms." };
    }
  };

  /* ---------------------------------------
   * UPDATE BOOKING
   * --------------------------------------- */
  const updateBooking = async (bookingId: string, updates: any) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, message: "Not authenticated." };

      const { data: updated, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .select();
      if (error)
        return { success: false, message: "Failed to update booking." };
      if (updated)
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updated[0] : b))
        );

      /* EMAIL NOTICE */
      await sendEmail(
        user.email!,
        "Your Booking Was Updated",
        `
  <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">

      <!-- HEADER -->
      <tr>
        <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">
            Your Booking Has Been Updated
          </h2>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">
          <p>Hello <strong>${user.name ?? user.email}</strong>,</p>

          <p>We wanted to let you know that your booking has been successfully updated. Here are the latest details:</p>

          <!-- UPDATED BOOKING DETAILS -->
          <div style="
              background:#f9f9f9;
              border:1px solid #e5e7eb;
              padding:16px;
              margin:18px 0;
              border-radius:6px;
          ">
            <p style="margin:6px 0;"><strong>Check-in:</strong> ${
              updates.check_in
            }</p>
            <p style="margin:6px 0;"><strong>Check-out:</strong> ${
              updates.check_out
            }</p>
            <p style="margin:6px 0;"><strong>Guests:</strong> ${
              updates.guests
            }</p>
          </div>

          <p>If you have any questions or need to make further changes, feel free to reply to this email or click on the below 'My Trips' button. Thank you!!!</p>

          <!-- BUTTON -->
          <div style="text-align:center; margin:24px 0;">
            <a href="http://localhost:5173/account"
              style="background:#e26d5c; color:#fff; padding:10px 20px;
              text-decoration:none; border-radius:5px; font-size:15px;">
              My Trips
            </a>
          </div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="text-align:center; padding:16px; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} GuestEase. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `
      );

      //         <p style="margin-top:24px;">Warm regards,<br>
      //         <strong>GuestEase</strong></p>
      //       </td>
      //     </tr>

      //     <!-- FOOTER -->
      //     <tr>
      //       <td style="padding:12px; font-size:12px; text-align:center; color:#777; background:#fafafa;">
      //         © GuestEase. All rights reserved.
      //       </td>
      //     </tr>

      //   </table>
      // </div>

      //         <h2>Your Booking Has Been Updated</h2>
      //         <p><strong>Check-in:</strong> ${updates.check_in}</p>
      //         <p><strong>Check-out:</strong> ${updates.check_out}</p>
      //         <p><strong>Guests:</strong> ${updates.guests}</p>
      //       `
      //       );

      return { success: true, message: "Booking updated successfully." };
    } finally {
      setLoading(false);
    }
  };

  const storePayment = async (paymentData: any) => {
    try {
      const res = await fetch("http://localhost:3000/store-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      return await res.json();
    } catch (error) {
      console.error("Store payment error:", error);
      return { success: false, message: "Payment save failed" };
    }
  };

  /* ---------------------------------------

   * CANCEL BOOKING

   * --------------------------------------- */
  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, message: "Not authenticated." };

      await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId)
        .eq("user_id", user.id);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));

      /* EMAIL NOTICE */

      await sendEmail(
        user.email!,

        "Your Booking Has Been Cancelled 😢",

        `

  <div style="background:#fafafa; padding:20px; font-family:Arial, sans-serif;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"

           style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb;">



      <!-- HEADER -->

      <tr>

        <td style="padding:20px; text-align:center; background:#e26d5c; border-bottom:1px solid #e5e7eb;">

          <h2 style="margin:0; font-weight:600; font-size:20px; color:#fff;">

            Your Booking Has Been Cancelled 😢

          </h2>

        </td>

      </tr>



      <!-- BODY -->

      <tr>

        <td style="padding:24px; color:#444; font-size:15px; line-height:1.6;">

          <p>Hello <strong>${user.name ?? user.email}</strong>,</p>



          <p>We’re sorry to hear that you won’t be staying with GuestEase. Here are the details of your booking cancellation:</p>



          <!-- CANCELLED BOOKING DETAILS -->

          <div style="

              background:#f9f9f9;

              border:1px solid #e5e7eb;

              padding:16px;

              margin:18px 0;

              border-radius:6px;

          ">

            <p style="margin:6px 0;"><strong>Booking ID:</strong> ${bookingId}</p>

        

          </div>



          <p>If you have any questions or want to make a new booking, feel free to reply to this email or click the 'My Trips' button below.</p>



          <!-- BUTTON -->

          <div style="text-align:center; margin:24px 0;">

            <a href="http://localhost:5173/account"

               style="background:#e26d5c; color:#fff; padding:10px 20px;

                      text-decoration:none; border-radius:5px; font-size:15px;">

              My Trips

            </a>

          </div>

        </td>

      </tr>



      <!-- FOOTER -->

      <tr>

        <td style="text-align:center; padding:16px; font-size:12px; color:#777;">

          © ${new Date().getFullYear()} GuestEase. All rights reserved.

        </td>

      </tr>



    </table>

  </div>

  `
      );

      return { success: true };
    } finally {
      setLoading(false);
    }
  };

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
      if (!booking) return { success: false, message: "Booking not found." };

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { success: false, message: "Not authenticated." };

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

  /* Fetch reviews */
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
        bookings,
        loading,
        fetchBookings,
        bookRoom,
        searchAvailableRooms,
        updateBooking,
        cancelBooking,
        submitReview,
        fetchReviewsByRoom,
        storePayment,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

/* Hook */

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside a BookingProvider");
  return ctx;
};
