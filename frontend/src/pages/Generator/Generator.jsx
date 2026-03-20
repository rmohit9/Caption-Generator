import React, { useState, useEffect, useId, useRef } from "react";
import {
    FaShoppingBag, FaBullseye, FaPaintBrush, FaFileAlt, FaInstagram, FaLinkedin, FaTwitter, FaFacebook,
} from "react-icons/fa";
import { PenTool, Share2, Sparkles, Copy, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import GeneratorSidebar from "./GeneratorSidebar";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useSidebar } from "../../Context/SidebarContext";

const PLATFORMS = [
    { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "text-orange-500" },
    { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "text-blue-600" },
    { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "text-sky-500" },
    { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "text-indigo-600" },
];

const getPlatformUI = (platform) => {
    const mockUI = {
        instagram: { icon: <FaInstagram className="text-orange-500" />, label: "Instagram", bg: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700" },
        linkedin: { icon: <FaLinkedin className="text-blue-600" />, label: "LinkedIn", bg: "bg-blue-50", border: "border-blue-200", tag: "bg-blue-100 text-blue-700" },
        twitter: { icon: <FaTwitter className="text-sky-500" />, label: "Twitter/X", bg: "bg-sky-50", border: "border-sky-200", tag: "bg-sky-100 text-sky-700" },
        facebook: { icon: <FaFacebook className="text-indigo-600" />, label: "Facebook", bg: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700" },
    };
    return mockUI[platform] || mockUI.instagram;
};

const LANGUAGE_OPTIONS = [
    { value: "English", label: "English" }, { value: "Hindi", label: "Hindi" }, { value: "Hinglish", label: "Hinglish" },
    { value: "Spanish", label: "Spanish" }, { value: "French", label: "French" }, { value: "Other", label: "Other" },
];

const LanguageSelector = ({ label = "Language", value, onChange }) => {
    const selectId = useId(); const inputId = useId();
    const isOther = value.language === "Other";

    const emitChange = (nextLanguage, nextCustom) => {
        if (!onChange) return;
        const nextIsOther = nextLanguage === "Other";
        const nextFinal = nextIsOther ? nextCustom.trim() : nextLanguage;
        onChange({ language: nextLanguage, customLanguage: nextCustom, finalLanguage: nextFinal });
    };

    return (
        <div>
            <label htmlFor={selectId} className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <select id={selectId} value={value.language} onChange={(e) => emitChange(e.target.value, value.customLanguage)} className="w-full appearance-none rounded-2xl px-4 py-3 pr-11 text-sm text-slate-800 font-semibold bg-white/90 border-2 border-orange-200 shadow-sm focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-200 transition-all">
                    <option value="" disabled>Select Language</option>
                    {LANGUAGE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${isOther ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`} aria-hidden={!isOther}>
                <input id={inputId} type="text" placeholder="Type custom language..." value={value.customLanguage} onChange={(e) => emitChange(value.language, e.target.value)} disabled={!isOther} className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 transition-all disabled:opacity-60" />
            </div>
        </div>
    );
};

const Generator = () => {
    const { sidebarState, setSidebarState } = useSidebar(); 
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getMarginLeft = () => {
        if (!isDesktop) return 0;
        return sidebarState === "full" ? "16rem" : sidebarState === "mini" ? "4rem" : 0;
    };

    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
    
    const [activeChatId, setActiveChatId] = useState(null);
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const [demoInput, setDemoInput] = useState({ product: "", description: "", audience: "", tone: "", length: "medium", hashtagCount: "" });
    const [generatedCaptions, setGeneratedCaptions] = useState({});
    const [refiningPlatform, setRefiningPlatform] = useState(null);
    const [refinePrompts, setRefinePrompts] = useState({});
    const [languageData, setLanguageData] = useState({ language: "", customLanguage: "", finalLanguage: "" });

    const resultsContainerRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const el = resultsContainerRef.current;
        if (!el) return;

        const timer = setTimeout(() => {
            const isOverflowing = el.scrollHeight > 500;
            setShouldScroll(isOverflowing);
        }, 50);

        return () => clearTimeout(timer);
    }, [generatedCaptions]);

    const handleTogglePlatform = (platformId) => {
        setSelectedPlatforms((prev) => prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]);
    };

    const handleSelectHistory = (item) => {
        let fullTopic = item.product || ""; 
        let parsedAudience = "", parsedLength = "medium", parsedLanguage = "", parsedHashtagCount = "";

        const matchAndExtract = (regex) => {
            const match = fullTopic.match(regex);
            if (match) { fullTopic = fullTopic.replace(match[0], "").trim(); return match[1].trim(); }
            return "";
        };

        parsedAudience = matchAndExtract(/Audience:\s*([^.]+)/);
        parsedLength = matchAndExtract(/Length:\s*([^.]+)/) || "medium";
        parsedLanguage = matchAndExtract(/Language:\s*([^.]+)/);
        parsedHashtagCount = matchAndExtract(/Hashtags:\s*([^.]+)/);
        matchAndExtract(/Refinement:\s*([^.]+)/); 

        fullTopic = fullTopic.replace(/\.\s*\./g, ".").replace(/^\.+|\.+$/g, "").trim();
        let parsedProduct = fullTopic, parsedDescription = "";
        const firstDotIndex = fullTopic.indexOf(". "); 
        if (firstDotIndex !== -1) {
            parsedProduct = fullTopic.substring(0, firstDotIndex).trim();
            parsedDescription = fullTopic.substring(firstDotIndex + 2).trim().replace(/^\.+|\.+$/g, "").trim();
        }

        setDemoInput({ product: parsedProduct, description: parsedDescription, audience: parsedAudience, tone: item.caption_type || "", length: parsedLength, hashtagCount: parsedHashtagCount });
        
        if (parsedLanguage) {
            const isStandard = LANGUAGE_OPTIONS.find(opt => opt.value.toLowerCase() === parsedLanguage.toLowerCase());
            setLanguageData(isStandard ? { language: isStandard.value, customLanguage: "", finalLanguage: isStandard.value } : { language: "Other", customLanguage: parsedLanguage, finalLanguage: parsedLanguage });
        } else setLanguageData({ language: "", customLanguage: "", finalLanguage: "" });

        setSelectedPlatforms(item.platforms || []);
        setGeneratedCaptions(item.results || {});
        setActiveChatId(item.id); 
        setRefinePrompts({});
        setGenerated(true);
        setErrorMessage("");
        
        if (window.innerWidth < 768) setSidebarState("closed"); 
    };

    const handleGenerate = async () => {
        setErrorMessage(""); setGenerating(true); setGenerated(false);
        if (selectedPlatforms.length === 0) { setErrorMessage("Select at least one platform"); setGenerating(false); return; }

        try {
            const topicParts = [
                demoInput.product, demoInput.description, demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`, languageData.finalLanguage && `Language: ${languageData.finalLanguage}`,
                demoInput.hashtagCount && `Hashtags: ${demoInput.hashtagCount}`,
            ].filter(Boolean);

            const response = await api.post("generate-caption/", {
                platforms: selectedPlatforms, 
                caption_type: demoInput.tone,
                topic: topicParts.join(". "),
                language: languageData.finalLanguage || "",
                hashtag_count: demoInput.hashtagCount || "",
            });

            setGeneratedCaptions(response.data.results);
            setActiveChatId(response.data.id); 
            setRefinePrompts({});
            setGenerated(true);
            setRefreshSidebar(prev => prev + 1); 
            toast.success("Captions generated!");
        } catch (err) {
            const message = err?.response?.data?.error || "Failed to generate captions.";
            setErrorMessage(message); toast.error(message);
        } finally {
            setGenerating(false);
        }
    };

    const handleRefineCaption = async (platform) => {
        if (!refinePrompts[platform]) { toast.error("Enter a refinement prompt"); return; }

        setRefiningPlatform(platform);
        try {
            const topicParts = [
                demoInput.product, demoInput.description, demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`, languageData.finalLanguage && `Language: ${languageData.finalLanguage}`,
                demoInput.hashtagCount && `Hashtags: ${demoInput.hashtagCount}`, `Refinement: ${refinePrompts[platform]}`,
            ].filter(Boolean);

            const response = await api.post("generate-caption/", {
                platform: platform, 
                caption_type: demoInput.tone,
                topic: topicParts.join(". "),
                language: languageData.finalLanguage || "",
                hashtag_count: demoInput.hashtagCount || "",
                history_id: activeChatId 
            });

            setGeneratedCaptions(response.data.results);
            setRefreshSidebar(prev => prev + 1); 
            setRefinePrompts((prev) => ({ ...prev, [platform]: "" }));
            toast.success(`Refined ${PLATFORMS.find((p) => p.id === platform)?.name}!`);
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to refine caption.");
        } finally {
            setRefiningPlatform(null);
        }
    };

    const handleCopyCaptionForPlatform = (platform) => {
        const caption = generatedCaptions[platform];
        if (!caption) return;
        navigator.clipboard.writeText(`${caption.caption}\n\n${caption.hashtags.join(" ")}`);
        toast.success("Copied to clipboard!");
    };

    const handleNewChat = () => {
        setDemoInput({ product: "", description: "", audience: "", tone: "", length: "medium", hashtagCount: "" });
        setLanguageData({ language: "", customLanguage: "", finalLanguage: "" });
        setSelectedPlatforms(["instagram"]);
        setGeneratedCaptions({});
        setActiveChatId(null);
        setRefinePrompts({});
        setGenerated(false);
        setErrorMessage("");
        toast.success("Ready for a new caption!");
    };

    return (
        <div>
            <div className="min-h-screen flex bg-[#fff7ed]">
                <GeneratorSidebar onNewChat={handleNewChat} onSelectHistory={handleSelectHistory} refreshKey={refreshSidebar} />

                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300" style={{ marginLeft: getMarginLeft() }}>
                    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-orange-100 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#f08a5d] flex items-center justify-center shadow-md">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-black text-slate-800">Caption Generator</h1>
                        </div>
                        {/* Desktop Navigation Pill */}
                        <div className="hidden md:flex items-center gap-1 bg-orange-50/80 p-1 rounded-full border border-orange-200 shadow-sm backdrop-blur-md">
                            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-orange-100 px-5 py-1.5 rounded-full transition-all duration-300">Home</Link>
                            <Link to="/generator" className="text-sm font-black text-white bg-[#f08a5d] shadow-md px-5 py-1.5 rounded-full transition-all duration-300 cursor-default pointer-events-none">Generate</Link>
                            <Link to="/workspace" className="text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-orange-100 px-5 py-1.5 rounded-full transition-all duration-300">Workspace</Link>
                        </div>
                        {/* Mobile Navigation */}
                        <div className="md:hidden flex items-center gap-1 bg-orange-50/80 p-1 rounded-full border border-orange-200 shadow-sm backdrop-blur-md">
                            <Link to="/" className="text-[10px] sm:text-xs font-bold text-slate-500 px-2 py-1.5 rounded-full">Home</Link>
                            <Link to="/generator" className="text-[10px] sm:text-xs font-black text-white bg-[#f08a5d] px-2 py-1.5 rounded-full shadow-sm pointer-events-none">Gen</Link>
                            <Link to="/workspace" className="text-[10px] sm:text-xs font-bold text-slate-500 px-2 py-1.5 rounded-full">Work</Link>
                        </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-8 items-start">
                                
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-orange-200/30 border border-orange-100">
                                    <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-[#f08a5d] text-white"><PenTool size={16} /></span> Campaign Details
                                    </h3>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaShoppingBag className="w-4 h-4" /> Product / Brand Name</label>
                                            <input className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-200 transition" value={demoInput.product} onChange={(e) => setDemoInput({ ...demoInput, product: e.target.value })} placeholder="e.g. Organic Green Tea" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaFileAlt className="w-4 h-4" /> Description or Campaign Goal</label>
                                            <textarea rows="2" className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 transition" value={demoInput.description} onChange={(e) => setDemoInput({ ...demoInput, description: e.target.value })} placeholder="e.g. Promote wellness, boost morning energy" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaBullseye className="w-4 h-4" /> Target Audience</label>
                                            <input className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 transition" value={demoInput.audience} onChange={(e) => setDemoInput({ ...demoInput, audience: e.target.value })} placeholder="e.g. Fitness Enthusiasts" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaPaintBrush className="w-4 h-4" /> Tone of Caption</label>
                                            <input className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 transition" value={demoInput.tone} onChange={(e) => setDemoInput({ ...demoInput, tone: e.target.value })} placeholder="e.g. Motivational & Fresh" />
                                        </div>
                                        
                                        <LanguageSelector label="Language Selection" value={languageData} onChange={setLanguageData} />
                                        
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><PenTool className="w-4 h-4" /> Caption Length</label>
                                                <div className="flex gap-3">
                                                    {["short", "medium", "long"].map((len) => (
                                                        <label key={len} className="flex items-center gap-1 cursor-pointer">
                                                            <input type="radio" name="length" value={len} checked={demoInput.length === len} onChange={(e) => setDemoInput({ ...demoInput, length: e.target.value })} className="w-4 h-4 text-[#f08a5d] border-orange-300 focus:ring-[#f08a5d]" />
                                                            <span className="text-sm text-slate-700 capitalize">{len}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Hashtag Count</label>
                                                <input type="number" min="0" max="30" className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 transition" value={demoInput.hashtagCount} onChange={(e) => setDemoInput({ ...demoInput, hashtagCount: e.target.value })} placeholder="e.g. 12" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Select Platforms (Multiple)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {PLATFORMS.map((p) => (
                                                    <button key={p.id} type="button" onClick={() => handleTogglePlatform(p.id)} className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${selectedPlatforms.includes(p.id) ? "text-white border-[#f08a5d] shadow-md bg-[#f08a5d]" : "border-orange-200 text-slate-500 hover:bg-orange-50"}`}>
                                                        {p.icon} {p.name} {selectedPlatforms.includes(p.id) && " ✓"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={handleGenerate} disabled={generating} className="relative overflow-hidden w-full bg-[#f08a5d] hover:bg-[#d97346] text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn">
                                            {generating ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating Magic...</> : <>Generate Captions & Hashtags →</>}
                                        </button>
                                    </div>
                                </div>

                                <div className={`rounded-3xl overflow-hidden transition-all duration-700 ${generated ? "bg-white/80 backdrop-blur-md shadow-2xl shadow-orange-200/30 border border-orange-100" : "border-2 border-dashed border-orange-200 bg-white/50"}`}>
                                    {!generated && !generating ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                                            <div className="text-7xl mb-5 opacity-20 animate-float"><Sparkles className="w-16 h-16 text-orange-300" /></div>
                                            <p className="text-orange-400 font-bold text-sm">Fill in your campaign details<br />and click generate to see AI magic! ✨</p>
                                        </div>
                                    ) : generating ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                                            <div className="relative w-20 h-20 mb-6">
                                                <div className="absolute inset-0 rounded-full border-4 border-orange-200" />
                                                <div className="absolute inset-0 rounded-full border-4 border-t-[#f08a5d] animate-spin" />
                                                <div className="absolute inset-2 rounded-full border-4 border-t-[#d97346] animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                                                <span className="absolute inset-0 flex items-center justify-center text-2xl"><Sparkles className="w-8 h-8 text-[#f08a5d]" /></span>
                                            </div>
                                            <p className="font-black text-[#f08a5d] mb-1">Crafting your perfect captions...</p>
                                            <p className="text-orange-400 text-xs font-semibold">Generating for {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? "s" : ""}</p>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-orange-100">
                                                <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#f08a5d]" />
                                                <span className="text-xs font-black text-[#f08a5d] uppercase tracking-wider">Generated for: {demoInput.product || "Custom Subject"}</span>
                                                <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓ Ready</span>
                                            </div>
                                            {errorMessage && <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-sm font-semibold">{errorMessage}</div>}

                                            <div
                                                ref={resultsContainerRef}
                                                className={`space-y-4 transition-all duration-300 ${shouldScroll ? "max-h-[500px] overflow-y-auto pr-2" : ""}`}
                                            >
                                                {Object.keys(generatedCaptions).map((platform) => {
                                                    const caption = generatedCaptions[platform];
                                                    if (!caption || !caption.caption) return null;

                                                    return (
                                                        <div key={platform} className={`rounded-2xl p-4 border-2 ${getPlatformUI(platform).bg} ${getPlatformUI(platform).border} hover:shadow-lg transition-all`}>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-lg">{getPlatformUI(platform).icon}</span>
                                                                <span className={`text-xs font-black px-2 py-1 rounded-full ${getPlatformUI(platform).tag}`}>{getPlatformUI(platform).label}</span>
                                                                <button onClick={() => handleCopyCaptionForPlatform(platform)} className={`ml-auto w-8 h-8 rounded-lg transition border-0 flex items-center justify-center ${getPlatformUI(platform).tag} hover:shadow-sm`}><Copy size={14} /></button>
                                                            </div>

                                                            <p className="text-sm text-slate-700 font-medium mb-2 whitespace-pre-wrap">{caption.caption}</p>

                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {caption.hashtags.map((h) => (
                                                                    <span
                                                                        key={h}
                                                                        className={`text-xs ${getPlatformUI(platform).tag} px-2 py-0.5 rounded-full font-semibold`}
                                                                    >
                                                                        {h}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <div className="space-y-2 pt-3 border-t border-current border-opacity-10">
                                                                <div className="space-y-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Tell AI what to change..."
                                                                        value={refinePrompts[platform] || ""}
                                                                        onChange={(e) =>
                                                                            setRefinePrompts((prev) => ({
                                                                                ...prev,
                                                                                [platform]: e.target.value,
                                                                            }))
                                                                        }
                                                                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-current border-opacity-20 bg-white/50 focus:outline-none focus:border-[#f08a5d] focus:bg-white transition"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRefineCaption(platform)}
                                                                        disabled={refiningPlatform === platform}
                                                                        className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-[#f08a5d] hover:bg-[#d97346] text-white hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1"
                                                                    >
                                                                        <RotateCcw size={12} />
                                                                        {refiningPlatform === platform ? "Refining..." : "Refine"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {generated && Object.keys(generatedCaptions).length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        const allText = Object.keys(generatedCaptions).map((platform) => {
                                                            const caption = generatedCaptions[platform];
                                                            return caption && caption.caption ? `${getPlatformUI(platform).label}:\n${caption.caption}\n${caption.hashtags.join(" ")}` : "";
                                                        }).filter(Boolean).join("\n\n---\n\n");
                                                        navigator.clipboard.writeText(allText);
                                                        toast.success("All captions copied!");
                                                    }}
                                                    className="w-full text-white bg-[#f08a5d] hover:bg-[#d97346] font-black py-3 rounded-2xl mt-4 text-sm hover:-translate-y-1 transition-all shadow-lg relative overflow-hidden flex items-center justify-center gap-2 shimmer-btn"
                                                >
                                                    <Copy size={16} />
                                                    Copy All Captions & Hashtags
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Generator;