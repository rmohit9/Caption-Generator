import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaKey, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FloatingHashSymbols from "../../components/Hashtag";
import api from "../../services/api";
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();

    // --- STANDARD LOGIN STATES ---
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    // --- FORGOT PASSWORD STATES ---
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = OTP, 3 = New Password
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
    const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

    // --- CLOSE MODAL ON ESCAPE ---
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') resetForgotModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const resetForgotModal = () => {
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleForgotChange = (e) => {
        setForgotData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- STANDARD LOGIN HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('login/', {
                username: formData.email,
                password: formData.password
            });

            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            if (response.data.full_name) {
                localStorage.setItem('full_name', response.data.full_name);
            }

            toast.success("Successfully logged in!");
            navigate('/');
        } catch (error) {
            console.error("Login Error: ", error.response?.data);
            toast.error(error.response?.data?.detail || error.response?.data?.error || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- FORGOT PASSWORD HANDLERS ---

    // STEP 1: Send OTP via Brevo
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!forgotData.email) return toast.error("Please enter your email.");

        setIsForgotLoading(true);
        try {
            await api.post('password-reset/request-otp/', { email: forgotData.email });
            toast.success("Verification code sent to your email!");
            setForgotStep(2);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to send OTP. Check if the email is registered.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!forgotData.otp) return toast.error("Please enter the verification code.");

        setIsForgotLoading(true);
        try {
            await api.post('password-reset/verify-otp/', {
                email: forgotData.email,
                otp: forgotData.otp
            });
            toast.success("Code verified successfully!");
            setForgotStep(3);
        } catch (error) {
            toast.error(error.response?.data?.error || "Invalid or expired verification code.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    // STEP 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (forgotData.newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
        if (forgotData.newPassword !== forgotData.confirmPassword) return toast.error("Passwords do not match!");

        setIsForgotLoading(true);
        try {
            await api.post('password-reset/confirm/', {
                email: forgotData.email,
                otp: forgotData.otp,
                new_password: forgotData.newPassword
            });
            toast.success("Password reset successfully! You can now log in.");
            resetForgotModal();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to reset password. Please try again.");
        } finally {
            setIsForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start lg:justify-center md:justify-start
        py-4 sm:py-6 md:py-8 md:px-2 relative overflow-y-auto bg-[#fff7ed]">
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

                    {/* Left side - Branding & Welcome Back */}
                    <div className="relative bg-gradient-to-br from-[#f08a5d] to-[#d97346] p-5 sm:p-8 md:p-10 text-white flex flex-col justify-between overflow-hidden">

                        {/* Decorative Background Elements */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none hidden md:block">
                            <div className="absolute top-10 left-10 text-8xl font-black rotate-12">#</div>
                            <div className="absolute bottom-20 right-10 text-9xl font-black -rotate-12">#</div>
                            <div className="absolute top-1/3 right-1/4 text-7xl font-black rotate-45">#</div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <img
                                    src="https://www.graphura.in/image/bg%20removed.webp"
                                    alt="Graphura Logo"
                                    className="h-10 sm:h-12 md:h-14 w-auto"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </div>

                            <h1 className="poppins-heading-hero text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3 sm:mb-4">
                                Welcome Back to <br className="hidden sm:block" />
                                <span className="text-yellow-300">Graphura AI</span>
                            </h1>

                            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-white/90 font-medium leading-relaxed max-w-sm">
                                Log in to continue creating AI-powered captions and hashtags that dominate social media.
                            </p>

                            <div className="space-y-3 sm:space-y-4 hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm">✓</span>
                                    <span className="text-sm font-semibold text-white/90">Access your saved campaigns</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm">✓</span>
                                    <span className="text-sm font-semibold text-white/90">Continue where you left off</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs sm:text-sm">✓</span>
                                    <span className="text-sm font-semibold text-white/90">Personalized hashtag suggestions</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
                            <p className="text-white/90 text-xs sm:text-sm font-medium">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-white font-black hover:text-yellow-300 transition-colors sm:ml-1">
                                    Sign up free →
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right side - Login Form */}
                    <div className="p-6 sm:p-10 md:p-14 bg-white/50 backdrop-blur-sm flex flex-col justify-center">

                        <div className="flex items-center mb-5 sm:mb-8">
                            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#f08a5d] transition-colors group w-fit">
                                <FaArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs sm:text-sm font-bold">Back to Home</span>
                            </Link>
                        </div>

                        <h2 className="poppins-heading text-2xl sm:text-3xl md:text-4xl text-slate-800 mb-1.5">Log In</h2>
                        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-10 font-medium">Access your HashCraft AI dashboard.</p>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

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

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between pt-1 sm:pt-2">
                                <label className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleChange}
                                            className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 border-2 border-orange-200 rounded bg-white checked:bg-[#f08a5d] checked:border-[#f08a5d] transition-all cursor-pointer"
                                        />
                                        <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 14 10" fill="none"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsForgotModalOpen(true)}
                                    className="text-xs sm:text-sm font-bold text-[#f08a5d] hover:text-[#d97346] hover:underline transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 sm:mt-4 bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shimmer-btn text-sm sm:text-base flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Log In to Dashboard"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* FORGOT PASSWORD MODAL            */}
            {/* ========================================= */}
            {isForgotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden animate-fade-up">

                        {/* Header */}
                        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <FaLock className="text-[#f08a5d]" size={16} /> Reset Password
                            </h3>
                            <button onClick={resetForgotModal} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors border border-slate-100 shadow-sm">
                                <FaTimes size={14} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-8">

                            {/* STEP 1: ENTER EMAIL */}
                            {forgotStep === 1 && (
                                <form onSubmit={handleSendOtp} className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <p className="text-sm font-medium text-slate-600">Enter your registered email address and we will send you a verification code.</p>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                                            <FaEnvelope className="w-3 h-3" /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={forgotData.email}
                                            onChange={handleForgotChange}
                                            placeholder="hello@example.com"
                                            className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold bg-slate-50 border-2 border-orange-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <button type="submit" disabled={isForgotLoading} className="w-full bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center">
                                        {isForgotLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Send Verification Code"}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: ENTER OTP */}
                            {forgotStep === 2 && (
                                <form onSubmit={handleVerifyOtp} className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-orange-600 mb-1">Code sent to:</p>
                                        <p className="text-sm font-black text-slate-800 truncate">{forgotData.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                                            <FaKey className="w-3 h-3" /> Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={forgotData.otp}
                                            onChange={handleForgotChange}
                                            placeholder="Enter 6-digit code"
                                            className="w-full rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg text-slate-800 font-black bg-slate-50 border-2 border-orange-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                            required
                                            autoFocus
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setForgotStep(1)} className="flex-1 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 py-3.5 rounded-xl transition-colors">
                                            Back
                                        </button>
                                        <button type="submit" disabled={isForgotLoading} className="flex-[2] bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center">
                                            {isForgotLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Verify Code"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3: NEW PASSWORD */}
                            {forgotStep === 3 && (
                                <form onSubmit={handleResetPassword} className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <p className="text-sm font-medium text-green-600 bg-green-50 border border-green-100 p-3 rounded-xl">✓ Code verified. Please create your new password.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaLock className="w-3 h-3" /> New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showForgotNewPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={forgotData.newPassword}
                                                    onChange={handleForgotChange}
                                                    placeholder="••••••••"
                                                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 font-semibold bg-slate-50 border-2 border-orange-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                                    required
                                                    minLength={8}
                                                />
                                                <button type="button" onClick={() => setShowForgotNewPassword(!showForgotNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] p-1">
                                                    {showForgotNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaLock className="w-3 h-3" /> Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showForgotConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={forgotData.confirmPassword}
                                                    onChange={handleForgotChange}
                                                    placeholder="••••••••"
                                                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 font-semibold bg-slate-50 border-2 border-orange-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                                    required
                                                    minLength={8}
                                                />
                                                <button type="button" onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] p-1">
                                                    {showForgotConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isForgotLoading} className="w-full bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center">
                                        {isForgotLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save New Password"}
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            )}

            <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      * { font-family: 'Inter', sans-serif; }
      .poppins-heading { font-family: 'Poppins', sans-serif; font-weight: 500; }
      .poppins-heading-hero { font-family: 'Poppins', sans-serif; font-weight: 500; }
      
      @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
      .shimmer-btn::after {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        animation: shimmer-move 2.5s infinite;
      }
      @keyframes shimmer-move { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      @keyframes floatY { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
      .animate-float { animation: floatY 6s ease-in-out infinite; }
    `}</style>
        </div>
    );
};

export default Login;