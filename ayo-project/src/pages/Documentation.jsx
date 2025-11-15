import React from 'react'
import Navbar from '../components/Navbar'

const Documentation = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Dev-connect Documentation</h1>

          <p className="text-gray-700 mb-6">This documentation provides an overview of the platform, developer APIs, integration points, and guides for common tasks.</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700">Dev-connect is a developer-focused social platform with features for posting projects, messaging, joining groups, and a marketplace for services. The platform is built with a React frontend and Node/Express backend.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">API Endpoints</h2>
            <p className="text-gray-700">Common endpoints (example):</p>
            <ul className="list-disc list-inside text-gray-700">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/posts</code> — list posts</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/auth/register</code> — register user</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/project</code> — create project listing</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Authentication</h2>
            <p className="text-gray-700">Dev-connect uses token-based authentication. Obtain a token via the login endpoint and include it in the `Authorization` header for protected routes.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">WebSocket & Real-time</h2>
            <p className="text-gray-700">Real-time messaging is powered by sockets. Connect to the socket server and authenticate using your token to participate in real-time chats and notifications.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Front-end Integration</h2>
            <p className="text-gray-700">The front-end provides reusable hooks and context for authentication and socket handling. Check `src/context` for `context.jsx` and `SocketContext.jsx`.</p>
          </section>

          <section className="mt-8 text-sm text-gray-500">
            <p>Need more details? Open an issue in the repository or contact devs@dev-connect.example</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default Documentation
