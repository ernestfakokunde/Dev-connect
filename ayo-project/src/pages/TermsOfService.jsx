import React from 'react'
import Navbar from '../components/Navbar'

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Dev-connect Terms of Service</h1>
          <p className="text-gray-700 mb-6">Welcome to Dev-connect. These Terms of Service ("Terms") govern your use of our platform. By accessing or using Dev-connect you agree to be bound by these Terms.</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Using Dev-connect</h2>
            <p className="text-gray-700">Dev-connect is a community platform for developers to share projects, collaborate, message, and use the marketplace. You must be 13+ (or the minimum age in your jurisdiction) to use our services. You are responsible for all activity originating from your account.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. Accounts and Content</h2>
            <p className="text-gray-700">You retain ownership of the content you post. By posting, you grant Dev-connect a worldwide, non-exclusive, royalty-free license to host, reproduce, and display your content to provide the service. You must not post illegal, infringing, defamatory, or abusive content.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Marketplace & Transactions</h2>
            <p className="text-gray-700">If you use the Marketplace to buy or sell services or digital goods, you agree to follow the Marketplace rules. Dev-connect is a facilitator and is not responsible for the quality of third-party services, timely delivery, or disputes between buyers and sellers.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Prohibited Conduct</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Harassment, hate speech, discrimination, or threats.</li>
              <li>Posting personal data of others without consent.</li>
              <li>Impersonation or misrepresentation.</li>
              <li>Spam, scams, or misleading information.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. Enforcement & Termination</h2>
            <p className="text-gray-700">We reserve the right to remove content and suspend or terminate accounts that violate these Terms. We may also cooperate with law enforcement where required.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Disclaimers & Limitation of Liability</h2>
            <p className="text-gray-700">Dev-connect is provided "as is" and we disclaim all warranties to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
            <p className="text-gray-700">We may update these Terms occasionally. Material changes will be communicated via the platform or email when possible. Continued use after changes indicates acceptance.</p>
          </section>

          <section className="mt-8 text-sm text-gray-500">
            <p>Questions about these Terms? Contact our team via the support link in your account or email: support@dev-connect.example</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default TermsOfService
