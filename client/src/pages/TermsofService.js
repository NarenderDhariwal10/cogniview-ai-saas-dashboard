// frontend/src/pages/TermsOfService.jsx
import React from "react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
        <p className="text-gray-600">
          By using Cogniview, you agree to the following terms and conditions.
        </p>
      </motion.div>

      <motion.div
        className="prose prose-lg text-gray-700 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to comply with these
            Terms of Service. If you do not agree, you must not use our
            services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Use of Services</h2>
          <p>
            You agree to use Cogniview only for lawful purposes and in
            compliance with applicable laws. Unauthorized use, including
            reselling, is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. You must notify us immediately of unauthorized
            use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Payment & Billing</h2>
          <p>
            Subscription fees are billed according to your chosen plan. Failure
            to pay may result in suspension or termination of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
          <p>
            All content, trademarks, and intellectual property belong to
            Cogniview. You may not copy, distribute, or reverse-engineer without
            permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms, without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
          <p>
            Cogniview is not liable for indirect, incidental, or consequential
            damages arising from the use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Updates will be posted on
            this page with the revised effective date.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
