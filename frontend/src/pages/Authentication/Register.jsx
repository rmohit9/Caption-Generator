import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FloatingHashSymbols from "../../components/Hashtag";
import api from "../../services/api";
import toast from 'react-hot-toast';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        agree: false,
    });

    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success("Account created successfully! Redirecting to login...");
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            
        } catch (error) {
            console.error("Registration Error: ", error.response?.data);
            const errData = error.response?.data;
            
            if (errData && typeof errData === 'object') {
                const firstKey = Object.keys(errData)[0];
                if (firstKey) {
                    const msg = errData[firstKey];
                    const formattedMessage = Array.isArray(msg) ? msg[0] : msg;
                    const fieldName = firstKey.charAt(0).toUpperCase() + firstKey.slice(1);
                    toast.error(`${fieldName}: ${formattedMessage}`);
                } else {
                     toast.error("Registration failed. Please check your information.");
                }
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-[#fff7ed] overflow-y-auto">
            
            {/* Floating hashtag symbols */}
            <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block">
                <FloatingHashSymbols count={100} opacity={0.15} />
            </div>

            {/* Soft background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/3 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
            </div>

            {/* Main container */}
            <div className="relative z-10 max-w-5xl w-full bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl shadow-orange-200/50 border border-orange-100 overflow-hidden animate-fade-up">
                <div className="grid md:grid-cols-2 h-full">
                    
                    {/* Left side - Branding & Benefits */}
                    <div className="relative bg-gradient-to-br from-[#f08a5d] to-[#d97346] p-8 sm:p-10 md:p-14 text-white flex flex-col justify-between overflow-hidden">
                        
                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none hidden md:block">
                            <div className="absolute top-10 left-10 text-8xl font-black rotate-12">#</div>
                            <div className="absolute bottom-20 right-10 text-9xl font-black -rotate-12">#</div>
                            <div className="absolute top-1/3 right-1/4 text-7xl font-black rotate-45">#</div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-8 sm:mb-12">
                                <img
                                    src="https://www.graphura.in/image/bg%20removed.webp"
                                    alt="Graphura Logo"
                                    className="h-10 sm:h-12 md:h-14 w-auto"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 sm:mb-6">
                                Join the <br className="hidden sm:block" />
                                <span className="text-yellow-300">Hashtag Revolution</span>
                            </h1>

                            <ul className="space-y-3 sm:space-y-5 text-sm sm:text-base font-medium text-white/90 hidden sm:block">
                                <li className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">✓</span>
                                    <span>Generate viral captions instantly</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">✓</span>
                                    <span>Discover algorithm-friendly hashtags</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">✓</span>
                                    <span>Save and manage custom brand profiles</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">✓</span>
                                    <span>Perfectly format posts for every network</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative z-10 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/20">
                            <p className="text-white/90 text-xs sm:text-sm font-medium">
                                Already have an account?{" "}
                                <Link to="/login" className="text-white font-black hover:text-yellow-300 transition-colors sm:ml-1">
                                    Log in here →
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right side - Registration Form */}
                    <div className="p-6 sm:p-10 md:p-14 bg-white/50 backdrop-blur-sm flex flex-col justify-center">
                        
                        <div className="flex items-center mb-6 sm:mb-8">
                            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#f08a5d] transition-colors group w-fit">
                                <FaArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs sm:text-sm font-bold">Back to Home</span>
                            </Link>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 mb-2">Create Account</h2>
                        <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10 font-medium">Start your journey with HashCraft AI.</p>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-black text-[#f08a5d] mb-1.5 sm:mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                    <FaUser className="w-3.5 h-3.5" /> Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full rounded-xl sm:rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 pl-11 sm:pl-12 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all shadow-sm"
                                        required
                                    />
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-black text-[#f08a5d] mb-1.5 sm:mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                    <FaEnvelope className="w-3.5 h-3.5" /> Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="hello@example.com"
                                        className="w-full rounded-xl sm:rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 pl-11 sm:pl-12 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all shadow-sm"
                                        required
                                    />
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-black text-[#f08a5d] mb-1.5 sm:mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                    <FaLock className="w-3.5 h-3.5" /> Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl sm:rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 pl-11 sm:pl-12 pr-12 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all shadow-sm"
                                        required
                                    />
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] transition-colors p-1"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="pt-1 sm:pt-2">
                                <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                        <input
                                            type="checkbox"
                                            name="agree"
                                            id="agree"
                                            checked={formData.agree}
                                            onChange={handleChange}
                                            className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-orange-200 rounded bg-white checked:bg-[#f08a5d] checked:border-[#f08a5d] transition-all cursor-pointer"
                                            required
                                        />
                                        <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors leading-snug">
                                        I agree to the{" "}
                                        <Link to="/terms" className="font-bold text-[#f08a5d] hover:text-[#d97346] hover:underline transition-colors">Terms of Service</Link>
                                        {" "}and{" "}
                                        <Link to="/privacy" className="font-bold text-[#f08a5d] hover:text-[#d97346] hover:underline transition-colors">Privacy Policy</Link>.
                                    </span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full mt-2 sm:mt-4 bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shimmer-btn text-sm sm:text-base"
                            >
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
                .shimmer-btn::after {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                    animation: shimmer-move 2.5s infinite;
                }
                @keyframes shimmer-move { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            `}</style>
        </div>
    );
};

export default Register;