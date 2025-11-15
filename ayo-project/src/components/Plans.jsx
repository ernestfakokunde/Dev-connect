import React from 'react';

const plans = () => {
  return (
    <div className="flex flex-wrap gap-5 justify-center text-center items-center p-9">
      {/* Free Plan */}
      <div className="flex flex-col justify-between items-center bg-[#111827] text-white font-bold w-[250px] h-[400px] rounded-2xl shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
          <p className="text-sm text-gray-50 mb-4">For individuals just getting started</p>
          <ul className="text-left space-y-2 text-sm">
            <li>✅ Access to basic features</li>
            <li>✅ Community support</li>
            <li>✅ Limited storage (500MB)</li>
            <li>✅ One active project</li>
            <li>✅ Email notifications</li>
          </ul>
        </div>
        <button className="mt-6 bg-gray-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-gray-700 transition">
          Choose Free
        </button>
      </div>

      {/* Premium Plan */}
      <div className="flex flex-col justify-between items-center bg-[#111827] font-bold text-white w-[250px] h-[400px] rounded-2xl shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
          <p className="text-sm text-gray-100 mb-4 font-bold">For teams and professionals</p>
          <ul className="text-left space-y-2 text-sm">
            <li>🌟 Unlimited projects</li>
            <li>🌟 Advanced analytics</li>
            <li>🌟 Priority support</li>
            <li>🌟 10GB cloud storage</li>
            <li>🌟 Team collaboration tools</li>
          </ul>
        </div>
        <button className="mt-6 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-500 transition">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default plans;
