import React, { useState, useEffect } from "react";
import bedIcon from "../assets/medical-bed.png";
import regImage from "../assets/hospitalHallway.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IntroPage from "./IntroPage";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [introVisible, setIntroVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenBnsTour");

    // 1. Priority: If they haven't seen the tour (or reset it via Support), show it.
    if (!hasSeenTour) {
      setIntroVisible(true);
    } 
    // 2. If they have seen the tour and are logged in, send them to dashboard.
    else if (user) {
      navigate("/dashboard");
    } 
    // 3. Otherwise, just show the landing page.
    else {
      setShowWelcome(true);
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Intro Onboarding Overlay */}
      {introVisible && (
        <IntroPage
          onComplete={() => {
            setIntroVisible(false);
            // After tour, if they are logged in, send them home, else show welcome
            if (user) {
              navigate("/dashboard");
            } else {
              setShowWelcome(true);
            }
          }}
        />
      )}

      {/* Main Content */}
      <div
        id="welcome"
        className={`min-h-screen bg-cover bg-center flex flex-col items-center justify-center transition-opacity duration-1000 ${
          showWelcome ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${regImage})` }}
      >
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white">
          <img
            src={bedIcon}
            alt="Bed Icon"
            className="mx-auto h-24 w-auto mb-8 drop-shadow-2xl animate-pulse"
          />

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Hospital Bed <br />
            <span className="text-indigo-400">Notification System</span>
          </h1>

          <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto font-light">
            A modern, lightweight system for real-time bed assignment and patient
            admission notifications.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/login"
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-xl"
            >
              Log in
            </a>
            <a
              href="/register"
              className="px-10 py-4 border-2 border-indigo-400 hover:bg-indigo-400/20 text-white font-bold rounded-lg transition-all"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;