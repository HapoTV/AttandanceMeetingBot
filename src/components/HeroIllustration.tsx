import React from 'react';

const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* soft background bloom */}
      <div className="absolute -inset-12 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-40 blur-2xl rounded-[48px]" />
      </div>

      {/* container to position three panels */}
      <div className="relative h-[380px] sm:h-[440px]">
        {/* LEFT BASE: agenda list */}
        <div className="hidden sm:block absolute left-0 top-4 w-[23rem] h-[16rem] bg-gradient-to-b from-sky-100 to-white rounded-[22px] border border-sky-200 shadow-[0_40px_100px_rgba(2,132,199,0.22)] p-6">
          <div className="text-sky-900 font-semibold text-sm mb-3">1, Opening Meeting</div>
          <div className="flex items-center mb-3">
            <div className="px-3 py-1.5 rounded-xl bg-white shadow border border-sky-400 text-sky-700 font-medium text-sm mr-3">1.1 Confirm Minutes</div>
            <div className="text-gray-400 text-xs flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded bg-gray-200" />
              <span className="inline-block w-3 h-3 rounded bg-gray-200" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-8 rounded-xl bg-white shadow-inner" />
            <div className="h-8 rounded-xl bg-white shadow-inner" />
            <div className="h-8 rounded-xl bg-white shadow-inner" />
          </div>
          {/* curved arrow */}
          <svg className="absolute -bottom-10 left-6 w-28 h-28 text-gray-500" viewBox="0 0 100 100" fill="none">
            <path d="M8,60 C38,82 63,86 90,92" stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M84 86 L90 92 L82 94" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </div>

        {/* RIGHT BACK: confirm minutes panel */}
        <div className="hidden sm:block absolute right-0 top-0 w-[23rem] h-[13rem] bg-gradient-to-br from-emerald-50 to-white rounded-[22px] border border-emerald-200 shadow-[0_30px_90px_rgba(16,185,129,0.22)] p-6 rotate-1">
          <div className="text-emerald-700 font-semibold text-sm mb-1">Meeting Insights</div>
          <div className="text-gray-500 text-xs mb-3">In the meeting held from....</div>
          <div className="h-2.5 bg-gray-200 rounded w-48 mb-1" />
          <div className="h-2.5 bg-gray-200 rounded w-60 mb-1" />
          <div className="h-2.5 bg-gray-200 rounded w-44" />
          {/* spark lines */}
          <div className="absolute -right-2 top-6 text-gray-400">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />
            <span className="inline-block w-3 h-1 rounded bg-gray-300 mr-1" />
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* FRONT: board pack card */}
        <div className="absolute left-12 sm:left-20 top-24 sm:top-32 w-[23rem] sm:w-[28rem]">
          <div className="bg-white rounded-[26px] border border-gray-100 shadow-[0_70px_140px_rgba(0,0,0,0.18)] overflow-hidden">
            <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between rounded-t-3xl">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-white/20 rounded-sm" />
                Weekly Meeting
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 text-amber-800 text-xs font-bold rounded-md px-2 py-1">1</div>
                <div className="bg-amber-100 text-amber-800 text-xs font-bold rounded-md px-2 py-1">&gt;</div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-emerald-600 font-extrabold tracking-wide mb-3">Last week Action Items</div>
              <div className="h-2.5 bg-emerald-100 rounded w-60 mb-3" />
              <div className="h-2.5 bg-gray-200 rounded w-72 mb-5" />
              <div className="text-gray-800 font-semibold mb-2">Team Presentations</div>
              <div className="h-3.5 bg-amber-200 rounded w-72 mb-2" />
              <div className="h-2.5 bg-gray-200 rounded w-64 mb-2" />
              <div className="h-2.5 bg-gray-200 rounded w-52" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;
