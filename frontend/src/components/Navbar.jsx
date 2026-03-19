import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; 
import toast from "react-hot-toast";
import api from "../services/api";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("access");
  
  // FETCH USERNAME (WHICH HOLDS THE FIRST NAME)
  const fullName = localStorage.getItem("full_name") || "User";

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
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#platforms", label: "Platforms" },
  ];

  return (
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
        <div className="hidden md:flex gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-orange-800/70 text-sm font-medium hover:text-orange-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          {/* Generate & Workspace Links */}
          {isAuthenticated && (
            <>
              <Link
                to="/generator"
                className="relative text-orange-800/70 text-sm font-medium hover:text-orange-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Generate
              </Link>
              <Link
                to="/workspace"
                className="relative text-orange-800/70 text-sm font-medium hover:text-orange-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-orange-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                My Workspace
              </Link>
            </>

          )}
        </div>

        {/* Desktop Buttons & Welcome Message */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {isAuthenticated ? (
            <>
              {/* Plain text welcome message instead of a button */}
              <span className="text-xs lg:text-sm font-semibold text-orange-700 mr-2">
                Welcome, {fullName}
              </span>
              
              <button 
                onClick={handleLogout}
                className="relative overflow-hidden flex items-center gap-2 text-white font-normal px-4 py-2 rounded-full shadow-2xl shadow-[#f08a5d]/30 transition-all duration-300 shimmer-btn text-sm bg-[#f08a5d] hover:bg-[#d97346] hover:-translate-y-1 hover:shadow-[#f08a5d]/40 cursor-pointer"
              >
                Log Out
              </button>
            </>
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
          className="md:hidden p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-lg animate-fade-down">
          <div className="flex flex-col items-center py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-orange-800 font-medium hover:text-orange-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            
            {/* Generate Link in Mobile Dropdown */}
            {isAuthenticated && (
              <>
                <Link
                  to="/generator"
                  className="text-orange-800 font-medium hover:text-orange-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Generate
                </Link>
                <Link
                  to="/workspace"
                  className="text-orange-800 font-medium hover:text-orange-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Workspace
                </Link>
              </>
            )}

            <div className="flex flex-col gap-3 pt-2 w-full">
              {isAuthenticated ? (
                <>
                  {/* Plain text welcome message for mobile */}
                  <span className="text-center text-sm font-semibold text-orange-700 pb-2 border-b border-orange-100">
                    Welcome, {fullName}
                  </span>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center text-white font-black px-4 py-2 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 transition-all duration-300"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <button className="w-full px-4 py-2 text-sm font-semibold text-orange-700 border-2 border-orange-200 rounded-full bg-white hover:bg-orange-50 transition-all duration-300 shadow-sm" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <button className="w-full text-white font-black px-4 py-2 rounded-full shadow-lg transition-all duration-300 shimmer-btn" style={{ background: "linear-gradient(135deg, #f08a5d, #f97316, #ea580c)", backgroundSize: "200% auto" }} onClick={() => setMobileMenuOpen(false)}>
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
  );
};

export default NavBar;