import { Link } from 'react-router-dom';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Returns &amp; Refunds</h1>
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Return Eligibility</h2>
            <p className="text-gray-600 leading-relaxed">
              Items purchased from PhoneStore may be returned within 30 days of delivery, provided they are in original condition with all accessories, packaging, and documentation included. Opened electronics are subject to a 20% restocking fee unless defective upon arrival. Customized or personalized items are non-returnable.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How to Initiate a Return</h2>
            <p className="text-gray-600 leading-relaxed">
              To initiate a return, sign in to your PhoneStore account and navigate to the Orders section. Select the order containing the item you wish to return, click "Request Return," and follow the instructions. You will receive a prepaid return shipping label and a confirmation email once your return request is approved.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Return Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              PhoneStore provides free return shipping for defective or incorrect items. For all other eligible returns, a flat return shipping fee of $9.99 will be deducted from your refund. Returns received without the provided return label may be refused or subject to additional fees.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Refunds are issued to the original payment method within 7-10 business days after we receive and inspect the returned item. Shipping fees are non-refundable unless the return is due to our error or a defective product. Refunds for gift cards are issued as store credit.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Exchanges</h2>
            <p className="text-gray-600 leading-relaxed">
              If you received a defective or incorrect product, we will happily arrange an exchange for the correct item at no additional cost. For size or color exchanges, please process a return and place a new order. Items must be in original condition and within the return window.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Warranty Claims</h2>
            <p className="text-gray-600 leading-relaxed">
              Products covered under manufacturer warranty are not eligible for returns through PhoneStore. Please contact the manufacturer directly for warranty service. We are happy to provide the manufacturer contact information and relevant documentation upon request.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Refused or Unclaimed Packages</h2>
            <p className="text-gray-600 leading-relaxed">
              If a return package is refused by our warehouse or if a refund package is unclaimed, PhoneStore reserves the right to reship the item, deduct reasonable restocking fees, or issue a refund minus shipping and handling charges.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about returns or refunds, please contact our support team at support@phonestore.com or call +1 (555) 123-4567.
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
