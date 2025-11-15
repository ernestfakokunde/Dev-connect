import React from 'react'
import Navbar from '../components/Navbar'

const Compliance = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Compliance & Legal</h1>

          <p className="text-gray-700 mb-6">Dev-connect is committed to complying with applicable laws and regulations, including data protection and intellectual property rules.</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
            <p className="text-gray-700">We follow reasonable organizational and technical measures to protect user data. For users in jurisdictions with specific privacy laws (e.g., GDPR), we honor rights requests for access, correction, and deletion where applicable.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
            <p className="text-gray-700">Users should only post content they own or have rights to share. If you believe your IP has been infringed, follow our takedown procedure by contacting copyright@dev-connect.example with required details.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Law Enforcement & Legal Requests</h2>
            <p className="text-gray-700">We comply with valid legal requests where required. We will notify users of requests for their data unless legally prohibited.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Accessibility & Equal Opportunity</h2>
            <p className="text-gray-700">We strive to make Dev-connect accessible. If you encounter accessibility issues, please contact accessibility@dev-connect.example.</p>
          </section>

          <section className="mt-8 text-sm text-gray-500">
            <p>For legal inquiries contact legal@dev-connect.example</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Compliance
