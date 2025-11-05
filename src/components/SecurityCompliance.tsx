import React from 'react';

const SecurityCompliance: React.FC = () => {
  return (
    <section id="security" className="py-20 bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Security & Compliance</h2>
          <p className="mt-4 text-gray-600">We prioritize data privacy and enterprise-grade security across the platform.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-900">Data Privacy</h3>
            <p className="mt-2 text-sm text-gray-600">Granular access controls and least-privilege principles. Customer data is isolated per tenant.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-900">Encryption</h3>
            <p className="mt-2 text-sm text-gray-600">Encryption in transit (TLS 1.2+) and at rest (AES-256). Secret management best practices.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-900">Retention Policy</h3>
            <p className="mt-2 text-sm text-gray-600">Configurable retention windows and export on request. Role-based deletion workflows.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">GDPR-ready</span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">SSO</span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">SOC 2 (in progress)</span>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
