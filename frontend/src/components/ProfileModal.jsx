import React, { useState, useEffect } from "react";
import { X, Settings, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const ProfileModal = ({ isOpen, onClose, fullName, setFullName }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Name Update States
  const [nameInput, setNameInput] = useState(fullName);
  const [isSubmittingName, setIsSubmittingName] = useState(false);

  // Password Update States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Sync name input if fullName prop changes
  useEffect(() => {
    setNameInput(fullName);
  }, [fullName]);

  if (!isOpen) return null;

  // --- HANDLE NAME UPDATE ---
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (nameInput === fullName) return;

    setIsSubmittingName(true);
    try {
      await api.patch("update-profile/", { full_name: nameInput });
      
      localStorage.setItem("full_name", nameInput);
      setFullName(nameInput);
      toast.success("Profile name updated successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to update profile name.";
      toast.error(errorMsg);
    } finally {
      setIsSubmittingName(false);
    }
  };

  // --- HANDLE PASSWORD UPDATE ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await api.post("change-password/", {
        old_password: oldPassword,
        new_password: newPassword
      });
      toast.success("Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('details'); // Go back to details tab on success
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to update password. Check your old password.";
      toast.error(errorMsg);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-orange-100 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Settings className="text-[#f08a5d]" size={18} /> Account Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-[#f08a5d] bg-white hover:bg-orange-50 p-1.5 rounded-full transition-colors border border-slate-100 shadow-sm cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-2 pt-2">
            <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'details' ? 'border-[#f08a5d] text-[#f08a5d]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Profile Details
            </button>
            <button 
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'security' ? 'border-[#f08a5d] text-[#f08a5d]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Security
            </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
            {activeTab === 'details' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex flex-col items-center justify-center py-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f08a5d] to-[#d97346] flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-orange-50">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <CheckCircle2 size={12} /> Verified Member
                        </span>
                    </div>

                    <form onSubmit={handleNameUpdate} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest">Full Name / Username</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isSubmittingName || nameInput === fullName}
                                    className="px-4 py-3 text-sm font-bold text-white bg-[#f08a5d] hover:bg-[#d97346] shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center cursor-pointer"
                                >
                                    {isSubmittingName ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Status</p>
                        <p className="text-sm font-semibold text-slate-700">Active and verified. You have full access to Graphura AI generation features.</p>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 mb-2">
                        <p className="text-sm font-medium text-slate-700 flex items-start gap-2">
                            <KeyRound className="text-[#f08a5d] shrink-0 mt-0.5" size={16} /> 
                            <span>Update your password below. You must know your current password to make changes.</span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest">Current Password</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 font-medium bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] transition-colors cursor-pointer p-1"
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 font-medium bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] transition-colors cursor-pointer p-1"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-[#f08a5d] mb-1.5 uppercase tracking-widest">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 font-medium bg-white border-2 border-orange-100 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d] transition-colors cursor-pointer p-1"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmittingPassword}
                        className="w-full mt-2 px-5 py-3.5 text-sm font-bold text-white bg-[#f08a5d] hover:bg-[#d97346] shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center cursor-pointer"
                    >
                        {isSubmittingPassword ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Update Password"}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
