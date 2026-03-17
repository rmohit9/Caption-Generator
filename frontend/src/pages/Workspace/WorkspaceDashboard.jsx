import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const WorkspaceDashboard = () => {
    const navigate = useNavigate();
    const { id: workspaceId } = useParams(); 

    // --- REAL BACKEND STATE FOR PROFILES ---
    const [profiles, setProfiles] = useState([]);
    
    // Form States for creating/editing a Profile
    const [profileName, setProfileName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [audience, setAudience] = useState("");
    const [tone, setTone] = useState("Professional");

    // Fetch Profiles when the dashboard loads
    useEffect(() => {
        if (workspaceId) {
            fetchProfiles();
        }
    }, [workspaceId]);

    const fetchProfiles = async () => {
        try {
            const response = await api.get(`workspaces/${workspaceId}/profiles/`);
            setProfiles(response.data);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            toast.error("Failed to load Batch Profiles.");
        }
    };

    // --- REAL CRUD LOGIC FOR PROFILES ---
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: profileName, brand: brandName, audience, tone };
            const response = await api.post(`workspaces/${workspaceId}/profiles/`, payload);
            
            setProfiles([response.data, ...profiles]);
            setSelectedItem(response.data);
            setMainView('view_profile');
            toast.success("Batch Profile created successfully!");
            clearForm();
        } catch (error) {
            console.error("Error creating profile:", error);
            toast.error("Failed to save Batch Profile.");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = { name: profileName, brand: brandName, audience, tone };
            const response = await api.patch(`profiles/${selectedItem.id}/`, payload);
            
            // Update the profile in the state array
            setProfiles(profiles.map(p => p.id === selectedItem.id ? response.data : p));
            setSelectedItem(response.data);
            setMainView('view_profile');
            toast.success("Batch Profile updated!");
            clearForm();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update Batch Profile.");
        }
    };

    const handleDeleteProfile = async () => {
        const confirm = window.confirm("Are you sure you want to delete this Batch Profile?");
        if (!confirm) return;

        try {
            await api.delete(`profiles/${selectedItem.id}/`);
            setProfiles(profiles.filter(p => p.id !== selectedItem.id));
            setSelectedItem(null);
            setMainView('new_profile'); // Go back to create screen
            toast.success("Batch Profile deleted.");
        } catch (error) {
            console.error("Error deleting profile:", error);
            toast.error("Failed to delete Batch Profile.");
        }
    };

    const openEditForm = () => {
        setProfileName(selectedItem.name);
        setBrandName(selectedItem.brand);
        setAudience(selectedItem.audience);
        setTone(selectedItem.tone);
        setMainView('edit_profile');
    };

    const clearForm = () => {
        setProfileName("");
        setBrandName("");
        setAudience("");
        setTone("Professional");
    };

    const openOldProfile = (profile) => {
        setSelectedItem(profile);
        setMainView('view_profile');
        clearForm();
    };

    // --- MOCK DATA FOR CAMPAIGNS ---
    const mockCampaigns = [
        { id: 1, name: "Organic Green Tea Launch", profileName: "Fitness Brand Tone", product: "Green Tea", details: "Launch campaign...", date: "March 16, 2026" }
    ];

    const mockResults = {
        instagram: { caption: "Refresh your mornings...", hashtags: "#GreenTeaLover" },
        linkedin: { caption: "Health starts with mindful choices...", hashtags: "#Productivity" }
    };

    // --- UI STATE ---
    const [sidebarTab, setSidebarTab] = useState('profiles'); 
    const [mainView, setMainView] = useState('new_profile'); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const [isGenerating, setIsGenerating] = useState(false);

    // --- CAMPAIGN HANDLERS ---
    const handleGenerate = (e) => {
        e.preventDefault();
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setSelectedItem(mockCampaigns[0]);
            setMainView('view_campaign');
        }, 1000);
    };

    const openOldCampaign = (campaign) => {
        setSelectedItem(campaign);
        setMainView('view_campaign');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* ========================================== */}
            {/* LEFT SIDEBAR: History & Navigation         */}
            {/* ========================================== */}
            <aside className="w-80 bg-white border-r border-gray-300 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Workspace</p>
                        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                    </div>
                    <button onClick={() => navigate('/workspace')} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                        ← Back
                    </button>
                </div>

                <div className="flex border-b border-gray-200 bg-white">
                    <button onClick={() => setSidebarTab('campaigns')} className={`flex-1 py-3 text-sm font-bold ${sidebarTab === 'campaigns' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                        Campaigns
                    </button>
                    <button onClick={() => setSidebarTab('profiles')} className={`flex-1 py-3 text-sm font-bold ${sidebarTab === 'profiles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                        Batch Profiles
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {sidebarTab === 'campaigns' ? (
                        mockCampaigns.map(camp => (
                            <div key={camp.id} onClick={() => openOldCampaign(camp)} className={`p-4 rounded border cursor-pointer transition-colors ${mainView === 'view_campaign' && selectedItem?.id === camp.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                <h4 className="font-bold text-gray-800 text-sm">{camp.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{camp.date}</p>
                            </div>
                        ))
                    ) : (
                        // REAL PROFILES RENDERED HERE
                        profiles.map(prof => (
                            <div key={prof.id} onClick={() => openOldProfile(prof)} className={`p-4 rounded border cursor-pointer transition-colors ${(mainView === 'view_profile' || mainView === 'edit_profile') && selectedItem?.id === prof.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                <h4 className="font-bold text-gray-800 text-sm">{prof.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">Brand: {prof.brand}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <button onClick={() => { clearForm(); setMainView(sidebarTab === 'campaigns' ? 'new_campaign' : 'new_profile'); }} className="w-full py-3 bg-gray-800 hover:bg-black text-white text-sm font-bold rounded transition-colors">
                        + Create New {sidebarTab === 'campaigns' ? 'Campaign' : 'Profile'}
                    </button>
                </div>
            </aside>

            {/* ========================================== */}
            {/* RIGHT MAIN AREA: Forms & Details           */}
            {/* ========================================== */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-gray-100">
                <div className="max-w-3xl mx-auto">
                    
                    {/* NEW CAMPAIGN FORM (Mocked) */}
                    {mainView === 'new_campaign' && (
                        <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Create New Campaign</h1>
                            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">1. Select Batch Profile</label>
                                    <select className="w-full border border-gray-300 p-3 rounded bg-gray-50" required>
                                        <option value="">-- Choose a Saved Profile --</option>
                                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">2. Campaign Name</label><input type="text" className="w-full border p-3 rounded bg-gray-50" required /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">3. Product</label><input type="text" className="w-full border p-3 rounded bg-gray-50" required /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">4. Details</label><textarea className="w-full border p-3 rounded bg-gray-50" rows="3" required></textarea></div>
                                
                                {/* ADDED PLATFORM SELECTION HERE */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">5. Target Platforms</label>
                                    <div className="flex gap-4 p-4 border border-gray-300 rounded bg-gray-50 flex-wrap">
                                        <label className="flex items-center gap-2"><input type="checkbox" value="Instagram" className="w-4 h-4" /> Instagram</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" value="LinkedIn" className="w-4 h-4" /> LinkedIn</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" value="Twitter" className="w-4 h-4" /> Twitter / X</label>
                                        <label className="flex items-center gap-2"><input type="checkbox" value="Facebook" className="w-4 h-4" /> Facebook</label>
                                    </div>
                                </div>

                                <button type="submit" disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded mt-4 transition-colors">
                                    {isGenerating ? "Generating Magic..." : "Generate Captions"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* REAL: NEW/EDIT PROFILE FORM */}
                    {(mainView === 'new_profile' || mainView === 'edit_profile') && (
                        <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {mainView === 'edit_profile' ? 'Edit Batch Profile' : 'Create Batch Profile'}
                                </h1>
                                {mainView === 'edit_profile' && (
                                    <button type="button" onClick={() => setMainView('view_profile')} className="text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                                )}
                            </div>
                            <form onSubmit={mainView === 'edit_profile' ? handleUpdateProfile : handleSaveProfile} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Profile Name</label>
                                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g., Fitness Brand Tone" className="w-full border border-gray-300 p-3 rounded bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name</label>
                                    <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g., HealthyLife" className="w-full border border-gray-300 p-3 rounded bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Target Audience</label>
                                    <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Fitness Enthusiasts" className="w-full border border-gray-300 p-3 rounded bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tone of Voice</label>
                                    <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border border-gray-300 p-3 rounded bg-gray-50">
                                        <option value="Professional">Professional</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Motivational">Motivational</option>
                                        <option value="Humorous">Humorous</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded mt-4 transition-colors text-lg">
                                    {mainView === 'edit_profile' ? 'Update Profile' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* REAL: VIEW OLD BATCH PROFILE */}
                    {mainView === 'view_profile' && selectedItem && (
                        <div className="bg-white p-8 rounded shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h1 className="text-2xl font-bold text-gray-800">Batch Profile Details</h1>
                                <div className="flex gap-3">
                                    <button onClick={openEditForm} className="text-sm text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded hover:bg-blue-50">Edit</button>
                                    <button onClick={handleDeleteProfile} className="text-sm text-red-600 font-bold border border-red-600 px-4 py-2 rounded hover:bg-red-50">Delete</button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Profile Name</p><p className="text-lg font-bold text-gray-800 mt-1">{selectedItem.name}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Brand Name</p><p className="text-md text-gray-700 mt-1">{selectedItem.brand}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Target Audience</p><p className="text-md text-gray-700 mt-1">{selectedItem.audience}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tone of Voice</p><p className="text-md text-gray-700 mt-1">{selectedItem.tone}</p></div>
                            </div>
                        </div>
                    )}

                    {/* VIEW CAMPAIGN (Mocked) */}
                    {mainView === 'view_campaign' && selectedItem && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">{selectedItem.name}</h1>
                            <div className="bg-white border p-6 rounded shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Instagram</h4>
                                <textarea className="w-full border p-3 mb-4 rounded bg-gray-50" rows="3" defaultValue={mockResults.instagram.caption}></textarea>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default WorkspaceDashboard;