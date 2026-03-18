import React, { useState, useEffect, useId } from 'react';
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
  Copy,
  RotateCcw,
  Globe,
  Hash
} from 'lucide-react';
import {
  FaShoppingBag,
  FaFileAlt,
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

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Hinglish", label: "Hinglish" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Other", label: "Other" },
];

// --- LANGUAGE SELECTOR COMPONENT ---
const LanguageSelector = ({ label = "Language", value, onChange }) => {
  const selectId = useId();
  const inputId = useId();
  const isOther = value.language === "Other";

  const emitChange = (nextLanguage, nextCustom) => {
      if (!onChange) return;
      const nextIsOther = nextLanguage === "Other";
      const nextFinal = nextIsOther ? nextCustom.trim() : nextLanguage;
      onChange({ language: nextLanguage, customLanguage: nextCustom, finalLanguage: nextFinal });
  };

  return (
      <div>
          <label htmlFor={selectId} className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> {label}
          </label>
          <div className="relative">
              <select
                  id={selectId}
                  value={value.language}
                  onChange={(e) => emitChange(e.target.value, value.customLanguage)}
                  className="w-full appearance-none rounded-2xl px-4 py-3 pr-11 text-sm text-slate-800 font-semibold bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
              >
                  <option value="" disabled>Select Language</option>
                  {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pink-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                  </svg>
              </span>
          </div>

          <div className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${isOther ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`} aria-hidden={!isOther}>
              <label htmlFor={inputId} className="sr-only">Custom Language</label>
              <input
                  id={inputId}
                  type="text"
                  placeholder="Type custom language..."
                  value={value.customLanguage}
                  onChange={(e) => emitChange(value.language, e.target.value)}
                  disabled={!isOther}
                  className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
          </div>
      </div>
  );
};

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  // --- REAL BACKEND STATE FOR PROFILES AND CAMPAIGNS ---
  const [profiles, setProfiles] = useState([]);
  const [campaigns, setCampaigns] = useState([]); 

  // --- UI STATE ---
  const [sidebarTab, setSidebarTab] = useState('campaigns'); 
  const [mainView, setMainView] = useState('new_campaign');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [generating, setGenerating] = useState(false);
  const [refiningPlatform, setRefiningPlatform] = useState(null);
  const [refinePrompts, setRefinePrompts] = useState({});

  // --- BATCH PROFILE FORM STATES ---
  const [profileName, setProfileName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [tones, setTones] = useState([]);
  const [toneInput, setToneInput] = useState("");
  // NEW: Moved from Campaign to Profile
  const [profileLanguageData, setProfileLanguageData] = useState({ language: "English", customLanguage: "", finalLanguage: "English" });
  const [profileLength, setProfileLength] = useState("medium");
  const [profileHashtagCount, setProfileHashtagCount] = useState("");

  // --- CAMPAIGN FORM STATES ---
  const [campaignInput, setCampaignInput] = useState({
    profileId: "", 
    name: "",
    product: "",
    details: "",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Fetch Data when the dashboard loads
  useEffect(() => {
    if (workspaceId) {
      fetchProfiles();
      fetchCampaigns(); 
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

  const fetchCampaigns = async () => {
    try {
      const response = await api.get(`workspaces/${workspaceId}/campaigns/`);
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load Campaigns.");
    }
  };

  // --- TONE CAPSULE HANDLERS ---
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
      const payload = { 
        name: profileName, 
        brand: brandName, 
        audience, 
        tone: tones,
        language: profileLanguageData.finalLanguage || "English",
        length: profileLength,
        hashtag_count: profileHashtagCount ? parseInt(profileHashtagCount) : null
      };
      const response = await api.post(`workspaces/${workspaceId}/profiles/`, payload);

      setProfiles([response.data, ...profiles]);
      setSelectedItem(response.data);
      setMainView('view_profile');
      toast.success("Batch Profile created successfully!");
      clearProfileForm();
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
      const payload = { 
        name: profileName, 
        brand: brandName, 
        audience, 
        tone: tones,
        language: profileLanguageData.finalLanguage || "English",
        length: profileLength,
        hashtag_count: profileHashtagCount ? parseInt(profileHashtagCount) : null
      };
      const response = await api.patch(`profiles/${selectedItem.id}/`, payload);

      setProfiles(profiles.map(p => p.id === selectedItem.id ? response.data : p));
      setSelectedItem(response.data);
      setMainView('view_profile');
      toast.success("Batch Profile updated!");
      clearProfileForm();
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

  const handleDeleteCampaign = async () => {
    const confirm = window.confirm("Are you sure you want to delete this Campaign?");
    if (!confirm) return;

    try {
      await api.delete(`workspaces/${workspaceId}/campaigns/${selectedItem.id}/`);
      setCampaigns(campaigns.filter(c => c.id !== selectedItem.id));
      setSelectedItem(null);
      setMainView('new_campaign');
      toast.success("Campaign deleted.");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete Campaign.");
    }
  };

  const openEditForm = () => {
    setProfileName(selectedItem.name);
    setBrandName(selectedItem.brand);
    setAudience(selectedItem.audience);
    setTones(selectedItem.tone || []);
    
    // Parse language safely for editing
    const lang = selectedItem.language || "English";
    const isStandard = LANGUAGE_OPTIONS.find(opt => opt.value.toLowerCase() === lang.toLowerCase());
    if (isStandard) {
        setProfileLanguageData({ language: isStandard.value, customLanguage: "", finalLanguage: isStandard.value });
    } else {
        setProfileLanguageData({ language: "Other", customLanguage: lang, finalLanguage: lang });
    }
    
    setProfileLength(selectedItem.length || "medium");
    setProfileHashtagCount(selectedItem.hashtag_count ? selectedItem.hashtag_count.toString() : "");

    setMainView('edit_profile');
  };

  const clearProfileForm = () => {
    setProfileName("");
    setBrandName("");
    setAudience("");
    setTones([]);
    setToneInput("");
    setProfileLanguageData({ language: "English", customLanguage: "", finalLanguage: "English" });
    setProfileLength("medium");
    setProfileHashtagCount("");
  };

  const openOldProfile = (profile) => {
    setSelectedItem(profile);
    setMainView('view_profile');
    clearProfileForm();
  };

  // --- CAMPAIGN HANDLERS ---
  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!campaignInput.profileId) {
      toast.error("Please select a Batch Profile.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    setGenerating(true);
    
    try {
      // Find the selected profile so we can inherit its language, length, and hashtag count
      const selectedProfile = profiles.find(p => p.id === campaignInput.profileId);

      const payload = {
        batch_profile: campaignInput.profileId,
        name: campaignInput.name,
        product: campaignInput.product,
        details: campaignInput.details,
        length: selectedProfile.length || "medium",
        language: selectedProfile.language || "English",
        hashtag_count: selectedProfile.hashtag_count || null,
        platforms: selectedPlatforms,
      };

      const response = await api.post(`workspaces/${workspaceId}/campaigns/`, payload);
      
      setCampaigns([response.data, ...campaigns]);
      setSelectedItem(response.data);
      setRefinePrompts({});
      setMainView('view_campaign');
      toast.success("Campaign generated successfully!");
      
      // Clear campaign form
      setCampaignInput({ profileId: "", name: "", product: "", details: "" });
      setSelectedPlatforms([]);

    } catch (error) {
      console.error("Error generating campaign:", error);
      toast.error("Failed to generate Campaign. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // --- REFINE CAPTION HANDLER FOR CAMPAIGNS ---
  const handleRefineCaption = async (platform) => {
    if (!refinePrompts[platform]) {
        toast.error("Please enter a refinement prompt");
        return;
    }

    setRefiningPlatform(platform);
    try {
        const profile = profiles.find(p => p.id === selectedItem.batch_profile);
        const toneString = profile && profile.tone ? profile.tone.join(", ") : "";

        const topicParts = [
            selectedItem.product,
            selectedItem.details,
            selectedItem.length && `Length: ${selectedItem.length}`,
            selectedItem.language && `Language: ${selectedItem.language}`,
            selectedItem.hashtag_count && `Hashtags: ${selectedItem.hashtag_count}`,
            `Refinement: ${refinePrompts[platform]}`,
        ].filter(Boolean);

        const response = await api.post("generate-caption/", {
            platform: platform,
            caption_type: toneString,
            topic: topicParts.join(". "),
            language: selectedItem.language || "English",
            hashtag_count: selectedItem.hashtag_count || "",
        });

        const hashtags = Array.isArray(response.data.hashtags) ? response.data.hashtags : [];
        
        const updatedResults = {
            ...selectedItem.results,
            [platform]: {
                caption: response.data.caption,
                hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
            }
        };

        setSelectedItem(prev => ({ ...prev, results: updatedResults }));
        setCampaigns(prev => prev.map(c => c.id === selectedItem.id ? { ...c, results: updatedResults } : c));

        try {
            await api.patch(`workspaces/${workspaceId}/campaigns/${selectedItem.id}/`, { results: updatedResults });
        } catch (patchErr) {
            console.log("Note: Backend Campaign patch endpoint not available or failed.", patchErr);
        }

        setRefinePrompts((prev) => ({ ...prev, [platform]: "" }));
        toast.success(`Caption refined for ${PLATFORMS.find((p) => p.id === platform)?.name}!`);
    } catch (err) {
        console.error("Error refining caption:", err);
        const message = err?.response?.data?.error || "Failed to refine caption. Please try again.";
        toast.error(message);
    } finally {
        setRefiningPlatform(null);
    }
  };

  const handleCopyCaptionForPlatform = (platform, data) => {
    if (!data) return;
    const text = `${data.caption}\n\n${data.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const openOldCampaign = (campaign) => {
    setSelectedItem(campaign);
    setRefinePrompts({});
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-md">
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

      {/* LEFT SIDEBAR */}
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
        <div className="md:hidden flex justify-end p-2">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md">
              <FolderPlus className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-indigo-900 text-sm tracking-tight">Dashboard</span>
          </div>
          <button onClick={() => navigate('/workspace')} className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition" title="Back to Workspaces">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex border-b border-indigo-100 bg-white/50">
          <button
            onClick={() => setSidebarTab('campaigns')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              sidebarTab === 'campaigns' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-indigo-400 hover:text-indigo-600'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setSidebarTab('profiles')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              sidebarTab === 'profiles' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-indigo-400 hover:text-indigo-600'
            }`}
          >
            Batch Profiles
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {sidebarTab === 'campaigns' ? (
            campaigns.length > 0 ? (
              campaigns.map(camp => (
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
                  <p className="text-xs text-indigo-400 mt-1 font-medium">{new Date(camp.created_at).toLocaleDateString()}</p>
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

        <div className="p-4 border-t border-indigo-100 bg-white/50">
          <button
            onClick={() => { 
              if (sidebarTab === 'campaigns') {
                setMainView('new_campaign');
              } else {
                clearProfileForm();
                setMainView('new_profile');
              }
            }}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl shadow-md 
            hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Plus size={16} />
            New {sidebarTab === 'campaigns' ? 'Campaign' : 'Profile'}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">

          {/* REAL: NEW CAMPAIGN FORM (SHORTENED) */}
          {mainView === 'new_campaign' && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-pink-200/30 border border-pink-100">
              <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                  <PenTool size={16} />
                </span>
                Campaign Details
              </h3>
              <form onSubmit={handleGenerate} className="space-y-5">
                
                {/* Select Profile */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FolderPlus className="w-4 h-4" /> 1. Select Batch Profile
                  </label>
                  <select 
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition" 
                    required
                    value={campaignInput.profileId}
                    onChange={(e) => setCampaignInput({ ...campaignInput, profileId: e.target.value })}
                  >
                    <option value="">-- Choose a Saved Profile --</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>)}
                  </select>
                </div>

                {/* Campaign Name */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> 2. Campaign Name
                  </label>
                  <input
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.name}
                    onChange={(e) => setCampaignInput({ ...campaignInput, name: e.target.value })}
                    placeholder="e.g. Summer Launch 2026"
                    required
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaShoppingBag className="w-4 h-4" /> 3. Product / Service
                  </label>
                  <input
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.product}
                    onChange={(e) => setCampaignInput({ ...campaignInput, product: e.target.value })}
                    placeholder="e.g. Organic Green Tea"
                    required
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <FaFileAlt className="w-4 h-4" /> 4. Campaign Goal & Details
                  </label>
                  <textarea
                    rows="3"
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    value={campaignInput.details}
                    onChange={(e) => setCampaignInput({ ...campaignInput, details: e.target.value })}
                    placeholder="e.g. Promote wellness, boost morning energy, highlight 20% discount."
                    required
                  />
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" /> 5. Select Platforms (Multiple)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        type="button"
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
                  type="submit"
                  disabled={generating}
                  className="relative cursor-pointer overflow-hidden w-full text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn"
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
              </form>
            </div>
          )}

          {/* REAL: NEW / EDIT PROFILE FORM (EXPANDED)  */}
          {(mainView === 'new_profile' || mainView === 'edit_profile') && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-pink-200/30 border border-pink-200">
              <div className="flex justify-between items-center mb-6 border-b border-pink-100 pb-4">
                <h1 className="text-2xl font-black text-pink-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    {mainView === 'edit_profile' ? <Edit className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  {mainView === 'edit_profile' ? 'Edit Batch Profile' : 'Create Batch Profile'}
                </h1>
                {mainView === 'edit_profile' && (
                  <button type="button" onClick={() => setMainView('view_profile')} className="text-sm font-bold text-pink-500 hover:text-pink-700 bg-pink-50 px-4 py-2 rounded-xl cursor-pointer">
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={mainView === 'edit_profile' ? handleUpdateProfile : handleSaveProfile} className="space-y-5">
                
                {/* Basic Details Grid */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                    <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Profile Name</label>
                    <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g. Fitness Brand Tone"
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
                        placeholder="e.g. HealthyLife"
                        className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold placeholder-pink-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                        required
                    />
                    </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Fitness Enthusiasts"
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
                        <button type="button" onClick={() => handleRemoveTone(t)} className="text-white/80 hover:text-white cursor-pointer focus:outline-none text-base leading-none">
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
                </div>

                {/* --- ADVANCED AI SETTINGS (Moved from Campaign) --- */}
                <div className="pt-4 border-t border-pink-100 space-y-5">
                    <h3 className="text-sm font-bold text-pink-800 uppercase tracking-widest">Default Post Settings</h3>
                    
                    <LanguageSelector
                        label="Language Preference"
                        value={profileLanguageData}
                        onChange={setProfileLanguageData}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                <PenTool className="w-4 h-4" /> Caption Length
                            </label>
                            <div className="flex gap-3">
                                {["short", "medium", "long"].map((len) => (
                                    <label key={len} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="profileLength"
                                            value={len}
                                            checked={profileLength === len}
                                            onChange={(e) => setProfileLength(e.target.value)}
                                            className="w-4 h-4 text-pink-600 border-pink-300 focus:ring-pink-500"
                                        />
                                        <span className="text-sm text-slate-700 capitalize">{len}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-pink-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                <Hash className="w-4 h-4" /> Hashtag Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                                value={profileHashtagCount}
                                onChange={(e) => setProfileHashtagCount(e.target.value)}
                                placeholder="e.g. 12 (Leave blank for AI choice)"
                            />
                        </div>
                    </div>
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mt-4"
                >
                  {mainView === 'edit_profile' ? 'Update Profile' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/* REAL: VIEW PROFILE  */}
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
                  <button onClick={openEditForm} className="flex items-center gap-1 cursor-pointer text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl transition">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={handleDeleteProfile} className="flex items-center gap-1 cursor-pointer text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Profile Name</p>
                  <p className="text-lg font-bold text-indigo-900">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Brand Name</p>
                  <p className="text-lg font-bold text-indigo-900">{selectedItem.brand}</p>
                </div>
              </div>

              <div className="space-y-5">
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

                {/* Display Advanced Settings */}
                <div className="pt-4 border-t border-pink-100 flex gap-8">
                    <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Language</p>
                        <p className="text-sm font-semibold text-indigo-900 capitalize">{selectedItem.language || "English"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Default Length</p>
                        <p className="text-sm font-semibold text-indigo-900 capitalize">{selectedItem.length || "Medium"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Hashtags</p>
                        <p className="text-sm font-semibold text-indigo-900">{selectedItem.hashtag_count ? `${selectedItem.hashtag_count} Tags` : "AI Choice"}</p>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------- REAL: VIEW CAMPAIGN DYNAMIC RESULTS WITH REFINE ---------- */}
          {mainView === 'view_campaign' && selectedItem && (
            <div className="space-y-6 pb-12">
              <div className="flex justify-between items-center border-b border-pink-200 pb-4">
                <h1 className="text-3xl font-black text-pink-800 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                  {selectedItem.name}
                </h1>
                <button onClick={handleDeleteCampaign} className="flex items-center gap-1 cursor-pointer text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition">
                    <Trash2 size={14} /> Delete
                </button>
              </div>

              {/* Campaign Overview Metadata */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-md border border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Product</p>
                  <p className="text-md font-bold text-indigo-900">{selectedItem.product}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-1">Profile Used</p>
                  <p className="text-md font-bold text-indigo-900">{selectedItem.profile_name || 'N/A'}</p>
                </div>
              </div>

              {/* Dynamic Results Feed mapped directly from database JSON */}
              {selectedItem.results && Object.entries(selectedItem.results).map(([platformId, data]) => {
                const platformConfig = PLATFORMS.find(p => p.id === platformId) || { name: platformId, icon: <Share2 />, color: "from-gray-400 to-gray-500", tag: "bg-gray-100 text-gray-600" };
                
                return (
                  <div key={platformId} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-pink-200/30 border border-pink-200 animate-fade-down">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl text-pink-500">{platformConfig.icon}</span>
                        <span className={`text-xs font-black px-2 py-1 rounded-full ${platformConfig.tag || "bg-pink-100 text-pink-600"}`}>
                            {platformConfig.name}
                        </span>
                        <button
                            onClick={() => handleCopyCaptionForPlatform(platformId, data)}
                            className={`ml-auto w-8 h-8 rounded-lg transition border-0 flex items-center justify-center ${platformConfig.tag || "bg-pink-100 text-pink-600"} hover:shadow-sm cursor-pointer`}
                            aria-label={`Copy ${platformConfig.name} caption`}
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                    
                    <textarea
                      className="w-full rounded-2xl px-4 py-3 text-sm text-indigo-900 font-semibold bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition mb-4 resize-none"
                      rows="4"
                      defaultValue={data.caption}
                      readOnly
                    ></textarea>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(data.hashtags) 
                        ? data.hashtags.map((h, i) => (
                            <span key={i} className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full">
                              {h.startsWith('#') ? h : `#${h}`}
                            </span>
                          ))
                        : (typeof data.hashtags === 'string' && data.hashtags.split(' ').map((h, i) => (
                            <span key={i} className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full">
                              {h}
                            </span>
                          )))
                      }
                    </div>

                    {/* REFINEMENT UI */}
                    <div className="space-y-2 pt-3 border-t border-pink-200 border-opacity-50">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Tell AI what to change..."
                                value={refinePrompts[platformId] || ""}
                                onChange={(e) => setRefinePrompts((prev) => ({ ...prev, [platformId]: e.target.value }))}
                                className="w-full text-xs px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:border-pink-500 transition"
                            />
                            <button
                                onClick={() => handleRefineCaption(platformId)}
                                disabled={refiningPlatform === platformId}
                                className="w-full px-3 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <RotateCcw size={12} />
                                {refiningPlatform === platformId ? "Refining..." : "Refine"}
                            </button>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkspaceDashboard;