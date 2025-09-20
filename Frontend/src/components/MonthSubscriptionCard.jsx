import { CircleCheckBig } from "lucide-react";
import React from "react";

const MonthSubscriptionCard = ({ isSelected, onSelect }) => {
  const monthBill = 100;

  return (
    <div
      onClick={onSelect}
      className={`relative flex-1 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer shadow-md
        ${
          isSelected
            ? "bg-blue-600 text-white shadow-xl"
            : "bg-white text-gray-900 border border-gray-200 hover:shadow-lg"
        }
      `}
    >
      <div className="absolute top-4 right-4">
        <input
          type="radio"
          name="subscription"
          checked={isSelected}
          onChange={onSelect}
          className="form-radio h-5 w-5 text-blue-600 cursor-pointer"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Monthly Subscription</h2>
        <p className={`text-5xl font-extrabold mb-6 ${isSelected ? 'text-white' : 'text-blue-600'}`}>
          {monthBill} ETB{" "}
          <span className={`text-lg font-medium ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>/month</span>
        </p>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>Flexibility:</strong> Ideal for short-term use.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>No Commitment:</strong> Only for one month.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CircleCheckBig className="text-current" />
            <span><strong>Low upfront cost</strong> for tighter budgets.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MonthSubscriptionCard;