import React from 'react';
import bedIcon from '../assets/medical-bed.png';
import regImage from '../assets/hospitalHallway.jpg'; // Import the image
import { useAuth } from '../context/AuthContext'
import { FaHeartbeat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
    {user ? (
      navigate('/dashboard')
    ) : (
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${regImage})` }}>
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <img src={bedIcon} alt="Bed Icon" className="mx-auto h-24 w-auto mb-6" />
            {/* <FaHeartbeat className='h-20 w-20 ml-70'/> */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Hospital Bed </span>
              <span className="block text-indigo-400 mt-2">Notification System</span>
            </h1>
            <p className="mt-6 text-xl max-w-2xl mx-auto text-gray-300">
              A modern, lightweight system for real-time bed assignment and patient admission notifications.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <a
                href="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                Log in
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-8 py-3 border-2 border-indigo-400 text-base font-medium rounded-md text-white bg-transparent hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Home;