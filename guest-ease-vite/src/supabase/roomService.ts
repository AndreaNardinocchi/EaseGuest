// roomService.ts
import { supabase } from "../supabaseClient";

export const searchAvailableRooms = async (
  checkIn: string,
  checkOut: string
) => {
  try {
    const { data, error } = await supabase.rpc("get_available_rooms", {
      _check_in: checkIn,
      _check_out: checkOut,
    });

    if (error) throw error;

    return { success: true, rooms: data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error fetching rooms:", err);
    return { success: false, rooms: [], message: err.message };
  }
};
