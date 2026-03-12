import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';
import MonthSubscriptionCard from "../components/MonthSubscriptionCard";
import homeImage from "../assets/homeImage.jpg";
import { User, Mail, Lock, UserCheck, Phone, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'; 
import PrivacyModal from "../components/PrivacyModal";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("c1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly");

  const university = localStorage.getItem("university");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    try {
      setError("");
      setMessage("Registering...");
      localStorage.setItem("selectedPlan", subscriptionPlan);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      
      const response = await register(name, email, password, phone, role, subscriptionPlan);
      setMessage(response.message);
      toast.success("Registration successful!");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Registration failed");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* 1. Changed to min-h-[calc(100vh-64px)] to account for Navbar height */
    <div className="min-h-screen w-full bg-white font-sans flex flex-col lg:flex-row">
      
      {/* Left Side: Visual Branding - Fixed height on desktop to match viewport */}
      <div className="hidden lg:relative lg:flex lg:w-5/12 sticky top-0 max-h">
        <img
          src={homeImage}
          alt="Medical background"
          className="absolute inset-0 w-full max-h object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-indigo-900/40" />
        
        <div className="relative z-10 flex flex-col justify-center h-full w-full p-12">
          <div className="max-w-md">
            <h1 className="text-white text-5xl font-black leading-tight tracking-tighter mb-6 italic">
              Join the <br />
              <span className="text-indigo-400">Future of Care.</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
              Empowering medical professionals with real-time bed intelligence and streamlined patient workflows.
            </p>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">
             <ShieldCheck size={16} className="text-indigo-400" />
             <span>HIPAA Compliant Data Encryption</span>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      {/* 2. Added overflow-y-auto for desktop and removed fixed h-screen */}
      <div className="w-full lg:w-7/12 flex items-start justify-center bg-white p-6 sm:p-12 lg:p-20 overflow-y-visible">
        <div className="w-full max-w-2xl space-y-8 pt-4 pb-12">
          {/* University Badge */}
          <div onClick={() => navigate("/choice")} className="animate-pulse cp inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black hover:bg-indigo-500 text-white mb-6" aria-label="Choose University">
            <span className="text-[9px] font-black uppercase">{university} University</span>
          </div>            
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                Sign in here
              </a>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-r-xl text-sm font-bold animate-pulse">{message}</div>}
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm font-bold">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none font-semibold"
                    placeholder="Dr. John Doe"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none font-semibold"
                    placeholder="yourname@gmail.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"} required
                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none font-semibold"
                    placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="tel" required
                    pattern="^(\+2519\d{8}|09\d{8})$"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none font-semibold"
                    placeholder="0911223344"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Role</label>
              <div className="relative group">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none font-bold appearance-none"
                >
                  <option value="c1">Clinical year 1 (C1)</option>
                  <option value="c2">Clinical Year 2 (C2)</option>
                  <option value="intern">Medical Staff</option>
                </select>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="pt-4">
              {role !== 'intern' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-[2px] flex-1 bg-slate-100" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Plan Selection</span>
                    <div className="h-[2px] flex-1 bg-slate-100" />
                  </div>
                  <div className="flex justify-center items-center">
                    <MonthSubscriptionCard
                      isSelected={subscriptionPlan === "monthly"}
                      onSelect={() => setSubscriptionPlan("monthly")}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-50 border-2 border-indigo-100 p-5 rounded-[2rem] flex items-center gap-4">
                  <div className="bg-indigo-600 px-3 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-tighter shrink-0">Verified Free</div>
                  <p className="font-bold text-indigo-900 text-sm italic leading-tight">Standard medical staff access enabled (No subscription required).</p>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <input
                  id="terms" type="checkbox"
                  checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="w-5 h-5 text-indigo-600 border-2 border-slate-300 rounded-lg focus:ring-indigo-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-500 font-medium">
                  I acknowledge the{" "}
                  <button type="button" onClick={() => setShowModal(true)} className="text-indigo-600 font-black hover:underline">
                    Medical Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center py-5 px-6 bg-indigo-600 hover:bg-indigo-800 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.15em] transition-all transform active:scale-[0.98] shadow-2xl disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Register;