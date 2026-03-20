import React, { useState, useEffect, useId, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles, PenTool, FolderPlus, Edit, Trash2, X, ChevronLeft, Share2, Plus, Menu, Copy, RotateCcw, Globe, Hash,
  House
} from 'lucide-react';
import {
  FaShoppingBag, FaFileAlt, FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaEllipsisV, FaThumbtack, FaSearch, FaTimes, FaUser, FaSignOutAlt
} from 'react-icons/fa';
import api from '../../services/api';
import ProfileModal from '../../components/ProfileModal';

// --- TIME FORMATTER ---
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay} days ago`;
    return date.toLocaleDateString();
}

// --- SIDEBAR ROW COMPONENT WITH 3-DOTS MENU ---
function SidebarRow({ item, type, onSelect, onDelete, onRename, onTogglePin, isActive }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const Icon = type === 'campaign' ? PenTool : Sparkles;
    const subText = type === 'campaign' ? formatRelativeTime(new Date(item.created_at)) : `Brand: ${item.brand}`;

    return (
        <div onClick={onSelect} className={`group relative flex items-center gap-2 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${isActive ? 'bg-orange-50/80 border-[#f08a5d] shadow-sm ring-1 ring-[#f08a5d]/10' : 'bg-white border-transparent hover:border-orange-200 hover:shadow-sm'}`}>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {item.is_pinned && <FaThumbtack size={12} className="text-[#f08a5d] rotate-45 shrink-0" />}
                    {!item.is_pinned && <Icon size={14} className={`shrink-0 ${isActive ? 'text-[#f08a5d]' : 'text-slate-400'}`} />}
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium pl-6 truncate">{subText}</p>
            </div>
            
            {/* 3 Dots Menu */}
            <div className="relative shrink-0" ref={menuRef}>
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className={`p-1.5 rounded-lg hover:bg-orange-100 transition ${menuOpen ? 'text-[#f08a5d] opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                    <FaEllipsisV size={12} />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-orange-100 rounded-xl shadow-xl z-50 overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(item.id); }} className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                            <Trash2 size={12} /> Delete
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRename(item.id); }} className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-2 transition-colors">
                            <Edit size={12} /> Rename
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onTogglePin(item.id); }} className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 flex items-center gap-2 transition-colors">
                            <FaThumbtack size={12} className={item.is_pinned ? "rotate-45 text-[#f08a5d]" : ""} /> {item.is_pinned ? "Unpin" : "Pin to top"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- PREMIUM INTERACTIVE GRID PARTICLE SYSTEM ---
const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const handleMouseMove = (event) => { mouse.x = event.clientX; mouse.y = event.clientY; };
        const handleMouseOut = () => { mouse.x = null; mouse.y = null; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); };

        class Particle {
            constructor(x, y) {
                this.baseX = x; this.baseY = y; this.x = x; this.y = y;
                this.vx = 0; this.vy = 0; this.size = 1.5; this.angle = Math.random() * Math.PI * 2;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(240, 138, 93, 0.5)'; ctx.fill();
            }
            update() {
                this.angle += 0.02;
                let targetX = this.baseX + Math.cos(this.angle) * 1.5;
                let targetY = this.baseY + Math.sin(this.angle) * 1.5;

                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x; let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const pushStrength = 40; 
                        targetX -= (dx / distance) * force * pushStrength;
                        targetY -= (dy / distance) * force * pushStrength;
                    }
                }
                const springStrength = 0.08; const friction = 0.82;
                this.vx += (targetX - this.x) * springStrength; this.vy += (targetY - this.y) * springStrength;
                this.vx *= friction; this.vy *= friction;
                this.x += this.vx; this.y += this.vy;
                this.draw();
            }
        }

        const initParticles = () => {
            particles = []; const spacing = 35; 
            for (let x = 0; x < canvas.width + spacing; x += spacing) {
                for (let y = 0; y < canvas.height + spacing; y += spacing) { particles.push(new Particle(x, y)); }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) { particles[i].update(); }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize(); animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700" },
  { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", tag: "bg-blue-100 text-blue-700" },
  { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200", tag: "bg-sky-100 text-sky-700" },
  { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700" },
];

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" }, { value: "Hindi", label: "Hindi" }, { value: "Hinglish", label: "Hinglish" },
  { value: "Spanish", label: "Spanish" }, { value: "French", label: "French" }, { value: "Other", label: "Other" },
];

const LanguageSelector = ({ label = "Language", value, onChange }) => {
  const selectId = useId(); const inputId = useId(); const isOther = value.language === "Other";
  const emitChange = (nextLanguage, nextCustom) => {
      if (!onChange) return;
      const nextIsOther = nextLanguage === "Other";
      const nextFinal = nextIsOther ? nextCustom.trim() : nextLanguage;
      onChange({ language: nextLanguage, customLanguage: nextCustom, finalLanguage: nextFinal });
  };

  return (
      <div className="w-full">
          <label htmlFor={selectId} className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-4 h-4 shrink-0" /> <span className="truncate">{label}</span>
          </label>
          <div className="relative">
              <select id={selectId} value={value.language} onChange={(e) => emitChange(e.target.value, value.customLanguage)} className="w-full appearance-none rounded-2xl px-4 py-3 sm:py-3.5 pr-11 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-200 transition-all cursor-pointer">
                  <option value="" disabled>Select Language</option>
                  {LANGUAGE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-orange-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
          </div>
          <div className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 w-full ${isOther ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`} aria-hidden={!isOther}>
              <input id={inputId} type="text" placeholder="Type custom language..." value={value.customLanguage} onChange={(e) => emitChange(value.language, e.target.value)} disabled={!isOther} className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
          </div>
      </div>
  );
};

const WorkspaceDashboard = () => {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();

  const [workspaceDetails, setWorkspaceDetails] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [campaigns, setCampaigns] = useState([]); 

  const [sidebarTab, setSidebarTab] = useState('campaigns'); 
  const [mainView, setMainView] = useState('new_campaign');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [generating, setGenerating] = useState(false);
  const [refiningPlatform, setRefiningPlatform] = useState(null);
  const [refinePrompts, setRefinePrompts] = useState({});

  // --- SEARCH AND MODAL STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [renameModal, setRenameModal] = useState({ isOpen: false, id: null, type: null, text: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null, message: "" });

  const [profileName, setProfileName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [tones, setTones] = useState([]);
  const [toneInput, setToneInput] = useState("");
  const [profileLanguageData, setProfileLanguageData] = useState({ language: "English", customLanguage: "", finalLanguage: "English" });
  const [profileLength, setProfileLength] = useState("medium");
  const [profileHashtagCount, setProfileHashtagCount] = useState("");

  const [campaignInput, setCampaignInput] = useState({
    profileId: "", name: "", product: "", details: "",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('full_name') || 'User');
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      await api.post("logout/", { refresh_token: refreshToken });
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceDetails();
      fetchProfiles();
      fetchCampaigns(); 
    }
  }, [workspaceId]);

  const fetchWorkspaceDetails = async () => {
    try {
      const response = await api.get(`workspaces/${workspaceId}/`);
      setWorkspaceDetails(response.data);
    } catch (error) { console.error("Failed to load workspace details."); }
  };

  const fetchProfiles = async () => {
    try {
      const response = await api.get(`workspaces/${workspaceId}/profiles/`);
      setProfiles(response.data);
    } catch (error) { toast.error("Failed to load Batch Profiles."); }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await api.get(`workspaces/${workspaceId}/campaigns/`);
      setCampaigns(response.data);
    } catch (error) { toast.error("Failed to load Campaigns."); }
  };

  // --- CRUD ACTIONS (Refactored to accept explicit IDs) ---
  const handleDeleteProfile = (id = selectedItem?.id) => {
    if (!id) return;
    setDeleteModal({ isOpen: true, id, type: 'profile', message: "Are you sure you want to delete this Batch Profile?" });
  };

  const handleDeleteCampaign = (id = selectedItem?.id) => {
    if (!id) return;
    setDeleteModal({ isOpen: true, id, type: 'campaign', message: "Are you sure you want to delete this Campaign?" });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    if (type === 'campaign') {
      try {
        await api.delete(`workspaces/${workspaceId}/campaigns/${id}/`);
        setCampaigns(campaigns.filter(c => c.id !== id));
        if(selectedItem?.id === id) { setSelectedItem(null); setMainView('new_campaign'); }
        toast.success("Campaign deleted.");
      } catch (error) { toast.error("Failed to delete Campaign."); }
    } else {
      try {
        await api.delete(`profiles/${id}/`);
        setProfiles(profiles.filter(p => p.id !== id));
        if(selectedItem?.id === id) { setSelectedItem(null); setMainView('new_profile'); }
        toast.success("Batch Profile deleted.");
      } catch (error) { toast.error("Failed to delete Batch Profile."); }
    }
    setDeleteModal({ isOpen: false, id: null, type: null, message: "" });
  };

  const openRenameModal = (id, type, currentName) => {
      setRenameModal({ isOpen: true, id, type, text: currentName });
  };

  const submitRename = async () => {
      const { id, type, text } = renameModal;
      if (!text || text.trim() === "") { toast.error("Name cannot be empty"); return; }
      
      try {
          if (type === 'campaign') {
              const camp = campaigns.find(c => c.id === id);
              if(text.trim() === camp.name) { setRenameModal({isOpen: false, id: null, type: null, text: ""}); return; }
              await api.patch(`workspaces/${workspaceId}/campaigns/${id}/`, { name: text.trim() });
              setCampaigns(prev => prev.map(c => c.id === id ? { ...c, name: text.trim() } : c));
              if(selectedItem?.id === id) setSelectedItem(prev => ({...prev, name: text.trim()}));
          } else {
              const prof = profiles.find(p => p.id === id);
              if(text.trim() === prof.name) { setRenameModal({isOpen: false, id: null, type: null, text: ""}); return; }
              await api.patch(`profiles/${id}/`, { name: text.trim() });
              setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: text.trim() } : p));
              if(selectedItem?.id === id) setSelectedItem(prev => ({...prev, name: text.trim()}));
          }
          toast.success("Renamed successfully!");
      } catch (err) { toast.error("Failed to rename"); } 
      finally { setRenameModal({ isOpen: false, id: null, type: null, text: "" }); }
  };

  const handleTogglePinCampaign = async (id) => {
      const camp = campaigns.find(c => c.id === id);
      if(!camp) return;
      try {
          await api.patch(`workspaces/${workspaceId}/campaigns/${id}/`, { is_pinned: !camp.is_pinned });
          setCampaigns(prev => prev.map(c => c.id === id ? { ...c, is_pinned: !camp.is_pinned } : c));
          toast.success(camp.is_pinned ? "Unpinned" : "Pinned");
      } catch (err) { toast.error("Failed to update pin status"); }
  };

  const handleTogglePinProfile = async (id) => {
      const prof = profiles.find(p => p.id === id);
      if(!prof) return;
      try {
          await api.patch(`profiles/${id}/`, { is_pinned: !prof.is_pinned });
          setProfiles(prev => prev.map(p => p.id === id ? { ...p, is_pinned: !prof.is_pinned } : p));
          toast.success(prof.is_pinned ? "Unpinned" : "Pinned");
      } catch (err) { toast.error("Failed to update pin status"); }
  };

  // --- FORM HANDLERS ---
  const handleAddTone = (e) => {
    e.preventDefault();
    const trimmedTone = toneInput.trim();
    if (trimmedTone && !tones.includes(trimmedTone)) { setTones([...tones, trimmedTone]); setToneInput(""); }
  };

  const handleRemoveTone = (toneToRemove) => { setTones(tones.filter(t => t !== toneToRemove)); };
  const handleToneKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTone(e); } };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (tones.length === 0) { toast.error("Please add at least one Tone of Voice."); return; }
    try {
      const payload = { 
        name: profileName, brand: brandName, audience, tone: tones,
        language: profileLanguageData.finalLanguage || "English", length: profileLength,
        hashtag_count: profileHashtagCount ? parseInt(profileHashtagCount) : null
      };
      const response = await api.post(`workspaces/${workspaceId}/profiles/`, payload);
      setProfiles([response.data, ...profiles]);
      setSelectedItem(response.data);
      setMainView('view_profile');
      toast.success("Batch Profile created successfully!");
      clearProfileForm();
    } catch (error) { toast.error("Failed to save Batch Profile."); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (tones.length === 0) { toast.error("Please add at least one Tone of Voice."); return; }
    try {
      const payload = { 
        name: profileName, brand: brandName, audience, tone: tones,
        language: profileLanguageData.finalLanguage || "English", length: profileLength,
        hashtag_count: profileHashtagCount ? parseInt(profileHashtagCount) : null
      };
      const response = await api.patch(`profiles/${selectedItem.id}/`, payload);
      setProfiles(profiles.map(p => p.id === selectedItem.id ? response.data : p));
      setSelectedItem(response.data);
      setMainView('view_profile');
      toast.success("Batch Profile updated!");
      clearProfileForm();
    } catch (error) { toast.error("Failed to update Batch Profile."); }
  };

  const openEditForm = () => {
    setProfileName(selectedItem.name);
    setBrandName(selectedItem.brand);
    setAudience(selectedItem.audience);
    setTones(selectedItem.tone || []);
    const lang = selectedItem.language || "English";
    const isStandard = LANGUAGE_OPTIONS.find(opt => opt.value.toLowerCase() === lang.toLowerCase());
    if (isStandard) { setProfileLanguageData({ language: isStandard.value, customLanguage: "", finalLanguage: isStandard.value }); } 
    else { setProfileLanguageData({ language: "Other", customLanguage: lang, finalLanguage: lang }); }
    setProfileLength(selectedItem.length || "medium");
    setProfileHashtagCount(selectedItem.hashtag_count ? selectedItem.hashtag_count.toString() : "");
    setMainView('edit_profile');
  };

  const clearProfileForm = () => {
    setProfileName(""); setBrandName(""); setAudience(""); setTones([]); setToneInput("");
    setProfileLanguageData({ language: "English", customLanguage: "", finalLanguage: "English" });
    setProfileLength("medium"); setProfileHashtagCount("");
  };

  const openOldProfile = (profile) => {
    setSelectedItem(profile); setMainView('view_profile'); clearProfileForm();
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const openOldCampaign = (campaign) => {
    setSelectedItem(campaign); setRefinePrompts({}); setMainView('view_campaign');
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleTogglePlatform = (platformId) => {
    setSelectedPlatforms(prev => prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!campaignInput.profileId) { toast.error("Please select a Batch Profile."); return; }
    if (selectedPlatforms.length === 0) { toast.error("Please select at least one platform."); return; }

    setGenerating(true);
    try {
      const selectedProfile = profiles.find(p => p.id === campaignInput.profileId);
      const payload = {
        batch_profile: campaignInput.profileId, name: campaignInput.name, product: campaignInput.product, 
        details: `${campaignInput.details}. Length: ${selectedProfile.length || "medium"}`,
        language: selectedProfile.language || "English", platforms: selectedPlatforms,
      };
      if (selectedProfile.hashtag_count) { payload.hashtag_count = parseInt(selectedProfile.hashtag_count); }

      const response = await api.post(`workspaces/${workspaceId}/campaigns/`, payload);
      setCampaigns([response.data, ...campaigns]); setSelectedItem(response.data);
      setRefinePrompts({}); setMainView('view_campaign');
      toast.success("Campaign generated successfully!");
      setCampaignInput({ profileId: "", name: "", product: "", details: "" }); setSelectedPlatforms([]);
    } catch (error) { toast.error("Failed to generate Campaign. Please try again."); } 
    finally { setGenerating(false); }
  };

  const handleRefineCaption = async (platform) => {
    if (!refinePrompts[platform]) { toast.error("Please enter a refinement prompt"); return; }
    setRefiningPlatform(platform);
    try {
        const profile = profiles.find(p => p.id === selectedItem.batch_profile);
        const toneString = profile && profile.tone ? profile.tone.join(", ") : "";
        const topicParts = [
            selectedItem.product, selectedItem.details, selectedItem.length && `Length: ${selectedItem.length}`,
            selectedItem.language && `Language: ${selectedItem.language}`, selectedItem.hashtag_count && `Hashtags: ${selectedItem.hashtag_count}`,
            `Refinement: ${refinePrompts[platform]}`,
        ].filter(Boolean);

        const response = await api.post("generate-caption/", {
            platforms: [platform],
            caption_type: toneString, 
            topic: topicParts.join(". "),
            language: selectedItem.language || "English", 
            hashtag_count: selectedItem.hashtag_count || "",
        });

        const platformResult = response.data.results?.[platform] || {};
        const hashtags = Array.isArray(platformResult.hashtags) ? platformResult.hashtags : [];
        const updatedResults = { ...selectedItem.results, [platform]: { caption: platformResult.caption || "", hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)) } };
        setSelectedItem(prev => ({ ...prev, results: updatedResults }));
        setCampaigns(prev => prev.map(c => c.id === selectedItem.id ? { ...c, results: updatedResults } : c));

        try { await api.patch(`campaigns/${selectedItem.id}/`, { results: updatedResults }); } catch (patchErr) {}

        setRefinePrompts((prev) => ({ ...prev, [platform]: "" }));
        toast.success(`Caption refined for ${PLATFORMS.find((p) => p.id === platform)?.name}!`);
    } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to refine caption.");
    } finally {
        setRefiningPlatform(null);
    }
  };
  const handleCopyCaptionForPlatform = (platform, data) => {
    if (!data) return;
    navigator.clipboard.writeText(`${data.caption}\n\n${data.hashtags.join(" ")}`);
    toast.success("Copied to clipboard!");
  };

  // --- SIDEBAR DATA GROUPING ---
  const groupItems = (items) => {
      const pinned = [], today = [], yesterday = [], older = [];
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      items.forEach((item) => {
          if (item.is_pinned) { pinned.push(item); } 
          else {
              const itemDate = new Date(item.created_at);
              if (itemDate >= todayStart) today.push(item);
              else if (itemDate >= yesterdayStart && itemDate < todayStart) yesterday.push(item);
              else older.push(item);
          }
      });
      return { pinned, today, yesterday, older };
  };

  const activeData = sidebarTab === 'campaigns' ? campaigns : profiles;
  const filteredData = activeData
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())))
      .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  
  const groupedData = groupItems(filteredData);

  const renderSidebarGroup = (title, items) => {
      if (items.length === 0) return null;
      return (
          <div className="mb-4">
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#f08a5d] flex items-center gap-1">
                  {title === 'Pinned' && <FaThumbtack size={10} className="rotate-45" />} {title}
              </p>
              <div className="space-y-1.5">
                  {items.map(item => (
                      <SidebarRow 
                          key={item.id}
                          item={item}
                          type={sidebarTab === 'campaigns' ? 'campaign' : 'profile'}
                          isActive={selectedItem?.id === item.id}
                          onSelect={() => sidebarTab === 'campaigns' ? openOldCampaign(item) : openOldProfile(item)}
                          onDelete={(id) => sidebarTab === 'campaigns' ? handleDeleteCampaign(id) : handleDeleteProfile(id)}
                          onRename={(id) => openRenameModal(id, sidebarTab === 'campaigns' ? 'campaign' : 'profile', item.name)}
                          onTogglePin={(id) => sidebarTab === 'campaigns' ? handleTogglePinCampaign(id) : handleTogglePinProfile(id)}
                      />
                  ))}
              </div>
          </div>
      );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row bg-[#fff7ed] relative overflow-hidden">
      
      {/* CANVAS BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <ParticleBackground />
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-b border-orange-100 relative z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#f08a5d] flex items-center justify-center shadow-md shrink-0">
            <FolderPlus className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight truncate">
            {workspaceDetails?.name || 'Workspace'}
          </span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 ml-2 rounded-lg hover:bg-orange-50 text-[#f08a5d] transition-colors shrink-0">
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* THE FIXED SIDEBAR */}
      <aside className={`
          fixed md:relative top-0 left-0 z-50 md:z-10
          h-[100dvh] w-[85%] sm:w-80 shrink-0
          bg-white/90 backdrop-blur-xl border-r border-orange-100 
          shadow-2xl md:shadow-[4px_0_24px_rgba(240,138,93,0.05)]
          transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="md:hidden flex justify-end p-3 pb-0 shrink-0">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-orange-50 text-[#f08a5d] transition-colors"><X size={18} /></button>
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-4 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden w-full pr-2">
            <div className="w-9 h-9 rounded-xl bg-[#f08a5d] flex items-center justify-center shadow-md shrink-0">
              <FolderPlus className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-800 text-base tracking-tight truncate" title={workspaceDetails?.name || 'Workspace'}>
              {workspaceDetails ? workspaceDetails.name : 'Workspace'}
            </span>
          </div>
          <button onClick={() => navigate('/workspace')} className="p-2 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#f08a5d] transition-colors shrink-0" title="Back to Workspaces">
            <House size={18} />
          </button>
        </div>

        {/* Segmented Control UI for Tabs */}
        <div className="px-4 pb-3 flex flex-col gap-3 shrink-0">
            <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                <button 
                    onClick={() => {
                        setSidebarTab('campaigns');
                        setMainView('new_campaign');
                        setSelectedItem(null);
                    }} 
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${sidebarTab === 'campaigns' ? 'bg-white text-[#f08a5d] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Campaigns
                </button>
                <button 
                    onClick={() => {
                        setSidebarTab('profiles');
                        setMainView('new_profile');
                        clearProfileForm();
                        setSelectedItem(null);
                    }} 
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${sidebarTab === 'profiles' ? 'bg-white text-[#f08a5d] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Profiles
                </button>
            </div>
            
            {/* Live Search & Add Button */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${sidebarTab}...`}
                        className="w-full pl-8 pr-3 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#f08a5d] focus:ring-2 focus:ring-[#f08a5d]/10 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f08a5d]">
                            <FaTimes size={12} />
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => { 
                        if (sidebarTab === 'campaigns') { setMainView('new_campaign'); setSelectedItem(null); } 
                        else { clearProfileForm(); setMainView('new_profile'); setSelectedItem(null); } 
                        if (window.innerWidth < 768) setSidebarOpen(false);
                    }} 
                    className="w-10 h-10 rounded-xl bg-[#f08a5d] text-white flex items-center justify-center hover:bg-[#d97346] transition-all hover:shadow-lg hover:-translate-y-0.5 shrink-0"
                    title={`New ${sidebarTab === 'campaigns' ? 'Campaign' : 'Profile'}`}
                >
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>
        </div>

        {/* Sidebar History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 sleek-scrollbar">
            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                    {sidebarTab === 'campaigns' ? <PenTool size={28} className="text-slate-400 mb-3" /> : <Sparkles size={28} className="text-slate-400 mb-3" />}
                    <p className="text-slate-500 text-xs font-medium">No results found.</p>
                </div>
            ) : (
                <>
                    {renderSidebarGroup('Pinned', groupedData.pinned)}
                    {renderSidebarGroup('Today', groupedData.today)}
                    {renderSidebarGroup('Yesterday', groupedData.yesterday)}
                    {renderSidebarGroup('Older', groupedData.older)}
                </>
            )}
        </div>

        {/* BOTTOM PROFILE SECTION */}
        <div className="border-t border-orange-100 px-4 py-4 flex-shrink-0 bg-white/50 relative" ref={profileMenuRef}>
          <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-orange-100 transition-all group cursor-pointer"
          >
              <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f08a5d] to-[#d97346] flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                      {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start truncate overflow-hidden">
                      <span className="text-sm font-bold text-slate-800 truncate leading-tight w-full pr-2 text-left">{userName}</span>
                      
                  </div>
              </div>
              <FaEllipsisV size={12} className="text-slate-400 group-hover:text-[#f08a5d] shrink-0" />
          </button>
          
          {profileMenuOpen && (
              <div className="absolute bottom-full left-4 mb-2 w-56 bg-white border border-orange-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  <button onClick={() => { setProfileMenuOpen(false); setIsProfileModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-orange-50 flex items-center gap-2.5 transition cursor-pointer"><FaUser size={13} className="text-slate-400" /> Profile</button>
                  <div className="border-t border-orange-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition cursor-pointer"><FaSignOutAlt size={13} /> Log out</button>
              </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative z-10 w-full h-full sleek-scrollbar pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto">
          
          {/* NEW CAMPAIGN FORM (STACKED UI) */}
          {mainView === 'new_campaign' && (
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-8 shadow-xl shadow-orange-100/50 border border-white animate-fade-down">
              <h3 className="font-black text-slate-800 text-xl mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-[#f08a5d] shadow-inner border border-orange-100 shrink-0"><PenTool size={18} /></span> 
                Create New Campaign
              </h3>
              <form onSubmit={handleGenerate} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2.5 uppercase tracking-widest flex items-center gap-1.5"><FolderPlus className="w-4 h-4 shrink-0" /> 1. Select Batch Profile</label>
                  <select className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none cursor-pointer appearance-none" required value={campaignInput.profileId} onChange={(e) => setCampaignInput({ ...campaignInput, profileId: e.target.value })}>
                    <option value="" disabled>-- Choose a Saved Profile --</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2.5 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-4 h-4 shrink-0" /> 2. Campaign Name</label>
                  <input className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" value={campaignInput.name} onChange={(e) => setCampaignInput({ ...campaignInput, name: e.target.value })} placeholder="e.g. Summer Launch 2026" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2.5 uppercase tracking-widest flex items-center gap-1.5"><FaShoppingBag className="w-4 h-4 shrink-0" /> 3. Product / Service</label>
                  <input className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" value={campaignInput.product} onChange={(e) => setCampaignInput({ ...campaignInput, product: e.target.value })} placeholder="e.g. Organic Green Tea" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2.5 uppercase tracking-widest flex items-center gap-1.5"><FaFileAlt className="w-4 h-4 shrink-0" /> 4. Campaign Goal & Details</label>
                  <textarea rows="3" className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none resize-none" value={campaignInput.details} onChange={(e) => setCampaignInput({ ...campaignInput, details: e.target.value })} placeholder="e.g. Promote wellness, boost morning energy, highlight 20% discount." required />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-3 uppercase tracking-widest flex items-center gap-1.5"><Share2 className="w-4 h-4 shrink-0" /> 5. Select Platforms (Multiple)</label>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {PLATFORMS.map((p) => (
                      <button type="button" key={p.id} onClick={() => handleTogglePlatform(p.id)} className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${selectedPlatforms.includes(p.id) ? "text-[#f08a5d] border-[#f08a5d] bg-orange-50 shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                        <span className={selectedPlatforms.includes(p.id) ? p.color : "text-slate-400"}>{p.icon}</span> 
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={generating} className="mt-8 relative cursor-pointer overflow-hidden w-full text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 shimmer-btn bg-[#f08a5d] hover:bg-[#d97346]">
                  {generating ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" /> Generating Magic...</> : <>Generate Captions & Hashtags →</>}
                </button>
              </form>
            </div>
          )}

          {/* NEW / EDIT PROFILE FORM */}
          {(mainView === 'new_profile' || mainView === 'edit_profile') && (
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-8 shadow-xl shadow-orange-100/50 border border-white animate-fade-down">
              <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#f08a5d] shadow-inner border border-orange-100 shrink-0">
                    {mainView === 'edit_profile' ? <Edit size={16} /> : <Sparkles size={16} />}
                  </div>
                  <span className="truncate">{mainView === 'edit_profile' ? 'Edit Batch Profile' : 'Create Batch Profile'}</span>
                </h1>
                {mainView === 'edit_profile' && (
                  <button type="button" onClick={() => setMainView('view_profile')} className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 sm:px-4 py-2 rounded-xl cursor-pointer transition-colors shrink-0">Cancel</button>
                )}
              </div>
              <form onSubmit={mainView === 'edit_profile' ? handleUpdateProfile : handleSaveProfile} className="space-y-5 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                    <label className="block text-xs font-black text-[#f08a5d] mb-2 sm:mb-2.5 uppercase tracking-widest">Profile Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g. Fitness Brand Tone" className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" required />
                    </div>
                    <div>
                    <label className="block text-xs font-black text-[#f08a5d] mb-2 sm:mb-2.5 uppercase tracking-widest">Brand Name</label>
                    <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. HealthyLife" className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" required />
                    </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2 sm:mb-2.5 uppercase tracking-widest">Target Audience</label>
                  <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Fitness Enthusiasts" className="w-full rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#f08a5d] mb-2.5 uppercase tracking-widest">Tone of Voice</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tones.map((t, index) => (
                      <span key={index} className="bg-orange-50 text-[#f08a5d] border border-[#f08a5d]/20 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                        {t} <button type="button" onClick={() => handleRemoveTone(t)} className="text-[#f08a5d]/60 hover:text-[#f08a5d] cursor-pointer focus:outline-none text-base leading-none transition-colors shrink-0">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={toneInput} onChange={(e) => setToneInput(e.target.value)} onKeyDown={handleToneKeyDown} placeholder="Type a tone..." className="flex-1 rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 transition-all outline-none" />
                    <button type="button" onClick={handleAddTone} className="bg-[#f08a5d] hover:bg-[#d97346] cursor-pointer text-white font-bold px-5 sm:px-6 rounded-2xl shadow-md hover:shadow-lg transition-all shrink-0">Add</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-5 sm:space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Default Post Settings</h3>
                    <LanguageSelector label="Language Preference" value={profileLanguageData} onChange={setProfileLanguageData} />
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <label className="block text-xs font-black text-[#f08a5d] mb-3 uppercase tracking-widest flex items-center gap-1.5"><PenTool className="w-4 h-4 shrink-0" /> Caption Length</label>
                            <div className="flex flex-col gap-2.5">
                                {["short", "medium", "long"].map((len) => (
                                    <label key={len} className="flex items-center gap-2 cursor-pointer w-fit">
                                        <input type="radio" name="profileLength" value={len} checked={profileLength === len} onChange={(e) => setProfileLength(e.target.value)} className="w-4 h-4 text-[#f08a5d] border-slate-300 focus:ring-[#f08a5d]" />
                                        <span className="text-sm font-semibold text-slate-700 capitalize">{len}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <label className="block text-xs font-black text-[#f08a5d] mb-3 uppercase tracking-widest flex items-center gap-1.5"><Hash className="w-4 h-4 shrink-0" /> Hashtag Count</label>
                            <input type="number" min="0" max="30" className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border border-slate-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-100 transition outline-none" value={profileHashtagCount} onChange={(e) => setProfileHashtagCount(e.target.value)} placeholder="e.g. 12 (Leave blank for AI)" />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full cursor-pointer bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mt-6 shimmer-btn">
                  {mainView === 'edit_profile' ? 'Update Batch Profile' : 'Save Batch Profile'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW PROFILE */}
          {mainView === 'view_profile' && selectedItem && (
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-8 shadow-xl shadow-orange-100/50 border border-white animate-fade-down">
              <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-slate-100 flex-col sm:flex-row gap-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#f08a5d] shadow-inner border border-orange-100 shrink-0"><FolderPlus size={16} /></div> 
                  <span className="truncate">Profile: {selectedItem.name}</span>
                </h1>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button onClick={openEditForm} className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 cursor-pointer text-xs font-bold text-[#f08a5d] bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl transition-colors border border-orange-100"><Edit size={14} /> Edit</button>
                  <button onClick={() => handleDeleteProfile()} className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 cursor-pointer text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors border border-red-100"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 overflow-hidden">
                    <p className="text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-1.5">Brand Name</p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 truncate">{selectedItem.brand}</p>
                </div>
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 overflow-hidden">
                    <p className="text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-1.5">Target Audience</p>
                    <p className="text-base sm:text-lg font-bold text-slate-800 truncate">{selectedItem.audience}</p>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <p className="text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-3">Tone of Voice</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tone && selectedItem.tone.map((t, index) => (
                      <span key={index} className="bg-orange-50 text-[#f08a5d] text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange-100 shadow-sm">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="overflow-hidden"><p className="text-[10px] sm:text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-1">Language</p><p className="text-sm sm:text-base font-bold text-slate-800 capitalize truncate">{selectedItem.language || "English"}</p></div>
                    <div className="overflow-hidden"><p className="text-[10px] sm:text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-1">Default Length</p><p className="text-sm sm:text-base font-bold text-slate-800 capitalize truncate">{selectedItem.length || "Medium"}</p></div>
                    <div className="overflow-hidden col-span-2 sm:col-span-1"><p className="text-[10px] sm:text-xs font-black text-[#f08a5d] uppercase tracking-wider mb-1">Hashtags</p><p className="text-sm sm:text-base font-bold text-slate-800 truncate">{selectedItem.hashtag_count ? `${selectedItem.hashtag_count} Tags` : "AI Choice"}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW CAMPAIGN DYNAMIC RESULTS */}
          {mainView === 'view_campaign' && selectedItem && (
            <div className="space-y-5 sm:space-y-6 animate-fade-down">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-orange-200 pb-4 sm:pb-5">
                <h1 className="text-xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#f08a5d] border border-orange-100 shadow-sm shrink-0"><PenTool size={20} /></div>
                  <span className="truncate">{selectedItem.name}</span>
                </h1>
                <button onClick={() => handleDeleteCampaign()} className="w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-5 py-3 sm:py-2.5 rounded-xl transition-colors border border-red-100 shrink-0">
                    <Trash2 size={14} /> Delete Campaign
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-orange-100 flex flex-col sm:flex-row gap-4 sm:gap-12">
                <div className="overflow-hidden"><p className="text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1.5">Product / Service</p><p className="text-sm sm:text-base font-bold text-slate-800 truncate">{selectedItem.product}</p></div>
                <div className="overflow-hidden"><p className="text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1.5">Batch Profile Used</p><p className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5 truncate"><FolderPlus size={14} className="text-[#f08a5d] shrink-0"/> <span className="truncate">{selectedItem.profile_name || 'N/A'}</span></p></div>
              </div>

              <div className="space-y-4 sm:space-y-5 mt-6 sm:mt-8">
              {selectedItem.results && Object.entries(selectedItem.results).map(([platformId, data]) => {
                const platformConfig = PLATFORMS.find(p => p.id === platformId) || { name: platformId, icon: <Share2 />, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", tag: "bg-gray-100 text-gray-600" };
                
                return (
                  <div key={platformId} className={`bg-white/90 backdrop-blur-md rounded-[2rem] p-5 sm:p-6 shadow-lg border-2 ${platformConfig.border} hover:shadow-xl transition-all animate-fade-down`}>
                    
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                        <span className={`text-xl sm:text-2xl ${platformConfig.color}`}>{platformConfig.icon}</span>
                        <span className={`text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${platformConfig.tag}`}>{platformConfig.name}</span>
                        <button 
                            onClick={() => handleCopyCaptionForPlatform(platformId, data)} 
                            className={`ml-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-1.5 ${platformConfig.tag} hover:opacity-80 cursor-pointer shadow-sm shrink-0`} 
                            aria-label={`Copy ${platformConfig.name} caption`}
                        >
                            <Copy size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Copy</span>
                        </button>
                    </div>
                    
                    <div className="w-full rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 font-medium bg-slate-50 border border-slate-100 mb-4 sm:mb-5 leading-relaxed shadow-inner whitespace-pre-wrap break-words">
                        {data.caption}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                      {Array.isArray(data.hashtags) 
                        ? data.hashtags.map((h, i) => (<span key={i} className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${platformConfig.tag}`}>{h.startsWith('#') ? h : `#${h}`}</span>))
                        : (typeof data.hashtags === 'string' && data.hashtags.split(' ').map((h, i) => (<span key={i} className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${platformConfig.tag}`}>{h}</span>)))
                      }
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                            <input 
                                type="text" 
                                placeholder="Tell AI what to change..." 
                                value={refinePrompts[platformId] || ""} 
                                onChange={(e) => setRefinePrompts((prev) => ({ ...prev, [platformId]: e.target.value }))} 
                                className={`flex-1 text-sm font-medium px-4 py-2.5 sm:py-3 rounded-xl border-2 bg-white focus:outline-none transition-all ${platformConfig.border} focus:ring-4`} 
                                style={{ '--tw-ring-color': 'rgba(240, 138, 93, 0.15)' }} 
                            />
                            <button 
                                onClick={() => handleRefineCaption(platformId)} 
                                disabled={refiningPlatform === platformId} 
                                className="px-5 py-3 sm:py-2.5 text-sm font-bold rounded-xl bg-[#f08a5d] hover:bg-[#d97346] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <RotateCcw size={14} className={refiningPlatform === platformId ? "animate-spin" : ""} /> 
                                {refiningPlatform === platformId ? "Refining..." : "Refine"}
                            </button>
                        </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RENAME MODAL */}
      {renameModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-fade-down border border-orange-100">
            <div className="px-6 py-5 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Edit className="text-[#f08a5d]" size={16} /> Rename {renameModal.type === 'campaign' ? 'Campaign' : 'Profile'}
              </h3>
              <button onClick={() => setRenameModal({ isOpen: false, id: null, type: null, text: "" })} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors border border-slate-100 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
                <label className="block text-[10px] font-black text-[#f08a5d] mb-2 uppercase tracking-widest">New Name</label>
                <input
                    type="text"
                    value={renameModal.text}
                    onChange={(e) => setRenameModal({ ...renameModal, text: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); }}
                    className="w-full rounded-2xl px-4 py-3.5 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-4 focus:ring-[#f08a5d]/10 outline-none transition-all"
                    autoFocus
                />
            </div>
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setRenameModal({ isOpen: false, id: null, type: null, text: "" })} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
                Cancel
              </button>
              <button onClick={submitRename} className="px-5 py-2.5 text-sm font-bold text-white bg-[#f08a5d] hover:bg-[#d97346] hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-fade-down border border-red-100">
            <div className="px-6 py-5 border-b border-red-100 flex justify-between items-center bg-red-50/50">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Trash2 className="text-red-500" size={16} /> Confirm Deletion
              </h3>
              <button onClick={() => setDeleteModal({ isOpen: false, id: null, type: null, message: "" })} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors border border-slate-100 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 text-center text-slate-700 font-medium text-sm">
                {deleteModal.message}
            </div>
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null, type: null, message: "" })} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER PROFILE MODAL */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        fullName={userName}
        setFullName={setUserName}
      />
    </div>
  );
};

export default WorkspaceDashboard;