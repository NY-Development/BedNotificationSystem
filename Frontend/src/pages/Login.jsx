import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // assuming you have this
import loginImage from "../assets/stethoscope.jpg"; // update path if needed
import bedIcon from "../assets/medical-bed.png"; // update path if needed

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👇 Automatically navigate to dashboard if user is already logged in
  useEffect(() => {
    if (user?.subscription?.isActive) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setError("");
      await login(email, password);

      if (user?.subscription?.isActive) {
        toast.success("Login Success! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        toast.custom((t) => (
          <div
            className={`${user?.subscription?.isActive === false ? 'flex' : 'hidden'} ${t.visible ? "animate-custom-enter" : "animate-custom-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      user?.image ||
                      `https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80`
                    }
                    alt="Profile Picture"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Hello {user?.name}
                  </p>
                  <p className="mt-1 text-sm text-black">
                    <p>
                      Payment is being Processed{" "}
                      <span className="animate-bounce">⏳</span>...
                    </p>
                    Check your{" "}
                    <span className="font-bold text-blue-500">
                      {user?.email}
                    </span>{" "}
                    for admin approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="cp w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
      }
    } catch (err) {
      setError(err.message || "Login failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Only show login form if no user is logged in
  if (user?.subscription?.isActive) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden">
        {/* Left Side: Image with overlaid text */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginImage}
            alt="Medical background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white z-10">
            <img
              src={bedIcon}
              alt="Bed Icon"
              className="mx-auto h-20 w-auto mb-4"
            />
            <h1 className="text-white text-4xl lg:text-5xl font-extrabold px-6">
              Your Medical Practice, Simplified
            </h1>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center max-sm:p-10">
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

              <div className="rounded-md space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
