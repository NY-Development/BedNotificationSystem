import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { uploadPaymentScreenshot } from "../services/payment";
import {
  Loader2,
  FileImage,
  Upload,
  CheckCircle,
  X,
  Clipboard,
  DollarSign,
  Tag,
} from "lucide-react";
import GoBack from "../components/GoBack";
import { useNavigate, Link } from "react-router-dom";

const Screenshot = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // ✅ Function to dynamically determine amount
  const getSubscriptionAmount = () => {
    const c1YearlyBill = 799.9;
    const c2YearlyBill = 599.9;
    const monthlyBill = 100;

    const role = localStorage.getItem("role");
    const plan = localStorage.getItem("selectedPlan");

    if (plan === "monthly") return monthlyBill;

    if (plan === "yearly") {
      return role === "c1" ? c1YearlyBill : c2YearlyBill;
    }

    return monthlyBill; // default fallback
  };

  const plan = localStorage.getItem("selectedPlan") || "monthly";
  const amount = getSubscriptionAmount();
  const AccountNumber = 1000403196928;
  const AccountName = "Yamlak Negash Dugo";

  // 🚫 If no plan, block access
  if (localStorage.getItem("selectedPlan") === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-6xl mb-4 text-red-500">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-lg text-gray-600 mb-6">
            Please select a subscription plan to view this page.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full shadow-lg transform hover:scale-[1.02]"
          >
            Register Now
          </Link>
        </div>
      </div>
    );
  }

  // 🧩 Prevent user from leaving until upload is complete
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!file) {
        e.preventDefault();
        e.returnValue =
          "You must upload your payment screenshot before leaving this page.";
      }
    };

    const handlePopState = () => {
      if (!file) {
        toast.error("You cannot go back until you upload your screenshot.");
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [file]);

  // 🖼️ File handling
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
    else setPreview(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Account Number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  // 📤 Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a screenshot file first.");

    try {
      setLoading(true);
      const res = await uploadPaymentScreenshot(file);
      toast.success(res.message || "Screenshot uploaded successfully!", {
        duration: 5000,
      });

      // Reset state
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      localStorage.removeItem("selectedPlan");

      setShowModal(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 5000);
    } catch (err) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border-t-8 border-indigo-600 relative">
        <GoBack />
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Payment Details
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Please transfer the amount and upload the screenshot below.
        </p>

        {/* Payment Summary */}
        <div className="space-y-4 mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex justify-between items-center text-lg font-medium text-gray-700">
            <div className="flex items-center text-indigo-700">
              <Tag className="w-5 h-5 mr-2" />
              <span>Plan:</span>
            </div>
            <span className="font-semibold text-indigo-800">
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xl font-bold text-gray-800 border-t pt-3 border-indigo-200">
            <div className="flex items-center text-indigo-700">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Total Amount:</span>
            </div>
            <span className="text-2xl text-green-600">{amount} ETB</span>
          </div>

          <div className="pt-3 border-t border-indigo-200">
            <p className="font-bold text-gray-700 mb-2">Transfer to:</p>
            <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-500">Account Name:</span>
                <span className="font-semibold text-gray-800">{AccountName}</span>
              </div>

              <div className="flex justify-between items-center text-base font-mono">
                <span className="text-gray-500">Account Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-extrabold">{AccountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(AccountNumber.toString())}
                    className={`p-1 rounded-full transition duration-150 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "text-indigo-600 hover:bg-indigo-100"
                    }`}
                    aria-label="Copy Account Number"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="text-gray-700 font-medium mb-3">
              Upload Screenshot
            </label>
            {preview ? (
              <div className="relative mb-4">
                <img
                  src={preview}
                  alt="Payment Preview"
                  className="w-48 h-48 object-cover rounded-xl border-4 border-dashed border-gray-300 shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 -translate-y-2 translate-x-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:bg-red-700 transition-all border-2 border-white"
                  aria-label="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex flex-col items-center justify-center rounded-xl border-4 border-dashed border-gray-300 mb-4 text-gray-500">
                <FileImage className="w-12 h-12 mb-2" />
                <p className="text-sm">No file selected</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Screenshot</span>
              </>
            )}
          </button>

          {preview && !loading && (
            <div className="flex items-center justify-center mt-3 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              File selected and ready to upload
            </div>
          )}
        </form>
      </div>

      {/* ✅ Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 transition-transform duration-300">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upload Complete!
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment screenshot has been sent for admin review.
            </p>
            <p className="text-indigo-600 font-medium mb-2">
              Please wait for confirmation before logging in.
            </p>
            <p className="text-sm text-gray-500 italic">
              Redirecting to login in 5 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenshot;