import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bedIcon from "../assets/medical-bed.png";
import { X, Menu, LogOut, User, ShieldAlert, CheckCircle } from 'lucide-react';
import Profile from "./Profile";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-screen bg-slate-900/95 backdrop-blur-md text-white border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex items-center space-x-3 group transition-transform active:scale-95"
            >
              <div className="bg-indigo-500/20 p-2 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
                <img src={bedIcon} alt="Logo" className="h-8 w-auto" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white">BNS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="cp text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">Dashboard</Link>
                    <Link to="/beds" className="cp text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">Beds Management</Link>
                    
                    {user.role === "admin" && (
                      <Link to="/admin" className="cp text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">Staff List</Link>
                    )}
                    
                    {user?.role !== 'intern' && (
                      <Link to="/update-expiry" className="cp text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">Expiry Dates</Link>
                    )}
                  </div>

                  <div className="h-8 w-[1px] bg-white/10 mx-2" />

                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {setIsMenuOpen(false); setIsProfileModalOpen(true)}}
                      className="cp flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 p-1.5 pr-4 rounded-full transition-all border border-white/5"
                    >
                      <img 
                        src={user?.image || "https://placehold.co/100x100"} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30" 
                      />
                      <span className="text-sm font-bold text-white">{user.name}</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link to="/about" className={location.pathname === '/about' ? 'hidden' : 'text-sm font-bold text-slate-300 hover:text-white transition-colors'}>About System</Link>
                  <Link to="/register" className={location.pathname === '/register' ? 'hidden' : 'text-sm font-bold text-slate-300 hover:text-white transition-colors'}>Register</Link>
                  <Link 
                    to="/login" 
                    className={location.pathname === '/login' ? 'hidden' : 'bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95'}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu} 
                className="cp p-2 text-slate-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10 p-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
            {user ? (
              <div className="flex flex-col space-y-4">
                    <button 
                      onClick={() => {setIsMenuOpen(false); setIsProfileModalOpen(true)}}
                      className="cp flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 p-1.5 pr-4 rounded-full transition-all border border-white/5"
                    >
                      <img 
                        src={user?.image || "https://placehold.co/100x100"} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30" 
                      />
                      <span className="text-sm font-bold text-white">{user.name}</span>
                    </button>
                  <div>
                </div>
                <Link to="/dashboard" onClick={toggleMenu} className="cp text-lg font-bold text-slate-300 px-2">Dashboard</Link>
                <Link to="/beds" onClick={toggleMenu} className="cp text-lg font-bold text-slate-300 px-2">Beds</Link>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="cp w-full flex items-center justify-between p-4 bg-red-500/10 text-red-500 rounded-2xl font-bold"
                >
                  Logout Session <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to="/login" onClick={toggleMenu} className={location.pathname === '/login' ? 'hidden' : 'cp p-4 bg-indigo-600 text-center rounded-2xl font-bold'}>Login</Link>
                <Link to="/register" onClick={toggleMenu} className={location.pathname === '/register' ? 'hidden' : 'cp p-4 bg-slate-800 text-center rounded-2xl font-bold'}>Register</Link>
                <Link to="/about" onClick={toggleMenu} className={location.pathname === '/about' ? 'hidden' : 'cp p-4 bg-slate-800 text-center rounded-2xl font-bold'}>About Us</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Dark Health-Themed Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" />
          
          <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <ShieldAlert size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Confirm Logout</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                You are about to end your session. You will need to re-authenticate to manage ward notifications.
              </p>
            </div>
            
            <div className="flex border-t border-white/10 h-14">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="cp flex-1 font-bold text-slate-500 hover:text-white transition-all text-xs tracking-widest uppercase"
              >
                Go Back
              </button>
              <button 
                onClick={confirmLogout}
                className="cp flex-1 font-bold text-red-500 hover:text-white transition-all border-l border-white/10 text-xs tracking-widest uppercase"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <Profile onClose={() => setIsProfileModalOpen(false)} user={user} />
      )}
    </>
  );
};

export default Navbar;