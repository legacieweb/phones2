import { Link } from 'react-router-dom';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Shipping Policy</h1>
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Delivery Areas</h2>
            <p className="text-gray-600 leading-relaxed">
              PhoneStore ships to all locations within the continental United States. Additional shipping fees may apply for orders to Alaska, Hawaii, Puerto Rico, and other US territories. International shipping is currently not available.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Processing Time</h2>
            <p className="text-gray-600 leading-relaxed">
              Orders are processed within 1-2 business days after payment confirmation. Business days are Monday through Friday, excluding public holidays. You will receive a confirmation email once your order has been shipped with tracking information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Estimated Delivery Times</h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>Standard Shipping (5-7 business days)</p>
              <p>Expedited Shipping (2-3 business days)</p>
              <p>Next-Day Shipping (1 business day, order before 2 PM)</p>
              <p className="text-sm text-gray-400 mt-2">Delivery times are estimates and are not guaranteed. Delays may occur due to unforeseen circumstances beyond our control.</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping Rates</h2>
            <p className="text-gray-600 leading-relaxed">
              Shipping charges are calculated based on order weight, dimensions, and destination at checkout. PhoneStore offers free standard shipping on all orders over $500. Rates shown at the time of checkout are final.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Order Tracking</h2>
            <p className="text-gray-600 leading-relaxed">
              Once your order has been shipped, you will receive an email with a tracking number and a link to track your package. You can also view your order status and tracking information in your PhoneStore account dashboard.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Shipping Restrictions</h2>
            <p className="text-gray-600 leading-relaxed">
              Some products may have shipping restrictions due to carrier limitations or legal regulations. If an item cannot be shipped to your address, we will notify you and provide options to modify or cancel your order. We are not liable for delays or non-delivery resulting from inaccurate address information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Lost or Damaged Packages</h2>
            <p className="text-gray-600 leading-relaxed">
              PhoneStore is not responsible for lost or damaged packages after delivery has been confirmed with the carrier. If your package is marked as delivered but you have not received it, please contact the carrier directly. For damaged items, please take photos and contact our support team within 48 hours of delivery.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For any shipping-related questions or concerns, please contact us at support@phonestore.com or call +1 (555) 123-4567.
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
