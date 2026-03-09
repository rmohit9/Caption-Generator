import { useState, useEffect, useRef } from "react";

// flawors icons and heart shape icons 

import { FaStar, FaHeart } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi";

// social icons 

import { FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

// lucide react icons 

import {
  Rocket,
  Play,
  Copy,
  Heart,
  Save,
  Share2,
  Zap
} from "lucide-react";
import Stats from "../../components/HomeComponents/Stats";


const CAPTIONS = {
  instagram: {
    text: "🌿 Refresh your mornings with nature's purest energy! Every sip of our Organic Green Tea ignites your metabolism, sharpens your focus & brings calm to your hustle. Your wellness journey starts in a cup. ✨☕",
    hashtags: ["#GreenTeaLover", "#HealthyHabits", "#WellnessJourney", "#OrganicLiving", "#FitnessFuel", "#MorningRitual", "#CleanEnergy", "#NaturalWellness"],
    score: 94, emoji: "📸", label: "Instagram",
    gradient: "from-pink-500 via-rose-400 to-orange-400",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    border: "border-pink-200", tag: "bg-pink-100 text-pink-600", dot: "bg-pink-500",
  },
  linkedin: {
    text: "Health starts with mindful choices. Our Organic Green Tea blends premium wellness with everyday productivity — because peak performance begins before the boardroom. Make the switch that matters. 💼🍃",
    hashtags: ["#Productivity", "#SustainableLiving", "#WellnessAtWork", "#MindfulLeadership", "#HealthyProfessionals", "#GreenTea"],
    score: 87, emoji: "💼", label: "LinkedIn",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-200", tag: "bg-blue-100 text-blue-600", dot: "bg-blue-500",
  },
  twitter: {
    text: "Fuel your focus & fitness with Organic Green Tea 🍵⚡ Zero crash. All energy. All natural. Your mornings just got a serious upgrade. 🌱",
    hashtags: ["#GreenTea", "#MorningRoutine", "#FitnessMotivation", "#HealthyLiving", "#CleanEnergy"],
    score: 91, emoji: "🐦", label: "Twitter/X",
    gradient: "from-sky-500 via-cyan-400 to-teal-400",
    bg: "bg-gradient-to-br from-sky-50 to-cyan-50",
    border: "border-sky-200", tag: "bg-sky-100 text-sky-600", dot: "bg-sky-500",
  },
};

const FEATURES = [
  { icon: "🧠", title: "AI-Powered Captions", desc: "GPT-grade copy tailored to your brand voice, audience & platform in seconds.", color: "from-fuchsia-500 to-pink-500" },
  { icon: "🔥", title: "Trending Hashtags", desc: "Algorithmically sourced hashtags that maximize reach and discoverability.", color: "from-orange-400 to-rose-500" },
  { icon: "📊", title: "Engagement Scoring", desc: "Every post gets a real-time AI engagement score before you publish.", color: "from-violet-500 to-purple-600" },
  { icon: "🎯", title: "Audience Targeting", desc: "Captions crafted for your exact demographic — age, interest & behavior.", color: "from-pink-500 to-rose-600" },
  { icon: "⚡", title: "Instant Generation", desc: "Generate 6 platform-ready posts simultaneously in under 3 seconds.", color: "from-amber-400 to-orange-500" },
  { icon: "♻️", title: "Content Repurposing", desc: "Turn one idea into 6 platform-native posts automatically. One click.", color: "from-teal-400 to-cyan-500" },
];

const STEPS = [
  { num: "01", icon: "✍️", title: "Describe Your Product", desc: "Enter brand name, product, target audience & tone in seconds.", color: "from-pink-400 to-rose-500" },
  { num: "02", icon: "🤖", title: "AI Generates Instantly", desc: "Engine crafts platform-specific captions, CTAs, emojis & hashtag stacks.", color: "from-violet-400 to-purple-500" },
  { num: "03", icon: "🎯", title: "Pick & Customize", desc: "Choose your favourite variation, fine-tune tone, copy with one click.", color: "from-fuchsia-400 to-pink-500" },
  { num: "04", icon: "🚀", title: "Publish & Grow", desc: "Schedule directly or export. Watch your engagement metrics skyrocket.", color: "from-orange-400 to-rose-500" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Social Media Manager @ PixelAgency", avatar: "PS", text: "HashCraft AI cut our caption writing time by 80%. The hashtag suggestions are scary accurate — our reach doubled in 2 weeks!", stars: 5, color: "from-pink-400 to-rose-500" },
  { name: "Marcus Cole", role: "Founder @ FitLife Brand", avatar: "MC", text: "I used to spend 2 hours per post. Now it's 3 minutes. The engagement scores are genuinely predictive — absolute game changer.", stars: 5, color: "from-violet-400 to-purple-500" },
  { name: "Ananya Verma", role: "Content Lead @ TrendPulse", avatar: "AV", text: "The platform-specific tone adjustment is insane. LinkedIn sounds professional, Instagram sounds fun. It just gets it!", stars: 5, color: "from-fuchsia-400 to-pink-500" },
];

const PLATFORMS = [
  {
    name: "Instagram",
    icon: <FaInstagram />,
    detail: "Carousel · Reels · Stories",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin />,
    detail: "Posts · Articles · Thought Leadership",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Twitter / X",
    icon: <FaXTwitter />,
    detail: "Tweets · Threads · Spaces",
    color: "from-sky-400 to-cyan-400",
  },
  {
    name: "Facebook",
    icon: <FaFacebook />,
    detail: "Posts · Groups · Stories",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
    detail: "Video Captions · Bio · Comments",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
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
    <span className="flex justify-center items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
      {current.icon}
      {displayed}
      <span className="animate-pulse text-rose-400">|</span>
    </span>
  );
}

function FloatingParticle({ style, emoji }) {
  return <div className="absolute pointer-events-none select-none opacity-20 text-2xl animate-bounce" style={style}>{emoji}</div>;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("instagram");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [demoInput, setDemoInput] = useState({ product: "Organic Green Tea", audience: "Fitness Enthusiasts", tone: "Motivational & Fresh" });
  const [activePlatform, setActivePlatform] = useState(null);
  const [likedCards, setLikedCards] = useState({});
  const [savedHashtags, setSavedHashtags] = useState([]);
  const heroRef = useRef(null);

  const active = CAPTIONS[activeTab];

  // useEffect(() => {
  //   const onMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
  //   window.addEventListener("mousemove", onMove);
  //   return () => window.removeEventListener("mousemove", onMove);
  // }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(active.text + "\n\n" + active.hashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2400);
  };

  const toggleHashtag = (tag) => {
    setSavedHashtags(prev => prev.includes(tag) ? prev.filter(h => h !== tag) : [...prev, tag]);
  };

  const toggleLike = (key) => setLikedCards(prev => ({ ...prev, [key]: !prev[key] }));

  const particles = [
    { icon: <GiSparkles />, style: { top: "8%", left: "5%", animationDelay: "0s", animationDuration: "3s" } },
    { icon: <FaStar />, style: { top: "15%", right: "8%", animationDelay: "0.5s", animationDuration: "2.5s" } },
    { icon: <HiOutlineSparkles />, style: { top: "35%", left: "2%", animationDelay: "1s", animationDuration: "3.5s" } },
    { icon: <FaStar />, style: { top: "60%", right: "3%", animationDelay: "1.5s", animationDuration: "2.8s" } },
    { icon: <FaHeart />, style: { bottom: "20%", left: "6%", animationDelay: "0.8s", animationDuration: "3.2s" } },
    { icon: <FaHeart />, style: { bottom: "10%", right: "10%", animationDelay: "0.3s", animationDuration: "2.7s" } },
    { icon: <GiSparkles />, style: { top: "45%", right: "7%", animationDelay: "2s", animationDuration: "3s" } },
    { icon: <HiOutlineSparkles />, style: { top: "75%", left: "4%", animationDelay: "1.2s", animationDuration: "2.9s" } },
  ];

  // social text arrays 

  const socialTexts = [
    { icon: <FaInstagram className="text-pink-500" />, text: "Instagram" },
    { icon: <FaLinkedin className="text-blue-600" />, text: "LinkedIn" },
    { icon: <FaXTwitter className="text-black" />, text: "Twitter / X" },
    { icon: <FaTiktok className="text-black" />, text: "TikTok" },
    { icon: <FaFacebook className="text-blue-500" />, text: "Facebook" },
    { icon: <FaYoutube className="text-red-500" />, text: "YouTube" }
  ];
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }

        @keyframes floatY { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes floatX { 0%,100%{transform:translateX(0px)} 50%{transform:translateX(10px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(244,114,182,0.5)} 70%{transform:scale(1);box-shadow:0 0 0 14px rgba(244,114,182,0)} 100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(244,114,182,0)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes shimmer-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(244,114,182,0.3)} 50%{box-shadow:0 0 40px rgba(244,114,182,0.6), 0 0 80px rgba(244,114,182,0.2)} }
        @keyframes typewriter-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes card-float { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(0.5deg)} 66%{transform:translateY(-4px) rotate(-0.5deg)} }

        .animate-float { animation: floatY 4s ease-in-out infinite; }
        .animate-float-x { animation: floatX 5s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .animate-scale-in { animation: scaleIn 0.5s ease both; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
        .animate-glow { animation: glow 2.5s ease-in-out infinite; }
        .animate-card-float { animation: card-float 6s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.455,0.03,0.515,0.955) infinite; }

        .shimmer-btn::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); animation: shimmer-move 2s infinite; }

        .glass { background: rgba(255,255,255,0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8); }
        .glass-pink { background: rgba(255,240,248,0.75); backdrop-filter: blur(20px); border: 1px solid rgba(255,182,213,0.4); }
        .glass-dark { background: rgba(30,10,20,0.75); backdrop-filter: blur(20px); border: 1px solid rgba(255,182,213,0.2); }

        .hover-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 30px 80px rgba(244,114,182,0.2); }

        .gradient-text { background: linear-gradient(135deg, #e91e8c, #f43f8e, #ec4899, #a855f7); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-shift 3s ease infinite; }

        .tab-active { background: linear-gradient(135deg, #f43f8e, #ec4899); color: white; box-shadow: 0 8px 24px rgba(244,63,142,0.4); transform: scale(1.05); }

        .hashtag-chip { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; }
        .hashtag-chip:hover { transform: scale(1.12) translateY(-2px); }
        .hashtag-chip.saved { background: linear-gradient(135deg, #f43f8e, #ec4899) !important; color: white !important; border-color: transparent !important; }

        .progress-bar { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .platform-card { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .platform-card:hover { transform: translateY(-12px) scale(1.05) rotate(1deg); }
        .step-card { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .step-card:hover { transform: translateY(-10px) scale(1.03); }

        .cursor-glow { width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%); pointer-events:none; position:fixed; transform:translate(-50%,-50%); transition:left 0.1s, top 0.1s; z-index:0; }
        

        .input-field { background: rgba(255,255,255,0.8); border: 2px solid rgba(244,114,182,0.25); transition: all 0.3s ease; }
        .input-field:focus { outline: none; border-color: #f43f8e; background: white; box-shadow: 0 0 0 4px rgba(244,114,182,0.1); }
      `}</style>

      {/* Mouse glow follower */}
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Floating particles */}
      {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Big background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 animate-float" style={{ background: "radial-gradient(circle, #f9a8d4, #fbcfe8, transparent)" }} />
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full opacity-25 animate-float" style={{ animationDelay: "2s", background: "radial-gradient(circle, #e879f9, #f0abfc, transparent)" }} />
        <div className="absolute bottom-1/4 -left-24 w-72 h-72 rounded-full opacity-20 animate-float" style={{ animationDelay: "4s", background: "radial-gradient(circle, #f472b6, #fda4af, transparent)" }} />
        <div className="absolute -bottom-20 right-1/3 w-96 h-64 rounded-full opacity-25 animate-float" style={{ animationDelay: "1s", background: "radial-gradient(circle, #c084fc, #e879f9, transparent)" }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <Navbar />

      {/*  HERO  */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 z-10">

        {/* Orbiting ring decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-pink-200/40 animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-purple-200/30 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

        {/* Badge */}
        <div className="relative animate-fade-up mb-6">
          <div className="glass-pink rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg shadow-pink-200/50">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse-ring" style={{ background: "#f43f8e" }} />
            <span className="text-xs font-black tracking-widest uppercase" style={{ background: "linear-gradient(135deg, #be185d, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI-Powered Social Media Generator
            </span>
            <span className="text-xs text-rose-400 font-semibold">Now Live</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display text-center font-black leading-none tracking-tighter mb-5 animate-fade-up relative z-10" style={{ fontSize: "clamp(2.8rem,7.5vw,5.8rem)", animationDelay: "0.1s" }}>
          <span className="text-rose-950">Create </span>
          <span className="gradient-text">Viral Captions</span>
          <br />
          <span className="text-rose-950">&amp; </span>
          <span className="gradient-text">Hashtags</span>
          <span className="text-rose-950"> in </span>
          <span className="relative inline-block">
            <span className="gradient-text">3 Seconds</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"><path d="M2 8 Q75 2, 150 8 Q225 14, 298 8" stroke="#f43f8e" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" /></svg>
          </span>
        </h1>

        <p
          className="
        text-center
        text-rose-800/70
        font-light
        text-base sm:text-lg lg:text-xl
        max-w-md sm:max-w-lg lg:max-w-2xl
        leading-relaxed
        mx-auto
        px-4
        mb-8
        animate-fade-up
        relative
        z-10
        "
          style={{ animationDelay: "0.2s" }}
        >
          Instantly generate platform-optimized posts for{" "}

          <span className="font-semibold text-lg inline-flex items- justify-center gap-2">
            <TypewriterText texts={socialTexts} />
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up relative z-10" style={{ animationDelay: "0.3s" }}>
          <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-8 py-4 rounded-full shadow-2xl shadow-pink-400/50 hover:-translate-y-2 hover:shadow-pink-400/70 transition-all duration-300 shimmer-btn text-base" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)", backgroundSize: "200% auto" }}>
            Generate Free
          </button>
          <button className="flex items-center gap-2 font-black px-7 py-4 rounded-full border-2 border-pink-300 text-rose-600 hover:bg-pink-100 hover:-translate-y-2 transition-all duration-300 text-base glass" style={{ backdropFilter: "blur(10px)" }}>
            Watch 60s Demo
          </button>
        </div>

        {/* Platform pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 animate-fade-up relative z-10">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 border-pink-200 bg-white/70 text-rose-600 backdrop-blur-sm cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {p.icon}
              </span>

              <span>{p.name}</span>

              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                ✓
              </span>
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-3xl">

          {/* glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 blur-3xl opacity-30 rounded-3xl" />

          <div className="relative bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-xl">

            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">

              <div className="flex gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
              </div>

              <span className="text-xs font-semibold text-rose-600">
                Hashtag Studio
              </span>



            </div>

            {/* content */}
            <div className="p-6">

              {/* caption */}
              <div className="mb-6 p-5 rounded-xl border border-pink-200 bg-pink-50 text-sm text-slate-700">
                {active.text}
              </div>

              {/* hashtags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {active.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-pink-200 text-rose-600 hover:bg-pink-50 transition cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* footer */}
              <div className="flex items-center justify-between pt-4 border-t border-pink-100">

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Score</span>

                  <div className="w-32 h-2 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                      style={{ width: `${active.score}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-rose-600">
                    {active.score}%
                  </span>
                </div>

                <div className="flex">
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 border border-pink-200 rounded-full text-rose-500 hover:bg-pink-50 transition">
                    <Heart size={14} />
                    Like
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* floating badge */}
          <div className="absolute -top-4 -right-4 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-md flex items-center gap-1">
            <Zap size={14} />
            3s Generation
          </div>

        </div>


      </section>

      {/* ═══ STATS STRIP ═══ */}
      <Stats />

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-24 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-pink rounded-full px-5 py-2 mb-5 shadow-md shadow-pink-200/50">
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#be185d" }}>⚙️ How It Works</span>
            </div>
            <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
              <span className="text-rose-950">From Idea to </span>
              <span className="gradient-text">Viral Post</span>
              <br /><span className="text-rose-950">in 4 Simple Steps</span>
            </h2>
            <p className="text-rose-800/60 text-lg font-light max-w-lg mx-auto">No learning curve. No templates. Just pure AI magic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="step-card relative glass rounded-3xl p-6 shadow-lg shadow-pink-100/60 cursor-default overflow-hidden group"
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ background: `linear-gradient(135deg, ${i === 0 ? "rgba(244,63,142,0.08)" : i === 1 ? "rgba(168,85,247,0.08)" : i === 2 ? "rgba(236,72,153,0.08)" : "rgba(249,115,22,0.08)"})` }} />
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${i === 0 ? "#f43f8e,#ec4899" : i === 1 ? "#a855f7,#7c3aed" : i === 2 ? "#ec4899,#f43f8e" : "#f97316,#ef4444"})` }} />
                <div className="relative">
                  <div className="font-display text-6xl font-black leading-none mb-3" style={{ color: "rgba(244,114,182,0.15)" }}>{s.num}</div>
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
                  <h3 className="font-black text-rose-900 text-base mb-2">{s.title}</h3>
                  <p className="text-rose-800/60 text-sm leading-relaxed font-medium">{s.desc}</p>
                </div>
                {i < 3 && <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-pink-300 text-2xl z-20">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE DEMO ═══ */}
      <section id="features" className="relative py-24 px-4 z-10">
        <div className="absolute inset-0 opacity-40" style={{ background: "linear-gradient(135deg, rgba(253,242,248,0.8), rgba(250,232,255,0.6))" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-pink rounded-full px-5 py-2 mb-5 shadow-md shadow-pink-200/50">
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#be185d" }}>🎮 Try It Live</span>
            </div>
            <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
              <span className="text-rose-950">See the </span>
              <span className="gradient-text">AI Magic</span>
              <span className="text-rose-950"> Happen</span>
            </h2>
            <p className="text-rose-800/60 text-lg font-light max-w-md mx-auto">Fill in your details and watch captions appear live.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Input */}
            <div className="glass rounded-3xl p-7 shadow-xl shadow-pink-200/40 border border-pink-200/50">
              <h3 className="font-black text-rose-900 text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg, #f43f8e, #a855f7)" }}>✍️</span>
                Campaign Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Product / Brand Name", key: "product", placeholder: "e.g. Organic Green Tea", icon: "🛍️" },
                  { label: "Target Audience", key: "audience", placeholder: "e.g. Fitness Enthusiasts", icon: "🎯" },
                  { label: "Campaign Tone", key: "tone", placeholder: "e.g. Motivational & Fresh", icon: "🎨" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-black text-rose-700 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      {f.icon} {f.label}
                    </label>
                    <input
                      className="input-field w-full rounded-2xl px-4 py-3 text-sm text-rose-900 font-semibold placeholder-rose-300"
                      value={demoInput[f.key]}
                      onChange={e => setDemoInput({ ...demoInput, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-black text-rose-700 mb-2 uppercase tracking-widest">🌐 Select Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {["Instagram 📸", "LinkedIn 💼", "Twitter 🐦", "TikTok 🎵", "Facebook 👥"].map((p, i) => (
                      <button
                        key={p}
                        className={`text-xs font-black px-3 py-1.5 rounded-full border-2 transition-all duration-200 hover:scale-105 ${i < 3 ? "text-white border-transparent shadow-md" : "border-pink-200 text-rose-400 hover:bg-pink-50"}`}
                        style={i < 3 ? { background: "linear-gradient(135deg, #f43f8e, #a855f7)" } : {}}
                      >
                        {i < 3 && "✓ "}{p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="relative overflow-hidden w-full text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shimmer-btn"
                  style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)" }}
                >
                  {generating
                    ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Magic...</>
                    : <> Generate Captions &amp; Hashtags →</>
                  }
                </button>
              </div>
            </div>

            {/* Output */}
            <div className={`rounded-3xl overflow-hidden transition-all duration-700 ${generated ? "glass shadow-2xl shadow-pink-300/40 border border-pink-200/60" : "border-2 border-dashed border-pink-200"}`}>
              {!generated && !generating ? (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="text-7xl mb-5 opacity-20 animate-float">🤖</div>
                  <p className="text-rose-400 font-bold text-sm">Fill in your campaign details<br />and click generate to see AI magic! ✨</p>
                </div>
              ) : generating ? (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-pink-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-t-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
                  </div>
                  <p className="font-black text-rose-700 mb-1">Crafting your perfect captions...</p>
                  <p className="text-rose-400 text-xs font-semibold">Analyzing audience, tone & trending hashtags</p>
                  <div className="mt-4 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#f43f8e", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-pink-100">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#f43f8e" }} />
                    <span className="text-xs font-black text-rose-700 uppercase tracking-wider">Generated for: {demoInput.product}</span>
                    <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">✓ Ready</span>
                  </div>
                  {Object.entries(CAPTIONS).map(([key, val]) => (
                    <div key={key} className={`mb-3 rounded-2xl p-4 border-2 ${val.bg} ${val.border} hover-lift cursor-pointer group`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{val.emoji}</span>
                        <span className={`text-xs font-black capitalize px-2 py-0.5 rounded-full ${val.tag}`}>{val.label}</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-white/60 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${val.score}%`, background: "linear-gradient(90deg, #f43f8e, #a855f7)" }} />
                          </div>
                          <span className="text-xs font-black text-rose-600">{val.score}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-2">{val.text.slice(0, 90)}...</p>
                      <div className="flex flex-wrap gap-1">
                        {val.hashtags.slice(0, 3).map(h => (
                          <span key={h} className={`text-xs ${val.tag} px-2 py-0.5 rounded-full font-black`}>{h}</span>
                        ))}
                        <span className="text-xs text-slate-400 px-2 py-0.5 font-bold">+{val.hashtags.length - 3} more</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleCopy} className="w-full text-white font-black py-3 rounded-2xl mt-2 text-sm hover:-translate-y-1 transition-all shadow-lg shimmer-btn relative overflow-hidden" style={{ background: copied ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #f43f8e, #a855f7)" }}>
                    {copied ? "✓ Copied to Clipboard!" : "📋 Copy All Captions & Hashtags"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="relative py-24 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-pink rounded-full px-5 py-2 mb-5">
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#be185d" }}>💡 Features</span>
            </div>
            <h2 className="font-display font-black leading-tight" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
              <span className="text-rose-950">Everything to </span>
              <span className="gradient-text">Dominate Social</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="hover-lift glass rounded-3xl p-7 shadow-lg shadow-pink-100/60 border border-pink-100/60 cursor-default group relative overflow-hidden"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300`} style={{ background: `linear-gradient(135deg, rgba(244,63,142,0.06), rgba(168,85,247,0.06))` }} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: `linear-gradient(135deg, ${f.color.replace("from-", "").replace("to-", "").replace(/ /g, ", ")})`.replace("from-", "").replace("via-", "").replace("to-", "") || "linear-gradient(135deg, #f43f8e, #a855f7)" }}>
                    {f.icon}
                  </div>
                  <h3 className="font-black text-rose-900 text-base mb-2 group-hover:text-rose-700 transition-colors">{f.title}</h3>
                  <p className="text-rose-800/60 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS ═══ */}
      <section id="platforms" className="relative py-24 px-4 z-10">
        <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(135deg, rgba(253,242,248,0.9), rgba(250,232,255,0.8))" }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 glass-pink rounded-full px-5 py-2 mb-5">
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#be185d" }}>🌐 Platforms</span>
          </div>
          <h2 className="font-display font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
            <span className="text-rose-950">One Tool. </span>
            <span className="gradient-text">Every Platform.</span>
          </h2>
          <p className="text-rose-800/60 text-lg font-light max-w-lg mx-auto mb-14">HashCraft AI understands the language, format & algorithm of every major platform.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {PLATFORMS.map((p, i) => (
              <div key={p.name} className="platform-card glass rounded-3xl p-7 shadow-md shadow-pink-100/60 border border-pink-100/60 cursor-pointer group relative overflow-hidden" onClick={() => setActivePlatform(activePlatform === p.name ? null : p.name)}>
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${activePlatform === p.name ? "opacity-100" : "opacity-0"}`} style={{ background: "linear-gradient(135deg, rgba(244,63,142,0.1), rgba(168,85,247,0.1))" }} />
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{p.icon}</div>
                  <h3 className="font-black text-rose-900 text-base mb-1">{p.name}</h3>
                  <p className="text-xs text-rose-400 font-semibold">{p.detail}</p>
                  {activePlatform === p.name && (
                    <div className="mt-3 text-xs font-black text-white px-3 py-1 rounded-full inline-block" style={{ background: "linear-gradient(135deg, #f43f8e, #a855f7)" }}>✓ Selected</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="relative py-24 px-4 z-10" style={{ background: "linear-gradient(135deg, #7c3aed, #be185d, #9d174d)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-5">
              <span className="text-xs font-black tracking-widest uppercase text-white">⭐ Testimonials</span>
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
      </section>


      {/* ═══ CTA BANNER ═══ */}
      <section className="relative py-24 px-4 z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #fce4ec, #f8bbd0, #f3e5f5, #e8eaf6, #fce4ec)", backgroundSize: "400% 400%", animation: "gradient-shift 6s ease infinite" }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f43f8e 0%, transparent 50%), radial-gradient(circle at 70% 50%, #a855f7 0%, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-float">🚀</div>
          <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: "clamp(2rem,5vw,3.8rem)" }}>
            <span className="text-rose-950">Start Creating </span>
            <span className="gradient-text">Viral Content</span>
            <br /><span className="text-rose-950">Today - It's Free</span>
          </h2>
          <p className="text-rose-800/70 text-lg font-semibold mb-10 max-w-lg mx-auto">Join 10,000+ marketers saving 80% of their content creation time with HashCraft AI.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="relative overflow-hidden flex items-center gap-2 text-white font-black px-10 py-5 rounded-full text-lg shadow-2xl shadow-pink-400/50 hover:-translate-y-2 hover:shadow-pink-400/70 transition-all duration-300 shimmer-btn" style={{ background: "linear-gradient(135deg, #f43f8e, #ec4899, #a855f7)" }}>
              Get Started
            </button>
            <button className="flex items-center gap-2 font-black px-8 py-5 rounded-full border-2 border-pink-300 text-rose-700 hover:bg-pink-100 hover:-translate-y-2 transition-all duration-300 text-lg glass">
              Read Case Studies
            </button>
          </div>
          <p className="text-rose-400 text-xs mt-6 font-bold">✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Setup in 30 seconds</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
}