import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        ? "bg-white/80 backdrop-blur-md border-b border-pink-200/50 shadow-lg shadow-pink-200/30"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <img
            src="https://www.graphura.in/image/bg%20removed.webp"
            alt="Graphura Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-rose-800/70 font-medium hover:text-pink-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-pink-500 after:to-rose-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 lg:gap-4">
          <button className="px-4 py-2 text-sm lg:text-base font-semibold text-pink-700 border-2 border-pink-200 rounded-full bg-white/50 backdrop-blur-sm hover:bg-pink-50 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md">
            Login
          </button>
          <button className="relative overflow-hidden text-sm lg:text-base font-semibold flex items-center gap-2 text-white font-black px-4 py-2 rounded-full shadow-2xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-indigo-500/40 transition-all duration-300 shimmer-btn text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-[length:200%_auto] animate-gradient">
            Start Free
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg animate-fade-down">
          <div className="flex flex-col items-center py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-rose-800 font-medium hover:text-pink-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button className="px-5 py-2 text-sm font-semibold text-pink-700 border-2 border-pink-200 rounded-full bg-white/50 hover:bg-pink-50 transition-all">
                Login
              </button>
              <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-8 py-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-indigo-500/40 transition-all duration-300 shimmer-btn text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-[length:200%_auto] animate-gradient">
                Start Free
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;