import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/payment"; 
import { CheckCircle, XCircle, Loader, Download, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tx_ref & status from Chapa redirect
  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref");

  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'success', 'failed', 'pending'
  const [verificationMessage, setVerificationMessage] = useState("Awaiting transaction reference from payment provider...");
  const [receiptTxRef, setReceiptTxRef] = useState(tx_ref);

  const handleVerification = useCallback(async () => {
    if (!tx_ref) {
      setIsLoading(false);
      setVerificationStatus('failed');
      setVerificationMessage("No transaction reference found. Please ensure you returned to BNS after payment.");
      return;
    }

    setVerificationMessage("Verifying your payment with the BNS server and Chapa...");

    try {
      // Use the GET verify API route
      const data = await verifyPayment(tx_ref);
      if (data.success) {
        setVerificationStatus('success');
        setVerificationMessage("Payment verified successfully! Your subscription is now active.");
        toast.success("Subscription Active! Redirecting...");
        setReceiptTxRef(tx_ref);

      } else {
        setVerificationStatus('failed');
        setVerificationMessage(data.message || "Payment could not be verified. Status is not 'success'.");
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      setVerificationStatus('failed');
      setVerificationMessage("An unexpected error occurred during verification. Please check your network or contact support.");
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  }, [tx_ref, navigate]);

  useEffect(() => {
    if (tx_ref) {
      setIsLoading(true);
      handleVerification();
    } else {
      setIsLoading(false);
      setVerificationStatus('pending'); // Initial state for user guidance
    }
  }, [handleVerification, tx_ref]);

  // --- UI Logic ---
  let Icon = AlertTriangle;
  let colorClass = 'text-yellow-600';
  let bgColorClass = 'bg-yellow-50';
  let borderColorClass = 'border-yellow-600';

  if (isLoading) {
    Icon = Loader;
    colorClass = 'text-indigo-600';
    bgColorClass = 'bg-indigo-50';
    borderColorClass = 'border-indigo-600';
  } else if (verificationStatus === 'success') {
    Icon = CheckCircle;
    colorClass = 'text-green-600';
    bgColorClass = 'bg-green-50';
    borderColorClass = 'border-green-600';
  } else if (verificationStatus === 'failed') {
    Icon = XCircle;
    colorClass = 'text-red-600';
    bgColorClass = 'bg-red-50';
    borderColorClass = 'border-red-600';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className={`p-8 sm:p-10 bg-white rounded-xl shadow-2xl text-center w-full max-w-lg border-t-8 ${borderColorClass} transition-all duration-500`}>
        
        {/* Header Icon & Title */}
        <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full ${bgColorClass} mb-6`}>
            <Icon className={`w-8 h-8 ${colorClass} ${isLoading ? 'animate-spin' : ''}`} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment {isLoading ? 'Processing' : verificationStatus === 'success' ? 'Confirmed' : 'Unverified'}
        </h1>
        
        {/* Transaction Reference Display */}
        {tx_ref && (
            <p className="text-sm text-gray-500 mb-6 font-bold">
                Tx Reference: <span className="font-mono text-gray-700 italic">{tx_ref}</span>
            </p>
        )}

        {/* Status Message */}
        <div className={`p-4 rounded-lg ${bgColorClass} mb-8 border border-opacity-50`}>
            <p className={`text-lg font-semibold ${colorClass}`}>{verificationMessage}</p>
        </div>
        
        {/* User Instructions/Description */}
        <div className="text-left text-gray-700 space-y-4 border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800">Next Steps:</h2>
            
            {verificationStatus === 'success' && (
                <>
                    <p className="text-base">
                        Your BNS subscription is <span className="font-bold">active!</span> You will be automatically redirected to the login page shortly to begin using the system.
                    </p>
                    <p className="text-base">
                        Click the <span className="font-bold">Download Receipt</span> button below to save your official payment document.
                    </p>
                </>
            )}
            {verificationStatus === 'failed' && (
                <>
                    <p className="text-base">
                        <span className="font-bold">Action Required:</span> If you completed the payment, please <span className="font-bold">wait 5 minutes</span> for the final webhook notification. If the status remains unverified, contact support with your <span className="font-bold">Transaction Reference</span>.
                    </p>
                </>
            )}
            {verificationStatus === 'pending' && (
                <p className="text-base">
                    This page is for verifying your subscription payment. If you have not paid, please return to the BNS dashboard. If you just paid and were not redirected, please contact support.
                </p>
            )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4 sm:flex sm:justify-center sm:space-y-0 sm:space-x-4">
            {verificationStatus === 'success' && (
                <a
                    // NOTE: This assumes a protected backend route at /api/payment/receipt/:tx_ref
                    href={`/api/payment/receipt/${receiptTxRef}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01]"
                >
                    <Download className="w-5 h-5" />
                    <span>Download Receipt (PDF)</span>
                </a>
            )}
            
            {verificationStatus === 'success' ? (<button
                onClick={() => navigate("/login")}
                className={`cp w-full sm:w-auto inline-flex items-center justify-center py-3 px-6 font-bold text-blue-600 border-3 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white hover:border-blue-200 transition-all duration-300 ${isLoading && 'opacity-70 cursor-not-allowed'}`}
                disabled={isLoading}
            >
                Go to Login
            </button>) : (<button
                onClick={() => navigate("/")}
                className={`cp w-full sm:w-auto inline-flex items-center justify-center py-3 px-6 text-gray-700 border border-blue-500 rounded-xl hover:bg-gray-100 transition-all duration-300 ${isLoading && 'opacity-70 cursor-not-allowed'}`}
                disabled={isLoading}
            >
                Go to BNS Home
            </button>)}
        </div>

      </div>
    </div>
  );
};

export default Payments;