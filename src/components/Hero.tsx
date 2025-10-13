import React from 'react';
import { Play } from 'lucide-react';
import HeroIllustration from './HeroIllustration';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white text-gray-900 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-wide uppercase text-gray-500">
                From Agenda to Action, Simplified!
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-black">
                Transform Your
                <span className="block">Meetings Into</span>
                <span className="block">Action Items</span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-xl">
                Record, transcribe, and extract actionable insights from every meeting. Plus comprehensive
                leave management, time tracking, and AI-powered workplace automation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-2.5 rounded-full bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-all shadow">
                Try for Free
              </button>
              <button className="px-6 py-2.5 rounded-full border-2 border-cyan-600 text-cyan-600 font-semibold hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5 text-cyan-600" />
                Watch a Demo
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-black">24/7</p>
                <p className="text-gray-500 text-sm">AI Assistant</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-black">99%</p>
                <p className="text-gray-500 text-sm">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold text-black">50+</p>
                <p className="text-gray-500 text-sm">Integrations</p>
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="relative lg:flex lg:justify-end">
            <div className="w-full sm:w-[24rem] lg:w-[28rem]">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;