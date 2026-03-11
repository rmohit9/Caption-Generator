import { useState, useEffect, useRef } from "react";

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
    icon: <FaInstagram className="text-pink-500" />,
    label: "Instagram",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
    border: "border-indigo-200",
    tag: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  linkedin: {
    text: "Health starts with mindful choices. Our Organic Green Tea blends premium wellness with everyday productivity — because peak performance begins before the boardroom. Make the switch that matters. 💼🍃",
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
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
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
    gradient: "from-sky-500 via-cyan-400 to-teal-400",
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
    border: "border-sky-200",
    tag: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },
};

const FEATURES = [
  {
    icon: <FaBrain className="w-6 h-6" />,
    title: "AI-Powered Captions",
    desc: "GPT-grade copy tailored to your brand voice, audience & platform in seconds.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <FaFire className="w-6 h-6" />,
    title: "Trending Hashtags",
    desc: "Algorithmically sourced hashtags that maximize reach and discoverability.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <FaChartBar className="w-6 h-6" />,
    title: "Engagement Scoring",
    desc: "Every post gets a real-time AI engagement score before you publish.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <FaBullseye className="w-6 h-6" />,
    title: "Audience Targeting",
    desc: "Captions crafted for your exact demographic — age, interest & behavior.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Generation",
    desc: "Generate 6 platform-ready posts simultaneously in under 3 seconds.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: <FaRecycle className="w-6 h-6" />,
    title: "Content Repurposing",
    desc: "Turn one idea into 6 platform-native posts automatically. One click.",
    color: "from-indigo-500 to-purple-600",
  },
];

const STEPS = [
  {
    num: "01",
    icon: <HiOutlineLightBulb />,
    title: "Share Your Idea",
    desc: "Tell the AI what you want to post about. Just a simple topic or idea is enough.",
  },
  {
    num: "02",
    icon: <HiOutlineSparkles />,
    title: "AI Creates Content",
    desc: "Our AI instantly generates engaging captions and post ideas optimized for reach.",
  },
  {
    num: "03",
    icon: <HiOutlineDocumentText />,
    title: "Customize & Refine",
    desc: "Adjust tone, add hashtags, or tweak the content to perfectly match your style.",
  },
  {
    num: "04",
    icon: <HiOutlineRocketLaunch />,
    title: "Publish & Grow",
    desc: "Share your post and watch your engagement grow with AI-optimized content.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Social Media Manager @ PixelAgency",
    avatar: "PS",
    text: "HashCraft AI cut our caption writing time by 80%. The hashtag suggestions are scary accurate — our reach doubled in 2 weeks!",
    stars: 5,
    color: "from-indigo-400 to-purple-500",
  },
  {
    name: "Marcus Cole",
    role: "Founder @ FitLife Brand",
    avatar: "MC",
    text: "I used to spend 2 hours per post. Now it's 3 minutes. The engagement scores are genuinely predictive — absolute game changer.",
    stars: 5,
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Ananya Verma",
    role: "Content Lead @ TrendPulse",
    avatar: "AV",
    text: "The platform-specific tone adjustment is insane. LinkedIn sounds professional, Instagram sounds fun. It just gets it!",
    stars: 5,
    color: "from-purple-400 to-pink-500",
  },
];

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <FaInstagram />,
    detail: "Carousel · Reels · Stories",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <FaLinkedin />,
    detail: "Posts · Articles · Thought Leadership",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: <FaXTwitter />,
    detail: "Tweets · Threads · Spaces",
    color: "from-sky-400 to-cyan-400",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <FaFacebook />,
    detail: "Posts · Groups · Stories",
    color: "from-indigo-500 to-blue-500",
  },
  // {
  //   id: "tiktok",
  //   name: "TikTok",
  //   icon: <FaTiktok />,
  //   detail: "Video Captions · Bio · Comments",
  //   color: "from-purple-500 to-fuchsia-500",
  // },
  {
    id: "youtube",
    name: "YouTube",
    icon: <FaYoutube />,
    detail: "Titles · Descriptions · Tags",
    color: "from-red-500 to-rose-500",
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
    <span className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold">
      {current.icon}
      {displayed}
      <span className="animate-pulse text-indigo-400">|</span>
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
  const [activeTab, setActiveTab] = useState("instagram");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
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
    navigator.clipboard.writeText(active.text + "\n\n" + active.hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2400);
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

  const particles = [
    {
      icon: <GiSparkles />,
      style: { top: "8%", left: "5%", animationDelay: "0s" },
    },
    {
      icon: <FaStar />,
      style: { top: "15%", right: "8%", animationDelay: "0.5s" },
    },
    {
      icon: <Sparkles />,
      style: { top: "35%", left: "2%", animationDelay: "1s" },
    },
    {
      icon: <FaStar />,
      style: { top: "60%", right: "3%", animationDelay: "1.5s" },
    },
    {
      icon: <FaHeart />,
      style: { bottom: "20%", left: "6%", animationDelay: "0.8s" },
    },
    {
      icon: <FaHeart />,
      style: { bottom: "10%", right: "10%", animationDelay: "0.3s" },
    },
    {
      icon: <GiSparkles />,
      style: { top: "45%", right: "7%", animationDelay: "2s" },
    },
    {
      icon: <Sparkles />,
      style: { top: "75%", left: "4%", animationDelay: "1.2s" },
    },
  ];

  const socialTexts = [
    { icon: <FaInstagram className="text-pink-500" />, text: "Instagram" },
    { icon: <FaLinkedin className="text-blue-600" />, text: "LinkedIn" },
    { icon: <FaXTwitter className="text-black" />, text: "Twitter / X" },
    // { icon: <FaTiktok className="text-black" />, text: "TikTok" },
    { icon: <FaFacebook className="text-blue-500" />, text: "Facebook" },
    { icon: <FaYoutube className="text-red-500" />, text: "YouTube" },
  ];

  // Map platform id to caption key (only those we have data for)
  const captionKeys = {
    instagram: "instagram",
    linkedin: "linkedin",
    twitter: "twitter",
  };

  const handleCopyAll = () => {
    const selectedCaptions = Object.entries(CAPTIONS)
      .filter(([key]) => selectedPlatforms.includes(key))
      .map(([_, val]) => val.text + "\n\n" + val.hashtags.join(" "))
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(selectedCaptions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }

        @keyframes floatY { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes floatX { 0%,100%{transform:translateX(0px)} 50%{transform:translateX(10px)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(79,70,229,0.4)} 70%{box-shadow:0 0 0 20px rgba(79,70,229,0)} 100%{box-shadow:0 0 0 0 rgba(79,70,229,0)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes shimmer-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .animate-float { animation: floatY 6s ease-in-out infinite; }
        .animate-float-x { animation: floatX 5s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .animate-scale-in { animation: scaleIn 0.5s ease both; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
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

      {/* Floating particles (icons) */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <FloatingHashSymbols count={100} opacity={0.1} />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute -bottom-20 right-1/3 w-96 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <Navbar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-25 pb-8 px-4 z-10"
      >
        {/* Orbiting rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-indigo-200/30 animate-spin-slow" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-purple-200/20 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        />

        {/* Badge */}
        <div className="relative animate-fade-up mb-4">
          <div className="bg-white/70 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg shadow-indigo-200/50 border border-indigo-100">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse-ring bg-indigo-500" />
            <span className="text-xs font-black tracking-widest uppercase text-indigo-600">
              AI-Powered Social Media Generator
            </span>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
              Now Live
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-black text-center leading-none tracking-tight mb-3 animate-fade-up relative z-10"
          style={{ fontSize: "clamp(2.8rem,7.5vw,5.8rem)" }}
        >
          <span className="text-slate-800">Create </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Viral Captions
          </span>
          <br />
          <span className="text-slate-800">&amp; </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Hashtags
          </span>
          <span className="text-slate-800"> in </span>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              3 Seconds
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 8 Q75 2, 150 8 Q225 14, 298 8"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </span>
        </h1>

        <p
          className="text-center text-slate-600 font-light text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 mb-5 animate-fade-up relative z-10"
          style={{ animationDelay: "0.2s" }}
        >
          Instantly generate platform-optimized posts for{" "}
          <span className="font-semibold inline-block align-middle">
            <TypewriterText texts={socialTexts} />
          </span>
        </p>

        {/* CTA */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-up relative z-10"
          style={{ animationDelay: "0.3s" }}
        >
          <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-8 py-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-indigo-500/40 transition-all duration-300 shimmer-btn text-base" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}>
            Generate Free
          </button>
        </div>

        {/* Interactive Demo Card */}
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 blur-3xl opacity-30 rounded-3xl" />
          <div className="relative bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl shadow-indigo-200/30">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                Hashtag Studio
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6 p-5 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-slate-700">
                {active.text}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {active.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Score</span>
                  <div className="w-32 h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${active.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-indigo-600">
                    {active.score}%
                  </span>
                </div>
                <div className="flex">
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 border border-indigo-200 rounded-full text-indigo-500 hover:bg-indigo-50 transition">
                    <Heart size={14} />
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md flex items-center gap-1">
            <Zap size={14} />
            3s Generation
          </div>
        </div>
      </section>

      <Stats />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative py-14 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-5 py-2 mb-5 shadow-sm border border-indigo-100">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600">
                How It Works
              </span>
            </div>
            <h2
              className="font-black leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">From Idea to </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Viral Post
              </span>
              <br />
              <span className="text-slate-800">in 4 Simple Steps</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-lg mx-auto">
              No complicated tools. No learning curve. Just simple AI-powered
              content creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="relative bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default group border border-indigo-50"
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-50/50 to-purple-50/50" />
                <div className="relative">
                  <div className="flex justify-between items-center">
                    <div className="text-6xl font-black text-indigo-100 mb-4">
                      {s.num}
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="features" className="relative py-14 px-4 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white/50" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-full px-5 py-2 mb-5 shadow-md">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600">
                Try It Live
              </span>
            </div>
            <h2
              className="font-black leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">See the </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                AI Magic
              </span>
              <span className="text-slate-800"> Happen</span>
            </h2>
            <p className="text-slate-600 text-lg font-light max-w-md mx-auto">
              Fill in your details and watch captions appear live.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Input */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-7 shadow-xl shadow-indigo-200/30 border border-indigo-100">
              <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
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
                  {
                    label: "Caption Length Preferences",
                    key: "length",
                    placeholder: "e.g. Short, Medium, Long",
                    icon: <FaRuler className="w-4 h-4" />,
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      {f.icon} {f.label}
                    </label>
                    <input
                      className="w-full rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold placeholder-slate-400 bg-white border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                      value={demoInput[f.key]}
                      onChange={(e) => setDemoInput({ ...demoInput, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-black text-indigo-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" /> Select Platforms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS
                      .filter(p => ["instagram", "linkedin", "twitter", "facebook"].includes(p.id))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${selectedPlatforms === p.id
                            ? "text-white border-transparent shadow-md bg-gradient-to-r from-indigo-500 to-purple-500"
                            : "border-indigo-200 text-indigo-400 hover:bg-indigo-50"
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
                  className="relative overflow-hidden w-full text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 
                  transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn"
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
                    <FaRobot className="w-16 h-16 text-indigo-300" />
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
                  <p className="font-black text-indigo-700 mb-1">
                    Crafting your perfect captions...
                  </p>
                  <p className="text-indigo-400 text-xs font-semibold">
                    Analyzing audience, tone & trending hashtags
                  </p>
                  <div className="mt-4 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce bg-indigo-500"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
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
                  {Object.entries(CAPTIONS)
                    .filter(([key]) => selectedPlatforms.includes(key))
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className={`mb-3 rounded-2xl p-4 border-2 ${val.bg} ${val.border} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{val.icon}</span>
                          <span
                            className={`text-xs font-black capitalize px-2 py-0.5 rounded-full ${val.tag}`}
                          >
                            {val.label}
                          </span>
                          <div className="ml-auto flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-white/60 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                style={{ width: `${val.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-indigo-600">
                              {val.score}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-2">
                          {val.text.slice(0, 90)}...
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {val.hashtags.slice(0, 3).map((h) => (
                            <span
                              key={h}
                              className={`text-xs ${val.tag} px-2 py-0.5 rounded-full font-black`}
                            >
                              {h}
                            </span>
                          ))}
                          <span className="text-xs text-slate-400 px-2 py-0.5 font-bold">
                            +{val.hashtags.length - 3} more
                          </span>
                        </div>
                      </div>
                    ))}
                  <button
                    onClick={handleCopyAll}
                    className="w-full text-white font-black py-3 rounded-2xl mt-2 text-sm hover:-translate-y-1 transition-all shadow-lg shimmer-btn 
                    relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}
                  >
                    {copied ? "✓ Copied to Clipboard!" : "📋 Copy All Selected Captions & Hashtags"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-5 py-2 mb-5 border border-indigo-100">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600">
                Features
              </span>
            </div>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-slate-800">Everything to </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Dominate Social
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default group border border-indigo-50"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 bg-gradient-to-r ${f.color} text-white`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-black text-slate-800 text-base mb-2 group-hover:text-indigo-700 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      < section id="platforms" className="relative py-14 px-4 z-10" >
        <><div
          className="absolute inset-0 opacity-50"
          style={{
            background: "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,232,255,0.8))",
          }} /><div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 glass-pink rounded-full px-5 py-2 mb-5">
              <span
                className="text-xs font-black tracking-widest uppercase"
                style={{ color: "#be185d" }}
              >
                Platforms
              </span>
            </div>

            <h2
              className="font-display font-black leading-tight mb-4"
              style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}
            >
              <span className="text-rose-950">One Tool. </span>
              <span className="gradient-text">Every Platform.</span>
            </h2>

            <p className="text-rose-800/60 text-lg font-light max-w-lg mx-auto mb-14">
              HashCraft AI understands the language, format & algorithm of every major
              platform.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {PLATFORMS.map((p, i) => (
                <div
                  key={p.name}

                  className={`relative rounded-3xl p-[1px] transition-all duration-500 cursor-pointer group
                   ${activePlatform === p.name
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 scale-105"
                      : "bg-gradient-to-r from-pink-200/40 to-purple-200/40 hover:from-pink-400 hover:to-purple-400 hover:scale-105"
                    }`}
                >
                  {/* Card */}
                  <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl p-7 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">

                    {/* Animated shine */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                      <div className="absolute -left-40 top-0 h-full w-40 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-12 translate-x-0 group-hover:translate-x-[500px] transition-transform duration-1000" />
                    </div>

                    <div className="relative z-10">

                      {/* Icon */}
                      <div className="text-4xl text-rose-600 mb-4 group-hover:scale-1.15 group-hover:-rotate-6 transition-all duration-300">
                        {p.icon}
                      </div>

                      {/* Name */}
                      <h3 className="font-black text-rose-900 text-base mb-1 tracking-wide">
                        {p.name}
                      </h3>

                      {/* Detail */}
                      <p className="text-xs text-rose-400 font-semibold">
                        {p.detail}
                      </p>


                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div></>
      </section >

      {/* TESTIMONIALS */}
      < section className="relative py-14 px-4 z-10" style={{ background: "linear-gradient(135deg, #7c3aed, #be185d, #9d174d)" }
      }>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-5">
              <span className="text-xs font-black tracking-widest uppercase text-white">Testimonials</span>
            </div>
            <h2 className="font-display font-black text-white leading-tight" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
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
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-lg`} style={{ background: `linear-gradient(135deg, ${i === 0 ? "#f43f8e,#ec4899" : i === 1 ? "#a855f7,#7c3aed" : "#ec4899,#f43f8e"})` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">{t.name}</div>
                    <div className="text-pink-200 text-xs font-semibold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* CTA BANNER*/}
      <section className="relative py-14 px-4 z-10 overflow-hidden">
        {/* Subtle background pattern with floating hashtags */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute top-10 left-1/4 text-8xl font-black text-indigo-600 rotate-12">#</div>
          <div className="absolute bottom-20 right-1/3 text-9xl font-black text-pink-500 -rotate-12">#</div>
          <div className="absolute top-40 right-1/4 text-7xl font-black text-purple-400 rotate-45">#</div>
          <div className="absolute bottom-10 left-1/3 text-8xl font-black text-indigo-300 -rotate-6">#</div>
          <div className="absolute top-1/2 left-10 text-8xl font-black text-pink-300 rotate-90">#</div>
        </div>

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 via-white/70 to-pink-50/10" />

        <div className="relative max-w-4xl mx-auto text-center">

          {/* Headline with gradient accent */}
          <h2 className="font-black text-slate-800 leading-tight mb-4 text-4xl md:text-5xl lg:text-6xl">
            Start Creating Viral Content
            <br />
            Today – <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">It's Free</span>
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Join <span className="font-bold text-indigo-600">10,000+ marketers</span> saving 80% of their content creation time with HashCraft AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className="relative overflow-hidden flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-indigo-500/40 transition-all duration-300 shimmer-btn text-base" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}>
              Generate Free
            </button>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}