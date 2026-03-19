import React, { useEffect } from "react";
import FloatingHashSymbols from "../../components/Hashtag";

const Privacy = () => {
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
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-gray-600">
              Website: 
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
                Graphura India Private Limited ("Graphura", "we", "our", "us")
                respects your privacy and is committed to protecting your personal
                information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Personal details (name, email address, phone number)</li>
                <li>Account login credentials</li>
                <li>Payment and billing information</li>
                <li>Usage data, IP address, browser type</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside ml-4">
                <li>To provide and improve our services</li>
                <li>To verify user identity and prevent fraud</li>
                <li>To communicate updates and support</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Cookies & Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to improve user experience,
                analyze traffic, and personalize content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Sharing</h2>
              <p>We do not sell or rent your personal data. Information may be shared only:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>With trusted service providers</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your
                data. However, no online system is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
              <p>
                Your information is retained only as long as necessary to fulfill
                business and legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. User Rights</h2>
              <ul className="list-disc list-inside ml-4">
                <li>Access or update your personal data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Third-Party Links</h2>
              <p>
                Our website may contain links to external websites. We are not
                responsible for their privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 and we do not
                knowingly collect data from minors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p>Graphura India Private Limited</p>
                <p>Patudi, Gurugram, Haryana — 122503</p>
                <p>
                  Email:
                  <a href="mailto:support@graphura.in" className="text-blue-600 hover:underline">
                    support@graphura.in
                  </a>
                </p>
                <p>
                  Website:
                  <a href="https://graphura.in" className="text-blue-600 hover:underline">
                    https://graphura.in
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;