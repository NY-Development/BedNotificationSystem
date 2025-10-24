import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const { checkOtp, resendVerificationOtp, userEmail, initiateUserPayment } = useAuth();

  useEffect(() => {
    if (!userEmail) {
      navigate("/register");
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [userEmail, navigate]);

  useEffect(() => {
    if (timer < 0) {
      setTimer(0);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("Verifying OTP...");
      await checkOtp(userEmail, otp);
      setMessage("Account verified! Redirecting to payment...");

      // initiate payment instead of going to login
      setTimeout(() => {
        // initiateUserPayment(userEmail);
        navigate('/screenshot');
      }, 2000);

      // setMessage("Account verified! Redirecting to login...");
      // setTimeout(() => {
      //   navigate('/login');
      // }, 1500);
    } catch (err) {
      setError(err.message || "OTP verification failed");
      setMessage("");
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      setMessage("Resending OTP...");
      await resendVerificationOtp(userEmail);
      setMessage("New OTP sent. Please check your email.");
      setTimer(60);
    } catch (err) {
      setError(err);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            An OTP has been sent to your email: {userEmail}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in {timer} seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              disabled={timer > 0}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;