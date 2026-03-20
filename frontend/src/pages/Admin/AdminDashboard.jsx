import React, { useState, useEffect } from "react";
import { FaKey, FaServer, FaSave, FaExclamationTriangle, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import api from "../../services/api";

const AdminDashboard = () => {
    const [config, setConfig] = useState({ gemini_api_key: "", token_limit: 1000000, tokens_used: 0, is_exhausted: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('admin/config/');
                setConfig(res.data);
            } catch (error) {
                toast.error("Failed to load configuration. Are you an admin?");
            } finally { setLoading(false); }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('admin/config/', config);
            toast.success("API Keys and Limits Updated!");
            const res = await api.get('admin/config/');
            setConfig(res.data);
        } catch (error) {
            toast.error("Failed to update system config.");
        } finally { setSaving(false); }
    };

    const usagePercentage = Math.min((config.tokens_used / config.token_limit) * 100, 100).toFixed(1);

    if (loading) return (
        <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#f08a5d] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#f08a5d] font-bold tracking-widest uppercase text-sm">Loading Data Core...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fff7ed] p-4 sm:p-8 relative">
            
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 animate-fade-up">
                
                <div className="mb-6">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#f08a5d] transition-colors w-fit group">
                        <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Back to Site</span>
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-orange-100 border border-orange-50 mb-8">
                    <div className="flex items-center gap-5 border-b border-orange-100 pb-8 mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#f08a5d] to-[#d97346] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <FaServer size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">System Command Center</h1>
                            <p className="text-sm font-medium text-slate-500 mt-1">Live API Key & Limit Management</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        {/* Status Card */}
                        <div className={`p-6 rounded-2xl border-2 transition-colors ${config.is_exhausted ? 'bg-red-50 border-red-200' : 'bg-green-50/50 border-green-100'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                {config.is_exhausted ? <FaExclamationTriangle className="text-red-500 w-5 h-5" /> : <FaCheckCircle className="text-green-500 w-5 h-5" />}
                                <h3 className="font-bold text-slate-700">API Status</h3>
                            </div>
                            <p className={`text-2xl font-black tracking-tight ${config.is_exhausted ? 'text-red-600' : 'text-green-600'}`}>
                                {config.is_exhausted ? "EXHAUSTED" : "OPERATIONAL"}
                            </p>
                        </div>

                        {/* Usage Card */}
                        <div className="p-6 rounded-2xl bg-orange-50/50 border-2 border-orange-100 md:col-span-2">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">Token Usage Tracking</h3>
                            <div className="w-full bg-white rounded-full h-5 mb-3 overflow-hidden border border-orange-100 shadow-inner">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 75 ? 'bg-amber-500' : 'bg-[#f08a5d]'}`} 
                                    style={{ width: `${usagePercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-600">
                                <span>{config.tokens_used.toLocaleString()} used</span>
                                <span>{config.token_limit.toLocaleString()} max ({usagePercentage}%)</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                        <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <FaKey className="text-[#f08a5d]"/> Update System Credentials
                        </h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-[#f08a5d] mb-2 uppercase tracking-widest">Gemini API Key</label>
                                <input 
                                    type="text" 
                                    value={config.gemini_api_key} 
                                    onChange={(e) => setConfig({...config, gemini_api_key: e.target.value})}
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-bold focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all font-mono tracking-tight" 
                                    placeholder="Enter new API key..."
                                />
                                <p className="text-xs font-medium text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg inline-block border border-amber-100">
                                    Pasting a new key will automatically reset the token usage counter to 0.
                                </p>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-[#f08a5d] mb-2 uppercase tracking-widest">Token Usage Limit</label>
                                <input 
                                    type="number" 
                                    value={config.token_limit} 
                                    onChange={(e) => setConfig({...config, token_limit: parseInt(e.target.value)})}
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-bold focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all font-mono" 
                                />
                                <p className="text-xs text-slate-500 mt-2 font-medium">Set to 0 for unlimited (not recommended without billing alerts).</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className="bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent flex rounded-full animate-spin" /> : <FaSave />}
                                {saving ? "Saving Core..." : "Save Configuration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
