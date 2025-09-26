import React, { useEffect, useMemo, useState } from 'react';
import { Mic, CheckSquare, Calendar, Bell, ChevronRight, Clock, BellRing, CalendarDays, CalendarCheck, FileText, FileUp, Sparkles } from 'lucide-react';

const tabs = [
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'record', label: 'Recorder', icon: Mic },
  { id: 'transcript', label: 'Transcript', icon: FileText },
  { id: 'innovation', label: 'Innovation', icon: CheckSquare },
  { id: 'actions', label: 'Action Items', icon: Bell },
  { id: 'time', label: 'Time Tracking', icon: Clock },
  { id: 'reminders', label: 'Reminders', icon: BellRing },
  { id: 'calendar', label: 'Calendar Integration', icon: CalendarDays },
  { id: 'leave', label: 'Leave Management', icon: CalendarCheck },
];

const content: Record<string, { title: string; description: string; bullets: string[] }> = {
  agenda: {
    title: 'Turn Real Work into a Ready Agenda',
    description: "Generate a first-draft agenda in seconds so meetings start with purpose, using a simple prompt or imported source materials.",
    bullets: ['Welcome, Icebreaker, and Check-in', 'Review Previous Meeting Action Items', 'Team Updates']
  },
  record: {
    title: 'Crystal‑Clear Recording',
    description: 'High‑quality capture that preserves every word and voice with noise reduction and speaker labeling.',
    bullets: ['Studio‑grade audio', 'Speaker labels (who said what)', 'Noise reduction']
  },
  transcript: {
    title: 'Live Transcription & Search',
    description: 'The system listens as you talk and turns speech into clean, readable notes in real time — fully searchable after the meeting.',
    bullets: ['Real‑time transcription', 'Key phrases highlighted', 'Full‑text search']
  },
  innovation: {
    title: 'Where Ideas Take Shape',
    description: 'Capture fresh ideas, explore bold concepts, and identify opportunities to push the team forward.',
    bullets: ['New Ideas', 'Emerging Trends', 'Opportunities to Explore']
  },
  actions: {
    title: 'Close the Loop with Actions',
    description: 'Convert decisions to tasks and track them to completion with status and reminders.',
    bullets: ['Owners & Due Dates', 'Status Updates', 'Integrations']
  },
  time: {
    title: 'Effortless Time Tracking',
    description: "Team members can clock in and out by simply sending messages like 'in' or 'out'. Breaks and lunch are logged too, creating accurate timesheets for managers.",
    bullets: ['Clock in/out via chat', 'Breaks and lunch tracking', 'Accurate timesheets']
  },
  reminders: {
    title: 'AI-Powered Reminders',
    description: 'Automated nudges for breaks, lunchtime, and follow-ups keep the team healthy and on track without micromanagement.',
    bullets: ['Break reminders', 'Lunchtime nudges', 'Follow-up prompts']
  },
  calendar: {
    title: 'Calendar Integration',
    description: 'Syncs with Google and Outlook so availability is current, invites are on time, and scheduling conflicts are minimized.',
    bullets: ['Google Calendar', 'Outlook Calendar', 'Real-time availability']
  },
  leave: {
    title: 'Leave Management',
    description: "Request time off with natural phrases like 'sick today' or 'on leave 25–28 Jan'. Managers get instant notifications, and calendars update automatically.",
    bullets: ['Natural-language requests', 'Manager approvals', 'Calendar sync']
  }
};

const Features: React.FC = () => {
  const [active, setActive] = useState<string>('agenda');

  const ActiveIcon = tabs.find(t => t.id === active)?.icon || Calendar;
  const data = content[active];

  // Small animated demo for the Agenda tab
  const AgendaDemo: React.FC<{ bullets: string[] }> = ({ bullets }) => {
    const prompt = useMemo(
      () => 'Create an agenda for the team Weekly meetings',
      []
    );
    const [typed, setTyped] = useState('');
    const [showFile, setShowFile] = useState(false);
    const [reading, setReading] = useState(false);
    const [revealed, setRevealed] = useState(0);
    const [cursorOn, setCursorOn] = useState(true);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
      // reset state for each cycle
      setTyped('');
      setShowFile(false);
      setReading(false);
      setRevealed(0);

      // typing effect
      let i = 0;
      const t = setInterval(() => {
        setTyped(prompt.slice(0, i + 1));
        i++;
        if (i >= prompt.length) {
          clearInterval(t);
          // show uploaded file row
          setTimeout(() => setShowFile(true), 300);
          // show reading indicator
          setTimeout(() => setReading(true), 800);
          // finish reading then reveal agenda items
          setTimeout(() => {
            setReading(false);
            let idx = 0;
            const drop = setInterval(() => {
              setRevealed((r) => Math.min(bullets.length, r + 1));
              idx++;
              if (idx >= bullets.length) clearInterval(drop);
            }, 450);
            // after all items are revealed, wait 2s and restart
            setTimeout(() => setCycle((c) => c + 1), 2000 + bullets.length * 450);
          }, 1800);
        }
      }, 40);
      return () => clearInterval(t);
    }, [prompt, bullets.length, cycle]);

    useEffect(() => {
      const c = setInterval(() => setCursorOn((v) => !v), 450);
      return () => clearInterval(c);
    }, []);

    return (
      <div className="space-y-4">
        {/* Prompt input */}
        <div className="relative rounded-xl border border-purple-300 bg-white/70 backdrop-blur px-4 py-3 text-left shadow-sm">
          <div className="text-gray-800 min-h-[28px]">
            {typed}
            <span className={`ml-px inline-block w-[2px] h-5 align-middle ${cursorOn ? 'bg-purple-600' : 'bg-transparent'}`} />
          </div>
          {/* uploaded file row */}
          {(
            <div
              className={`mt-3 transition-all duration-500 ${showFile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
            >
              <div className="flex items-center justify-between bg-slate-900/80 text-white rounded-lg px-3 py-2 border border-slate-700">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-purple-300" />
                  <span className="text-xs">Draft_Agenda_Q1.pdf</span>
                </div>
                <span className="text-[10px] text-white/60">uploaded</span>
              </div>
            </div>
          )}
        </div>

        {/* Reading indicator */}
        <button className={`w-full rounded-full text-white py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
          reading ? 'bg-purple-700' : 'bg-purple-600'
        }`}>
          <Sparkles className="w-4 h-4" /> {reading ? 'Reading Your Inputs…' : 'Generate Agenda'}
        </button>

        {/* Result list with drop-in animation */}
        <div className="space-y-3">
          {bullets.map((b, i) => (
            <div
              key={b}
              className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                i < revealed ? 'bg-white shadow border-purple-200' : 'bg-purple-100/60 border-purple-200'
              } transition-all duration-500`}
              style={{
                transform: i < revealed ? 'translateY(0px)' : 'translateY(-8px)',
                opacity: i < revealed ? 1 : 0.4,
              }}
            >
              <span className="text-gray-800">
                {i + 1}. {b}
              </span>
              <span className={`text-sm transition-all ${i < revealed ? 'text-gray-500' : 'text-gray-400 blur-xl opacity-20'}`}>{(i + 1) * 5} min</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-semibold shadow-sm ${
                active === id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-purple-200 hover:border-purple-300'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-100 to-purple-200 text-gray-900 p-8 shadow-xl border border-purple-300">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-purple-800 bg-purple-200 px-3 py-1 rounded-full">
                <ActiveIcon className="w-4 h-4" /> {tabs.find(t => t.id === active)?.label}
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">{data.title}</h3>
              <p className="text-gray-700 text-lg max-w-xl">{data.description}</p>
              <button className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 font-semibold">
                LEARN MORE <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right mock UI / Demo */}
            <div className="bg-white rounded-xl p-4 border border-purple-200">
              {active === 'agenda' ? (
                <AgendaDemo bullets={content.agenda.bullets} />
              ) : (
                <div className="space-y-3">
                  {data.bullets.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-purple-100 rounded-lg px-4 py-3 border border-purple-200">
                      <span className="text-gray-800">{i + 1}. {b}</span>
                      <span className="text-gray-500 text-sm">{(i + 1) * 5} min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;