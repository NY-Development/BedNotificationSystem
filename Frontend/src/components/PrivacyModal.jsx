import React from "react";
import { X, MessageCircleMore } from "lucide-react";

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow-lg relative overflow-y-auto scrollbar-hide max-h-[80vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cp absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Privacy Policy & Terms of Use
        </h2>

        <div className="space-y-4 text-gray-600 font-medium text-sm leading-relaxed">
          <p className="italic">
            Welcome to the <strong>Hospital Bed Notification System</strong>.
            This Privacy Policy explains how we collect, use, and protect your
            information while ensuring transparency and user safety.
          </p>

          <p>
            <strong>1. Information We Collect:</strong>  
            We collect basic account details (such as your name, email, and
            password) to create and manage your profile. If you choose a
            subscription plan, we also collect payment-related data (like your
            selected plan and payment screenshot) for verification purposes.
          </p>

          <p>
            <strong>2. Use of Uploaded Payment Screenshots:</strong>  
            Uploaded screenshots are used solely to confirm your manual payment
            and activate your subscription. They are securely stored through our
            cloud provider and are never shared publicly or with unauthorized
            parties.
          </p>

          <p>
            <strong>3. Data Security:</strong>  
            We use encrypted connections (HTTPS) and secure storage to protect
            your information. Only authorized administrators have limited access
            to uploaded screenshots and user payment data.
          </p>

          <p>
            <strong>4. Account Responsibilities:</strong>  
            You are responsible for maintaining the confidentiality of your
            account credentials. Do not share your password or access token with
            others. If you suspect unauthorized access, please notify support
            immediately.
          </p>

          <p>
            <strong>5. Data Retention:</strong>  
            Payment screenshots and user data are stored only for the duration
            required to verify your payment and manage your active
            subscription. Once your subscription expires or is canceled, related
            payment data may be securely deleted after verification.
          </p>

          <p>
            <strong>6. Updates and Modifications:</strong>  
            We may update our Privacy Policy or Terms periodically to improve
            service quality or comply with new regulations. Any major updates
            will be communicated to you in advance.
          </p>

          <p>
            <strong>7. Purpose of the Platform:</strong>  
            The Hospital Bed Notification System is designed for
            educational/operational support purposes. It assists in real-time
            communication and workflow management but does not replace official
            hospital record systems.
          </p>

          <p>
            <strong>8. User Rights:</strong>  
            You have the right to access, update, or delete your personal data
            by contacting the system administrator. You may also request removal
            of your uploaded payment screenshot after verification.
          </p>

          <p>
            <strong>9. Contact: </strong>  
            For any privacy-related questions or data removal requests, please
            contact our support team at:  
          {/* Telegram Username Section */}
          <div className="text-gray-600 mb-2 inline ml-2">
            <a 
              href="https://t.me/NYDev_Chat" 
              className="text-blue-500 underline font-bold italic " 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {`NYDev`} <MessageCircleMore className="inline text-center ml-1 h-auto"/>
            </a>
          </div>
          </p>

          <p className="text-xs italic text-gray-500">
            By continuing to register or use this system, you agree to abide by
            these Terms and acknowledge our Privacy Policy.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="cp bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
