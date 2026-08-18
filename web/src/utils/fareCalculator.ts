/**
 * Bahir Dar Ride Fare Calculation Engine
 */

export interface FareCalculationParams {
  distanceKm: number;
  vehicleType: 'bajaj' | 'car' | 'delivery';
  isPeakSurge?: boolean;
}

export function calculateTripFare({ distanceKm, vehicleType, isPeakSurge = false }: FareCalculationParams): {
  baseFare: number;
  distanceFare: number;
  surgeMultiplier: number;
  totalETB: number;
} {
  let baseFare = 15;
  let perKmRate = 4;

  if (vehicleType === 'car') {
    baseFare = 60;
    perKmRate = 15;
  } else if (vehicleType === 'delivery') {
    baseFare = 25;
    perKmRate = 6;
  }

  const distanceFare = distanceKm * perKmRate;
  const surgeMultiplier = isPeakSurge ? 1.3 : 1.0;
  const totalETB = Math.round((baseFare + distanceFare) * surgeMultiplier);

  return {
    baseFare,
    distanceFare: Math.round(distanceFare),
    surgeMultiplier,
    totalETB,
  };
}
