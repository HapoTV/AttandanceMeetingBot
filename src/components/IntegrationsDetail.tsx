import React from 'react';

const cards = [
  {
    name: 'Zoom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
    points: ['One-click meeting import', 'Auto-recording and transcription', 'Action items and follow-ups'],
  },
  {
    name: 'Microsoft Teams',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg',
    points: ['Sync calendars & channels', 'Message summaries', 'Compliance-friendly storage'],
  },
  {
    name: 'Google Meet',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Google_Meet_2020_Logo.svg',
    points: ['Auto-join links', 'Attendance tracking', 'Highlights & snippets'],
  },
];

const IntegrationsDetail: React.FC = () => {
  return (
    <section id="integrations-detail" className="py-20 bg-gray-50 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Deep Integrations</h2>
          <p className="mt-4 text-gray-600">Connect your meeting stack in minutes. Get more value from Zoom, Teams, and Google Meet.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.name} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={c.logo} alt={`${c.name} logo`} className="h-8 w-auto" loading="lazy" />
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-lg bg-cyan-600 text-white py-2 text-sm font-semibold hover:bg-cyan-700">Add Integration</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsDetail;
