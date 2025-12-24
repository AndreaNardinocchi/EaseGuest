// utils/calculateAverageRating.ts

import type { Review } from "../types/interfaces";

export function calculateAverageRating(reviews: Review[] = []): number {
  const visibleReviews = reviews.filter(
    (r) => r.visibility_status === "visible"
  );

  if (visibleReviews.length === 0) return 0;

  const total = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
  return Number((total / visibleReviews.length).toFixed(1)); // e.g. 4.3
}
