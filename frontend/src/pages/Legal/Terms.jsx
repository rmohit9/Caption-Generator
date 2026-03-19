import React, { useEffect } from "react";
import FloatingHashSymbols from "../../components/Hashtag";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Terms = () => {
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Terms & Conditions</h1>
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">1.</span> Introduction</h2>
              <p>
                These Terms & Conditions govern your access to and use of Graphura's
                website, services, tools, and digital platforms. By accessing or
                using our services, you agree to be legally bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">2.</span> Eligibility</h2>
              <p>
                You must be at least 18 years old or legally capable of entering
                into a binding contract under applicable law to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">3.</span> Services</h2>
              <p className="mb-2">
                Graphura provides digital tools, data services, and technology
                solutions. Services may be modified, suspended, or discontinued at
                any time.
              </p>
              <p>
                Use of our services is subject to compliance with applicable laws
                and internal policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">4.</span> User Responsibilities</h2>
              <ul className="list-disc list-inside ml-2 space-y-2 marker:text-[#f08a5d]">
                <li><span className="text-slate-700">Provide accurate and complete information</span></li>
                <li><span className="text-slate-700">Maintain confidentiality of login credentials</span></li>
                <li><span className="text-slate-700">Use services only for lawful purposes</span></li>
                <li><span className="text-slate-700">Avoid misuse, abuse, or unauthorized access</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">5.</span> Intellectual Property</h2>
              <p>
                All content, trademarks, software, and intellectual property belong
                to Graphura unless otherwise stated. Unauthorized use is strictly
                prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">6.</span> Client Projects</h2>
              <p>
                Project deliverables, timelines, and ownership terms will be
                defined separately in written agreements or proposals.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">7.</span> Payments & Billing</h2>
              <p>
                Fees, payment schedules, and refund policies are communicated
                prior to service activation. Payments are generally non-refundable
                unless stated.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">8.</span> Privacy & Cookies</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy
                and Cookie Policy, which explain how we collect and protect
                personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">9.</span> Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. Graphura
                is not responsible for external content or practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">10.</span> Warranties & Disclaimer</h2>
              <p>
                Services are provided "as is" without warranties of any kind. We
                do not guarantee uninterrupted or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">11.</span> Limitation of Liability</h2>
              <p>
                Graphura shall not be liable for indirect, incidental, or
                consequential damages arising from service usage.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">12.</span> Termination</h2>
              <p>
                We reserve the right to suspend or terminate access for violations
                of these terms or misuse of services.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 flex items-center gap-2"><span className="text-[#f08a5d]">13.</span> Governing Law</h2>
              <p>
                These Terms & Conditions are governed by the laws of India. Any
                disputes shall be subject to the jurisdiction of Indian courts.
              </p>
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

export default Terms;