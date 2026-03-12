import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Universities } from "../data/data";
import toast from "react-hot-toast";
import gsap from "gsap";
import ChoiceCard from "../components/ChoiceCard";
import { ShieldCheck } from "lucide-react";

const ChoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const from = location.state?.from || "/login";

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(headerRef.current, { opacity: 0, y: 20 });
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1, delay: 0.1 });
  }, []);

  const handleSelection = (uni) => {
    toast.success(`Accessing ${uni.name} Database`, {
      icon: "🏥",
      style: { borderRadius: "10px", background: "#334155", color: "#fff" },
    });

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => navigate(from),
    });
  };

  return (
    /* Changed background to a soft medical grey/blue */
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 overflow-hidden"
    >
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 mb-6 border border-slate-300">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Institutional Access Point
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">
            Medical <span className="text-indigo-600">Affiliation</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Select your primary teaching hospital or university to synchronize
            your clinical credentials and access ward management tools.
          </p>
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {Universities.map((uni, index) => (
            <ChoiceCard
              key={uni.name}
              uni={uni}
              index={index}
              onSelect={handleSelection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoicePage;
