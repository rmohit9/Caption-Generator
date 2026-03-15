import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaEllipsisV,
  FaUser,
  FaSignOutAlt,
  FaTrash,
  FaChevronDown
} from "react-icons/fa";

// Mock caption history data
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
  {
    id: 3,
    product: "Vegan Snacks",
    preview:
      "Crunchy, healthy, and guilt-free – our new protein bars are the perfect on-the-go snack.",
    date: "3 days ago",
  },
  {
    id: 4,
    product: "Eco Water Bottle",
    preview:
      "Stay hydrated and save the planet. Our stainless steel bottles keep drinks cold for 24h.",
    date: "1 week ago",
  },
];

export default function CaptionHistorySidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarState, setSidebarState] = useState("full");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarState((prev) => (prev === "closed" ? "full" : "closed"));
    } else {
      setSidebarState((prev) => (prev === "full" ? "mini" : "full"));
    }
  };

  let widthClass = "";
  if (sidebarState === "full") widthClass = "w-80";
  else if (sidebarState === "mini") widthClass = "w-20";
  else widthClass = "w-0";

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen ${widthClass
          } bg-white/80 backdrop-blur-xl border-r border-indigo-100 shadow-xl z-30 transform transition-all duration-300 ${isMobile && sidebarState === "closed" ? "-translate-x-full" : "translate-x-0"
          } ${!isMobile && sidebarState === "mini" ? "overflow-hidden" : ""}`}
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="p-5 border-b border-indigo-100 flex items-center justify-between">
            {sidebarState === "full" ? (
              <>
                <h3 className="font-black text-indigo-800 flex items-center gap-2">
                  <FaHistory /> History
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 hover:bg-indigo-100 rounded text-indigo-600"
                    aria-label="New caption"
                    title="New caption"
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-indigo-100 rounded md:hidden"
                    aria-label="Toggle sidebar"
                  >
                    <FaChevronLeft />
                  </button>
                </div>
              </>
            ) : sidebarState === "mini" ? (
              <>
                <FaHistory className="text-indigo-800 text-xl mx-auto" />

                <button
                  onClick={toggleSidebar}
                  className="p-1 hover:bg-indigo-100 rounded absolute right-2"
                  aria-label="Expand sidebar"
                >
                  <FaChevronRight />
                </button>
              </>
            ) : null}
          </div>

          {/* History items (ONLY THIS SCROLLS) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {sidebarState === "mini"
              ? mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-center p-2 rounded-xl hover:bg-indigo-50 transition"
                >
                  <FaHistory className="text-indigo-400 text-lg" />
                </div>
              ))
              : sidebarState === "full" &&
              mockHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/50 border border-indigo-100 hover:shadow-md cursor-pointer transition relative"
                >
                  <div className="flex items-start justify-between">

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {item.product}
                      </p>

                      <p className="text-xs text-slate-500 truncate">
                        {item.preview}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-indigo-400 whitespace-nowrap">
                        {item.date}
                      </span>

                      {/* 3 DOT MENU */}
                      <div className="relative group">

                        <button
                          className="p-1 rounded-full hover:bg-indigo-100 transition text-indigo-400"
                        >
                          <FaEllipsisV size={12} />
                        </button>

                        <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-indigo-100 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">

                          <button
                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                            onClick={() => console.log("Delete", item.id)}
                          >
                            <FaTrash size={10} />
                            Delete
                          </button>

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Profile */}
          {sidebarState === "full" && (
            <div className="border-t border-indigo-100 p-4">

              <div className="flex items-center gap-3 relative">

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  JD
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    John Doe
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    john@example.com
                  </p>
                </div>

                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-1 hover:bg-indigo-100 rounded text-indigo-600"
                >
                  <FaChevronDown size={12} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-indigo-100 rounded-lg shadow-lg overflow-hidden">

                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 flex items-center gap-2">
                      <FaUser size={12} />
                      Profile
                    </button>

                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <FaSignOutAlt size={12} />
                      Logout
                    </button>

                  </div>
                )}

              </div>

            </div>
          )}
        </div>
      </div>

      {/* Mobile open button */}
      {isMobile && sidebarState === "closed" && (
        <button
          onClick={toggleSidebar}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-r-xl p-3 shadow-lg hover:bg-indigo-50 transition"
        >
          <FaChevronRight className="text-indigo-600" />
        </button>
      )}
    </>
  );
}