import React from "react";
import { Link } from "react-router-dom";
import { Users, HeartPulse, Stethoscope, Building2, ClipboardList, Mail, ChevronLeft, ShieldCheck, Activity } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group"
          >
            <div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </div>
            <span className="text-sm uppercase tracking-widest">Medical Portal</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative mb-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                <Activity size={14} className="text-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em]">Institutional Profile</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tighter italic uppercase">
                About <span className="text-indigo-600">BNS</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
                The Clinical Bed Registry (BNS) is a specialized administrative ecosystem engineered by{" "}
                <span className="text-slate-900 font-black">NYDev</span> to 
                standardize ward management and synchronize patient throughput across modern healthcare facilities.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
               <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center">
                  <ShieldCheck size={56} className="text-indigo-600 mb-4" />
                  <p className="text-slate-900 font-black text-xs uppercase tracking-widest italic">HIPAA Compliant</p>
                  <p className="text-slate-400 text-[9px] font-bold uppercase mt-1">Certified Registry</p>
               </div>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          
          {/* About Project Card */}
          <section className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">The Infrastructure</h2>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              The <strong>Bed Notification System (BNS)</strong> is a mission-critical 
              platform designed for clinical governance. We have refined the logic of ward allocation and patient auditing into a singular, high-integrity interface.
              <br /><br />
              It facilitates real-time occupancy monitoring and absolute transparency for medical directors, allowing 
              healthcare professionals to focus on acute clinical care rather than administrative overhead.
            </p>
          </section>

          {/* Mission Card */}
          <section className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
               <Stethoscope size={180} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 text-white">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:bg-indigo-500 transition-all">
                  <ClipboardList size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tight italic uppercase">Our Mandate</h2>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed text-lg">
                Our objective is to empower medical institutions with data-driven tools that minimize clinical friction. 
                We aim to deploy technology that is clinically intuitive — enhancing institutional accountability 
                and improving patient safety through seamless data synchronization.
              </p>
            </div>
          </section>
        </div>

        {/* The Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic underline underline-offset-8 decoration-indigo-600/30">Registry Standards</h2>
            <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">Medical Engineering by NYDev</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:border-indigo-300 transition-all group">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Stethoscope size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3 italic uppercase tracking-tighter">Clinical Precision</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Utilizing the MERN stack for high-availability database management, ensuring patient records are updated across all terminals instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:border-indigo-300 transition-all group">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <HeartPulse size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3 italic uppercase tracking-tighter">Responsive Design</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Interface optimized for high-stress emergency departments, ensuring information accessibility during critical ward rounds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:border-indigo-300 transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-indigo-600 transition-all shadow-lg">
                <Users size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-3 italic uppercase tracking-tighter">Staff Coordination</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Developed by the NYDev collective to foster collaboration between medical staff, supervisors, and hospital administrators.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Contact Footer */}
        <section className="bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden border border-white/5">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
           <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight italic uppercase">Institutional Integration</h2>
              <p className="text-slate-400 font-bold mb-12 max-w-xl mx-auto leading-relaxed uppercase text-xs tracking-widest">
                Partner with the NYDev team to deploy BNS or customized medical registry solutions for your facility.
              </p>
              <a
                href="mailto:yamlaknegash96@gmail.com"
                className="inline-flex items-center gap-4 text-sm text-white font-black bg-indigo-600 px-12 py-5 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-600/20 group"
              >
                <Mail className="w-5 h-5" />
                <span className="uppercase tracking-[0.2em]">Secure Inquiry</span>
              </a>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;