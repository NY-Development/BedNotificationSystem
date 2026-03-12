import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import s1 from '../assets/slide2.png'
import s2 from '../assets/slide3.png'
import s3 from '../assets/slide1.png'

const IntroPage = ({ onComplete }) => {
  const comp = useRef(null);
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "BNS",
      subtitle: "Smart Hospital Management",
      desc: "Welcome! BNS helps you manage hospital flow with zero delay.",
      image: s1
    },
    {
      title: "Real-Time",
      subtitle: "Instant Bed Tracking",
      desc: "View available beds across all wards in real-time. No more manual checking.",
      image: s2
    },
    {
      title: "Notifications",
      subtitle: "Stay Informed",
      desc: "Receive instant alerts when a patient is admitted or a bed is cleared.",
      image: s3   
    },
  ];

  const handleExit = () => {
    const tl = gsap.timeline({ 
      onComplete: () => {
        // Mark as seen in localStorage before calling the final onComplete
        localStorage.setItem('hasSeenBnsTour', 'true');
        onComplete();
      } 
    });
    
    tl.to("#intro-slider", {
      xPercent: -100,
      duration: 1.1,
      ease: "expo.inOut",
    })
    .to("#welcome", {
      opacity: 1,
      duration: 1,
    }, "-=0.8");
  };

  const changeSlide = (direction) => {
    const nextStep = direction === "next" ? step + 1 : step - 1;

    if (nextStep >= 0 && nextStep < slides.length) {
      gsap.to(".content-wrapper", {
        opacity: 0,
        x: direction === "next" ? -30 : 30,
        duration: 0.3,
        onComplete: () => {
          setStep(nextStep);
          gsap.fromTo(".content-wrapper", 
            { opacity: 0, x: direction === "next" ? 30 : -30 },
            { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
          );
        },
      });
    } else if (nextStep === slides.length) {
      handleExit();
    }
  };

  return (
    <div ref={comp} className="fixed inset-0 z-[1000] overflow-hidden bg-slate-950">
      <div id="intro-slider" className="h-screen w-full flex flex-col md:flex-row items-center justify-center p-6 md:p-12 relative">
        
        {/* Skip Button */}
        <button 
          onClick={handleExit}
          className="cp absolute top-8 right-8 border-2 border-white px-5 py-2 rounded-full text-slate-400 hover:text-white hover:border-indigo-500 transition-all z-50 font-bold tracking-widest text-[10px]"
        >
          SKIP TOUR
        </button>

        <div className="content-wrapper flex flex-col md:flex-row items-center gap-12 max-w-6xl w-full">
          
          {/* Left Side: Visual Preview */}
          <div className="w-full md:w-1/2 flex justify-center max-md:mt-30">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <img 
                src={slides[step].image} 
                alt="App Preview" 
                className="relative rounded-xl border border-slate-800 shadow-2xl w-full object-cover aspect-video"
              />
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full md:w-1/2 text-left space-y-6">
            <div>
              <h1 className="text-indigo-500 font-black text-5xl md:text-7xl italic mb-2">
                {slides[step].title}
              </h1>
              <h3 className="text-white text-2xl md:text-3xl font-bold">
                {slides[step].subtitle}
              </h3>
              <p className="text-slate-400 text-lg mt-4 leading-relaxed max-w-md">
                {slides[step].desc}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 pt-4">
              {step > 0 && (
                <button
                  onClick={() => changeSlide("prev")}
                  className="cp p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all border border-slate-800"
                >
                  <FaArrowLeft />
                </button>
              )}
              
              <button
                onClick={() => changeSlide("next")}
                className="cp px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold flex items-center gap-3 transition-all shadow-lg"
              >
                {step === slides.length - 1 ? "Get Started" : "Next Step"}
                <FaArrowRight size={14} />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="flex gap-2 pt-4">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;