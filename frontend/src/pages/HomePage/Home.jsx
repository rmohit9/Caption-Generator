import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// flavor icons and heart shape icons
import { FaStar, FaHeart, FaBrain, FaFire, FaChartBar, FaBullseye, FaRecycle, FaShoppingBag, FaPaintBrush, FaRobot, FaFileAlt, FaRuler } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";

// social icons
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FloatingHashSymbols from "../../components/Hashtag";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

// lucide react icons
import {
  Rocket,
  Play,
  Copy,
  Heart,
  Save,
  Share2,
  Zap,
  PenTool,
  Sparkles,
  FileText,
  Rocket as RocketLaunch,
} from "lucide-react";

import Stats from "../../components/HomeComponents/Stats";

// steps icons (using lucide)
const HiOutlineLightBulb = () => <PenTool className="w-6 h-6" />;
const HiOutlineSparkles = () => <Sparkles className="w-6 h-6" />;
const HiOutlineDocumentText = () => <FileText className="w-6 h-6" />;
const HiOutlineRocketLaunch = () => <RocketLaunch className="w-6 h-6" />;

const CAPTIONS = {
  instagram: {
    text: "🌿 Refresh your mornings with nature's purest energy! Every sip of our Organic Green Tea ignites your metabolism, sharpens your focus & brings calm to your hustle. Your wellness journey starts in a cup. ✨☕",
    hashtags: [
      "#GreenTeaLover",
      "#HealthyHabits",
      "#WellnessJourney",
      "#OrganicLiving",
      "#FitnessFuel",
      "#MorningRitual",
      "#CleanEnergy",
      "#NaturalWellness",
    ],
    score: 94,
    icon: <FaInstagram className="text-orange-500" />,
    label: "Instagram",
    bg: "bg-orange-50",
    border: "border-orange-200",
    tag: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  linkedin: {
    text: "Health starts with mindful choices. Our Organic Green Tea blends premium wellness with everyday productivity - because peak performance begins before the boardroom. Make the switch that matters. 💼🍃",
    hashtags: [
      "#Productivity",
      "#SustainableLiving",
      "#WellnessAtWork",
      "#MindfulLeadership",
      "#HealthyProfessionals",
      "#GreenTea",
    ],
    score: 87,
    icon: <FaLinkedin className="text-blue-600" />,
    label: "LinkedIn",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  twitter: {
    text: "Fuel your focus & fitness with Organic Green Tea 🍵⚡ Zero crash. All energy. All natural. Your mornings just got a serious upgrade. 🌱",
    hashtags: [
      "#GreenTea",
      "#MorningRoutine",
      "#FitnessMotivation",
      "#HealthyLiving",
      "#CleanEnergy",
    ],
    score: 91,
    icon: <FaXTwitter className="text-black" />,
    label: "Twitter/X",
    bg: "bg-sky-50",
    border: "border-sky-200",
    tag: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },
  facebook: {
    text: "Fresh content crafted to connect with your community. Share moments, spark conversations, and grow your reach.",
    hashtags: ["#FacebookMarketing", "#Community", "#Engagement", "#SocialMedia"],
    score: 90,
    icon: <FaFacebook className="text-blue-600" />,
    label: "Facebook",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    tag: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
};

const FEATURES = [
  {
    icon: <FaBrain className="w-4 h-4" />,
    title: "Client Workspaces",
    desc: "Organize brands, clients, and projects into isolated workspaces effortlessly.",
    color: "bg-[#f08a5d]",
  },
  {
    icon: <FaFire className="w-4 h-4" />,
    title: "Preset Brand Profiles",
    desc: "Save audience, tone, and formatting settings as profiles. Never type it twice.",
    color: "bg-[#f08a5d]",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Multi-Platform Campaigns",
    desc: "Generate tailored captions for 4 platforms from a single product prompt instantly.",
    color: "bg-[#f08a5d]",
  },
  {
    icon: <FaChartBar className="w-4 h-4" />,
    title: "Engagement Scoring",
    desc: "Every post gets a real-time AI engagement score before you publish.",
    color: "bg-[#f08a5d]",
  },
  {
    icon: <FaBullseye className="w-4 h-4" />,
    title: "Audience Targeting",
    desc: "Captions crafted for your exact demographic — age, interest & behavior.",
    color: "bg-[#f08a5d]",
  },
  {
    icon: <FaRecycle className="w-4 h-4" />,
    title: "Content Repurposing",
    desc: "Turn one idea into platform-native posts automatically with one click.",
    color: "bg-[#f08a5d]",
  },
];

const STEPS = [
  {
    num: "01",
    icon: <HiOutlineLightBulb />,
    title: "Create a Workspace",
    desc: "Start by creating a workspace to keep your brands or clients perfectly organized.",
  },
  {
    num: "02",
    icon: <HiOutlineDocumentText />,
    title: "Setup Brand Profiles",
    desc: "Define the brand's tone, audience, and hashtag preferences. Save it for later.",
  },
  {
    num: "03",
    icon: <HiOutlineSparkles />,
    title: "Launch a Campaign",
    desc: "Input your product details, pick your platforms, and let our AI do the heavy lifting.",
  },
  {
    num: "04",
    icon: <HiOutlineRocketLaunch />,
    title: "Publish & Grow",
    desc: "Export platform-optimized captions instantly and watch your engagement soar.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Social Media Manager @ PixelAgency",
    avatar: "PS",
    text: "The Workspaces feature is a lifesaver. We currently manage 5 distinct brands and switching between their Brand Profiles is perfectly seamless and fast.",
    stars: 5,
  },
  {
    name: "Marcus Cole",
    role: "Founder @ FitLife Brand",
    avatar: "MC",
    text: "Being able to run a Campaign and get 4 unique platform captions in one click has reduced my workflow from two hours down to seconds.",
    stars: 5,
  },
  {
    name: "Ananya Verma",
    role: "Content Lead @ TrendPulse",
    avatar: "AV",
    text: "The tone adaptation is brilliant. Our saved Brand Profile ensures LinkedIn captions sound professional while Instagram captions stay fun.",
    stars: 5,
  },
];

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <FaInstagram />,
    detail: "Carousel · Reels · Stories",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <FaLinkedin />,
    detail: "Posts · Articles · Thought Leadership",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: <FaXTwitter />,
    detail: "Tweets · Threads · Spaces",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FaFacebook />,
    detail: "Posts · Groups · Stories",
  },
];

function TypewriterText({ texts }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  const current = texts[idx];

  useEffect(() => {
    let timeout;

    if (!deleting && displayed.length < current.text.length) {
      timeout = setTimeout(
        () => setDisplayed(current.text.slice(0, displayed.length + 1)),
        65
      );
    } else if (!deleting && displayed.length === current.text.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, texts, current]);

  return (
    <span className="inline-flex items-center gap-2 text-[#f08a5d] font-semibold">
      {current.icon}
      {displayed}
      <span className="animate-pulse text-[#f08a5d]">|</span>
    </span>
  );
}

function FloatingParticle({ style, icon }) {
  return (
    <div
      className="absolute pointer-events-none select-none opacity-10 text-3xl animate-float"
      style={style}
    >
      {icon}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("instagram");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [demoInput, setDemoInput] = useState({
    product: "Organic Green Tea",
    description: "Promote natural energy and wellness",
    audience: "Fitness Enthusiasts",
    tone: "Motivational & Fresh",
    length: "Medium",
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState("instagram");
  const [activePlatform, setActivePlatform] = useState(null);
  const [likedCards, setLikedCards] = useState({});
  const [savedHashtags, setSavedHashtags] = useState([]);
  const heroRef = useRef(null);

  const active = CAPTIONS[activeTab];

  const handleCopy = () => {
    const current = generatedCaptions[activeTab] || active;
    if (!current) return;
    navigator.clipboard.writeText(current.text + "\n\n" + current.hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCTAClick = () => {
    if (localStorage.getItem("access")) {
      navigate("/generator");
    } else {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getGuestToken = () => {
    const key = "guest_token";
    let token = localStorage.getItem(key);
    if (!token && window.crypto?.randomUUID) {
      token = window.crypto.randomUUID();
      localStorage.setItem(key, token);
    }
    return token;
  };

  const handleGenerate = async () => {
    setErrorMessage("");
    if (!selectedPlatforms) {
      setErrorMessage("Please select a platform.");
      return;
    }

    setGenerating(true);
    setGenerated(false);

    const platform = selectedPlatforms;
    const captionType = demoInput.tone || "Motivational";
    const topicParts = [
      demoInput.product,
      demoInput.description,
      demoInput.audience && `Audience: ${demoInput.audience}`,
      demoInput.length && `Length: ${demoInput.length}`,
    ].filter(Boolean);
    const topic = topicParts.join(". ");

    try {
      const token = getGuestToken();
      const res = await api.post(
        "generate-caption/",
        {
          platforms: [platform],
          caption_type: captionType,
          topic,
        },
        {
          headers: token ? { "X-Guest-Token": token } : {},
        }
      );

      const platformResult = res.data?.results?.[platform] || {};
      const caption = platformResult.caption || "";
      const hashtags = Array.isArray(platformResult.hashtags) ? platformResult.hashtags : [];
      const safeHashtags = hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`));

      const base = CAPTIONS[platform] || CAPTIONS.instagram;
      setGeneratedCaptions((prev) => ({
        ...prev,
        [platform]: {
          ...base,
          text: caption || base.text,
          hashtags: safeHashtags.length ? safeHashtags : base.hashtags,
          score: base.score,
        },
      }));

      setGenerated(true);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        "Generation failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setGenerating(false);
    }
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => prev === id ? null : id);
  };

  const toggleHashtag = (tag) => {
    setSavedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((h) => h !== tag) : [...prev, tag]
    );
  };

  const toggleLike = (key) =>
    setLikedCards((prev) => ({ ...prev, [key]: !prev[key] }));

  const socialTexts = [
    { icon: <FaInstagram className="text-[#f08a5d]" />, text: "Instagram" },
    { icon: <FaLinkedin className="text-blue-600" />, text: "LinkedIn" },
    { icon: <FaXTwitter className="text-black" />, text: "Twitter / X" },
    { icon: <FaFacebook className="text-blue-500" />, text: "Facebook" },
  ];

  const handleCopyAll = () => {
    const selectedCaptions = Object.entries(CAPTIONS)
      .filter(([key]) => selectedPlatforms.includes(key))
      .map(([key, val]) => {
        const current = generatedCaptions[key] || val;
        return current.text + "\n\n" + current.hashtags.join(" ");
      })
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(selectedCaptions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#fff7ed",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .poppins-heading { font-family: 'Poppins', sans-serif; font-weight: 500; }
        .poppins-heading-hero { font-family: 'Poppins', sans-serif; font-weight: 500; }

        @keyframes floatY { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes floatX { 0%,100%{transform:translateX(0px)} 50%{transform:translateX(10px)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(240,138,93,0.4)} 70%{box-shadow:0 0 0 20px rgba(240,138,93,0)} 100%{box-shadow:0 0 0 0 rgba(240,138,93,0)} }
        @keyframes shimmer-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .animate-float { animation: floatY 6s ease-in-out infinite; }
        .animate-float-x { animation: floatX 5s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .animate-scale-in { animation: scaleIn 0.5s ease both; }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.455,0.03,0.515,0.955) infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmer-move 2s infinite;
        }
      `}</style>

      <FloatingHashSymbols count={100} opacity={0.1} />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute -bottom-20 right-1/3 w-96 h-64 bg-orange-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-4 z-10"
      >
        {/* Headline */}
        <h1
          className="poppins-heading-hero text-center leading-none tracking-tight mb-4 sm:mb-6 animate-fade-up relative z-10"
          style={{ fontSize: "clamp(1.8rem, 6.5vw, 4.8rem)" }}
        >
          <span className="text-slate-800">Create </span>
          <span className="text-[#f08a5d]">Viral Captions</span>
          <br />
          <span className="text-slate-800">&amp; </span>
          <span className="text-[#f08a5d]">Hashtags</span>
          <span className="text-slate-800"> in </span>
          <span className="relative inline-block">
            <span className="text-[#f08a5d]">3 Seconds</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 8 Q75 2, 150 8 Q225 14, 298 8"
                stroke="#f08a5d"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </span>
        </h1>

        <p
          className="text-center text-slate-600 font-light text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 mb-6 sm:mb-8 animate-fade-up relative z-10"
          style={{ animationDelay: "0.2s" }}
        >
          Instantly generate platform-optimized posts for{" "}
          <span className="font-normal inline-block align-middle">
            <TypewriterText texts={socialTexts} />
          </span>
        </p>

        {/* CTA */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-8 sm:mb-12 animate-fade-up relative z-10"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={handleCTAClick}
            className="relative overflow-hidden flex items-center gap-2 text-white font-normal px-6 py-3 rounded-full shadow-2xl shadow-[#f08a5d]/30 transition-all duration-300 shimmer-btn text-base bg-[#f08a5d] hover:bg-[#d97346] hover:-translate-y-1 hover:shadow-[#f08a5d]/40"
          >
            Generate Free
          </button>
        </div>

        {/* Interactive Demo Card */}
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-[#f08a5d] blur-3xl opacity-20 rounded-3xl" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-2xl shadow-orange-200/30">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-100">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 p-4 sm:p-5 rounded-xl bg-orange-50 border border-orange-100 text-sm text-slate-700">
                {active.text}
              </div>

              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {active.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-normal rounded-full border border-orange-200 text-orange-700 hover:bg-orange-100 transition cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-normal text-white bg-[#f08a5d] rounded-xl shadow-md flex items-center gap-1">
            <Zap size={14} />
            3s Generation
          </div>
        </div>
      </section>

      <Stats />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative py-14 px-4 z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-5 py-2 mb-5 shadow-sm border border-orange-100">
              <span className="text-xs font-normal tracking-widest uppercase text-orange-600">
                How It Works
              </span>
            </div>
            <h2
              className="poppins-heading leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">From Idea to </span>
              <span className="text-[#f08a5d]">
                Viral Post
              </span>
              <br />
              <span className="text-slate-800">in 4 Simple Steps</span>
            </h2>
            <p className="text-slate-600 text-base max-w-lg mx-auto">
              No complicated tools. No learning curve. Just simple AI-powered
              content creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="relative bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default group border border-orange-50"
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#f08a5d]/10" />
                <div className="relative">
                  <div className="flex justify-between items-center">
                    <div className="text-6xl font-normal text-slate-100 mb-4 group-hover:text-[#f08a5d]/30 transition-colors">
                      {s.num}
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f08a5d] text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="poppins-heading text-base text-slate-800 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="relative py-14 px-4 z-10">
        <div className="absolute inset-0 bg-orange-50/50" />
        <motion.div
          className="max-w-6xl mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-orange-200 rounded-full px-5 py-2 mb-5 shadow-md">
              <span className="text-xs font-normal tracking-widest uppercase text-orange-600">
                Try It Live
              </span>
            </div>
            <h2
              className="poppins-heading leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">See the </span>
              <span className="text-[#f08a5d]">
                AI Magic
              </span>
              <span className="text-slate-800"> Happen</span>
            </h2>
            <p className="text-slate-600 text-base font-light max-w-md mx-auto">
              Fill in your details and watch captions appear live.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Input */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-orange-200/30 border border-orange-100">
              <h3 className="poppins-heading text-base text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-[#f08a5d] text-white">
                  <PenTool size={16} />
                </span>
                Campaign Details
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Product / Brand Name",
                    key: "product",
                    placeholder: "e.g. Organic Green Tea",
                    icon: <FaShoppingBag className="w-4 h-4" />,
                  },
                  {
                    label: "Description or Campaign Goal",
                    key: "description",
                    placeholder: "e.g. Promote wellness, boost morning energy",
                    icon: <FaFileAlt className="w-4 h-4" />,
                  },
                  {
                    label: "Target Audience",
                    key: "audience",
                    placeholder: "e.g. Fitness Enthusiasts",
                    icon: <FaBullseye className="w-4 h-4" />,
                  },
                  {
                    label: "Tone of Caption",
                    key: "tone",
                    placeholder: "e.g. Motivational & Fresh",
                    icon: <FaPaintBrush className="w-4 h-4" />,
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-normal text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      {f.icon} {f.label}
                    </label>
                    <input
                      className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-normal placeholder-slate-400 bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-[#f08a5d]/30 transition"
                      value={demoInput[f.key]}
                      onChange={(e) => setDemoInput({ ...demoInput, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-normal text-[#f08a5d] mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" /> Select Platforms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS
                      .filter(p => ["instagram", "linkedin", "twitter", "facebook"].includes(p.id))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`flex items-center gap-1.5 text-xs font-normal px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${selectedPlatforms === p.id
                            ? "text-white border-transparent shadow-md bg-[#f08a5d]"
                            : "border-orange-200 text-orange-400 hover:bg-orange-50"
                            }`}
                        >
                          {p.icon}
                          {p.name}
                          {selectedPlatforms === p.id && " ✓"}
                        </button>
                      ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="relative overflow-hidden w-full text-white font-normal py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 
                  transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn bg-[#f08a5d] hover:bg-[#d97346]"
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
                {errorMessage && (
                  <p className="mt-3 text-sm font-normal text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Output */}
            <div
              className={`rounded-3xl overflow-hidden transition-all duration-700 ${generated
                ? "bg-white/80 backdrop-blur-md shadow-2xl shadow-[#f08a5d]/20 border border-[#d97346]"
                : "border-2 border-dashed border-[#d97346] bg-white/50"
                }`}
            >
              {!generated && !generating ? (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="text-7xl mb-5 opacity-20 animate-float">
                    <FaRobot className="w-16 h-16 text-[#f08a5d]" />
                  </div>
                  <p className="text-[#f08a5d]/60 font-normal text-sm">
                    Fill in your campaign details
                    <br />
                    and click generate to see AI magic! ✨
                  </p>
                </div>
              ) : generating ? (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-[#d97346]" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#f08a5d] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-t-[#d97346] animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">
                      <Sparkles className="w-8 h-8 text-[#f08a5d]" />
                    </span>
                  </div>
                  <p className="font-normal text-[#f08a5d] mb-1">
                    Crafting your perfect captions...
                  </p>
                  <p className="text-[#d97346]/70 text-xs font-normal">
                    Analyzing audience, tone & trending hashtags
                  </p>
                  <div className="mt-4 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce bg-[#f08a5d]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#d97346]">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#f08a5d]" />
                    <span className="text-xs font-normal text-[#f08a5d] uppercase tracking-wider">
                      Generated for: {demoInput.product}
                    </span>
                    <span className="ml-auto text-xs font-normal text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      ✓ Ready
                    </span>
                  </div>
                  {Object.entries(CAPTIONS)
                    .filter(([key]) => selectedPlatforms.includes(key))
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className={`mb-3 rounded-2xl p-4 border-2 ${val.bg} ${val.border} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group`}
                      >
                        {(() => {
                          const current = generatedCaptions[key] || val;
                          return (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">{current.icon}</span>
                                <span
                                  className={`text-xs font-normal capitalize px-2 py-0.5 rounded-full ${current.tag}`}
                                >
                                  {current.label}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-normal mb-2">
                                {val.text}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {val.hashtags.map((h) => (
                                  <span
                                    key={h}
                                    className={`text-xs ${current.tag} px-2 py-0.5 rounded-full font-normal`}
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ))}
                  <button
                    onClick={handleCopyAll}
                    className="w-full text-white font-normal py-3 rounded-2xl mt-2 text-sm hover:-translate-y-1 transition-all shadow-lg shimmer-btn 
                    relative overflow-hidden bg-[#f08a5d] hover:bg-[#d97346]"
                  >
                    {copied ? "✓ Copied to Clipboard!" : "Copy All Selected Captions & Hashtags"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="relative py-20 px-4 z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-5 py-2 mb-5 border border-orange-100">
              <span className="text-xs font-normal tracking-widest uppercase text-orange-600">
                Features
              </span>
            </div>
            <h2
              className="poppins-heading leading-tight"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">Everything to </span>
              <span className="text-[#f08a5d]">
                Dominate Social
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default group border border-orange-50"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${f.color} text-white`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="poppins-heading text-base text-slate-800 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms" className="relative py-14 px-4 z-10" >
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundColor: "rgba(255,247,237,0.9)", // orange-50 slightly transparent
          }}
        />
        <motion.div
          className="max-w-5xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass-orange rounded-full px-5 py-2 mb-5">
            <span
              className="text-xs font-normal tracking-widest uppercase text-[#f08a5d]"
            >
              Platforms
            </span>
          </div>

          <h2
            className="poppins-heading leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
          >
            <span className="text-slate-800">One Tool. </span>
            <span className="text-[#f08a5d]">Every Platform.</span>
          </h2>

          <p className="text-slate-800 text-base font-light max-w-lg mx-auto mb-14">
            Graphura AI understands the language, format & algorithm of every major
            platform.
          </p>

          {/* FIX: Changed grid to 1 col on mobile, 2 cols on tablet, 2 cols on desktop to create a perfect 2x2 square for 4 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PLATFORMS.map((p, i) => (
              <div
                key={p.name}
                className={`relative rounded-3xl p-[1px] transition-all duration-500 cursor-pointer group
                   ${activePlatform === p.name
                    ? "bg-[#f08a5d] scale-105"
                    : "bg-orange-200/40 hover:bg-[#f08a5d] hover:scale-105"
                  }`}
              >
                {/* Card */}
                <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl p-7 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">

                    {/* Icon */}
                    <div className="text-4xl text-[#f08a5d] mb-4 group-hover:scale-1.15 group-hover:-rotate-6 transition-all duration-300">
                      {p.icon}
                    </div>

                    {/* Name */}
                    <h3 className="poppins-heading text-[#f08a5d] text-base mb-1 tracking-wide">
                      {p.name}
                    </h3>

                    {/* Detail */}
                    <p className="text-xs text-[#d97346] font-semibold">
                      {p.detail}
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-14 px-4 z-10" style={{ backgroundColor: "#f08a5d" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <motion.div
          className="max-w-6xl mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-5">
              <span className="text-xs font-normal tracking-widest uppercase text-white">Testimonials</span>
            </div>
            <h2 className="poppins-heading text-white leading-tight" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
              Loved by <span className="text-yellow-300">10,000+</span> Marketers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="hover-lift bg-white/15 backdrop-blur-xl border border-white/25 rounded-3xl p-7 group cursor-default">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <span key={j} className="text-yellow-300 text-sm group-hover:scale-110 transition-transform" style={{ transitionDelay: `${j * 50}ms` }}>⭐</span>)}
                </div>
                <p className="text-white/85 text-sm leading-relaxed mb-6 font-medium">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-normal text-white shadow-lg`} style={{ backgroundColor: "#d97346" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-normal text-sm">{t.name}</div>
                    <div className="text-orange-200 text-xs font-semibold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA BANNER*/}
      <section className="relative py-14 px-4 z-10 overflow-hidden">
        {/* Subtle background pattern with floating hashtags */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-10 left-1/4 text-8xl font-black text-orange-600 rotate-12">#</div>
          <div className="absolute bottom-20 right-1/3 text-9xl font-black text-amber-500 -rotate-12">#</div>
          <div className="absolute top-40 right-1/4 text-7xl font-black text-yellow-400 rotate-45">#</div>
          <div className="absolute bottom-10 left-1/3 text-8xl font-black text-orange-300 -rotate-6">#</div>
          <div className="absolute top-1/2 left-10 text-8xl font-black text-amber-300 rotate-90">#</div>
        </div>

        {/* Soft solid overlay instead of gradient */}
        <div className="absolute inset-0 bg-white/70" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >

          {/* Headline */}
          <h2 className="poppins-heading text-slate-800 leading-tight mb-4 text-4xl md:text-5xl lg:text-6xl">
            Start Creating Viral Content
            <br />
            Today – <span className="text-[#f08a5d]">It's Free</span>
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 font-light">
            Join <span className="font-normal text-[#f08a5d]">10,000+ marketers</span> saving 80% of their content creation time with Graphura AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className="relative overflow-hidden flex items-center gap-2 text-white font-normal px-6 py-3 rounded-full shadow-2xl shadow-[#f08a5d]/30 transition-all duration-300 shimmer-btn text-base bg-[#f08a5d] hover:bg-[#d97346] hover:-translate-y-1 hover:shadow-[#f08a5d]/40">
              Generate Free
            </button>

          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}