import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bedIcon from "../assets/medical-bed.png";
import { X, Menu, LogOut } from 'lucide-react';
import Profile from "./Profile";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    navigate("/");
    logout();
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <nav className="p-4 bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold font-inter">
          <div className="flex items-center space-x-2">
            <img src={bedIcon} alt="Bed Icon" className="h-8" />
            <p>BNS</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 font-medium">
          {user ? (
            <>
              <div className="w-10 h-10 rounded-full hidden bg-gray-200 items-center justify-center cursor-pointer">
                <button className="cp text-gray-300" onClick={openProfileModal}>
                  <img src={user?.image} alt="Profile" className="inline w-6 h-6 object-cover" /> <p>Hello, {user.name} ({user.role})</p>
                </button>
              </div>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-blue-400">Users</Link>
              )}
              <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
              <Link to="/beds" className="hover:text-blue-400">Beds</Link>
              <button onClick={handleLogout} className="hover:text-red-400 cp flex">
                <LogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/register" className="hover:text-blue-400">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none cursor-pointer">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 font-medium">
          {user ? (
            <>
              <button className={`cp block px-4 py-2 text-sm text-gray-300`} onClick={openProfileModal}>
                <img src={user?.image} alt="Profile" className="inline h-8 w-8 rounded-full" /> Hello, {user.name} ({user.role})
              </button>
              <Link to="/dashboard" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-700 transition duration-200">Dashboard</Link>
              <Link to="/beds" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-700 transition duration-200">Beds</Link>
              <button onClick={handleLogout} className="cp w-full text-left flex px-4 py-2 hover:bg-red-700 text-red-400 transition duration-200">
                <LogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-700 transition duration-200">Login</Link>
              <Link to="/register" onClick={toggleMenu} className="block px-4 py-2 hover:bg-gray-700 transition duration-200">Register</Link>
            </>
          )}
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <Profile onClose={closeProfileModal} user={user} />
      )}
    </nav>
  );
};

export default Navbar;