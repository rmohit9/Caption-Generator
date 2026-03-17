import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  PenTool,
  FolderPlus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  Share2,
  Plus,
  Menu,
} from 'lucide-react';
import {
  FaShoppingBag,
  FaFileAlt,
  FaBullseye,
  FaPaintBrush,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
} from 'react-icons/fa';
import api from '../../services/api';

// PLATFORM CONSTANTS 
const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "from-pink-400 to-rose-500" },
  { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "from-blue-500 to-cyan-500" },
  { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "from-sky-400 to-cyan-400" },
  { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "from-indigo-500 to-blue-500" },
];

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  // REAL BACKEND STATE FOR PROFILES 
  const [profiles, setProfiles] = useState([]);

  // Form States for creating/editing a Profile
  const [profileName, setProfileName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");

  // TONE CAPSULE STATES
  const [tones, setTones] = useState([]);
  const [toneInput, setToneInput] = useState("");

  //  CAMPAIGN FORM STATE 
  const [campaignInput, setCampaignInput] = useState({
    product: "",
    description: "",
    audience: "",
    tone: "",
    length: "medium",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [generating, setGenerating] = useState(false);

  // --- UI STATE ---
  const [sidebarTab, setSidebarTab] = useState('profiles');
  const [mainView, setMainView] = useState('new_profile');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // for mobile

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

  // TONE CAPSULE HANDLERS
  const handleAddTone = (e) => {
    e.preventDefault();
    const trimmedTone = toneInput.trim();
    if (trimmedTone && !tones.includes(trimmedTone)) {
      setTones([...tones, trimmedTone]);
      setToneInput("");
    }
  };

  const handleRemoveTone = (toneToRemove) => {
    setTones(tones.filter(t => t !== toneToRemove));
  };

  const handleToneKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTone(e);
    }
  };

  // --- REAL CRUD LOGIC FOR PROFILES ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (tones.length === 0) {
      toast.error("Please add at least one Tone of Voice.");
      return;
    }

    try {
      const payload = { name: profileName, brand: brandName, audience, tone: tones };
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
    if (tones.length === 0) {
      toast.error("Please add at least one Tone of Voice.");
      return;
    }

    try {
      const payload = { name: profileName, brand: brandName, audience, tone: tones };
      const response = await api.patch(`profiles/${selectedItem.id}/`, payload);

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
      setMainView('new_profile');
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
    setTones(selectedItem.tone || []);
    setMainView('edit_profile');
  };

  const clearForm = () => {
    setProfileName("");
    setBrandName("");
    setAudience("");
    setTones([]);
    setToneInput("");
  };

  const openOldProfile = (profile) => {
    setSelectedItem(profile);
    setMainView('view_profile');
    clearForm();
  };

  // --- MOCK DATA FOR CAMPAIGNS (unchanged) ---
  const mockCampaigns = [
    { id: 1, name: "Organic Green Tea Launch", profileName: "Fitness Brand Tone", product: "Green Tea", details: "Launch campaign...", date: "March 16, 2026" }
  ];

  const mockResults = {
    instagram: { caption: "Refresh your mornings...", hashtags: "#GreenTeaLover" },
    linkedin: { caption: "Health starts with mindful choices...", hashtags: "#Productivity" }
  };

  // --- CAMPAIGN HANDLERS ---
  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGenerating(false);
      setSelectedItem(mockCampaigns[0]);
      setMainView('view_campaign');
    }, 1000);
  };

  const openOldCampaign = (campaign) => {
    setSelectedItem(campaign);
    setMainView('view_campaign');
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)",
      }}
    >
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-indigo-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 !!to-pink-600 flex items-center justify-center shadow-md">
            <FolderPlus className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-indigo-900 text-sm tracking-tight">Workspace</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* LEFT SIDEBAR (collapsible on mobile) */}
      <aside
        className={`
          ${sidebarOpen ? 'block' : 'hidden'} md:block
          w-full md:w-80 bg-white/80 backdrop-blur-md border-r border-indigo-200 shadow-xl shadow-indigo-200/30
          flex flex-col h-screen md:h-screen overflow-hidden
          fixed md:relative z-30 top-0 left-0 md:top-auto md:left-auto
          transition-all duration-300
        `}
        style={{ maxHeight: '100vh' }}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end p-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md">
              <FolderPlus className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-indigo-900 text-sm tracking-tight">Workspace</span>
          </div>
          <button
            onClick={() => navigate('/workspace')}
            className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition"
            title="Back to Workspaces"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex border-b border-indigo-100 bg-white/50">
          <button
            onClick={() => setSidebarTab('campaigns')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              sidebarTab === 'campaigns'
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-indigo-400 hover:text-indigo-600'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setSidebarTab('profiles')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              sidebarTab === 'profiles'
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-indigo-400 hover:text-indigo-600'
            }`}
          >
            Batch Profiles
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {sidebarTab === 'campaigns' ? (
            mockCampaigns.length > 0 ? (
              mockCampaigns.map(camp => (
                <div
                  key={camp.id}
                  onClick={() => openOldCampaign(camp)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    mainView === 'view_campaign' && selectedItem?.id === camp.id
                      ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300 shadow-md'
                      : 'bg-white border-indigo-200 hover:border-pink-300'
                  }`}
                >
                  <h4 className="font-bold text-indigo-900 text-sm truncate">{camp.name}</h4>
                  <p className="text-xs text-indigo-400 mt-1 font-medium">{camp.date}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-indigo-400 text-xs py-8">No campaigns yet.</p>
            )
          ) : (
            profiles.length > 0 ? (
              profiles.map(prof => (
                <div
                  key={prof.id}
                  onClick={() => openOldProfile(prof)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    (mainView === 'view_profile' || mainView === 'edit_profile') && selectedItem?.id === prof.id
                      ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-300 shadow-md'
                      : 'bg-white border-indigo-200 hover:border-pink-300'
                  }`}
                >
                  <h4 className="font-bold text-indigo-900 text-sm truncate">{prof.name}</h4>
                  <p className="text-xs text-indigo-400 mt-1 font-medium">Brand: {prof.brand}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-indigo-400 text-xs py-8">No profiles yet.</p>
            )
          )}
        </div>

        <div className="p-4 border-t border-indigo-100">
          <button
            onClick={() => { clearForm(); setMainView(sidebarTab === 'campaigns' ? 'new_campaign' : 'new_profile'); }}
            className="w-full flex items-center justify-center gap-2  text-white font-bold py-3 rounded-xl shadow-md 
            hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600" 
            
          >
            <Plus size={16} />
            New {sidebarTab === 'campaigns' ? 'Campaign' : 'Profile'}
          </button>
        </div>
      </aside>

      {/*  RIGHT MAIN AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">

          {/*  NEW CAMPAIGN FORM  */}
          {mainView === 'new_campaign' && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-pink-200/30 border border-pink-100">
              <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                  <PenTool size={16} />
                </span>
                Campaign Details
              </h3>
              <div className="space-y-5">
                {/* Product */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaShoppingBag className="w-4 h-4" /> Product / Brand Name
                  </label>
                  <input
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.product}
                    onChange={(e) => setCampaignInput({ ...campaignInput, product: e.target.value })}
                    placeholder="e.g. Organic Green Tea"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaFileAlt className="w-4 h-4" /> Description or Campaign Goal
                  </label>
                  <textarea
                    rows="2"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.description}
                    onChange={(e) => setCampaignInput({ ...campaignInput, description: e.target.value })}
                    placeholder="e.g. Promote wellness, boost morning energy"
                  />
                </div>

                {/* Audience */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaBullseye className="w-4 h-4" /> Target Audience
                  </label>
                  <input
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.audience}
                    onChange={(e) => setCampaignInput({ ...campaignInput, audience: e.target.value })}
                    placeholder="e.g. Fitness Enthusiasts"
                  />
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaPaintBrush className="w-4 h-4" /> Tone of Caption
                  </label>
                  <input
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.tone}
                    onChange={(e) => setCampaignInput({ ...campaignInput, tone: e.target.value })}
                    placeholder="e.g. Motivational & Fresh"
                  />
                </div>

                {/* Length Preference */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <PenTool className="w-4 h-4" /> Caption Length
                  </label>
                  <div className="flex gap-3">
                    {["short", "medium", "long"].map((len) => (
                      <label key={len} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="length"
                          value={len}
                          checked={campaignInput.length === len}
                          onChange={(e) => setCampaignInput({ ...campaignInput, length: e.target.value })}
                          className="w-4 h-4 text-pink-600 border-pink-300 focus:ring-pink-500"
                        />
                        <span className="text-sm text-slate-700 capitalize">{len}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" /> Select Platforms (Multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleTogglePlatform(p.id)}
                        className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${
                          selectedPlatforms.includes(p.id)
                            ? "text-white border-transparent shadow-md bg-gradient-to-r from-pink-500 to-pink-400"
                            : "border-pink-200 text-pink-400 hover:bg-pink-50"
                        }`}
                      >
                        {p.icon}
                        {p.name}
                        {selectedPlatforms.includes(p.id) && " ✓"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button  */}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="relative overflow-hidden w-full text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn"
                  style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}
                >
                  {generating ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>Generate Captions & Hashtags →</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* NEW / EDIT PROFILE FORM   */}
          {(mainView === 'new_profile' || mainView === 'edit_profile') && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-pink-200/30 border border-pink-200">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-pink-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    {mainView === 'edit_profile' ? <Edit className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  {mainView === 'edit_profile' ? 'Edit Batch Profile' : 'Create Batch Profile'}
                </h1>
                {mainView === 'edit_profile' && (
                  <button type="button" onClick={() => setMainView('view_profile')} className="text-sm font-bold text-pink-500 hover:text-pink-700 bg-pink-50 px-4 py-2 rounded-xl">
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={mainView === 'edit_profile' ? handleUpdateProfile : handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Profile/Title Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Fitness Brand Tone"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold placeholder-pink-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., HealthyLife"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold placeholder-pink-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Fitness Enthusiasts"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold placeholder-pink-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    required
                  />
                </div>

                {/* TONE CAPSULE INPUT UI */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Tone of Voice</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tones.map((t, index) => (
                      <span key={index} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                        {t}
                        <button type="button" onClick={() => handleRemoveTone(t)} className="text-white/80 hover:text-white focus:outline-none text-base leading-none">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={toneInput}
                      onChange={(e) => setToneInput(e.target.value)}
                      onKeyDown={handleToneKeyDown}
                      placeholder="Type a tone and press Enter or Add..."
                      className="flex-1 rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold placeholder-pink-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleAddTone}
                      className="bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 cursor-pointer text-white font-bold px-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-pink-400 mt-2 font-medium">e.g., Professional, Quirky, Motivational, Authoritative</p>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mt-4"
                >
                  {mainView === 'edit_profile' ? 'Update Profile' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/*  VIEW PROFILE  */}
          {mainView === 'view_profile' && selectedItem && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-pink-200/30 border border-pink-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-pink-100">
                <h1 className="text-2xl font-black text-pink-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <FolderPlus className="w-4 h-4 text-white" />
                  </div>
                  Batch Profile Details
                </h1>
                <div className="flex gap-2">
                  <button onClick={openEditForm} className="flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl transition">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={handleDeleteProfile} className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Profile/Title Name</p>
                  <p className="text-lg font-bold text-indigo-900">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Brand Name</p>
                  <p className="text-md text-indigo-700 font-semibold">{selectedItem.brand}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Target Audience</p>
                  <p className="text-md text-indigo-700 font-semibold">{selectedItem.audience}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-2">Tone of Voice</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tone && selectedItem.tone.map((t, index) => (
                      <span key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------- VIEW CAMPAIGN (Mocked) ---------- */}
          {mainView === 'view_campaign' && selectedItem && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-pink-800 pb-4 border-b border-pink-200 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                {selectedItem.name}
              </h1>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-pink-200/30 border border-pink-200">
                <h4 className="font-bold text-pink-800 mb-3 flex items-center gap-2">
                  <FaInstagram className="text-pink-500" /> Instagram
                </h4>
                <textarea
                  className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition mb-4"
                  rows="3"
                  defaultValue={mockResults.instagram.caption}
                ></textarea>
                <div className="flex flex-wrap gap-2">
                  {mockResults.instagram.hashtags.split(' ').map((h, i) => (
                    <span key={i} className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkspaceDashboard;