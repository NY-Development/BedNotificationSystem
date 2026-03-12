import { CircleCheckBig } from "lucide-react";
import React from "react";

const YearSubscriptionCard = ({ isSelected, onSelect, role }) => {
  const c1YearlyBill = 799.9;
  const c2YearlyBill = 599.9;
  const yearlyAmount = role === "c1" ? c1YearlyBill : c2YearlyBill;

  return (
    <div
      onClick={onSelect}
      className={`cp relative flex-1 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 border-2 
        ${isSelected 
          ? "bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-[1.02]" 
          : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
        }`}
    >
      {/* Radio Selector */}
      <div className="absolute top-6 right-6">
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-300"}`}>
          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
        </div>
      </div>

      {/* Save Tag */}
      <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
        Save 20% Yearly
      </div>

      <div>
        <h2 className={`text-xl font-black mb-1 ${isSelected ? "text-white" : "text-slate-900"}`}>{role==='c1'? '40 Weeks' : '32 Weeks'}</h2>
        <div className="flex items-baseline gap-1 mb-6">
          <span className={`text-4xl font-black tracking-tighter ${isSelected ? "text-white" : "text-slate-900"}`}>
            {yearlyAmount}
          </span>
          <span className={`text-sm font-bold uppercase tracking-widest ${isSelected ? "text-indigo-300" : "text-slate-400"}`}>
            ETB/yr
          </span>
        </div>

        <ul className="space-y-4">
          {[
            { label: "Save 20%", desc: "Best value for long-term." },
            { label: "Uninterrupted", desc: "12 months of ward access." },
            { label: "Priority", desc: "Members-only server speed." }
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CircleCheckBig className={`h-5 w-5 shrink-0 ${isSelected ? "text-indigo-400" : "text-emerald-500"}`} />
              <p className={`text-xs leading-relaxed ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                <strong className={isSelected ? "text-white" : "text-slate-900"}>{item.label}:</strong> {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YearSubscriptionCard;