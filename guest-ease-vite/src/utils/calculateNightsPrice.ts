export function calculateNightsPrice(
  checkIn: string,
  checkOut: string,
  pricePerNight: number
) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  // If dates are invalid, return safe defaults
  if (isNaN(start) || isNaN(end)) {
    return { nights: 0, total: 0 };
  }

  const nights = Math.max(0, (end - start) / (1000 * 60 * 60 * 24));

  const total = nights * (pricePerNight || 0);

  return { nights, total };
}
