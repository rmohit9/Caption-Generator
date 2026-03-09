import React from 'react'
import { useState, useEffect } from "react"

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-lg shadow-pink-200/50" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-pink-300 animate-glow" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)" }}>
                        H
                    </div>
                    <span className="font-display font-black text-xl tracking-tight" style={{ background: "linear-gradient(135deg, #be185d, #f43f8e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        HashCraft
                    </span>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "Platforms"].map(l => (
                        <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-semibold text-rose-900/70 hover:text-rose-600 transition-all duration-200 relative group">
                            {l}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300" style={{ background: "linear-gradient(90deg, #f43f8e, #a855f7)" }} />
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <button className="text-sm font-bold text-rose-600 hover:text-rose-800 transition-colors px-4 py-2 rounded-full hover:bg-rose-50">Log in</button>
                    <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-4 py-2 rounded-full shadow-2xl shadow-pink-400/50 hover:-translate-y-2 hover:shadow-pink-400/70 transition-all duration-300 shimmer-btn text-base" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}>
                        start Free
                    </button>
                </div>

                <button className="md:hidden p-2 rounded-xl hover:bg-pink-100 transition-colors" onClick={() => setMobileMenu(!mobileMenu)}>
                    <div className="space-y-1.5">
                        <div className={`w-6 h-0.5 rounded-full transition-all ${mobileMenu ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#f43f8e" }} />
                        <div className={`w-6 h-0.5 rounded-full transition-all ${mobileMenu ? "opacity-0" : ""}`} style={{ background: "#f43f8e" }} />
                        <div className={`w-6 h-0.5 rounded-full transition-all ${mobileMenu ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#f43f8e" }} />
                    </div>
                </button>
            </div>

            {mobileMenu && (
                <div className="md:hidden glass-pink border-t border-pink-200/50 px-6 py-5 flex flex-col gap-4">
                    {["Features", "How It Works", "Platforms", "Pricing"].map(l => (
                        <a key={l} href="#" className="text-sm font-bold text-rose-700 hover:text-rose-900">{l}</a>
                    ))}
                    <button className="text-sm font-bold text-white py-3 rounded-full mt-1" style={{ background: "linear-gradient(135deg, #f43f8e, #a855f7)" }}>✨ Start Free</button>
                </div>
            )}
        </nav>
    )
}
