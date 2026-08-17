/**
 * Utility: fareCalculator
 * Utility functions for calculating Haversine distance, ETA, and formatting price in ETB.
 */

/**
 * Calculates straight-line (Haversine) distance between two GPS coordinates in km
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.5;

  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.max(0.5, Math.round(distance * 10) / 10);
}

/**
 * Estimate travel time in minutes based on distance
 */
export function calculateEstimatedMinutes(distanceKm, speedKmh = 25) {
  const hours = distanceKm / speedKmh;
  const minutes = Math.ceil(hours * 60) + 3; // 3 mins pickup buffer
  return Math.max(3, minutes);
}

/**
 * Format currency to Ethiopian Birr (ETB)
 */
export function formatCurrencyETB(amount) {
  const num = Math.round(amount || 0);
  return `${num.toLocaleString()} ETB`;
}

export function calculateSurgePrice(basePrice, multiplier = 1.0) {
  return Math.round((basePrice || 0) * multiplier);
}
