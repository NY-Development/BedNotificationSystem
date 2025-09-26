import React from "react";
import { X } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[80vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cp absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Privacy Policy & Terms
        </h2>
        <div className="space-y-4 text-gray-600 font-semibold text-sm leading-relaxed">
          <p className="italic">
            Welcome to the Hospital Bed Notification System. By using our
            application, you agree to the following terms and conditions.
          </p>
          <p>
            1. We respect your privacy. Your personal information will only be
            used for account management and service access.
          </p>
          <p>
            2. You are responsible for maintaining the confidentiality of your
            account and login credentials.
          </p>
          <p>
            3. Unauthorized sharing of access credentials is prohibited.
          </p>
          <p>
            4. The service may update its features or terms at any time. Users
            will be notified in advance of major changes.
          </p>
          <p>
            5. By continuing, you acknowledge that this platform is for
            educational/medical workflow support purposes and not a substitute
            for official hospital management systems.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="cp bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
