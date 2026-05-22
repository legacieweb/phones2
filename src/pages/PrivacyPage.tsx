import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information you provide directly to us when you create an account, place an order, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information. We also collect certain information automatically when you visit our site, such as your IP address, browser type, and device information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to process your orders, provide customer support, improve our products and services, send you updates and promotional communications, and detect and prevent fraud or abuse.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting business, or serving our users, subject to confidentiality obligations.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Disabling cookies may affect the functionality of certain features on our website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information. You may also object to certain types of processing and request data portability. To exercise these rights, please contact us through our support page.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the effective date. Your continued use of PhoneStore after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions or concerns regarding this Privacy Policy, please reach out to us at privacy@phonestore.com.
            </p>
          </section>
          <div className="pt-4">
            <Link to="/" className="text-primary-600 font-semibold hover:text-primary-700">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
