import React, { useEffect } from "react";
import FloatingHashSymbols from "../../components/Hashtag";

const CookiePolicy = () => {
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
            <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
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
              <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you visit a
                website. They help improve user experience by remembering preferences
                and interactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
              <p>Graphura uses cookies to:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Ensure proper website functionality</li>
                <li>Analyze website traffic and performance</li>
                <li>Improve user experience and services</li>
                <li>Remember user preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Types of Cookies We Use</h2>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Essential Cookies:</strong> Required for website operation</li>
                <li><strong>Performance Cookies:</strong> Help analyze user behavior</li>
                <li><strong>Functional Cookies:</strong> Remember preferences</li>
                <li><strong>Analytics Cookies:</strong> Used for statistical insights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Third-Party Cookies</h2>
              <p>
                We may use trusted third-party services (e.g., analytics providers)
                that set cookies to collect usage data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Managing Cookies</h2>
              <p>
                You can control or delete cookies through your browser settings.
                Disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Cookie Duration</h2>
              <p>
                Cookies may be session-based (deleted after you close the browser)
                or persistent (stored for a defined period).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Changes to This Cookie Policy</h2>
              <p>
                Graphura may update this Cookie Policy periodically. Continued use
                of the website constitutes acceptance of changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Contact Information</h2>
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

export default CookiePolicy;