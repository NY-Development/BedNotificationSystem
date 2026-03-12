import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import loginImage from "../assets/stethoscope.jpg";
import bedIcon from "../assets/medical-bed.png";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const university = localStorage.getItem("university");

  useEffect(() => {
    if (user?.subscription?.isActive) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setError("");
      const res = await login(email, password);
      toast.custom((t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-slate-100`}>
          <div className="flex-1 p-5">
            <div className="flex items-start">
              <img
                className="h-12 w-12 rounded-full border-2 border-indigo-100"
                src={user?.image || `https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=100`}
                alt="Profile"
              />
              <div className="ml-4">
                <p className="text-sm font-bold text-slate-900">Hello {user?.name}</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  <span className="text-indigo-500">Login Successful, redirecting to dashboard.</span>
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="cp px-6 border-l border-slate-100 text-sm font-bold text-indigo-600 hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      ));
      navigate("/dashboard");
      // navigate("/universities") After successfully finished.
    } catch (err) {
      setError(err || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div className="flex h-full w-full">
        
        {/* Left Side: Visual Branding (Hidden on Mobile) */}
        <div className="hidden lg:relative lg:flex lg:w-1/2 h-full">
          <img
            src={loginImage}
            alt="Medical background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-indigo-900/40" />
          
          <div className="relative z-10 flex flex-col justify-center h-full w-full p-16">
            <div className="max-w-md">
              <h1 className="text-white text-6xl font-black leading-tight tracking-tighter mb-6 italic">
                Efficiency in <br />
                <span className="text-indigo-400">Every Ward.</span>
              </h1>
              <p className="text-slate-300 text-xl font-medium leading-relaxed">
                Streamlining bed management and patient notifications with real-time intelligence.
              </p>
            </div>

            <div className="flex items-center gap-6 text-white/50 text-xs font-bold tracking-[0.2em] uppercase">
               <span>v2.5.0</span>
               <div className="w-12 h-[1px] bg-white/20" />
               <span>Enterprise Secure</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form (Full width on Mobile) */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-12 md:p-24 bg-white">
          <div className="w-full max-w-md space-y-10">
            <div onClick={() => navigate("/choice")} className="animate-pulse cp inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black hover:bg-indigo-500 text-white mb-6" aria-label="Choose University">
              <span className="text-[9px] font-black uppercase">{university} University</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-500 font-medium">
                Access your hospital dashboard. New here?{" "}
                <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold decoration-indigo-200 underline underline-offset-4 decoration-2 transition-all">
                  Register Facility
                </a>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-xl text-sm font-bold animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div className="group">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-semibold"
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <div className="flex justify-between mb-2 ml-1">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                    <a href="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-semibold"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cp absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cp w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-800 text-white rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-xl hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100 text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                  Compliant with Health Information Privacy Standards
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;