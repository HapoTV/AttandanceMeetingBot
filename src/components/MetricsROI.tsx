import React from 'react';

const MetricsROI: React.FC = () => {
  const stats = [
    { label: 'Weekly time saved', value: '8–12h' },
    { label: 'Fewer no‑shows', value: '25–40%' },
    { label: 'Faster follow‑ups', value: '3×' },
  ];

  

  return (
    <section id="metrics" className="py-20 bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What you’ll achieve with AI Lab</h2>
          <p className="mt-4 text-gray-600">Outcomes teams can expect when running meetings with our platform.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
              <div className="mt-1 text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default MetricsROI;
