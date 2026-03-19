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
  FaEllipsisV,
  FaPen,
  FaThumbtack,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useSidebar } from "../../Context/SidebarContext";
import ProfileModal from "../../components/ProfileModal";

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

function Tooltip({ label }) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
      {label}
    </span>
  );
}

function MiniIconBtn({ icon: Icon, label, onClick }) {
  return (
    <div className="relative group flex justify-center w-full px-3">
      <button onClick={onClick} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-orange-50 hover:text-[#f08a5d] transition-all duration-150">
        <Icon size={16} />
      </button>
      <Tooltip label={label} />
    </div>
  );
}

function HistoryRow({ item, onSelect, onDelete, onRename, onTogglePin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div onClick={onSelect} className="group relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {item.pinned && <FaThumbtack size={14} className="text-[#f08a5d] rotate-45 shrink-0" />}
          <p className="text-sm font-medium text-slate-800 truncate">{item.product}</p>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">{item.preview}</p>
        <p className="text-[10px] text-slate-400 mt-1">{item.relativeTime}</p>
      </div>
      <div className="relative" ref={menuRef}>
        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="p-1.5 rounded-lg hover:bg-orange-100 text-slate-400 hover:text-[#f08a5d] transition opacity-0 group-hover:opacity-100">
          <FaEllipsisV size={12} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-orange-100 rounded-lg shadow-xl z-50 overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(item.id); }} className="w-full text-left px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
              <FaTrash size={12} /> Delete
            </button>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRename(item.id); }} className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-orange-50 flex items-center gap-2">
              <FaPen size={12} /> Rename
            </button>
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onTogglePin(item.id); }} className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-orange-50 flex items-center gap-2">
              <FaThumbtack size={12} className={item.pinned ? "rotate-45 text-[#f08a5d]" : ""} /> {item.pinned ? "Unpin" : "Pin to top"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratorSidebar({ onNewChat, onSelectHistory, refreshKey }) {
  const { sidebarState, setSidebarState } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameItemId, setRenameItemId] = useState(null);
  const [renameText, setRenameText] = useState("");

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

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get("caption-history/");
      if (response.data && response.data.length > 0) {
        const formatted = response.data.map((item) => {
          const created = new Date(item.created_at);
          
          let previewText = "No caption generated...";
          if (item.results) {
              const firstPlatformKey = Object.keys(item.results)[0];
              if (firstPlatformKey && item.results[firstPlatformKey].caption) {
                  previewText = item.results[firstPlatformKey].caption;
              }
          }

          return {
            id: item.id,
            product: item.topic,
            preview: previewText.substring(0, 80) + (previewText.length > 80 ? "..." : ""),
            createdAt: created,
            relativeTime: formatRelativeTime(created),
            platforms: item.platforms || [], 
            results: item.results || {},     
            caption_type: item.caption_type,
            pinned: item.is_pinned || false, 
          };
        });
        setHistory(formatted);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [userName, setUserName] = useState(localStorage.getItem("full_name") || "User");

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

  const handleRenameCaption = (itemId) => {
    const item = history.find((h) => h.id === itemId);
    if (!item) return;
    setRenameItemId(itemId);
    setRenameText(item.product);
    setRenameModalOpen(true);
  };

  const submitRename = async () => {
    if (!renameText || renameText.trim() === "") {
        toast.error("Name cannot be empty");
        return;
    }
    const item = history.find((h) => h.id === renameItemId);
    if (item && renameText.trim() === item.product) {
        setRenameModalOpen(false);
        return;
    }
    
    try {
      await api.patch(`caption-history/${renameItemId}/`, { topic: renameText.trim() });
      setHistory((prev) => prev.map((h) => h.id === renameItemId ? { ...h, product: renameText.trim() } : h));
      toast.success("Caption renamed");
    } catch {
      toast.error("Failed to rename caption");
    } finally {
      setRenameModalOpen(false);
    }
  };

  const handleTogglePin = async (itemId) => {
    const item = history.find((h) => h.id === itemId);
    if (!item) return;
    try {
      await api.patch(`caption-history/${itemId}/`, { is_pinned: !item.pinned });
      setHistory((prev) => prev.map((h) => h.id === itemId ? { ...h, pinned: !h.pinned } : h));
      toast.success(item.pinned ? "Caption unpinned" : "Caption pinned");
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  const filteredHistory = history
    .filter((item) => item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const groupHistory = (items) => {
    const pinned = [], today = [], yesterday = [], older = [];
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    items.forEach((item) => {
      if (item.pinned) {
        pinned.push(item);
      } else {
        const itemDate = new Date(item.createdAt);
        if (itemDate >= todayStart) today.push(item);
        else if (itemDate >= yesterdayStart && itemDate < todayStart) yesterday.push(item);
        else older.push(item);
      }
    });
    return { pinned, today, yesterday, older };
  };
  const groups = groupHistory(filteredHistory);

  const expandSearch = () => {
    setSidebarState("full");
    setTimeout(() => { setSearchOpen(true); searchRef.current?.focus(); }, 320);
  };

  const widthMap = { full: "16rem", mini: "4rem", closed: "0px" };

  return (
    <>
      <aside style={{ width: widthMap[sidebarState] }} className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-white border-r border-orange-100 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${sidebarState === "closed" ? "-translate-x-full" : "translate-x-0"}`}>
        {sidebarState === "full" && (
          <div className="flex flex-col h-full" style={{ width: "16rem" }}>
            <div className="flex items-center justify-center relative px-3 pt-3 pb-2 flex-shrink-0">
              <div className="w-1/2 flex-shrink-0"><img src="https://www.graphura.in/image/bg%20removed.webp" alt="Graphura" className="w-full h-auto object-contain" /></div>
              <button onClick={() => setSidebarState(isMobile ? "closed" : "mini")} className="absolute right-3 p-2 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#f08a5d] transition cursor-pointer"><FaChevronLeft size={13} /></button>
            </div>
            <div className="px-3 pt-1 pb-2 flex-shrink-0">
              <button onClick={onNewChat} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-slate-700 transition group cursor-pointer">
                <div className="w-7 h-7 rounded-lg border border-orange-200 bg-white group-hover:bg-orange-50 flex items-center justify-center shadow-sm"><FaPlus size={11} className="text-[#f08a5d]" /></div>
                <span className="text-sm font-medium">New chat</span>
              </button>
              <button onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-slate-500 transition group mt-0.5 cursor-pointer">
                <div className="w-7 h-7 rounded-lg border border-orange-200 bg-white group-hover:bg-orange-50 flex items-center justify-center shadow-sm"><FaSearch size={11} className="text-slate-400" /></div>
                <span className="text-sm font-medium">Search chats</span>
              </button>
              {searchOpen && (
                <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200">
                  <FaSearch size={10} className="text-slate-400 flex-shrink-0" />
                  <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search your captions..." className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none" />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}><FaTimes size={10} className="text-slate-400 hover:text-[#f08a5d] transition" /></button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0">
              {loading ? (
                <div className="flex flex-col gap-2 pt-4">{[1, 2, 3].map((i) => <div key={i} className="h-10 rounded-xl bg-orange-50 animate-pulse" />)}</div>
              ) : filteredHistory.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">{searchQuery ? "No results found." : "No history yet.\nGenerate your first caption!"}</p>
              ) : (
                <>
                  {groups.pinned.length > 0 && (
                    <>
                      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#f08a5d] flex items-center gap-1"><FaThumbtack size={10} className="rotate-45" /> Pinned</p>
                      {groups.pinned.map((item) => <HistoryRow key={item.id} item={item} onSelect={() => onSelectHistory(item)} onDelete={handleDeleteCaption} onRename={handleRenameCaption} onTogglePin={handleTogglePin} />)}
                    </>
                  )}
                  {groups.today.length > 0 && (
                    <>
                      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Today</p>
                      {groups.today.map((item) => <HistoryRow key={item.id} item={item} onSelect={() => onSelectHistory(item)} onDelete={handleDeleteCaption} onRename={handleRenameCaption} onTogglePin={handleTogglePin} />)}
                    </>
                  )}
                  {groups.yesterday.length > 0 && (
                    <>
                      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Yesterday</p>
                      {groups.yesterday.map((item) => <HistoryRow key={item.id} item={item} onSelect={() => onSelectHistory(item)} onDelete={handleDeleteCaption} onRename={handleRenameCaption} onTogglePin={handleTogglePin} />)}
                    </>
                  )}
                  {groups.older.length > 0 && (
                    <>
                      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Older</p>
                      {groups.older.map((item) => <HistoryRow key={item.id} item={item} onSelect={() => onSelectHistory(item)} onDelete={handleDeleteCaption} onRename={handleRenameCaption} onTogglePin={handleTogglePin} />)}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="border-t border-orange-100 px-3 py-3 flex-shrink-0" ref={profileRef}>
              <div className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-orange-50 transition cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#f08a5d] flex items-center justify-center text-white font-bold text-xs shadow flex-shrink-0">{userName.charAt(0).toUpperCase()}</div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                    <p className="text-xs text-slate-400">{localStorage.getItem("access") ? "Verified" : "Guest"}</p>
                  </div>
                  <FaChevronDown size={10} className={`text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {profileMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-orange-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    <button onClick={() => { setProfileMenuOpen(false); setIsProfileModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-orange-50 flex items-center gap-2.5 transition"><FaUser size={11} className="text-slate-400" /> Profile</button>
                    <div className="border-t border-orange-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition"><FaSignOutAlt size={11} /> Log out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {sidebarState === "mini" && (
          <div className="flex flex-col items-center h-full py-3 gap-1" style={{ width: "4rem" }}>
            <div className="relative group flex justify-center w-full px-3 mb-2">
              <button onClick={() => setSidebarState("full")} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-orange-50 hover:text-[#f08a5d] transition"><FaChevronRight size={13} /></button>
              <Tooltip label="Expand sidebar" />
            </div>
            <MiniIconBtn icon={FaPlus} label="New chat" onClick={onNewChat} />
            <MiniIconBtn icon={FaSearch} label="Search chats" onClick={expandSearch} />
            <div className="w-6 border-t border-orange-100 my-2" />
            <div className="flex-1" />
            <div className="relative group flex justify-center w-full px-3 pb-1" ref={profileRef}>
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="w-10 h-10 rounded-full bg-[#f08a5d] flex items-center justify-center text-white font-bold text-xs shadow hover:ring-2 hover:ring-orange-300 transition">{userName.charAt(0).toUpperCase()}</button>
              <Tooltip label={userName} />
              {profileMenuOpen && (
                <div className="absolute bottom-full left-full ml-2 mb-1 w-44 bg-white border border-orange-200 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-orange-100"><p className="text-sm font-semibold text-slate-800 truncate">{userName}</p><p className="text-xs text-slate-400">{localStorage.getItem("access") ? "Verified" : "Guest"}</p></div>
                  <button onClick={() => { setProfileMenuOpen(false); setIsProfileModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-orange-50 flex items-center gap-2.5 transition"><FaUser size={11} className="text-slate-400" /> Profile</button>
                  <div className="border-t border-orange-100" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition"><FaSignOutAlt size={11} /> Log out</button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
      
      {/* Mobile Overlays */}
      {isMobile && sidebarState === "closed" && <button onClick={() => setSidebarState("full")} className="fixed left-4 top-4 z-40 p-2.5 bg-white border border-orange-200 rounded-xl text-[#f08a5d] hover:bg-orange-50 transition shadow-lg"><FaBars size={16} /></button>}
      {isMobile && sidebarState === "full" && <div onClick={() => setSidebarState("closed")} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20" />}

      {/* RENAME MODAL */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-down border border-orange-100">
            <div className="px-6 py-4 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FaPen className="text-[#f08a5d]" size={14} /> Rename Chat
              </h3>
              <button onClick={() => setRenameModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); }}
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold bg-white border-2 border-orange-200 focus:border-[#f08a5d] focus:ring-2 focus:ring-orange-200 outline-none transition"
                autoFocus
              />
            </div>
            <div className="px-6 py-4 bg-orange-50/50 border-t border-orange-100 flex justify-end gap-3">
              <button onClick={() => setRenameModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white rounded-xl transition">
                Cancel
              </button>
              <button onClick={submitRename} className="px-4 py-2 text-sm font-bold text-white bg-[#f08a5d] hover:bg-[#d97346] hover:shadow-lg hover:-translate-y-0.5 rounded-xl transition">
                Save
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
    </>
  );
}