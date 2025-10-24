import React from "react";
import { Users, Heart, Code, Building2, Rocket, Mail, ChevronLeft } from "lucide-react";

// Placeholder for GoBack component to make the file self-contained and runnable.
const GoBack = () => (
  <button
    // In a real application, this would use react-router's navigate(-1)
    onClick={() => console.log('Go Back functionality triggered')}
    className="flex items-center text-indigo-600 hover:text-indigo-800 transition mb-8 font-semibold"
  >
    <ChevronLeft className="w-5 h-5 mr-1" />
    <span>Go Back</span>
  </button>
);


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-xl lg:shadow-2xl rounded-3xl p-8 sm:p-12 border-t-8 border-indigo-600">
        <GoBack />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            About <span className="text-indigo-600">BNS</span>
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            A smart bed management and notification system developed by{" "}
            <span className="font-bold text-indigo-700">NYDev</span> to
            transform hospital workflows and improve patient care coordination.
          </p>
        </div>

        {/* About Project */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6 border-b border-indigo-100 pb-2">
            <Building2 className="text-indigo-600 w-7 h-7 flex-shrink-0" />
            <h2 className="text-3xl font-extrabold text-gray-900">
              About the Project
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            The <strong>Bed Notification System (BNS)</strong> is a hospital
            management platform that streamlines the allocation of beds, wards,
            and departments for medical staff. It ensures efficient assignment
            tracking, timely expiry notifications, and transparent supervision.
            <br />
            <br />
            Designed with healthcare efficiency in mind, BNS allows
            administrators, supervisors, and healthcare workers to manage their
            responsibilities seamlessly — from patient bed tracking to duty
            scheduling.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6 border-b border-indigo-100 pb-2">
            <Rocket className="text-indigo-600 w-7 h-7 flex-shrink-0" />
            <h2 className="text-3xl font-extrabold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our mission is to empower hospitals with intuitive, data-driven
            tools that reduce confusion, enhance accountability, and ultimately
            improve patient outcomes. We believe technology should enable faster
            decisions and better communication — not add complexity.
          </p>
        </section>

        {/* The Team */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6 border-b border-indigo-100 pb-2">
            <Users className="text-indigo-600 w-7 h-7 flex-shrink-0" />
            <h2 className="text-3xl font-extrabold text-gray-900">
              The Team Behind BNS
            </h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
            BNS is proudly built and maintained by{" "}
            <span className="font-bold text-indigo-700">NYDev</span> — a
            forward-thinking software development team passionate about building
            impactful digital solutions for healthcare, education, and
            enterprise systems.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Card Example 1: Fullstack Development */}
            <div className="bg-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-100 transform hover:scale-[1.02] transition-all duration-300">
              <Code className="w-10 h-10 text-indigo-700 mb-3" />
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                Fullstack Development
              </h3>
              <p className="text-sm text-indigo-700/80">
                Built with React, Node.js, and MongoDB for a fast, scalable, and
                reliable platform.
              </p>
            </div>

            {/* Team Card Example 2: Human-Centered Design */}
            <div className="bg-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-100 transform hover:scale-[1.02] transition-all duration-300">
              <Heart className="w-10 h-10 text-indigo-700 mb-3" />
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                Human-Centered Design
              </h3>
              <p className="text-sm text-indigo-700/80">
                Designed for real-world hospital workflows — simple, intuitive,
                and responsive.
              </p>
            </div>

            {/* Team Card Example 3: Collaborative Spirit */}
            <div className="bg-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-100 transform hover:scale-[1.02] transition-all duration-300">
              <Users className="w-10 h-10 text-indigo-700 mb-3" />
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                Collaborative Spirit
              </h3>
              <p className="text-sm text-indigo-700/80">
                A diverse and passionate team from NYDev driving innovation in
                every release.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center border-t border-gray-200 pt-10 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-6">
            Want to learn more about BNS or collaborate with NYDev?
          </p>
          <a
            href="mailto:yamlaknegash96@gmail.com"
            className="inline-flex items-center space-x-3 text-lg text-white font-bold bg-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-300/50"
          >
            <Mail className="w-5 h-5" />
            <span>Contact our Team</span>
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
