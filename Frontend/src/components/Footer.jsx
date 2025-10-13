import { FaYoutube, FaInstagram, FaTelegramPlane, FaHeartbeat } from 'react-icons/fa';
import PrivacyModal from "../components/PrivacyModal";
import { useState } from 'react';
import bedIcon from '../assets/medical-bed.png'

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 border-t border-gray-700">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm">
          
          {/* Copyright & Product Info */}
          <div className="flex items-center mb-4 md:mb-0">
            <img src={bedIcon} alt="Bed Icon" className="mx-auto h-8 w-auto mr-2" />
            {/* <FaHeartbeat className="text-white text-xl mr-2" /> */}
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} <span className="font-bold text-white">BNS</span> - Bed Notification System.
            </p>
          </div>

          {/* Separator Line for Mobile */}
          <div className="block md:hidden w-full h-px bg-gray-700 my-4"></div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <span className="text-gray-500 sm:inline">Connect with the NYDev:</span>
            
            <a
              href="https://www.youtube.com/@NYDev-t6p"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center group"
              aria-label="YouTube Channel"
            >
              <FaYoutube className="text-2xl group-hover:scale-110 transition-transform" />
            </a>
            
            <a
              href="https://instagram.com/nydevofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition-colors duration-200 flex items-center group"
              aria-label="Instagram Profile"
            >
              <FaInstagram className="text-2xl group-hover:scale-110 transition-transform" />
            </a>
            
            <a
              href="https://t.me/+a4391kX-fU9hYjA0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
              aria-label="Telegram Channel"
            >
              <FaTelegramPlane className="text-2xl group-hover:scale-110 transition-transform" />
            </a>
          </div>

        </div>
        
        {/* Optional: Add a simple policy/terms area */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
            <button onClick={() => setShowModal(true)} className="cp hover:text-white mr-4">Privacy Policy</button>
        </div>
      </div>
      <PrivacyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </footer>
  );
};

export default Footer;