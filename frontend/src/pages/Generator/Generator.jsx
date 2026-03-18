import React, { useState, useEffect, useMemo, useId } from "react";
import {
    FaShoppingBag,
    FaBullseye,
    FaPaintBrush,
    FaFileAlt,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
} from "react-icons/fa";
import { PenTool, Share2, Sparkles, Copy, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import GeneratorSidebar from "./GeneratorSidebar";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useSidebar } from "../../Context/SidebarContext";

const Loader = () => {
    return (
        <span className="refine-loader" aria-label="Refining">
            <span className="refine-dots">
                <span className="refine-dot" />
                <span className="refine-dot" />
                <span className="refine-dot" />
                <span className="refine-dot" />
                <span className="refine-dot" />
            </span>
            <style>{`
                .refine-dots {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    gap: 4px;
                }
                .refine-dot {
                    height: 6px;
                    width: 6px;
                    border-radius: 999px;
                    background-color: #dbeafe;
                    animation: refinePulse 1.2s infinite ease-in-out;
                }
                .refine-dot:nth-child(1) { animation-delay: -0.24s; }
                .refine-dot:nth-child(2) { animation-delay: -0.12s; }
                .refine-dot:nth-child(3) { animation-delay: 0s; }
                .refine-dot:nth-child(4) { animation-delay: 0.12s; }
                .refine-dot:nth-child(5) { animation-delay: 0.24s; }
                @keyframes refinePulse {
                    0%, 100% {
                        transform: scale(0.8);
                        background-color: #dbeafe;
                        box-shadow: 0 0 0 0 rgba(191, 219, 254, 0.7);
                    }
                    50% {
                        transform: scale(1.25);
                        background-color: #93c5fd;
                        box-shadow: 0 0 0 6px rgba(191, 219, 254, 0);
                    }
                }
            `}</style>
        </span>
    );
};

// Platform definitions
const PLATFORMS = [
    { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "from-pink-400 to-rose-500" },
    { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "from-blue-500 to-cyan-500" },
    { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "from-sky-400 to-cyan-400" },
    { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "from-indigo-500 to-blue-500" },
];

const getPlatformUI = (platform) => {
    const mockUI = {
        instagram: { icon: <FaInstagram className="text-pink-500" />, label: "Instagram", bg: "bg-gradient-to-br from-pink-50 to-rose-50", border: "border-pink-200", tag: "bg-pink-100 text-pink-600" },
        linkedin: { icon: <FaLinkedin className="text-blue-600" />, label: "LinkedIn", bg: "bg-gradient-to-br from-blue-50 to-cyan-50", border: "border-blue-200", tag: "bg-blue-100 text-blue-600" },
        twitter: { icon: <FaTwitter className="text-black" />, label: "Twitter/X", bg: "bg-gradient-to-br from-sky-50 to-cyan-50", border: "border-sky-200", tag: "bg-sky-100 text-sky-600" },
        facebook: { icon: <FaFacebook className="text-blue-500" />, label: "Facebook", bg: "bg-gradient-to-br from-indigo-50 to-blue-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-600" },
    };
    return mockUI[platform] || mockUI.instagram;
};

const LANGUAGE_OPTIONS = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Hinglish", label: "Hinglish" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "Other", label: "Other" },
];

// UPDATED: Now a Controlled Component receiving 'value' from parent
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
            <label htmlFor={selectId} className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest">
                {label}
            </label>
            <div className="relative">
                <select
                    id={selectId}
                    value={value.language}
                    onChange={(e) => emitChange(e.target.value, value.customLanguage)}
                    className="w-full appearance-none rounded-2xl px-4 py-3 pr-11 text-sm text-slate-800 font-semibold bg-white/90 border-2 border-indigo-200 shadow-sm shadow-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                    <option value="" disabled>Select Language</option>
                    {LANGUAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400">
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
                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
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
        switch (sidebarState) {
            case "full": return "16rem";
            case "mini": return "4rem";
            default: return 0;
        }
    };

    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
    const [generatedHistoryIds, setGeneratedHistoryIds] = useState({});
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const [demoInput, setDemoInput] = useState({
        product: "",
        description: "",
        audience: "",
        tone: "",
        length: "medium",
        hashtagCount: "",
    });
    
    const [generatedCaptions, setGeneratedCaptions] = useState({});
    const [refiningPlatform, setRefiningPlatform] = useState(null);
    const [refinePrompts, setRefinePrompts] = useState({});
    
    // Initialized so it doesn't complain about being uncontrolled
    const [languageData, setLanguageData] = useState({
        language: "", customLanguage: "", finalLanguage: "",
    });

    const handleTogglePlatform = (platformId) => {
        setSelectedPlatforms((prev) => {
            if (prev.includes(platformId)) return prev.filter((p) => p !== platformId);
            return [...prev, platformId];
        });
    };

    // UPDATED PARSER: Now grabs Language and Hashtag Count
    const handleSelectHistory = (item) => {
        let fullTopic = item.product || ""; 
        let parsedAudience = "";
        let parsedLength = "medium";
        let parsedLanguage = "";
        let parsedHashtagCount = item.hashtags ? item.hashtags.length.toString() : ""; // Fallback
        let parsedRefinement = "";

        const audienceRegex = /Audience:\s*([^.]+)/;
        const audienceMatch = fullTopic.match(audienceRegex);
        if (audienceMatch) {
            parsedAudience = audienceMatch[1].trim();
            fullTopic = fullTopic.replace(audienceMatch[0], "").trim();
        }

        const lengthRegex = /Length:\s*([^.]+)/;
        const lengthMatch = fullTopic.match(lengthRegex);
        if (lengthMatch) {
            parsedLength = lengthMatch[1].trim();
            fullTopic = fullTopic.replace(lengthMatch[0], "").trim();
        }

        const languageRegex = /Language:\s*([^.]+)/;
        const languageMatch = fullTopic.match(languageRegex);
        if (languageMatch) {
            parsedLanguage = languageMatch[1].trim();
            fullTopic = fullTopic.replace(languageMatch[0], "").trim();
        }

        const hashtagRegex = /Hashtags:\s*([^.]+)/;
        const hashtagMatch = fullTopic.match(hashtagRegex);
        if (hashtagMatch) {
            parsedHashtagCount = hashtagMatch[1].trim();
            fullTopic = fullTopic.replace(hashtagMatch[0], "").trim();
        }

        const refinementRegex = /Refinement:\s*([^.]+)/;
        const refinementMatch = fullTopic.match(refinementRegex);
        if (refinementMatch) {
            parsedRefinement = refinementMatch[1].trim();
            fullTopic = fullTopic.replace(refinementMatch[0], "").trim();
        }

        fullTopic = fullTopic.replace(/\.\s*\./g, ".").replace(/^\.+|\.+$/g, "").trim();

        let parsedProduct = fullTopic;
        let parsedDescription = "";
        const firstDotIndex = fullTopic.indexOf(". "); 
        if (firstDotIndex !== -1) {
            parsedProduct = fullTopic.substring(0, firstDotIndex).trim();
            parsedDescription = fullTopic.substring(firstDotIndex + 2).trim();
            parsedDescription = parsedDescription.replace(/^\.+|\.+$/g, "").trim();
        }

        setDemoInput({
            product: parsedProduct,
            description: parsedDescription, 
            audience: parsedAudience,
            tone: item.caption_type || "",
            length: parsedLength || "medium",
            hashtagCount: parsedHashtagCount, 
        });
        
        // Restore Language Dropdown visually
        if (parsedLanguage) {
            const isStandard = LANGUAGE_OPTIONS.find(opt => opt.value.toLowerCase() === parsedLanguage.toLowerCase());
            if (isStandard) {
                setLanguageData({ language: isStandard.value, customLanguage: "", finalLanguage: isStandard.value });
            } else {
                setLanguageData({ language: "Other", customLanguage: parsedLanguage, finalLanguage: parsedLanguage });
            }
        } else {
            setLanguageData({ language: "", customLanguage: "", finalLanguage: "" });
        }

        if (parsedRefinement) {
            setRefinePrompts(prev => ({ ...prev, [item.platform]: parsedRefinement }));
        } else {
            setRefinePrompts({});
        }
        
        setSelectedPlatforms([item.platform]);
        
        setGeneratedCaptions({
            [item.platform]: {
                caption: item.caption,
                hashtags: item.hashtags || []
            }
        });
        
        setGeneratedHistoryIds({ [item.platform]: item.id });
        setGenerated(true);
        setErrorMessage("");
        
        if (window.innerWidth < 768) {
            setSidebarState("closed"); 
        }
    };

    const handleGenerate = async () => {
        setErrorMessage("");
        setGenerating(true);
        setGenerated(false);

        if (selectedPlatforms.length === 0) {
            setErrorMessage("Please select at least one platform");
            setGenerating(false);
            return;
        }

        try {
            // UPDATED: Append Language and Hashtags to the topic so it gets saved!
            const topicParts = [
                demoInput.product,
                demoInput.description,
                demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`,
                languageData.finalLanguage && `Language: ${languageData.finalLanguage}`,
                demoInput.hashtagCount && `Hashtags: ${demoInput.hashtagCount}`,
            ].filter(Boolean);

            const responses = await Promise.all(
                selectedPlatforms.map((platform) =>
                    api.post("generate-caption/", {
                        platform: platform,
                        caption_type: demoInput.tone,
                        topic: topicParts.join(". "),
                        language: languageData.finalLanguage || "",
                        hashtag_count: demoInput.hashtagCount || "",
                    })
                )
            );

            const captions = {};
            const historyIds = {};
            responses.forEach((response, index) => {
                const platform = selectedPlatforms[index];
                const hashtags = Array.isArray(response.data.hashtags) ? response.data.hashtags : [];
                captions[platform] = {
                    caption: response.data.caption,
                    hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
                };
                if (response.data.id) {
                    historyIds[platform] = response.data.id;
                }
            });

            setGeneratedCaptions(captions);
            setGeneratedHistoryIds(historyIds); 
            setRefinePrompts({});
            setGenerated(true);
            setRefreshSidebar(prev => prev + 1); 
            toast.success("Captions generated for all selected platforms!");
        } catch (err) {
            const message = err?.response?.data?.error || "Failed to generate captions. Please try again.";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setGenerating(false);
        }
    };

    const handleRefineCaption = async (platform) => {
        if (!refinePrompts[platform]) {
            toast.error("Please enter a refinement prompt");
            return;
        }

        setRefiningPlatform(platform);
        try {
            // UPDATED: Keep language and hashtags in the refined topic string too!
            const topicParts = [
                demoInput.product,
                demoInput.description,
                demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`,
                languageData.finalLanguage && `Language: ${languageData.finalLanguage}`,
                demoInput.hashtagCount && `Hashtags: ${demoInput.hashtagCount}`,
                `Refinement: ${refinePrompts[platform]}`,
            ].filter(Boolean);

            const historyIdToUpdate = generatedHistoryIds[platform];

            const response = await api.post("generate-caption/", {
                platform: platform,
                caption_type: demoInput.tone,
                topic: topicParts.join(". "),
                language: languageData.finalLanguage || "",
                hashtag_count: demoInput.hashtagCount || "",
                history_id: historyIdToUpdate 
            });

            const hashtags = Array.isArray(response.data.hashtags) ? response.data.hashtags : [];

            setGeneratedCaptions((prev) => ({
                ...prev,
                [platform]: {
                    caption: response.data.caption,
                    hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
                },
            }));

            if (response.data.id) {
                setGeneratedHistoryIds((prev) => ({ ...prev, [platform]: response.data.id }));
            }

            setRefreshSidebar(prev => prev + 1); 
            toast.success(`Caption refined for ${PLATFORMS.find((p) => p.id === platform)?.name}!`);
        } catch (err) {
            const message = err?.response?.data?.error || "Failed to refine caption. Please try again.";
            toast.error(message);
        } finally {
            setRefiningPlatform(null);
        }
    };

    const handleCopyCaptionForPlatform = (platform) => {
        const caption = generatedCaptions[platform];
        if (!caption) return;
        const text = `${caption.caption}\n\n${caption.hashtags.join(" ")}`;
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleNewChat = () => {
        setDemoInput({ product: "", description: "", audience: "", tone: "", length: "medium", hashtagCount: "" });
        setLanguageData({ language: "", customLanguage: "", finalLanguage: "" }); // Reset language dropdown
        setSelectedPlatforms(["instagram"]); // Default back to at least 1 platform
        setGeneratedCaptions({});
        setGeneratedHistoryIds({});
        setRefinePrompts({});
        setGenerated(false);
        setErrorMessage("");
        toast.success("Ready for a new caption!");
    };

    return (
        <div>
            <div
                className="min-h-screen flex"
                style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)" }}
            >
                <GeneratorSidebar 
                    onNewChat={handleNewChat} 
                    onSelectHistory={handleSelectHistory} 
                    refreshKey={refreshSidebar} 
                />

                <div
                    className="flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300"
                    style={{ marginLeft: getMarginLeft() }}
                >
                    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-indigo-100 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent">
                                Caption Generator
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-block text-xs text-indigo-400 font-medium">AI Ready</span>
                            <Link
                                to="/"
                                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 border border-indigo-200"
                            >
                                <span>←</span> Back
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-indigo-200/30 border border-indigo-100">
                                    <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                            <PenTool size={16} />
                                        </span>
                                        Campaign Details
                                    </h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaShoppingBag className="w-4 h-4" /> Product / Brand Name
                                            </label>
                                            <input
                                                className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                                value={demoInput.product}
                                                onChange={(e) => setDemoInput({ ...demoInput, product: e.target.value })}
                                                placeholder="e.g. Organic Green Tea"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaFileAlt className="w-4 h-4" /> Description or Campaign Goal
                                            </label>
                                            <textarea
                                                rows="2"
                                                className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                                value={demoInput.description}
                                                onChange={(e) => setDemoInput({ ...demoInput, description: e.target.value })}
                                                placeholder="e.g. Promote wellness, boost morning energy"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaBullseye className="w-4 h-4" /> Target Audience
                                            </label>
                                            <input
                                                className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                                value={demoInput.audience}
                                                onChange={(e) => setDemoInput({ ...demoInput, audience: e.target.value })}
                                                placeholder="e.g. Fitness Enthusiasts"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <FaPaintBrush className="w-4 h-4" /> Tone of Caption
                                            </label>
                                            <input
                                                className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                                value={demoInput.tone}
                                                onChange={(e) => setDemoInput({ ...demoInput, tone: e.target.value })}
                                                placeholder="e.g. Motivational & Fresh"
                                            />
                                        </div>

                                        <LanguageSelector
                                            label="Language Selection"
                                            value={languageData}
                                            onChange={setLanguageData}
                                        />

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                    <PenTool className="w-4 h-4" /> Caption Length
                                                </label>
                                                <div className="flex gap-3">
                                                    {["short", "medium", "long"].map((len) => (
                                                        <label key={len} className="flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="length"
                                                                value={len}
                                                                checked={demoInput.length === len}
                                                                onChange={(e) => setDemoInput({ ...demoInput, length: e.target.value })}
                                                                className="w-4 h-4 text-indigo-600 border-indigo-300 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-sm text-slate-700 capitalize">{len}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Sparkles className="w-4 h-4" /> Hashtag Count
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="30"
                                                    className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                                    value={demoInput.hashtagCount}
                                                    onChange={(e) => setDemoInput({ ...demoInput, hashtagCount: e.target.value })}
                                                    placeholder="e.g. 12"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                                <Share2 className="w-4 h-4" /> Select Platforms (Multiple)
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {PLATFORMS.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleTogglePlatform(p.id)}
                                                        className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${selectedPlatforms.includes(p.id)
                                                                ? "text-white border-transparent shadow-md bg-gradient-to-r from-indigo-500 to-purple-500"
                                                                : "border-indigo-200 text-indigo-400 hover:bg-indigo-50"
                                                            }`}
                                                    >
                                                        {p.icon}
                                                        {p.name}
                                                        {selectedPlatforms.includes(p.id) && " ✓"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

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

                                <div
                                    className={`rounded-3xl overflow-hidden transition-all duration-700 ${generated
                                            ? "bg-white/80 backdrop-blur-md shadow-2xl shadow-indigo-300/30 border border-indigo-200"
                                            : "border-2 border-dashed border-indigo-200 bg-white/50"
                                        }`}
                                >
                                    {!generated && !generating ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                                            <div className="text-7xl mb-5 opacity-20 animate-float">
                                                <Sparkles className="w-16 h-16 text-indigo-300" />
                                            </div>
                                            <p className="text-indigo-400 font-bold text-sm">
                                                Fill in your campaign details
                                                <br />
                                                and click generate to see AI magic! ✨
                                            </p>
                                        </div>
                                    ) : generating ? (
                                        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                                            <div className="relative w-20 h-20 mb-6">
                                                <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
                                                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
                                                <div className="absolute inset-2 rounded-full border-4 border-t-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                                                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                                                    <Sparkles className="w-8 h-8 text-indigo-500" />
                                                </span>
                                            </div>
                                            <p className="font-black text-indigo-700 mb-1">Crafting your perfect captions...</p>
                                            <p className="text-indigo-400 text-xs font-semibold">
                                                Generating for {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-indigo-100">
                                                <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-indigo-500" />
                                                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                                                    Generated for: {demoInput.product || "Custom Subject"}
                                                </span>
                                                <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                    ✓ Ready
                                                </span>
                                            </div>
                                            {errorMessage && (
                                                <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-sm font-semibold">
                                                    {errorMessage}
                                                </div>
                                            )}

                                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                                {selectedPlatforms.map((platform) => {
                                                    const caption = generatedCaptions[platform];
                                                    if (!caption) return null;

                                                    return (
                                                        <div
                                                            key={platform}
                                                            className={`rounded-2xl p-4 border-2 ${getPlatformUI(platform).bg} ${getPlatformUI(platform).border} hover:shadow-lg transition-all`}
                                                        >
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-lg">{getPlatformUI(platform).icon}</span>
                                                                <span className={`text-xs font-black px-2 py-1 rounded-full ${getPlatformUI(platform).tag}`}>
                                                                    {getPlatformUI(platform).label}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleCopyCaptionForPlatform(platform)}
                                                                    className={`ml-auto w-8 h-8 rounded-lg transition border-0 flex items-center justify-center ${getPlatformUI(platform).tag} hover:shadow-sm`}
                                                                    aria-label={`Copy ${getPlatformUI(platform).label} caption`}
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
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
                                                                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-current border-opacity-20 bg-white/50 focus:outline-none focus:bg-white transition"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRefineCaption(platform)}
                                                                        disabled={refiningPlatform === platform}
                                                                        className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1"
                                                                    >
                                                                        {refiningPlatform === platform ? (
                                                                            <Loader />
                                                                        ) : (
                                                                            <>
                                                                                <RotateCcw size={12} />
                                                                                Refine
                                                                            </>
                                                                        )}
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
                                                        const allText = selectedPlatforms
                                                            .map((platform) => {
                                                                const caption = generatedCaptions[platform];
                                                                if (!caption) return "";
                                                                return `${getPlatformUI(platform).label}:\n${caption.caption}\n${caption.hashtags.join(" ")}`;
                                                            })
                                                            .filter(Boolean)
                                                            .join("\n\n---\n\n");
                                                        navigator.clipboard.writeText(allText);
                                                        toast.success("All captions copied!");
                                                    }}
                                                    className="w-full text-white font-black py-3 rounded-2xl mt-4 text-sm hover:-translate-y-1 transition-all shadow-lg relative overflow-hidden flex items-center justify-center gap-2"
                                                    style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)" }}
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
