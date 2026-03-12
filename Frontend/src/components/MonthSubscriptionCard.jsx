import { CircleCheckBig } from "lucide-react";
import React from "react";

const MonthSubscriptionCard = ({ isSelected, onSelect }) => {
  const weekBill = 24.99;

  return (
    <div
      onClick={onSelect}
      className={`cp relative flex-1 rounded-[2rem] p-4 flex flex-col justify-center items-center transition-all duration-300 border-2 w-auto
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

      <div>
        <h2 className={`text-xl font-black mb-1 ${isSelected ? "text-white" : "text-slate-900"}`}>Weekly Plan</h2>
        <div className="flex items-baseline gap-1 mb-6">
          <span className={`text-4xl font-black tracking-tighter ${isSelected ? "text-white" : "text-slate-900"}`}>
            {weekBill}
          </span>
          <span className={`text-sm font-bold uppercase tracking-widest ${isSelected ? "text-indigo-300" : "text-slate-400"}`}>
            ETB/week
          </span>
        </div>

        <ul className="space-y-4">
          {[
            { label: "Flexibility", desc: "Short-term hospital trials." },
            { label: "Commitment", desc: "Cancel any time you want." },
            { label: "Low Cost", desc: "Perfect for tighter budgets." }
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CircleCheckBig className={`h-5 w-5 shrink-0 ${isSelected ? "text-indigo-400" : "text-indigo-500"}`} />
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

export default MonthSubscriptionCard;