import React from "react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDestructive = true }) => {
  if (!isOpen) return null;

  const confirmButtonColor = isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-emerald-500 hover:bg-emerald-600";
  const confirmButtonText = isDestructive ? "Delete" : "Confirm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="cp px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`cp px-4 py-2 text-white rounded ${confirmButtonColor}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;