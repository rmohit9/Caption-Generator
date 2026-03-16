import React, { useState } from "react";
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

// Platform definitions (same as in Home)
const PLATFORMS = [
    { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "from-pink-400 to-rose-500" },
    { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "from-blue-500 to-cyan-500" },
    { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "from-sky-400 to-cyan-400" },
    { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "from-indigo-500 to-blue-500" },
];

// Fallback caption data for UI structure
const getPlatformUI = (platform) => {
    const mockUI = {
        instagram: {
            icon: <FaInstagram className="text-pink-500" />,
            label: "Instagram",
            bg: "bg-gradient-to-br from-pink-50 to-rose-50",
            border: "border-pink-200",
            tag: "bg-pink-100 text-pink-600",

        },
        linkedin: {
            icon: <FaLinkedin className="text-blue-600" />,
            label: "LinkedIn",
            bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
            border: "border-blue-200",
            tag: "bg-blue-100 text-blue-600",

        },
        twitter: {
            icon: <FaTwitter className="text-black" />,
            label: "Twitter/X",
            bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
            border: "border-sky-200",
            tag: "bg-sky-100 text-sky-600",

        },
        facebook: {
            icon: <FaFacebook className="text-blue-500" />,
            label: "Facebook",
            bg: "bg-gradient-to-br from-indigo-50 to-blue-50",
            border: "border-indigo-200",
            tag: "bg-indigo-100 text-indigo-600",
        },
    };
    return mockUI[platform] || mockUI.instagram;
};

const Generator = () => {
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram"]);
    const [demoInput, setDemoInput] = useState({
        product: "Organic Green Tea",
        description: "Promote natural energy and wellness",
        audience: "Fitness Enthusiasts",
        tone: "Motivational & Fresh",
        length: "medium",
    });
    const [generatedCaptions, setGeneratedCaptions] = useState({});
    const [refiningPlatform, setRefiningPlatform] = useState(null);
    const [refinePrompts, setRefinePrompts] = useState({});
    const [copiedPlatform, setCopiedPlatform] = useState(null);

    const handleTogglePlatform = (platformId) => {
        setSelectedPlatforms((prev) => {
            if (prev.includes(platformId)) {
                return prev.filter((p) => p !== platformId);
            } else {
                return [...prev, platformId];
            }
        });
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
            const topicParts = [
                demoInput.product,
                demoInput.description,
                demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`,
            ].filter(Boolean);

            const responses = await Promise.all(
                selectedPlatforms.map((platform) =>
                    api.post("generate-caption/", {
                        platform: platform,
                        caption_type: demoInput.tone,
                        topic: topicParts.join(". "),
                    })
                )
            );

            const captions = {};
            responses.forEach((response, index) => {
                const platform = selectedPlatforms[index];
                const hashtags = Array.isArray(response.data.hashtags)
                    ? response.data.hashtags
                    : [];
                captions[platform] = {
                    caption: response.data.caption,
                    hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
                };
            });

            setGeneratedCaptions(captions);
            setRefinePrompts({});
            setGenerated(true);
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
            const topicParts = [
                demoInput.product,
                demoInput.description,
                demoInput.audience && `Audience: ${demoInput.audience}`,
                demoInput.length && `Length: ${demoInput.length}`,
                `Refinement: ${refinePrompts[platform]}`,
            ].filter(Boolean);

            const response = await api.post("generate-caption/", {
                platform: platform,
                caption_type: demoInput.tone,
                topic: topicParts.join(". "),
            });

            const hashtags = Array.isArray(response.data.hashtags)
                ? response.data.hashtags
                : [];

            setGeneratedCaptions((prev) => ({
                ...prev,
                [platform]: {
                    caption: response.data.caption,
                    hashtags: hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
                },
            }));

            setRefinePrompts((prev) => ({
                ...prev,
                [platform]: "",
            }));

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
        setCopiedPlatform(platform);
        setTimeout(() => setCopiedPlatform(null), 2000);
        toast.success("Copied to clipboard!");
    };

    const handleNewChat = () => {
        setDemoInput({
            product: "",
            description: "",
            audience: "",
            tone: "",
            length: "medium",
        });
        setSelectedPlatforms([]);
        setGeneratedCaptions({});
        setRefinePrompts({});
        setGenerated(false);
        setErrorMessage("");
        toast.success("Ready for a new caption!");
    };

    return (
        <div>
            <div
                className="min-h-screen flex"
                style={{
                    background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)",
                }}
            >
                {/* History Sidebar (self‑contained responsive) */}
                <GeneratorSidebar onNewChat={handleNewChat} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen overflow-y-auto lg:ml-[319.2px] md:ml-[319.2px]">
                    {/* Header with back link */}
                    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-indigo-100 px-6 py-3 flex items-center">
                        <h1 className="text-xl font-black text-indigo-800">Caption Generator</h1>
                        <div className="ml-auto flex items-center gap-3">
                            <Link
                                to="/"
                                className="text-sm text-indigo-600 hover:underline hidden sm:block"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>

                    {/* Main Generator Area */}
                    <div className="flex-1 p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Input Form */}
                                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-indigo-200/30 border border-indigo-100">
                                    <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                            <PenTool size={16} />
                                        </span>
                                        Campaign Details
                                    </h3>
                                    <div className="space-y-5">
                                        {/* Product */}
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

                                        {/* Description */}
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

                                        {/* Audience */}
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

                                        {/* Tone */}
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

                                        {/* Length Preference */}
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

                                        {/* Platforms */}
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

                                        {/* Generate Button */}
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

                                {/* Output */}
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
                                                    Generated for: {demoInput.product}
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

                                            {/* Captions for each platform */}
                                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                                {selectedPlatforms.map((platform) => {
                                                    const caption = generatedCaptions[platform];
                                                    if (!caption) return null;

                                                    return (
                                                        <div
                                                            key={platform}
                                                            className={`rounded-2xl p-4 border-2 ${getPlatformUI(platform).bg} ${getPlatformUI(platform).border} hover:shadow-lg transition-all`}
                                                        >
                                                            {/* Platform Header */}
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-lg">{getPlatformUI(platform).icon}</span>
                                                                <span className={`text-xs font-black px-2 py-1 rounded-full ${getPlatformUI(platform).tag}`}>
                                                                    {getPlatformUI(platform).label}
                                                                </span>
                                                            </div>

                                                            {/* Caption Text */}
                                                            <p className="text-sm text-slate-700 font-medium mb-2">{caption.caption}</p>

                                                            {/* Hashtags */}
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

                                                            {/* Refinement Section */}
                                                            <div className="space-y-2 pt-3 border-t border-current border-opacity-10">
                                                                <div className="flex gap-2">
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
                                                                        className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-current border-opacity-20 bg-white/50 focus:outline-none focus:bg-white transition"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRefineCaption(platform)}
                                                                        disabled={refiningPlatform === platform}
                                                                        className="px-2 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md transition disabled:opacity-50 flex items-center gap-1"
                                                                    >
                                                                        <RotateCcw size={12} />
                                                                        {refiningPlatform === platform ? "Refining..." : "Refine"}
                                                                    </button>
                                                                </div>

                                                                {/* Copy & actions */}
                                                                <button
                                                                    onClick={() => handleCopyCaptionForPlatform(platform)}
                                                                    className="w-full text-xs font-bold py-1.5 rounded-lg bg-white/60 hover:bg-white transition border border-current border-opacity-20"
                                                                >
                                                                    <Copy size={12} className="inline mr-1" />
                                                                    {copiedPlatform === platform ? "Copied!" : "Copy"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Copy All Button */}
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