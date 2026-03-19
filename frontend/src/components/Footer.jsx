import React from 'react';

export default function Footer() {
  return (
    <footer
      className="relative z-10 py-16 px-4 border-t border-orange-200/40"
      style={{ backgroundColor: "#fff7ed" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          
          {/* Left Column with Logo */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              
              {/* Graphura Logo */}
              <img
                src="https://www.graphura.in/image/bg%20removed.webp"
                alt="Graphura Logo"
                className="h-14 w-auto object-contain"
                style={{ backgroundColor: "transparent" }}
              />
            </div>

            <p className="text-sm leading-relaxed max-w-xs text-orange-700/60 font-medium mb-6">
              AI-powered social media caption and hashtag generator trusted by marketing teams worldwide. Save time, grow faster.
            </p>

            {/* Social Buttons */}
            <div className="flex gap-3">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "📸", label: "Instagram" },
                { icon: "▶", label: "YouTube" },
              ].map((s) => (
                <button
                  key={s.label}
                className="w-10 h-10 rounded-2xl bg-[#f08a5d] border border-orange-200/60 flex items-center justify-center text-sm text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-200 shimmer-btn"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {[
            { title: "Product", links: ["Features", "How It Works", "Pricing", "Changelog", "Roadmap"] },
            { title: "Platforms", links: ["Instagram", "LinkedIn", "Twitter / X", "TikTok", "YouTube"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-black text-orange-900 text-xs uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-orange-700/60 hover:text-orange-600 font-semibold transition-colors hover:translate-x-1 inline-block transition-transform"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom - Right Aligned */}
        <div className="border-t border-orange-200/60 pt-8 flex justify-end items-center">
          <div className="flex gap-6 text-xs">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-orange-400 hover:text-orange-600 font-semibold transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}