import React, { useState } from "react";
import { Mail, LifeBuoy, ChevronDown, ChevronUp, ShieldAlert, Activity, MessageCircle, ClipboardCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const faqs = [
  {
    question: "What is the Bed Notification System (BNS)?",
    answer: "BNS is a specialized clinical registry platform designed to standardize bed, ward, and department assignments. It enables institutional supervisors to synchronize rotations and track facility occupancy in real-time.",
  },
  {
    question: "Who is authorized to access the registry?",
    answer: "Access is strictly limited to verified medical personnel and institutional administrators. System credentials must be synchronized with your university or hospital department to access the ward management dashboard.",
  },
  {
    question: "Protocol for Ward Assignment Expiry?",
    answer: "Upon reaching a set expiry date, clinical data access is restricted to prevent outdated records. Users must re-authenticate their assignment through their supervisor to maintain institutional data integrity.",
  },
  {
    question: "Authentication & Credentialing Issues?",
    answer: "Ensure your institutional email is correct. If the verification protocol (OTP) fails, audit your spam directory. For persistent credentialing errors, contact your department's system supervisor for a manual override.",
  },
  {
    question: "Reporting Technical Discrepancies?",
    answer: "Technical discrepancies should be reported via the inquiry form below. For critical system outages, the authorized Telegram developer channel provides direct access to the technical team.",
  },
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Required fields missing.");
      return;
    }
    setLoading(true);

    const mailtoLink = `mailto:yamlaknegash96@gmail.com?subject=BNS Technical Inquiry: ${encodeURIComponent(form.name)}&body=${encodeURIComponent(`Report Details: ${form.message}\n\nRegistry Email: ${form.email}`)}`;

    window.location.href = mailtoLink;

    setLoading(false);
    toast.success("Inquiry Dispatched to Helpdesk");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 bg-white rounded-[2rem] mb-6 shadow-sm border border-slate-200">
            <LifeBuoy className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">
            Helpdesk <span className="text-indigo-600">& Assistance</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Access technical documentation and support protocols to ensure uninterrupted <span className="text-slate-900 font-bold">Clinical Operations</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Column */}
          <section className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <Activity size={20} className="text-indigo-600 animate-pulse" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Administrative Protocols</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`group rounded-[2rem] transition-all duration-500 border-2 ${
                    openIndex === index 
                      ? 'bg-slate-900 border-indigo-500 shadow-2xl' 
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-8 py-7 text-left outline-none"
                  >
                    <span className={`text-lg font-bold tracking-tight uppercase ${openIndex === index ? 'text-white' : 'text-slate-700'}`}>
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-full transition-all ${openIndex === index ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-8 pb-7 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-white/10 mb-6" />
                      <p className="text-slate-300 font-medium leading-relaxed italic text-md">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Column */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert size={20} className="text-indigo-600" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Technical Inquiry</h2>
            </div>

            {/* Support Form */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registry Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    placeholder="Institutional email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Inquiry Details</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:border-indigo-500 transition-all outline-none"
                    rows="4"
                    placeholder="Provide a detailed clinical or technical report..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? "Processing..." : <><ClipboardCheck size={18} /> Submit Inquiry</>}
                </button>
              </form>
            </div>

            {/* Quick Link Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative border border-white/5 shadow-2xl shadow-indigo-200/20">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <MessageCircle size={80} />
               </div>
               <div className="relative z-10">
                 <h3 className="font-black text-xl mb-1 italic uppercase tracking-tighter">Emergency Desk</h3>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-time Technical Support</p>
               </div>
               <a 
                href="https://t.me/NYDev_Chat" 
                target="_blank" 
                rel="noreferrer" 
                className="relative z-10 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
               >
                 <MessageCircle size={24} />
               </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Support;