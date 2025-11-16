// // pages/api/admin/bookings.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "../../../supabaseClient";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     // Fetch bookings with related user and room data
//     const { data, error } = await supabase.from("bookings").select(`
//         id,
//         check_in,
//         check_out,
//         guests,
//         user:user_id (id, first_name, last_name, email),
//         room:room_id (id, name)
//       `);

//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json(data);
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// }
