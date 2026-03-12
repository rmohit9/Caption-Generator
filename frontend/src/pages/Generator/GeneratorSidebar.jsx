import React, { useState, useEffect } from 'react';
import {
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaHistory,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

// Mock history data
const mockHistory = [
    {
        id: 1,
        product: "Organic Green Tea",
        platforms: ["instagram", "linkedin"],
        preview: "Refresh your mornings with nature's purest energy...",
        date: "2 hours ago",
    },
    {
        id: 2,
        product: "Fitness App",
        platforms: ["twitter", "facebook"],
        preview: "Transform your workout routine with AI-powered coaching...",
        date: "Yesterday",
    },
    {
        id: 3,
        product: "Vegan Snacks",
        platforms: ["instagram", "twitter"],
        preview: "Crunchy, healthy, and guilt-free – our new protein bars...",
        date: "3 days ago",
    },
];

const PLATFORMS = [
    { id: "instagram", name: "Instagram", icon: <FaInstagram />, color: "from-pink-400 to-rose-500" },
    { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin />, color: "from-blue-500 to-cyan-500" },
    { id: "twitter", name: "Twitter / X", icon: <FaTwitter />, color: "from-sky-400 to-cyan-400" },
    { id: "facebook", name: "Facebook", icon: <FaFacebook />, color: "from-indigo-500 to-blue-500" },
];

export default function GeneratorSidebar() {
    const [isMobile, setIsMobile] = useState(false);
    // State can be 'full', 'mini', or 'closed' (closed only on mobile)
    const [sidebarState, setSidebarState] = useState('full');

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // On mobile, start closed; on desktop, start full
            setSidebarState(mobile ? 'closed' : 'full');
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            // On mobile: toggle between closed and full
            setSidebarState(prev => prev === 'closed' ? 'full' : 'closed');
        } else {
            // On desktop: toggle between full and mini
            setSidebarState(prev => prev === 'full' ? 'mini' : 'full');
        }
    };

    const isOpen = sidebarState !== 'closed';
    let widthClass = '';
    if (sidebarState === 'full') widthClass = 'w-80';
    else if (sidebarState === 'mini') widthClass = 'w-20';
    else widthClass = 'w-0';

    return (
        <>
            {/* Sidebar */}
            <div
                className={`${isMobile ? 'fixed' : 'relative'} inset-y-0 left-0 z-30 ${widthClass} bg-white/80 backdrop-blur-xl border-r border-indigo-100 shadow-xl transform transition-all duration-300 ${
                    isMobile && sidebarState === 'closed' ? '-translate-x-full' : 'translate-x-0'
                } ${!isMobile && sidebarState === 'mini' ? 'overflow-hidden' : ''}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b border-indigo-100 flex items-center justify-between">
                        {sidebarState !== 'mini' ? (
                            <h3 className="font-black text-indigo-800 flex items-center gap-2">
                                <FaHistory /> History
                            </h3>
                        ) : (
                            <FaHistory className="text-indigo-800 text-xl mx-auto" />
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-1 hover:bg-indigo-100 rounded"
                            aria-label="Toggle sidebar"
                        >
                            {isMobile ? (
                                <FaChevronLeft />
                            ) : (
                                <FaChevronLeft className={`transform transition-transform ${sidebarState === 'mini' ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                    </div>

                    {/* History items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {sidebarState === 'mini' ? (
                            // Mini view: show only platform icons for each history item
                            mockHistory.map((item) => (
                                <div key={item.id} className="flex justify-center gap-1 p-2 rounded-xl hover:bg-indigo-50 transition">
                                    {item.platforms.map((p) => {
                                        const platform = PLATFORMS.find((pl) => pl.id === p);
                                        return <span key={p} className="text-lg">{platform?.icon}</span>;
                                    })}
                                </div>
                            ))
                        ) : sidebarState !== 'closed' ? (
                            // Full view: show details
                            mockHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 rounded-xl bg-white/50 border border-indigo-100 hover:shadow-md cursor-pointer transition group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {item.platforms.map((p) => {
                                            const platform = PLATFORMS.find((pl) => pl.id === p);
                                            return <span key={p} className="text-sm">{platform?.icon}</span>;
                                        })}
                                        <span className="text-xs text-indigo-400 ml-auto">{item.date}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700 truncate">{item.product}</p>
                                    <p className="text-xs text-slate-500 truncate">{item.preview}</p>
                                </div>
                            ))
                        ) : null}
                    </div>

                    {/* Footer */}
                    {sidebarState === 'full' && (
                        <div className="p-4 border-t border-indigo-100">
                            <button className="w-full text-sm text-indigo-600 font-semibold hover:underline">
                                View All History →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile open button when closed */}
            {isMobile && sidebarState === 'closed' && (
                <button
                    onClick={toggleSidebar}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-r-xl p-3 shadow-lg hover:bg-indigo-50 transition"
                    aria-label="Open sidebar"
                >
                    <FaChevronRight className="text-indigo-600" />
                </button>
            )}
        </>
    );
}