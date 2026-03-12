import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { BedProvider } from "./context/BedContext"; 
import { AssignmentProvider } from "./context/AssignmentContext";
import { AdminProvider } from "./context/AdminContext"; 
import { SupervisorProvider } from "./context/SupervisorContext";

// Components & Wrappers
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupportWidget from "./components/SupportWidget";
import UniversityWrapper from "./components/UniversityWrapper"; 

// Pages
import Home from "./pages/Home";
import ChoicePage from "./pages/ChoicePage"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Notifications from "./pages/Notifications";
import Assignments from "./pages/Assignments";
import MyAssignments from "./pages/MyAssignments";
import Admin from "./pages/Admin";
import MainAdmin from "./pages/MainAdmin";
import SelectUniversity from "./pages/SelectUniversity";
import SelectSchool from "./pages/SelectSchool";
import Payments from "./pages/Payments";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdateExpiry from "./pages/UpdateExpiry";
import SupportResponses from "./pages/SupportResponses";
import Screenshot from "./pages/Screenshot";
import AboutUs from "./pages/AboutUs";
import Support from "./pages/Support";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <AuthProvider>
        <BedProvider>
          <AssignmentProvider>
            <AdminProvider>
              <SupervisorProvider>
                <div className="min-h-screen bg-gray-50 flex flex-col scrollbar-hide">
                  <Analytics />
                  <Navbar />
                  
                  <main className="w-screen flex-grow text-center scrollbar-hide">
                    <Routes>
                      {/* --- 1. PUBLIC ROUTES (Always Accessible) --- */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/select-gateway" element={<ChoicePage />} />
                      <Route path="/choice" element={<ChoicePage />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

                      {/* --- 2. PROTECTED ROUTES (Inside the Wrapper) --- */}
                      <Route element={<UniversityWrapper />}>
                        {/* Auth flow */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />

                        {/* App functionality - These were outside before! */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/beds" element={<Beds />} />
                        <Route path="/universities" element={<SelectUniversity />} />
                        <Route path="/schools" element={<SelectSchool />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/myassignments" element={<MyAssignments />} />

                        {/* Management */}
                        <Route path="/supervisor" element={<Admin />} />
                        <Route path="/admin" element={<MainAdmin />} />
                        <Route path="/update-expiry" element={<UpdateExpiry />} />
                        <Route path="/support-responses" element={<SupportResponses />} />
                        <Route path="/payment/success" element={<Payments />} />
                        <Route path="/screenshot" element={<Screenshot />} />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </main>

                  <Footer />
                  <SupportWidget />
                </div>
              </SupervisorProvider>
            </AdminProvider>
          </AssignmentProvider>
        </BedProvider>
      </AuthProvider>
    </>
  );
}

export default App;