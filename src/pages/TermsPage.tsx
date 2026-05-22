import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Terms of Service</h1>
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using PhoneStore, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use License</h2>
            <p className="text-gray-600 leading-relaxed">
              Permission is granted to temporarily access and use PhoneStore for personal, non-commercial purposes. This license does not include modifying, copying, or using content for any commercial purpose without express written consent.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. PhoneStore reserves the right to refuse service or terminate accounts at its sole discretion.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Product Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, colors, or other content is accurate, complete, or error-free. In the event of a pricing error, PhoneStore reserves the right to cancel any order placed at the incorrect price.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Payment Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Payment is required at the time of order placement. We accept major credit cards and other payment methods as displayed during checkout. By providing payment information, you represent that you are authorized to use the payment method presented.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              PhoneStore shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use our service. Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to such liability.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              PhoneStore reserves the right to modify or replace these terms at any time. Your continued use of the service following any changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at legal@phonestore.com.
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
