import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaTrash,
  FaChevronDown,
  FaBars
} from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

// Mock caption history data (fallback)
const mockHistory = [
  {
    id: 1,
    product: "Organic Green Tea",
    preview:
      "Refresh your mornings with nature's purest energy – our new organic green tea is now available!",
    date: "2 hours ago",
  },
  {
    id: 2,
    product: "Fitness App",
    preview:
      "Transform your workout routine with AI-powered coaching. Get started today!",
    date: "Yesterday",
  },
];

export default function CaptionHistorySidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarState, setSidebarState] = useState("full");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [history, setHistory] = useState(mockHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarState(mobile ? "closed" : "full");
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("caption-history/");
        if (response.data && response.data.length > 0) {
          const formattedHistory = response.data.map((item, index) => ({
            id: item.id || index,
            product: item.topic,
            preview: item.caption.substring(0, 80) + (item.caption.length > 80 ? "..." : ""),
            date: new Date(item.created_at).toLocaleDateString(),
            platform: item.platform,
            caption: item.caption,
            hashtags: item.hashtags,
          }));
          setHistory(formattedHistory);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory(mockHistory);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        await api.post("logout/", { refresh: refreshToken });
      }
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("full_name");
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const userName = localStorage.getItem("full_name") || "User";

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarState((prev) => (prev === "closed" ? "full" : "closed"));
    } else {
      setSidebarState((prev) => (prev === "full" ? "mini" : "full"));
    }
  };

  const handleDeleteCaption = async (itemId) => {
    try {
      await api.delete(`caption-history/${itemId}/`);
      setHistory((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Caption deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete caption");
    }
  };

  return (
    <>
      {/* Sidebar - Matching Light Theme */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white/90 backdrop-blur-md border-r border-indigo-100 shadow-lg z-30 transform transition-all duration-300 ease-in-out
          ${sidebarState === "full" ? "w-64" : sidebarState === "mini" ? "w-20" : "w-0"}
          ${isMobile && sidebarState === "closed" ? "-translate-x-full" : "translate-x-0"}
          ${!isMobile && sidebarState === "mini" ? "overflow-hidden" : ""}
        `}
      >
        <div className="h-full flex flex-col">
          
          {/* Header with Toggle */}
          <div className="p-4 border-b border-indigo-100 flex items-center justify-between">
            {sidebarState === "full" && (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <FaHistory className="text-white text-sm" />
                </div>
                <h3 className="font-bold text-indigo-900 text-sm">History</h3>
              </div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 hover:text-indigo-700 transition ml-auto"
              title={sidebarState === "full" ? "Collapse" : "Expand"}
            >
              {sidebarState === "full" ? (
                <FaChevronLeft size={16} />
              ) : sidebarState === "mini" ? (
                <FaChevronRight size={16} />
              ) : null}
            </button>
          </div>

          {/* New Caption Button (Full View Only) */}
          {sidebarState === "full" && (
            <button 
              onClick={() => window.location.reload()}
              className="m-4 flex items-center gap-3 w-auto px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white transition font-medium text-sm shadow-md"
            >
              <FaPlus size={14} />
              New Chat
            </button>
          )}

          {/* History List */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {sidebarState === "mini" ? (
              history.map((item) => (
                <button
                  key={item.id}
                  className="w-full p-3 rounded-lg hover:bg-indigo-100 transition text-indigo-600 hover:text-indigo-700 flex justify-center"
                  title={item.product}
                >
                  <FaHistory size={16} />
                </button>
              ))
            ) : sidebarState === "full" && (loading ? (
              <div className="text-center py-12 text-indigo-400 text-sm">Loading...</div>
            ) : history && history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-indigo-50/50 hover:bg-indigo-100/60 border border-indigo-100 hover:border-indigo-200 transition group relative"
                >
                  <div className="flex items-start gap-3 pr-8">
                    <div className="flex-shrink-0 mt-1">
                      <FaHistory className="text-indigo-500 text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-indigo-900 truncate">
                        {item.product}
                      </p>
                      <p className="text-xs text-indigo-600 line-clamp-2 mt-1">
                        {item.preview}
                      </p>
                      <p className="text-xs text-indigo-400 mt-2">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button on Hover */}
                  <button
                    onClick={() => handleDeleteCaption(item.id)}
                    className="absolute top-3 right-2 p-2 rounded-md bg-red-100/0 hover:bg-red-100 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                    title="Delete"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-indigo-400 text-sm">
                No history yet.
                <br />
                Generate your first caption!
              </div>
            ))}
          </div>

          {/* User Profile Footer */}
          {sidebarState === "full" && (
            <div className="border-t border-indigo-100 p-4 bg-indigo-50/30">
              <div className="flex items-center gap-3 relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-indigo-500">
                    {localStorage.getItem("access") ? "Verified" : "Guest"}
                  </p>
                </div>

                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-2 hover:bg-indigo-200 rounded-lg text-indigo-600 transition"
                >
                  <FaChevronDown size={12} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-indigo-200 rounded-lg shadow-xl overflow-hidden z-50">
                    <button className="w-full text-left px-4 py-2 text-sm text-indigo-900 hover:bg-indigo-100 flex items-center gap-2 transition">
                      <FaUser size={12} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition border-t border-indigo-100"
                    >
                      <FaSignOutAlt size={12} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && sidebarState === "closed" && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-40 p-3 bg-white border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition shadow-lg"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Overlay for Mobile */}
      {isMobile && sidebarState === "full" && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/30 z-20"
        />
      )}
    </>
  );
}