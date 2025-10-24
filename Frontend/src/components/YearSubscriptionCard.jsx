import { CircleCheckBig } from "lucide-react";
import React from "react";

const YearSubscriptionCard = ({ isSelected, onSelect }) => {
  const yearlyBill = 1000;

  return (
    <div
      onClick={onSelect}
      className={`relative flex-1 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer shadow-md
        ${
          isSelected
            ? "bg-gray-900 text-white shadow-xl"
            : "bg-gray-100 text-gray-900 border border-gray-300 hover:shadow-lg"
        }
      `}
    >
      <div className="absolute top-4 right-4">
        <input
          type="radio"
          name="subscription"
          checked={isSelected}
          onChange={onSelect}
          className="form-radio h-5 w-5 text-gray-900 cursor-pointer"
        />
      </div>
      
      {/* Save Tag */}
      <div className="absolute top-6 -right-3 transform rotate-45 bg-green-500 text-white text-xs font-bold px-8 py-1 rounded-full shadow-md">
        Save 20%
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Yearly Subscription</h2>
        <p className={`text-5xl font-extrabold mb-6 ${isSelected ? 'text-gray-200' : 'text-green-600'}`}>
          {yearlyBill} ETB{" "}
          <span className={`text-lg font-medium ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>/year</span>
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>Save 20%:</strong> Cheaper than monthly.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>Continuous Access:</strong> No interruptions.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>Exclusive Features:</strong> Members-only content.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default YearSubscriptionCard;