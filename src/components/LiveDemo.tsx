import React, { useState } from 'react';
import Poster from '../assets/Hapo_Labs_footer.png';

const LiveDemo: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="live-demo" className="py-20 bg-gray-50 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Product Tour & Live Demo</h2>
          <p className="mt-4 text-gray-600">Preview the experience and request a live walkthrough with our team.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Local placeholder for product tour video */}
          <div className="w-full">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100" style={{ paddingTop: '56.25%' }}>
              <img
                src={Poster}
                alt="Product tour placeholder"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-white text-gray-800 text-sm font-medium shadow">Video coming soon</span>
              </div>
            </div>
          </div>

          {/* Internal booking form (no external services) */}
          <div className="w-full">
            <div className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden bg-white p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900">Request received</h3>
                  <p className="mt-2 text-gray-600">We will contact you shortly to schedule your live demo.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="text-gray-700">First Name</span>
                      <input required className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="firstName" />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700">Last Name</span>
                      <input required className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="lastName" />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-gray-700">Work Email</span>
                    <input type="email" required className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="email" />
                  </label>
                  <label className="block text-sm">
                    <span className="text-gray-700">Company</span>
                    <input className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="company" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="text-gray-700">Preferred Date</span>
                      <input type="date" className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="date" />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-700">Preferred Time</span>
                      <input type="time" className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="time" />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-gray-700">How can we help?</span>
                    <textarea rows={3} className="mt-1 w-full rounded-lg border border-gray-300 p-2" name="message" />
                  </label>
                  <button type="submit" className="mt-2 inline-flex items-center justify-center w-full rounded-lg bg-cyan-600 text-white py-3 font-semibold hover:bg-cyan-700">Request Live Demo</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
