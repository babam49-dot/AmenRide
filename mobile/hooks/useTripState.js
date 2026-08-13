import { useState, useCallback } from 'react';

export const TRIP_STATUSES = {
  IDLE: 'IDLE',
  SEARCHING: 'SEARCHING',
  ACCEPTED: 'ACCEPTED',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export default function useTripState(initialStatus = TRIP_STATUSES.IDLE) {
  const [status, setStatus] = useState(initialStatus);
  const [activeTrip, setActiveTrip] = useState(null);
  const [assignedDriver, setAssignedDriver] = useState(null);

  const startSearch = useCallback((tripData) => {
    setActiveTrip(tripData);
    setStatus(TRIP_STATUSES.SEARCHING);
  }, []);

  const acceptTrip = useCallback((driver) => {
    setAssignedDriver(driver);
    setStatus(TRIP_STATUSES.ACCEPTED);
  }, []);

  const driverArrived = useCallback(() => {
    setStatus(TRIP_STATUSES.ARRIVED);
  }, []);

  const startRide = useCallback(() => {
    setStatus(TRIP_STATUSES.IN_PROGRESS);
  }, []);

  const completeTrip = useCallback(() => {
    setStatus(TRIP_STATUSES.COMPLETED);
  }, []);

  const cancelTrip = useCallback(() => {
    setStatus(TRIP_STATUSES.CANCELLED);
  }, []);

  const resetTrip = useCallback(() => {
    setStatus(TRIP_STATUSES.IDLE);
    setActiveTrip(null);
    setAssignedDriver(null);
  }, []);

  return {
    status,
    activeTrip,
    assignedDriver,
    startSearch,
    acceptTrip,
    driverArrived,
    startRide,
    completeTrip,
    cancelTrip,
    resetTrip,
  };
}
