// frontend/src/pages/PrivacyPolicy.jsx
import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">
          Your privacy is important to us. Please read below to understand how
          we handle your data.
        </p>
      </motion.div>

      <motion.div
        className="prose prose-lg text-gray-700 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <section>
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect personal information such as name, email, and payment
            details when you sign up for our services. We also collect usage
            data to improve user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
          <p>
            The information we collect is used to provide, maintain, and improve
            our services, personalize your experience, and send important
            updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. Data Security</h2>
          <p>
            We implement advanced security measures, encryption, and access
            controls to ensure your data is protected against unauthorized
            access or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
          <p>
            We may use trusted third-party services for payments, analytics, and
            communication. These providers have access to your data only to
            perform their tasks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal data.
            Contact us at{" "}
            <a
              href="mailto:support@cogniview.com"
              className="text-indigo-600 underline"
            >
              support@cogniview.com
            </a>{" "}
            for assistance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Updates to Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated “last modified” date.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
