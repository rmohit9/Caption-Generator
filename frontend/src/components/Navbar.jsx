import React, { useState, useEffect } from "react";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg shadow-pink-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="https://www.graphura.in/image/bg%20removed.webp"
            alt="Graphura Logo"
            className="h-12 w-auto object-contain"
            style={{ backgroundColor: "transparent" }}
          />
        </a>

        {/* Centered Links */}
        <div className="flex gap-8 text-lg mx-auto">
          <a href="#features" className="hover:text-pink-500 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-pink-500 transition">
            How It Works
          </a>
          <a href="#platforms" className="hover:text-pink-500 transition">
            Platforms
          </a>
        </div>

        {/* Right Side Buttons */}
        <div className="flex gap-4">
          <button className="px-4 py-2 text-pink-500 border border-pink-500 rounded-lg hover:bg-pink-50 transition">
            Login
          </button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
            Start Free
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;