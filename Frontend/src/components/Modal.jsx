import React from "react";
import { useAuth } from "../context/AuthContext";

const Modal = ({ isOpen, updateAssign, onClose, children, forceRequired = false }) => {
  if (!isOpen) return null;

  const {user} = useAuth();

  return (
    user?.role !== 'intern' && (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
        {/* ❌ close button (only show if not forceRequired) */}
        {(!forceRequired || updateAssign) && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
          >
            ✖
          </button>
        )}
        {children}
      </div>
    </div>)
  );
};

export default Modal;
