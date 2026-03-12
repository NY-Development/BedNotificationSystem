import API from "./axios";

// 💰 Initiate payment (for Chapa)
export const initiatePayment = async (email) => {
  try {
    const res = await API.post("/payment/initiate", { email });
    return res.data; // contains checkout_url
  } catch (err) {
    console.error("Payment initiation failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Payment initiation failed");
  }
};

// ✅ Verify payment from backend after redirect
export const verifyPayment = async (tx_ref) => {
  try {
    const res = await API.get(`/payment/verify/${tx_ref}`);
    return res.data;
  } catch (err) {
    console.error("Payment verification failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Payment verification failed");
  }
};

// 🔁 Trigger callback manually (optional)
export const triggerPaymentCallback = async ({ tx_ref, status, email }) => {
  try {
    const res = await API.post("/payment/callback", { tx_ref, status, email });
    return res.data;
  } catch (err) {
    console.error("Payment callback failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Payment callback failed");
  }
};

// 📸 Upload screenshot manually (for offline payments)
export const uploadPaymentScreenshot = async (file) => {
  try {
    const email = localStorage.getItem("email");
    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("email", email);

    const res = await API.post("/payment/upload-screenshot", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Screenshot upload failed:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Screenshot upload failed");
  }
};


// 🤖 AI Payment: Initiate
export const initiateAIPayment = async (email, plan) => {
  try {
    const res = await API.post("/payment/ai/initiate", { email, plan });
    return res.data; 
  } catch (err) {
    throw new Error(err.response?.data?.message || "AI Payment failed");
  }
};

// 📸 AI Payment: Upload Screenshot
export const uploadAIScreenshot = async (file) => {
  try {
    // Create FormData object
    const formData = new FormData();
    
    // IMPORTANT: The key MUST be 'screenshot' to match your backend (req.file)
    formData.append("screenshot", file);

    const res = await API.post("/payment/ai/upload-screenshot", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "AI Screenshot upload failed");
  }
};
