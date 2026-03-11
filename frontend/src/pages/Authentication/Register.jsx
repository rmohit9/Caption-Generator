import React, { useState } from "react";
import { FaGoogle, FaApple, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom"; // or use <a> if not using router
import FloatingHashtag from "./FloatingHashtag";
import NavBar from "../../components/Navbar";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        agree: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic
        console.log("Register with:", formData);
    };

    return (
        <>

            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)",
                }}
            >

                {/* Floating hashtag symbols */}
                <FloatingHashtag />

                {/* Soft background blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float" />
                    <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
                </div>

                {/* Main container */}
                <div className="relative z-10 max-w-6xl w-full bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-200/50 border border-white/50 overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Left side - Branding & Benefits */}
                        <div className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 p-8 md:p-12 text-white flex flex-col justify-between overflow-hidden">
                            {/* Floating particles */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 left-10 text-8xl font-black rotate-12">#</div>
                                <div className="absolute bottom-20 right-10 text-9xl font-black -rotate-12">#</div>
                                <div className="absolute top-1/3 right-1/4 text-7xl font-black rotate-45">#</div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center gap-2 mb-8">
                                    <img
                                        src="https://www.graphura.in/image/bg%20removed.webp"
                                        alt="Graphura Logo"
                                        className="h-12 w-auto"
                                    />
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                                    Join the <br />
                                    <span className="text-yellow-300">Hashtag Revolution</span>
                                </h1>

                                <ul className="space-y-4 text-lg">
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                                        AI-powered caption generation
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                                        Trending hashtag suggestions
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                                        Platform-specific optimization
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                                        Real-time engagement scoring
                                    </li>
                                </ul>
                            </div>

                            <div className="relative mt-8">
                                <p className="text-white/80 text-sm">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-white font-bold underline hover:text-yellow-300 transition">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Right side - Registration Form */}

                        <div className="p-8 md:p-12 bg-white/80 backdrop-blur-sm">
                        {/* back button */}
                            <div className="flex items-center mb-4">
                                <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition group">
                                    <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-sm font-semibold">Back to Home</span>
                                </Link>
                            </div>

                            <h2 className="text-3xl font-black text-slate-800 mb-2">Create Account</h2>
                            <p className="text-slate-600 mb-8">Start your Journey with us </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                        <FaUser className="w-4 h-4" /> Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full rounded-2xl px-4 py-3 pl-10 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                            required
                                        />
                                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                        <FaEnvelope className="w-4 h-4" /> Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="hello@example.com"
                                            className="w-full rounded-2xl px-4 py-3 pl-10 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                            required
                                        />
                                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                        <FaLock className="w-4 h-4" /> Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl px-4 py-3 pl-10 pr-10 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                            required
                                        />
                                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition"
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="agree"
                                        id="agree"
                                        checked={formData.agree}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                                        required
                                    />
                                    <label htmlFor="agree" className="text-sm text-slate-600">
                                        I agree to the{" "}
                                        <a href="#" className="text-indigo-600 font-semibold hover:underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-indigo-600 font-semibold hover:underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full relative overflow-hidden text-white font-black py-3 
                                    rounded-2xl text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg shimmer-btn bg-indigo-600"
                                >
                                    Create Account
                                </button>



                                <p className="text-center text-xs text-slate-500 mt-4">
                                    By signing up, you agree to our Terms and Privacy Policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Required animations (add to global style or same as homepage) */}
                <style>{`
        @keyframes float-very-slow {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-30px) translateX(20px) rotate(120deg); }
          66% { transform: translateY(20px) translateX(-20px) rotate(240deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        .animate-float-very-slow {
          animation: float-very-slow linear infinite;
        }
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmer-move 2s infinite;
        }
        @keyframes shimmer-move {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
            </div>
        </>
    );
};

export default Register;