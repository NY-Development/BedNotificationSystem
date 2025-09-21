import API from './axios';

// Initiate payment after OTP verification
export const initiatePayment = async (email) => {
  try {
    const res = await API.post('/payment/initiate', { email });
    return res.data;
  } catch (err) {
    console.error('Payment initiation failed:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Payment initiation failed');
  }
};

// Verify payment from backend after Chapa redirect
export const verifyPayment = async (tx_ref) => {
  try {
    const res = await API.get(`/payment/verify/${tx_ref}`);
    return res.data;
  } catch (err) {
    console.error('Payment verification failed:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Payment verification failed');
  }
};

export const triggerPaymentCallback = async ({ tx_ref, status, email }) => {
  try {
    const res = await API.post('/payment/callback', {
      tx_ref,
      status,
      email,
    });
    return res.data;
  } catch (err) {
    console.error('Payment callback failed:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Payment callback failed');
  }
};