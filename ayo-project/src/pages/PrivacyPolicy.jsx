import React from 'react'
import Navbar from '../components/Navbar'

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Dev-connect Privacy Policy</h1>

          <p className="text-gray-700 mb-6">This Privacy Policy explains how Dev-connect collects, uses, and shares your information when you use our services.</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="text-gray-700">We collect information you provide directly (profile data, content, messages), usage data (pages visited, features used), and device data (IP address, browser) to operate and improve the service.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Provide, maintain, and improve the platform.</li>
              <li>Personalize content and recommendations.</li>
              <li>Facilitate communication and transactions between users.</li>
              <li>Monitor and prevent harmful activities.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Cookies & Tracking</h2>
            <p className="text-gray-700">We use cookies and similar technologies for authentication, security, analytics, and personalization. See our Cookie Policy for details.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Sharing & Third Parties</h2>
            <p className="text-gray-700">We may share information with service providers (hosting, analytics, payment processors), law enforcement when required, and other users when you choose to share content publicly. We do not sell personal data.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. Your Choices</h2>
            <p className="text-gray-700">You can edit your profile, adjust notification settings, and delete account data through account settings. For data access or deletion requests, contact support.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Security</h2>
            <p className="text-gray-700">We maintain administrative, technical, and physical safeguards to protect your information. However, no service is completely secure; we encourage safe practices like using strong passwords.</p>
          </section>

          <section className="mt-8 text-sm text-gray-500">
            <p>Questions about privacy? Email us at privacy@dev-connect.example</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default PrivacyPolicy
