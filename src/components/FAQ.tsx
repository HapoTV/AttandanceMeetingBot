import React from 'react';

const faqs = [
  { q: 'Is my data secure?', a: 'Yes. We use encryption in transit and at rest, least-privilege access, and regular security reviews.' },
  { q: 'Do you support Zoom/Teams/Meet?', a: 'Yes. We offer native integrations with Zoom, Microsoft Teams, and Google Meet.' },
  { q: 'How does pricing work?', a: 'Simple per-seat pricing with monthly or annual billing. Volume discounts available.' },
  { q: 'Do you offer a free trial?', a: 'Yes. Start with a 14-day free trial. No credit card required.' },
  { q: 'Can I export my data?', a: 'You can export recordings, transcripts, and action items at any time.' },
  { q: 'What support is included?', a: '24/7 email support plus priority channels for Enterprise plans.' },
  { q: 'Where is my data stored?', a: 'We use reputable cloud providers with regional options subject to plan availability.' },
  { q: 'Does AI Lab work for both remote and in-person meetings?', a: 'Yes. Capture outcomes from virtual meetings and in-room sessions alike using recordings or quick notes.' },
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-white scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-gray-600">Get answers to the most common questions about our product and services.</p>
        </div>

        {/* Two-column card grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="font-medium text-gray-900">{item.q}</span>
                {/* Chevron icon */}
                <svg className="ml-4 h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-gray-700">{item.a}</p>
            </details>
          ))}
        </div>

        {/* Bottom helper + CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Still have questions? We’re here to help.</p>
          <a href="#live-demo" className="mt-3 inline-flex items-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Contact Our Team</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
