import React from 'react'
import Navbar from '../components/Navbar'

const CookiePolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Dev-connect Cookie Policy</h1>

          <p className="text-gray-700 mb-6">We use cookies and similar technologies to provide, protect, and improve Dev-connect. This Cookie Policy explains what cookies we use and why.</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
            <p className="text-gray-700">Cookies are small data files placed on your device that help websites remember your preferences and activity.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Types of Cookies We Use</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li><strong>Essential:</strong> Required for authentication, account security, and the core functionality of the site.</li>
              <li><strong>Performance & Analytics:</strong> Help us understand platform usage to improve features and reliability.</li>
              <li><strong>Functional:</strong> Store user preferences such as language and display options.</li>
              <li><strong>Advertising:</strong> Used by third parties for interest-based advertising (where applicable) — you can opt out via browser settings or ad preference tools.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
            <p className="text-gray-700">You can control cookies through your browser settings. Blocking certain cookies may affect functionality. For analytics, you can opt out of tracking in your account preferences (when available).</p>
          </section>

          <section className="mt-8 text-sm text-gray-500">
            <p>Questions about cookies? Email privacy@dev-connect.example</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default CookiePolicy
