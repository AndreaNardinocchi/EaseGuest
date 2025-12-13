// import React, { useEffect, useState } from "react";
// import { useBooking } from "../../context/bookingContext";
// import type { Review } from "../../types/interfaces";
// import { Box, Typography, CircularProgress } from "@mui/material";

// interface BookingReviewsProps {
//   roomId: string;
// }

// const BookingReviews: React.FC<BookingReviewsProps> = ({ roomId }) => {
//   const { fetchReviewsByRoom } = useBooking(); // ✅ get the function from context
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadReviews = async () => {
//       setLoading(true);
//       const fetchedReviews = await fetchReviewsByRoom(roomId); // ✅ fetch all past reviews
//       setReviews(fetchedReviews);
//       setLoading(false);
//     };

//     loadReviews();
//   }, [roomId, fetchReviewsByRoom]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (reviews.length === 0) {
//     return <Typography>No reviews yet.</Typography>;
//   }

//   return (
//     <Box mt={3}>
//       <Typography variant="h6">Reviews:</Typography>
//       {reviews.map((review) => (
//         <Box
//           key={review.id}
//           mt={2}
//           p={2}
//           border="1px solid #ccc"
//           borderRadius={2}
//         >
//           <Typography>
//             <strong>User:</strong> {review.user_id}
//           </Typography>
//           <Typography>
//             <strong>Rating:</strong> {review.rating} / 5
//           </Typography>
//           <Typography>
//             <strong>Comment:</strong> {review.comment}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {new Date(review.created_at!).toLocaleDateString()}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default BookingReviews;

// import React, { useEffect, useState } from "react";
// import { useBooking } from "../../context/bookingContext";
// import type { Review } from "../../types/interfaces";
// import { Box, Typography, CircularProgress } from "@mui/material";
// import { supabase } from "../../supabaseClient"; // make sure you import your Supabase client

// interface BookingReviewsProps {
//   roomId: string;
// }

// interface ReviewWithName extends Review {
//   guestName: string;
// }

// const BookingReviews: React.FC<BookingReviewsProps> = ({ roomId }) => {
//   const { fetchReviewsByRoom } = useBooking();
//   const [reviews, setReviews] = useState<ReviewWithName[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadReviews = async () => {
//       setLoading(true);

//       try {
//         const fetchedReviews = await fetchReviewsByRoom(roomId);

//         // Map reviews and fetch guest names
//         const reviewsWithNames = await Promise.all(
//           fetchedReviews.map(async (review) => {
//             let guestName = "Guest"; // default
//             if (review.user_id) {
//               const { data: profileData, error } = await supabase
//                 .from("profiles")
//                 .select("first_name, last_name")
//                 .eq("id", review.user_id)
//                 .single();

//               if (!error && profileData) {
//                 const { first_name, last_name } = profileData;
//                 guestName =
//                   first_name || last_name
//                     ? `${first_name || ""} ${last_name || ""}`.trim()
//                     : "Guest";
//               } else {
//                 console.warn(
//                   "Error fetching guest name for user_id:",
//                   review.user_id,
//                   error
//                 );
//               }
//             }

//             return { ...review, guestName };
//           })
//         );

//         setReviews(reviewsWithNames);
//       } catch (err) {
//         console.error("Error loading reviews:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadReviews();
//   }, [roomId, fetchReviewsByRoom]);

//   if (loading) return <CircularProgress />;

//   if (reviews.length === 0) return <Typography>No reviews yet.</Typography>;

//   return (
//     <Box mt={3}>
//       <Typography variant="h6">Reviews:</Typography>
//       {reviews.map((review) => (
//         <Box
//           key={review.id}
//           mt={2}
//           p={2}
//           border="1px solid #ccc"
//           borderRadius={2}
//         >
//           <Typography>
//             <strong>User:</strong> {review.guestName}
//           </Typography>
//           <Typography>
//             <strong>Rating:</strong> {review.rating} / 5
//           </Typography>
//           <Typography>
//             <strong>Comment:</strong> {review.comment}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {new Date(review.created_at!).toLocaleDateString()}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default BookingReviews;

import React, { useEffect, useState } from "react";
import { useBooking } from "../../context/bookingContext";
import type { Review } from "../../types/interfaces";
import { Box, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../../supabaseClient"; // make sure you import your Supabase client

interface BookingReviewsProps {
  roomId: string;
}

interface ReviewWithName extends Review {
  guestName: string;
}

const BookingReviews: React.FC<BookingReviewsProps> = ({ roomId }) => {
  const { fetchReviewsByRoom } = useBooking();
  const [reviews, setReviews] = useState<ReviewWithName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);

      try {
        const fetchedReviews = await fetchReviewsByRoom(roomId);

        // Map reviews and fetch guest names
        const reviewsWithNames = await Promise.all(
          fetchedReviews.map(async (review) => {
            let guestName = "Guest"; // default
            if (review.user_id) {
              const { data: profileData, error } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", review.user_id)
                .single();

              if (!error && profileData) {
                const { first_name, last_name } = profileData;
                guestName =
                  first_name || last_name
                    ? `${first_name || ""} ${last_name || ""}`.trim()
                    : "Guest";
              } else {
                console.warn(
                  "Error fetching guest name for user_id:",
                  review.user_id,
                  error
                );
              }
            }

            return { ...review, guestName };
          })
        );

        setReviews(reviewsWithNames);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [roomId, fetchReviewsByRoom]);

  if (loading) return <CircularProgress />;

  if (reviews.length === 0) return <Typography>No reviews yet.</Typography>;

  return (
    <Box mt={3}>
      <Typography variant="h6">Reviews:</Typography>
      {reviews.map((review) => (
        <Box
          key={review.id}
          mt={2}
          p={2}
          border="1px solid #ccc"
          borderRadius={2}
        >
          <Typography>
            <strong>User:</strong> {review.guestName}
          </Typography>
          <Typography>
            <strong>Rating:</strong> {review.rating} / 5
          </Typography>
          <Typography>
            <strong>Comment:</strong> {review.comment}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(review.created_at!).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BookingReviews;
