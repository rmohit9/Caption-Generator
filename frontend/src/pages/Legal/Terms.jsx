import React, { useEffect } from "react";
import FloatingHashSymbols from "../../components/Hashtag";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #fff0f5 0%, #fce4ec 20%, #fdf2f8 40%, #fff0fb 60%, #fce8f5 80%, #fff5f7 100%)",
      }}
    >
      <FloatingHashSymbols count={100} opacity={0.1} />

      <main className="flex-grow pt-20 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-indigo-200/30 border border-indigo-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">
              Website:{" "}
              <a href="https://graphura.in" className="text-blue-600 hover:underline">
                https://graphura.in
              </a>{" "}
              • Graphura India Private Limited • Patudi, Gurugram, Haryana — 122503
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Effective Date: November 25, 2025
            </p>
          </div>

          <div className="space-y-6 text-gray-800">

            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                These Terms & Conditions govern your access to and use of Graphura's
                website, services, tools, and digital platforms. By accessing or
                using our services, you agree to be legally bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years old or legally capable of entering
                into a binding contract under applicable law to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Services</h2>
              <p>
                Graphura provides digital tools, data services, and technology
                solutions. Services may be modified, suspended, or discontinued at
                any time.
              </p>
              <p className="mt-2">
                Use of our services is subject to compliance with applicable laws
                and internal policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. User Responsibilities</h2>
              <ul className="list-disc list-inside ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain confidentiality of login credentials</li>
                <li>Use services only for lawful purposes</li>
                <li>Avoid misuse, abuse, or unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
              <p>
                All content, trademarks, software, and intellectual property belong
                to Graphura unless otherwise stated. Unauthorized use is strictly
                prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Client Projects</h2>
              <p>
                Project deliverables, timelines, and ownership terms will be
                defined separately in written agreements or proposals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Payments & Billing</h2>
              <p>
                Fees, payment schedules, and refund policies are communicated
                prior to service activation. Payments are generally non-refundable
                unless stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Privacy & Cookies</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy
                and Cookie Policy, which explain how we collect and protect
                personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. Graphura
                is not responsible for external content or practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Warranties & Disclaimer</h2>
              <p>
                Services are provided "as is" without warranties of any kind. We
                do not guarantee uninterrupted or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
              <p>
                Graphura shall not be liable for indirect, incidental, or
                consequential damages arising from service usage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Termination</h2>
              <p>
                We reserve the right to suspend or terminate access for violations
                of these terms or misuse of services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Governing Law</h2>
              <p>
                These Terms & Conditions are governed by the laws of India. Any
                disputes shall be subject to the jurisdiction of Indian courts.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;