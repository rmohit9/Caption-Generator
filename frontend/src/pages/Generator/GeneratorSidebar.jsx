import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaTrash,
  FaChevronDown,
  FaBars,
  FaSearch,
  FaTimes,
  FaMagic,
  FaHashtag,
  FaInstagram,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useSidebar } from "../../context/SidebarContext"; // adjust path

const mockHistory = [
  {
    id: 1,
    product: "Organic Green Tea",
    preview: "Refresh your mornings with nature's purest energy – our new organic green tea is now available!",
    date: "2 hours ago",
  },
  {
    id: 2,
    product: "Fitness App",
    preview: "Transform your workout routine with AI-powered coaching. Get started today!",
    date: "Yesterday",
  },
];

function Tooltip({ label }) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-indigo-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
      {label}
    </span>
  );
}

function MiniIconBtn({ icon: Icon, label, onClick }) {
  return (
    <div className="relative group flex justify-center w-full px-3">
      <button
        onClick={onClick}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-150"
      >
        <Icon size={16} />
      </button>
      <Tooltip label={label} />
    </div>
  );
}

function HistoryRow({ item, onDelete }) {
  return (
    <div className="group relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 transition cursor-pointer">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-indigo-900 truncate">{item.product}</p>
        <p className="text-xs text-indigo-400 truncate mt-0.5">{item.preview}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition flex-shrink-0"
        title="Delete"
      >
        <FaTrash size={10} />
      </button>
    </div>
  );
}

export default function GeneratorSidebar({ onNewChat }) {
  const { sidebarState, setSidebarState } = useSidebar();  // <-- use context
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [history, setHistory] = useState(mockHistory);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Responsive breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarState((prev) => {
        if (mobile && prev !== "closed") return "closed";
        if (!mobile && prev === "closed") return "full";
        return prev;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [setSidebarState]);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("caption-history/");
        if (response.data && response.data.length > 0) {
          setHistory(response.data.map((item, index) => ({
            id: item.id || index,
            product: item.topic,
            preview: item.caption.substring(0, 80) + (item.caption.length > 80 ? "..." : ""),
            date: new Date(item.created_at).toLocaleDateString(),
            platform: item.platform,
            caption: item.caption,
            hashtags: item.hashtags,
          })));
        }
      } catch {
        setHistory(mockHistory);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Close profile on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userName = localStorage.getItem("full_name") || "User";

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) await api.post("logout/", { refresh });
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("full_name");
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDeleteCaption = async (itemId) => {
    try {
      await api.delete(`caption-history/${itemId}/`);
      setHistory((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Caption deleted");
    } catch {
      toast.error("Failed to delete caption");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupHistory = (items) => {
    const today = [], yesterday = [], older = [];
    const now = new Date();
    items.forEach((item) => {
      const d = new Date(item.date);
      const diff = Math.floor((now - d) / 86400000);
      if (isNaN(diff) || item.date.includes("hour") || diff === 0) today.push(item);
      else if (diff === 1 || item.date === "Yesterday") yesterday.push(item);
      else older.push(item);
    });
    return { today, yesterday, older };
  };
  const groups = groupHistory(filteredHistory);

  const expandSearch = () => {
    setSidebarState("full");
    setTimeout(() => { setSearchOpen(true); searchRef.current?.focus(); }, 320);
  };

  const widthMap = { full: "16rem", mini: "4rem", closed: "0px" };

  return (
    <>
      <aside
        style={{ width: widthMap[sidebarState] }}
        className={`
          fixed top-0 left-0 h-screen z-30 flex flex-col
          bg-white border-r border-indigo-100 shadow-sm
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarState === "closed" ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* FULL VIEW */}
        {sidebarState === "full" && (
          <div className="flex flex-col h-full" style={{ width: "16rem" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <img src="" alt="logo" />
              </div>
              <button
                onClick={() => setSidebarState(isMobile ? "closed" : "mini")}
                className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition"
                title="Collapse"
              >
                <FaChevronLeft size={13} />
              </button>
            </div>

            {/* New chat + Search */}
            <div className="px-3 pt-1 pb-2 flex-shrink-0">
              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-indigo-700 transition group"
              >
                <div className="w-7 h-7 rounded-lg border border-indigo-200 bg-white group-hover:bg-indigo-100 flex items-center justify-center shadow-sm">
                  <FaPlus size={11} className="text-indigo-500" />
                </div>
                <span className="text-sm font-medium">New chat</span>
              </button>

              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-indigo-500 transition group mt-0.5"
              >
                <div className="w-7 h-7 rounded-lg border border-indigo-200 bg-white group-hover:bg-indigo-100 flex items-center justify-center shadow-sm">
                  <FaSearch size={11} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium">Search chats</span>
              </button>

              {searchOpen && (
                <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200">
                  <FaSearch size={10} className="text-indigo-400 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your captions..."
                    className="flex-1 bg-transparent text-sm text-indigo-900 placeholder-indigo-400 outline-none"
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                    <FaTimes size={10} className="text-indigo-400 hover:text-indigo-600 transition" />
                  </button>
                </div>
              )}
            </div>

            {/* Nav items */}
            <div className="px-3 pb-2 border-b border-indigo-100 flex-shrink-0">
              {[
                { icon: FaMagic, label: "Caption Generator" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 text-indigo-600 hover:text-indigo-900 transition group">
                  <div className="w-7 h-7 rounded-lg border border-indigo-200 bg-white group-hover:bg-indigo-100 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon size={11} className="text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0">
              {loading ? (
                <div className="flex flex-col gap-2 pt-4">
                  {[1,2,3].map((i) => <div key={i} className="h-10 rounded-xl bg-indigo-50 animate-pulse" />)}
                </div>
              ) : filteredHistory.length === 0 ? (
                <p className="text-center py-12 text-indigo-400 text-sm">
                  {searchQuery ? "No results found." : "No history yet.\nGenerate your first caption!"}
                </p>
              ) : (
                <>
                  {groups.today.length > 0 && <>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-300">Today</p>
                    {groups.today.map((item) => <HistoryRow key={item.id} item={item} onDelete={handleDeleteCaption} />)}
                  </>}
                  {groups.yesterday.length > 0 && <>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-300">Yesterday</p>
                    {groups.yesterday.map((item) => <HistoryRow key={item.id} item={item} onDelete={handleDeleteCaption} />)}
                  </>}
                  {groups.older.length > 0 && <>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-300">Previous 7 days</p>
                    {groups.older.map((item) => <HistoryRow key={item.id} item={item} onDelete={handleDeleteCaption} />)}
                  </>}
                </>
              )}
            </div>

            {/* Profile footer */}
            <div className="border-t border-indigo-100 px-3 py-3 flex-shrink-0" ref={profileRef}>
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow flex-shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-indigo-900 truncate">{userName}</p>
                    <p className="text-xs text-indigo-400">{localStorage.getItem("access") ? "Verified" : "Guest"}</p>
                  </div>
                  <FaChevronDown size={10} className={`text-indigo-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-indigo-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-indigo-800 hover:bg-indigo-50 flex items-center gap-2.5 transition">
                      <FaUser size={11} className="text-indigo-400" /> Profile
                    </button>
                    <div className="border-t border-indigo-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition">
                      <FaSignOutAlt size={11} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MINI VIEW */}
        {sidebarState === "mini" && (
          <div className="flex flex-col items-center h-full py-3 gap-1" style={{ width: "4rem" }}>
            <div className="relative group flex justify-center w-full px-3 mb-2">
              <button
                onClick={() => setSidebarState("full")}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                <FaChevronRight size={13} />
              </button>
              <Tooltip label="Expand sidebar" />
            </div>

            <MiniIconBtn icon={FaPlus} label="New chat" onClick={onNewChat} />
            <MiniIconBtn icon={FaSearch} label="Search chats" onClick={expandSearch} />

            <div className="w-6 border-t border-indigo-100 my-2" />

            <MiniIconBtn icon={FaMagic} label="Caption Generator" />
            <MiniIconBtn icon={FaHashtag} label="Hashtag Generator" />
            <MiniIconBtn icon={FaInstagram} label="Platform Templates" />
            <MiniIconBtn icon={FaRocket} label="Quick Generate" />

            <div className="flex-1" />
            <MiniIconBtn icon={FaStar} label="Upgrade plan" />

            <div className="relative group flex justify-center w-full px-3 pb-1" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow hover:ring-2 hover:ring-indigo-300 transition"
              >
                {userName.charAt(0).toUpperCase()}
              </button>
              <Tooltip label={userName} />

              {profileMenuOpen && (
                <div className="absolute bottom-full left-full ml-2 mb-1 w-44 bg-white border border-indigo-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-indigo-100">
                    <p className="text-sm font-semibold text-indigo-900 truncate">{userName}</p>
                    <p className="text-xs text-indigo-400">{localStorage.getItem("access") ? "Verified" : "Guest"}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-indigo-800 hover:bg-indigo-50 flex items-center gap-2.5 transition">
                    <FaUser size={11} className="text-indigo-400" /> Profile
                  </button>
                  <div className="border-t border-indigo-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition">
                    <FaSignOutAlt size={11} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Hamburger when closed on mobile */}
      {isMobile && sidebarState === "closed" && (
        <button
          onClick={() => setSidebarState("full")}
          className="fixed left-4 top-4 z-40 p-2.5 bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-50 transition shadow-lg"
          title="Open sidebar"
        >
          <FaBars size={16} />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && sidebarState === "full" && (
        <div
          onClick={() => setSidebarState("closed")}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
        />
      )}
    </>
  );
}