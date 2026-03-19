import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Settings, KeyRound, CheckCircle2, Edit3, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import toast from "react-hot-toast";
import api from "../services/api";
import ProfileModal from "./ProfileModal";


const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isAuthenticated = !!localStorage.getItem("access");
  
  // STATE FOR USERNAME SO UI UPDATES INSTANTLY
  const [fullName, setFullName] = useState(localStorage.getItem("full_name") || "User");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        await api.post("logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("full_name"); 
      toast.success("Logged out successfully");
      navigate("/");
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#platforms", label: "Platforms" },
  ];

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-md border-b border-orange-200/50 shadow-lg shadow-orange-200/30"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="https://www.graphura.in/image/bg%20removed.webp"
            alt="Graphura Logo"
            className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          {isHomePage ? (
            navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-orange-800/70 text-sm font-medium hover:text-orange-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))
          ) : (
            <Link
              to="/"
              className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 ${isHomePage ? 'text-orange-600 after:w-full' : 'text-orange-800/70 hover:text-orange-600 after:w-0 hover:after:w-full'}`}
            >
              Home
            </Link>
          )}
          
          {/* Generate & Workspace Links */}
          {isAuthenticated && (
            <>
              <Link
                to="/generator"
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 ${location.pathname === '/generator' ? 'text-orange-600 after:w-full' : 'text-orange-800/70 hover:text-orange-600 after:w-0 hover:after:w-full'}`}
              >
                Generate
              </Link>
              <Link
                to="/workspace"
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 ${location.pathname === '/workspace' || location.pathname.startsWith('/workspace/') ? 'text-orange-600 after:w-full' : 'text-orange-800/70 hover:text-orange-600 after:w-0 hover:after:w-full'}`}
              >
                My Workspace
              </Link>
            </>
          )}
        </div>

        {/* Desktop Buttons & Profile */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Trigger Button */}
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/60 border border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 shadow-sm cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#f08a5d] flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
                  {fullName.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                  {fullName}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-orange-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Dropdown Header */}
                  <div className="px-5 py-4 border-b border-orange-50 bg-orange-50/30">
                    <p className="text-sm font-bold text-slate-800 truncate">{fullName}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">Graphura User</p>
                  </div>
                  
                  {/* Dropdown Actions */}
                  <div className="p-2 space-y-1">
                    <button 
                        onClick={() => { setProfileDropdownOpen(false); setIsProfileModalOpen(true); }}
                        className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-[#f08a5d] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <User size={16} className="text-slate-400" /> Account Settings
                    </button>
                  </div>

                  <div className="p-2 border-t border-orange-50">
                    <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <X size={16} className="text-red-400" /> Log Out
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-sm lg:text-base font-semibold text-orange-700 border-2 border-orange-200 rounded-full bg-white/50 backdrop-blur-sm hover:bg-orange-50 hover:scale-110 transition-all duration-400 shadow-sm hover:shadow-md cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-4 py-2 rounded-full shadow-2xl shadow-orange-400/50 hover:scale-110 hover:shadow-orange-400/70 transition-all duration-400 shimmer-btn text-base cursor-pointer" style={{ background: "linear-gradient(135deg, #f08a5d, #f97316, #ea580c)", backgroundSize: "200% auto" }}>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-lg animate-fade-down">
          <div className="flex flex-col items-center py-4 px-6 space-y-4">
            {isHomePage ? (
              navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-orange-800 font-medium hover:text-orange-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))
            ) : (
              <Link to="/" className={`font-medium transition-colors py-2 ${isHomePage ? 'text-orange-600' : 'text-orange-800 hover:text-orange-600'}`} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            )}
            
            {isAuthenticated && (
              <>
                <Link to="/generator" className={`font-medium transition-colors py-2 ${location.pathname === '/generator' ? 'text-orange-600' : 'text-orange-800 hover:text-orange-600'}`} onClick={() => setMobileMenuOpen(false)}>
                  Generate
                </Link>
                <Link to="/workspace" className={`font-medium transition-colors py-2 ${location.pathname === '/workspace' || location.pathname.startsWith('/workspace/') ? 'text-orange-600' : 'text-orange-800 hover:text-orange-600'}`} onClick={() => setMobileMenuOpen(false)}>
                  My Workspace
                </Link>
              </>
            )}

            <div className="flex flex-col gap-3 pt-4 border-t border-orange-100 w-full mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-2xl border border-orange-100 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f08a5d] flex items-center justify-center text-white font-bold text-lg shadow-inner uppercase">
                      {fullName.charAt(0)}
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-bold text-slate-800 truncate">{fullName}</p>
                        <p className="text-xs font-medium text-slate-500">Graphura User</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setMobileMenuOpen(false); setIsProfileModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <Settings size={16} className="text-slate-400" /> Account Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-white font-black px-4 py-3 rounded-xl shadow-lg bg-[#f08a5d] hover:bg-[#d97346] transition-all cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <button className="w-full px-4 py-3 text-sm font-semibold text-orange-700 border-2 border-orange-200 rounded-xl bg-white hover:bg-orange-50 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="w-full text-white font-black px-4 py-3 rounded-xl shadow-lg transition-all duration-300 shimmer-btn cursor-pointer" style={{ background: "linear-gradient(135deg, #f08a5d, #f97316, #ea580c)", backgroundSize: "200% auto" }} onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

    {/* RENDER THE MODAL AT THE ROOT LEVEL */}
    <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        fullName={fullName} 
        setFullName={setFullName}
    />
    </>
  );
};

export default NavBar;