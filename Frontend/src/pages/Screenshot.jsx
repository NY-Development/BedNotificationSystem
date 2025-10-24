import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { uploadPaymentScreenshot } from "../services/payment";
import { Loader2, FileImage, Upload, CheckCircle, X, Clipboard, DollarSign, Tag } from "lucide-react"; // Added Clipboard, DollarSign, Tag for beautification
import GoBack from "../components/GoBack";
import { useNavigate, Link } from "react-router-dom";

const Screenshot = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false); // State for copy action

  const storedPlan = localStorage.getItem("selectedPlan") || "monthly";
  const plan = storedPlan;
  const amount = plan === "monthly" ? 100 : 1000;

  const AccountNumber = 1000403196928;
  const AccountName = "Yamlak Negash Dugo";

    if (localStorage.getItem("selectedPlan") === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-6xl mb-4 text-red-500">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-lg text-gray-600 mb-6">Please register to view this page.</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full shadow-lg transform hover:scale-[1.02]"
          >
            Register Now
          </Link>
        </div>
      </div>
    );
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
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


  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a screenshot file first.");

    try {
      setLoading(true);
      const res = await uploadPaymentScreenshot(file);
      toast.success(res.message || "Screenshot uploaded successfully!");
      
      // Clear inputs and preview
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      localStorage.removeItem("selectedPlan");

      // Show modal instead of toast
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

        {/* Payment Summary Box */}
        <div className="space-y-4 mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            
            {/* Plan and Amount */}
            <div className="flex justify-between items-center text-lg font-medium text-gray-700">
                <div className="flex items-center text-indigo-700">
                    <Tag className="w-5 h-5 mr-2"/>
                    <span>Plan:</span>
                </div>
                <span className="font-semibold text-indigo-800">
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </span>
            </div>

            <div className="flex justify-between items-center text-xl font-bold text-gray-800 border-t pt-3 border-indigo-200">
                <div className="flex items-center text-indigo-700">
                    <DollarSign className="w-5 h-5 mr-2"/>
                    <span>Total Amount:</span>
                </div>
                <span className="text-2xl text-green-600">{amount} ETB</span>
            </div>

            {/* Account Details */}
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
                                className={`p-1 rounded-full transition duration-150 ${copied ? 'bg-green-500 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
                                aria-label="Copy Account Number"
                            >
                                <Clipboard className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          
            <div className="flex flex-col items-center">
                <label className="text-gray-700 font-medium mb-3">Upload Screenshot</label>
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

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 transition-transform duration-300">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upload Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment screenshot has been sent for admin review. Please check your email for confirmation.
            </p>
            <p className="text-sm text-indigo-500">
              Redirecting to login shortly...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenshot;