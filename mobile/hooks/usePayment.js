import { useState, useCallback } from 'react';
import { initiatePayment, getPaymentStatus } from '../services/paymentApi';

export default function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const processPayment = useCallback(async ({ tripId, amount, paymentMethod, phoneNumber }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await initiatePayment({ tripId, amount, paymentMethod, phoneNumber });
      setTransaction(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setLoading(false);
      throw err;
    }
  }, []);

  const checkStatus = useCallback(async (transactionId) => {
    if (!transactionId) return;
    try {
      const res = await getPaymentStatus(transactionId);
      setTransaction(res);
      return res;
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    loading,
    error,
    transaction,
    processPayment,
    checkStatus,
  };
}
