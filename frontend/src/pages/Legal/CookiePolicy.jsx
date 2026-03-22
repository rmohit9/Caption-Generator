import React, { useEffect } from "react";
import FloatingHashSymbols from "../../components/Hashtag";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fff7ed] font-inter">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-1/4 -left-24 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block">
          <FloatingHashSymbols count={100} opacity={0.15} />
      </div>

      <Navbar />

      <main className="flex-grow pt-32 pb-16 relative z-20">
        <div className="container mx-auto px-4 max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-orange-200/50 border border-orange-100 animate-fade-up">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Cookie Policy</h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base mb-4 leading-loose">
              Website:{" "}
              <a href="https://graphura.in" className="font-bold text-[#f08a5d] hover:text-[#d97346] hover:underline transition-colors">
                https://graphura.in
              </a>{" "}
              <br className="sm:hidden" />
              <span className="hidden sm:inline mx-2 text-slate-300">•</span> Graphura India Private Limited <br className="sm:hidden" />
              <span className="hidden sm:inline mx-2 text-slate-300">•</span> Patudi, Gurugram, Haryana — 122503
            </p>
            <p className="text-xs sm:text-sm text-[#f08a5d] font-bold bg-orange-50 inline-block px-5 py-2 rounded-full border border-orange-200 shadow-sm uppercase tracking-widest">
              Effective Date: November 25, 2025
            </p>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed font-medium text-sm sm:text-base">

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">1.</span> What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you visit a
                website. They help improve user experience by remembering preferences
                and interactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">2.</span> How We Use Cookies</h2>
              <p className="mb-2">Graphura uses cookies to:</p>
              <ul className="list-disc list-inside ml-2 space-y-2 marker:text-[#f08a5d]">
                <li><span className="text-slate-700">Ensure proper website functionality</span></li>
                <li><span className="text-slate-700">Analyze website traffic and performance</span></li>
                <li><span className="text-slate-700">Improve user experience and services</span></li>
                <li><span className="text-slate-700">Remember user preferences</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">3.</span> Types of Cookies We Use</h2>
              <ul className="list-disc list-inside ml-2 space-y-2 marker:text-[#f08a5d]">
                <li><span className="text-slate-700"><strong className="text-slate-800">Essential Cookies:</strong> Required for website operation</span></li>
                <li><span className="text-slate-700"><strong className="text-slate-800">Performance Cookies:</strong> Help analyze user behavior</span></li>
                <li><span className="text-slate-700"><strong className="text-slate-800">Functional Cookies:</strong> Remember preferences</span></li>
                <li><span className="text-slate-700"><strong className="text-slate-800">Analytics Cookies:</strong> Used for statistical insights</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">4.</span> Third-Party Cookies</h2>
              <p>
                We may use trusted third-party services (e.g., analytics providers)
                that set cookies to collect usage data.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">5.</span> Managing Cookies</h2>
              <p>
                You can control or delete cookies through your browser settings.
                Disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">6.</span> Cookie Duration</h2>
              <p>
                Cookies may be session-based (deleted after you close the browser)
                or persistent (stored for a defined period).
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">7.</span> Changes to This Cookie Policy</h2>
              <p>
                Graphura may update this Cookie Policy periodically. Continued use
                of the website constitutes acceptance of changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-5 flex items-center gap-2"><span className="text-[#f08a5d]">8.</span> Contact Information</h2>
              <div className="bg-orange-50/50 border border-orange-100 p-6 sm:p-8 rounded-2xl shadow-inner text-sm space-y-3">
                <div>
                    <span className="block text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1">Company</span>
                    <p className="font-bold text-slate-800">Graphura India Private Limited</p>
                </div>
                <div>
                    <span className="block text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1">Address</span>
                    <p className="font-medium text-slate-600">Patudi, Gurugram, Haryana — 122503</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-2 border-t border-orange-100/50">
                    <div>
                        <span className="block text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1">Email</span>
                        <a href="mailto:support@graphura.in" className="font-bold text-slate-700 hover:text-[#d97346] hover:underline transition-colors">
                        support@graphura.in
                        </a>
                    </div>
                    <div>
                        <span className="block text-xs font-black text-[#f08a5d] uppercase tracking-widest mb-1">Website</span>
                        <a href="https://graphura.in" className="font-bold text-slate-700 hover:text-[#d97346] hover:underline transition-colors">
                        https://graphura.in
                        </a>
                    </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      
      <Footer />

      <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
          @keyframes floatY { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
          .animate-float { animation: floatY 6s ease-in-out infinite; }
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default CookiePolicy;