import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-hot-toast';
import MonthSubscriptionCard from "../components/MonthSubscriptionCard";
import YearSubscriptionCard from "../components/YearSubscriptionCard";
import homeImage from "../assets/homeImage.jpg";
import bedIcon from '../assets/medical-bed.png';
import { User, Mail, Lock, UserCheck, Phone, Eye, EyeOff } from 'lucide-react'; 
import PrivacyModal from "../components/PrivacyModal";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("c1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("Registering...");
      localStorage.setItem("selectedPlan", subscriptionPlan); //for the later use on the screenshot page.
      localStorage.setItem("email", email);
      const response = await register(name, email, password, phone, role, subscriptionPlan);
      setMessage(response.message);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      toast.error(err);
      console.log(err);
      console.log(err.message);
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen mx-auto flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden">
        {/* Left Side: Image with overlaid text (Hidden on small screens) */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={homeImage}
            alt="Medical background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-60"></div> {/* Semi-transparent overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white z-10">
            {/* 🛏️ RESTORED: Use the imported image bedIcon */}
            <img src={bedIcon} alt="Bed Icon" className="mx-auto h-20 w-auto mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-400 mt-2">Hospital Bed Notification System</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              <span className="font-extrabold text-white">Create your account</span> to get started with real-time bed assignments and patient notifications.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-lg">
            <div className="w-full">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in here
                </a>
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
              <div className="rounded-md space-y-4">
                {/* Name Input with Icon */}
                <div className="relative">
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* Email Input with Icon */}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Password Input with Eye Toggle */}
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* 👁 Eye Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                    ) : (
                    <Eye className="h-5 w-5" />
                    )}
                </button>
                </div>

                {/* Phone Input with Icon */}
                <div className="relative">
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    pattern="^(\+2519\d{8}|09\d{8})$"
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="0911223344"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {/* Role Select with Icon */}
                <div className="relative">
                  <label htmlFor="role" className="sr-only">
                    Role
                  </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                    </div>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  >
                    <option value="c1">C1</option>
                    <option value="c2">C2</option>
                    <option value="intern">Intern</option>
                    {/* Here later on update it with if the email is Selamawitilahun07@gmail.com the only role available will be Admin. */}
                  </select>
                </div>

                {/* Subscription Cards with responsive layout */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-center text-indigo-600">
                    Choose your subscription plan
                  </h3>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <MonthSubscriptionCard
                      isSelected={subscriptionPlan === "monthly"}
                      onSelect={() => setSubscriptionPlan("monthly")}
                    />
                    <YearSubscriptionCard
                      isSelected={subscriptionPlan === "yearly"}
                      onSelect={() => setSubscriptionPlan("yearly")}
                    />
                  </div>
                </div>
                {/* 👆COMMENTED FOR A TRIAL PERIOD.   */}
              </div>
              {/* ✅ Privacy & Terms Checkbox */}
              <div className="flex items-center justify-center mt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="cp h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  required
                />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I have read and agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="cp text-indigo-600 hover:underline"
                >
                  Privacy Policy & Terms
                </button>
              </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* ✅ Modal */}
      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Register;