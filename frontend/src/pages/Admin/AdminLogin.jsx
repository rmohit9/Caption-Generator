import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import api from "../../services/api";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", admin_access_key: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('admin/login/', formData);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            toast.success("Admin Access Granted");
            navigate('/admin/dashboard'); 
        } catch (error) {
            toast.error(error.response?.data?.error || "Unauthorized Access");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-[#fff7ed]">
            
            {/* Soft background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-orange-200/50 border border-orange-100 animate-fade-up">
                
                <div className="flex items-center mb-6">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#f08a5d] transition-colors group w-fit">
                        <FaArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs sm:text-sm font-bold">Back</span>
                    </Link>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f08a5d] to-[#d97346] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                        <FaShieldAlt size={28} />
                    </div>
                </div>
                
                <h2 className="text-3xl font-black text-slate-800 text-center mb-2">System Admin</h2>
                <p className="text-slate-500 text-center text-sm font-medium mb-8">Restricted Access Portal</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                            <FaEnvelope className="w-3.5 h-3.5" /> Admin Email
                        </label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                className="w-full rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all shadow-sm"
                                placeholder="admin@example.com"
                            />
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                            <FaLock className="w-3.5 h-3.5" /> Password
                        </label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="w-full rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                            />
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-red-500 mb-1.5 uppercase tracking-widest flex items-center gap-1.5">
                            <FaKey className="w-3.5 h-3.5" /> Master Access Key
                        </label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required 
                                value={formData.admin_access_key} 
                                onChange={(e) => setFormData({...formData, admin_access_key: e.target.value})} 
                                className="w-full rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 font-semibold placeholder-red-300 bg-red-50/30 border-2 border-red-100 focus:border-red-400 focus:ring-4 focus:ring-red-400/10 outline-none transition-all shadow-sm" 
                                placeholder="Enter secure key..." 
                            />
                            <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300 pointer-events-none" />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full mt-4 bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-sm disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {loading ? "Authenticating..." : "Establish Connection"}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};
export default AdminLogin;
