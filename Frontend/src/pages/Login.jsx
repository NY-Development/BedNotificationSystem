import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginImage from '../assets/stethoscope.jpg'
import bedIcon from '../assets/medical-bed.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left Side: Image with overlaid text (Hidden on small screens) */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginImage}
            alt="Medical background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white z-10">
            <img src={bedIcon} alt="Bed Icon" className="mx-auto h-20 w-auto mb-4" />
            <h1 className="text-white text-4xl lg:text-5xl font-extrabold px-6">
              Your Medical Practice, Simplified
            </h1>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <a
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  create a new account
                </a>
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="rounded-md space-y-2">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;