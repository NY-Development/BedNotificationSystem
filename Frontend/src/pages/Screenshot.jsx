import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  uploadPaymentScreenshot, 
  uploadAIScreenshot 
} from "../services/payment"; // ✅ Using both functions
import {
  Loader2,
  FileImage,
  Upload,
  CheckCircle,
  X,
  Clipboard,
  DollarSign,
  Tag,
  Sparkles,
  Layout,
} from "lucide-react";
import GoBack from "../components/GoBack";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Screenshot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 🗂️ Auto-switch to AI tab if user clicked "Unlock Here" in the Ward
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("ai") === "true" ? "ai" : "platform"
  );

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 🧮 Plan & Role Logic
  const selectedPlan = localStorage.getItem("selectedPlan");
  const role = localStorage.getItem("role") || user?.role;
  const currentPlan = selectedPlan || user?.subscription?.plan || "monthly";

  const getAmount = () => {
    if (activeTab === "ai") {
      // AI Add-on Pricing
      return currentPlan === "yearly" ? 399.9 : 49.9;
    } else {
      // Standard Platform Pricing
      const c1Yearly = 799.9;
      const c2Yearly = 599.9;
      const platformMonthly = 99.9;
      if (currentPlan === "monthly") return platformMonthly;
      if (currentPlan === "yearly") return role === "c1" ? c1Yearly : c2Yearly;
      return platformMonthly;
    }
  };

  const amount = getAmount();
  const AccountNumber = 1000403196928;
  const AccountName = "Yamlak Negash Dugo";

  // 🧩 Navigation Prevention
  useEffect(() => {
    if (isRedirecting) return;
    const handlePopState = () => {
      if (!file) {
        toast.error("Please upload the screenshot before going back.");
        window.history.pushState(null, "", window.location.href);
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [file, isRedirecting]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
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
      toast.success("Account copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Copy failed."); }
  };

  // 📤 Dynamic Upload Handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a screenshot file first.");

    try {
      setLoading(true);
      let res;

      // ✅ Choose the correct service function based on active tab
      if (activeTab === "ai") {
        res = await uploadAIScreenshot(file);
      } else {
        res = await uploadPaymentScreenshot(file);
      }

      toast.success(res.message || "Upload successful!", { duration: 5000 });
      setShowModal(true);
      setIsRedirecting(true);

      setTimeout(() => {
        localStorage.removeItem("selectedPlan");
        sessionStorage.removeItem("ai");
        setShowModal(false);
        navigate("/login");
      }, 5000);
    } catch (err) {
      toast.error(err.message || "Upload failed.");
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  if (!currentPlan && activeTab === 'platform') {
    return <div className="text-center p-20 font-bold">Access Denied. Please select a plan.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border-t-8 transition-all duration-500 relative ${activeTab === 'ai' ? 'border-amber-500' : 'border-indigo-600'}`}>
        <GoBack />

        {/* 📑 Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab("platform"); handleRemoveImage(); }}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "platform" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layout className="w-4 h-4 mr-2" /> Platform
          </button>
          <button
            onClick={() => { setActiveTab("ai"); handleRemoveImage(); }}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "ai" ? "bg-white text-amber-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" /> AI Tools
          </button>
        </div>

        <h2 className="text-2xl font-black text-center text-slate-800 mb-1">
          {activeTab === 'ai' ? 'Unlock AI Premium' : 'Payment Details'}
        </h2>
        <p className="text-center text-[10px] text-slate-400 mb-8 uppercase font-bold tracking-[0.2em]">
          {activeTab === 'ai' ? 'Step into the future' : 'Complete your registration'}
        </p>

        {/* 💳 Payment Summary Card */}
        <div className={`mb-8 p-5 rounded-2xl border-2 transition-colors ${activeTab === 'ai' ? 'bg-amber-50/50 border-amber-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase">Selected Plan</span>
            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase italic ${activeTab === 'ai' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {currentPlan}
            </span>
          </div>
          
          <div className="flex justify-between items-end border-t border-slate-200/60 pt-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase">Amount Due</span>
                <span className="text-3xl font-black text-green-600">{amount} <small className="text-sm">ETB</small></span>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">CBE Account</p>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-sm font-mono font-black text-slate-700">{AccountNumber}</span>
                    <button onClick={() => copyToClipboard(AccountNumber.toString())} className="text-indigo-500 hover:scale-110 transition-transform">
                        <Clipboard size={14} />
                    </button>
                </div>
            </div>
          </div>
          <p className="text-[10px] text-center mt-3 text-slate-500 font-medium italic">Acc Name: {AccountName}</p>
        </div>

        {/* 📸 Upload Section */}
        <form onSubmit={handleUpload} className="space-y-5">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Receipt Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <>
                <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <FileImage className="text-slate-400" size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload screenshot</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-4 text-white font-black uppercase tracking-widest rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 ${
                activeTab === 'ai' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
            {loading ? "Processing..." : `Confirm ${activeTab === 'ai' ? 'AI' : 'Plan'} Payment`}
          </button>
        </form>
      </div>

      {/* ✅ Success Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">Payment<br/>Submitted!</h2>
            <p className="text-slate-500 text-sm my-4 font-medium">
              We've received your {activeTab === 'ai' ? 'AI' : 'Platform'} receipt. Our team will verify it shortly.
            </p>
            <div className="py-2 px-4 bg-slate-50 rounded-full inline-block">
                <p className="text-[10px] text-indigo-600 font-black uppercase animate-pulse">Redirecting in 5s...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenshot;