import React, { useEffect, useMemo, useState } from 'react';
import { Mic, CheckSquare, Calendar, Bell, ChevronRight, Clock, BellRing, CalendarDays, CalendarCheck, FileText, FileUp, Sparkles, Bot, User, CheckCircle, MousePointerClick, Mail, AlarmClock, Check } from 'lucide-react';

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
    bullets: ['Adjust meeting schedules by canceling the Wednesday "attendance bot" meeting and merging it into Tuesday’s 9:00 AM session.', 'Add functionality to the new meeting attendance board application to ensure all buttons are operational', 'Reverse-engineer the rewards application to fit custom needs and implement email functionality using Superbase']
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
        <div className="relative rounded-xl border border-cyan-300 bg-white/70 backdrop-blur px-4 py-3 text-left shadow-sm">
          <div className="text-gray-800 min-h-[28px]">
            {typed}
            <span className={`ml-px inline-block w-[2px] h-5 align-middle ${cursorOn ? 'bg-cyan-600' : 'bg-transparent'}`} />
          </div>
          {/* uploaded file row */}
          {(
            <div
              className={`mt-3 transition-all duration-500 ${showFile ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
            >
              <div className="flex items-center justify-between bg-slate-900/80 text-white rounded-lg px-3 py-2 border border-slate-700">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs">Draft_Agenda_Q1.pdf</span>
                </div>
                <span className="text-[10px] text-white/60">uploaded</span>
              </div>
            </div>
          )}
        </div>

        {/* Reading indicator */}
        <button className={`w-full rounded-full text-white py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
          reading ? 'bg-cyan-700' : 'bg-cyan-600'
        }`}>
          <Sparkles className="w-4 h-4" /> {reading ? 'Reading Your Inputs…' : 'Generate Agenda'}
        </button>

        {/* Result list with drop-in animation */}
        <div className="space-y-3">
          {bullets.map((b, i) => (
            <div
              key={b}
              className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                i < revealed ? 'bg-white shadow border-cyan-200' : 'bg-cyan-100/60 border-cyan-200'
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

  // Leave demo: NL request -> parse -> manager approval -> calendar sync -> handover checklist (loop)
  const LeaveDemo: React.FC = () => {
    const [step, setStep] = useState(0); // 0 typing, 1 parsed, 2 approval card, 3 approved, 4 synced, 5 checklist
    const [cycle, setCycle] = useState(0);
    const requestFull = "On leave Fri–Mon. Reason: Study Leave.";
    const [typed, setTyped] = useState('');
    const [cursorOn, setCursorOn] = useState(true);

    useEffect(() => {
      // caret blink
      const c = window.setInterval(() => setCursorOn(v => !v), 520);
      return () => window.clearInterval(c);
    }, []);

    useEffect(() => {
      // reset
      setTyped('');
      setStep(0);
      // type the NL request
      let i = 0;
      const t = window.setInterval(() => {
        setTyped(requestFull.slice(0, i + 1));
        i++;
        if (i >= requestFull.length) {
          window.clearInterval(t);
          // show parsed chips
          window.setTimeout(() => setStep(1), 500);
          // show approval card
          window.setTimeout(() => setStep(2), 1400);
          // approve
          window.setTimeout(() => setStep(3), 2200);
          // calendar synced
          window.setTimeout(() => setStep(4), 3000);
          // checklist
          window.setTimeout(() => setStep(5), 3800);
          // loop restart
          window.setTimeout(() => setCycle(c => c + 1), 6500);
        }
      }, 45);
      return () => window.clearInterval(t);
    }, [cycle]);

    return (
      <div className="space-y-3">
        {/* NL request typing */}
        <div className="rounded-lg border border-cyan-200 bg-white p-3">
          <div className="text-sm text-gray-800">
            {typed}
            <span className={`ml-px inline-block w-[2px] h-4 align-middle ${cursorOn ? 'bg-cyan-600' : 'bg-transparent'}`} />
          </div>
          <div className="mt-1 text-[11px] text-gray-500">Requester: Petlo Matabane</div>
        </div>

        {/* Parsed chips */}
        {step >= 1 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">Dates: Fri → Mon (4 days)</span>
            <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">Type: Study Leave</span>
            <span className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">Reason: Examanination Period</span>
          </div>
        )}

        {/* Manager approval card */}
        {step >= 2 && (
          <div className="border border-cyan-200 rounded-lg bg-white p-3 text-xs flex items-center justify-between">
            <div className="text-gray-800">
              <div className="font-semibold text-sm">Leave request • Petlo Matabane</div>
              <div>Monday 25 → Thursday 28 • 4 days</div>
              <div className="text-gray-500">Manager: Yolanda Soga</div>
            </div>
            <div className="flex gap-2">
              <button className={`px-2 py-1 rounded-md border ${step >= 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-300'}`}>Approve</button>
              <button className="px-2 py-1 rounded-md border bg-white text-gray-700 border-gray-300">Decline</button>
            </div>
          </div>
        )}

        {/* Approved + calendar synced */}
        {step >= 3 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>
            {step >= 4 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">Synced to Google & Outlook</span>
            )}
          </div>
        )}

        {/* Calendar tile */}
        {step >= 4 && (
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
            <div className="text-[10px] text-gray-500 mb-1">Calendar</div>
            <div className="h-16 bg-white border border-cyan-200 rounded-md relative overflow-hidden">
              <div className="absolute inset-y-2 left-4 right-4 rounded-md bg-amber-100 border border-amber-200 text-amber-900 text-xs flex items-center px-2">Out Of Office • Petlo Matabane (Fri–Mon)</div>
            </div>
          </div>
        )}

        {/* Handover checklist */}
        {step >= 5 && (
          <div className="border border-cyan-200 rounded-lg bg-white p-3 text-xs">
            <div className="font-semibold text-gray-900 mb-1">Handover checklist</div>
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Update status in Teams</li>
              <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Assign cover: Phelokazi Madala & Mbali Kgatlhane</li>
        
            </ul>
          </div>
        )}
      </div>
    );
  };
  // Calendar demo: connected providers -> conflict -> smart suggestion -> availability (loops)
  const CalendarDemo: React.FC = () => {
    const [step, setStep] = useState(0);
    const [cycle, setCycle] = useState(0);
    const attendees = ['Sethu Xolilizwe', 'Phelokazi Madala', 'Mbali Kgatlhane'];

    useEffect(() => {
      setStep(0);
      const t1 = window.setTimeout(() => setStep(1), 600);   // show connections
      const t2 = window.setTimeout(() => setStep(2), 1600);  // conflict appears
      const t3 = window.setTimeout(() => setStep(3), 2800);  // auto-find next slot
      const t4 = window.setTimeout(() => setStep(4), 3800);  // availability chips animate
      const t5 = window.setTimeout(() => setCycle(c => c + 1), 6800); // loop
      return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout); };
    }, [cycle]);

    return (
      <div className="space-y-3">
        {/* Connected providers */}
        {(step >= 1) && (
          <div className="flex items-center justify-between border border-cyan-200 bg-white rounded-lg px-3 py-2 text-xs">
            <span className="text-gray-700">Connected: <span className="font-semibold">Google Calendar</span> • <span className="font-semibold">Outlook</span></span>
            <span className="inline-flex items-center gap-1 text-emerald-700"><Check className="w-3 h-3" /> Synced</span>
          </div>
        )}

        {/* Calendar grid mock */}
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3">
          <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-500 mb-2">
            <span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span>
          </div>
          <div className="relative h-20 bg-white rounded-md border border-cyan-200 overflow-hidden">
            {/* Existing event */}
            <div className={`absolute top-2 left-4 right-24 h-6 rounded-md px-2 flex items-center text-xs ${step >= 2 ? 'bg-red-100 border border-red-200 text-red-800' : 'bg-cyan-100 border border-cyan-200 text-cyan-800'}`}>
              Dev Meeting • 10:30–12:00
            </div>
            {/* New external event causing conflict */}
            {(step >= 2) && (
              <div className="absolute top-4 left-16 right-10 h-6 rounded-md px-2 flex items-center text-xs bg-amber-100 border border-amber-200 text-amber-900">
                One-on-one discussion • Wednesday 09:30–10:00
              </div>
            )}
            {/* Proposed slot after resolution */}
            {(step >= 3) && (
              <div className="absolute bottom-2 left-24 right-6 h-6 rounded-md px-2 flex items-center justify-between text-xs bg-emerald-100 border border-emerald-200 text-emerald-800">
                <span>Weeekly Team Meeting: Friday 10:30–11:00</span>
                <span className="inline-flex items-center gap-1"><Check className="w-3 h-3" /> Fit</span>
              </div>
            )}
          </div>
        </div>

        {/* Smart suggestion CTA */}
        {(step >= 2) && (
          <div className="flex items-center justify-between text-xs border border-cyan-200 bg-white rounded-lg px-3 py-2">
            <span className="text-gray-700">Conflict detected. Find next available slot?</span>
            <button className={`px-2 py-1 rounded-md border ${step >= 3 ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-cyan-700 border-cyan-300'}`}>
              Find next slot
            </button>
          </div>
        )}

        {/* Availability chips */}
        {(step >= 4) && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {attendees.map((name, i) => (
              <span key={name} className={`px-2 py-1 rounded-full border ${i === 0 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : i === 1 ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                {name} {i === 1 ? '• Away' : '• Available'}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
  // Innovation demo: idea share -> reactions -> blocker thread -> resolved -> suggestions (loop)
  const InnovationDemo: React.FC = () => {
    const [step, setStep] = useState(0);
    const [cycle, setCycle] = useState(0);
    const ideaTitleFull = 'Idea: AI assistant that auto-fills professional CV templates';
    const ideaDescFull = 'Let the bot transform raw experience and skills into a clean, professional CV layout and export to PDF or Word.';
    const [typedTitle, setTypedTitle] = useState('');
    const [typedDesc, setTypedDesc] = useState('');
    const [cursorOn, setCursorOn] = useState(true);
    const [ideaDone, setIdeaDone] = useState(false);

    // caret blink
    useEffect(() => {
      const c = window.setInterval(() => setCursorOn(v => !v), 520);
      return () => window.clearInterval(c);
    }, []);

    // type the idea text each cycle
    useEffect(() => {
      setTypedTitle('');
      setTypedDesc('');
      setIdeaDone(false);
      let i = 0;
      const ti = window.setInterval(() => {
        setTypedTitle(ideaTitleFull.slice(0, i + 1));
        i++;
        if (i >= ideaTitleFull.length) {
          window.clearInterval(ti);
          // small pause then type description
          const startDesc = window.setTimeout(() => {
            let j = 0;
            const td = window.setInterval(() => {
              setTypedDesc(ideaDescFull.slice(0, j + 1));
              j++;
              if (j >= ideaDescFull.length) {
                window.clearInterval(td);
                setIdeaDone(true);
              }
            }, 45); // description typing speed
          }, 400);
          return () => window.clearTimeout(startDesc);
        }
      }, 55); // title typing speed
      return () => window.clearInterval(ti);
    }, [cycle, ideaTitleFull, ideaDescFull]);

    // show reactions during the idea phase (independent of typing completion)
    useEffect(() => {
      setStep(0);
      const t1 = window.setTimeout(() => setStep(1), 1500);
      return () => {
        clearTimeout(t1);
      };
    }, [cycle]);

    // once idea typing is done, progress through blocker thread and loop
    useEffect(() => {
      if (!ideaDone) return;
      const t2 = window.setTimeout(() => setStep(2), 4000);  // keep idea visible for 4s after typing completes
      const t3 = window.setTimeout(() => setStep(3), 5500);  // first reply
      const t4 = window.setTimeout(() => setStep(4), 6700);  // second reply
      const t5 = window.setTimeout(() => setStep(5), 7900);  // resolved
      const t6 = window.setTimeout(() => setStep(6), 9100);  // suggestions
      const t7 = window.setTimeout(() => setCycle((c) => c + 1), 11600); // loop restart
      return () => { [t2,t3,t4,t5,t6,t7].forEach(clearTimeout); };
    }, [ideaDone]);

    return (
      <div className="space-y-3">
        {/* New Idea share */}
        {step < 2 && (
          <div className="border border-cyan-200 bg-white rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {typedTitle}
              <span className={`ml-px inline-block w-[2px] h-4 align-middle ${cursorOn ? 'bg-cyan-600' : 'bg-transparent'}`} />
            </div>
            <div className="text-xs text-gray-600">
              {typedDesc}
              <span className={`ml-px inline-block w-[2px] h-3 align-middle ${cursorOn ? 'bg-cyan-400' : 'bg-transparent'}`} />
            </div>
            {step >= 1 && (
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">+8</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">Sounds good</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">Use template library</span>
              </div>
            )}
          </div>
        )}

        {/* Blocker post */}
        {step >= 2 && (
          <div className="border border-cyan-200 bg-white rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-900 mb-1">Blocker: OAuth callback failing in production</div>
            <div className="text-xs text-gray-600">Users get 302 loops after consent. Production only.</div>
          </div>
        )}

        {/* Replies thread */}
        <div className="space-y-2">
          {step >= 3 && (
            <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-2 text-xs text-gray-800">
              <span className="font-semibold text-cyan-900">Monica:</span> Verify redirect URI matches exact scheme/host in the provider app settings.
            </div>
          )}
          {step >= 4 && (
            <div className="border border-cyan-200 bg-cyan-50 rounded-lg p-2 text-xs text-gray-800">
              <span className="font-semibold text-cyan-900">Sam:</span> Log request host header behind the load balancer; could be HTTP→HTTPS mismatch.
            </div>
          )}
        </div>

        {/* Resolved badge */}
        {step >= 5 && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1 w-fit">
            <Check className="w-3.5 h-3.5" /> Resolved: Redirect URI corrected
          </div>
        )}

        {/* AI Suggestions */}
        {step >= 6 && (
          <div className="border border-cyan-300 bg-cyan-50 rounded-lg p-3 text-xs text-gray-800">
            <div className="font-semibold text-cyan-900 mb-1">Team Suggestions</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Add a health-check to validate callback URL in CI.</li>
              <li>Write a short postmortem and share in #dev.</li>
              <li>Create a runbook step for OAuth provider config.</li>
            </ul>
          </div>
        )}
      </div>
    );
  };
  // Reminders demo: task deadline email + toast, and a meeting countdown banner (loops)
  const RemindersDemo: React.FC = () => {
    const [phase, setPhase] = useState<'email'|'toast'|'meeting'|'pause'>('email');
    const [toastProgress, setToastProgress] = useState(0);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
      setPhase('email');
      setToastProgress(0);
      setCountdown(15 * 60);

      const timers: number[] = [] as unknown as number[];

      // Show email for 1200ms
      timers.push(window.setTimeout(() => setPhase('toast'), 1200));

      // Toast progress over ~2.5s
      timers.push(window.setTimeout(() => {
        const start = Date.now();
        const dur = 2500;
        const tick = () => {
          const pct = Math.min(100, ((Date.now() - start) / dur) * 100);
          setToastProgress(pct);
          if (pct < 100) requestAnimationFrame(tick);
          else setPhase('meeting');
        };
        tick();
      }, 1300));

      // Meeting countdown approx 6s (fast-forward)
      timers.push(window.setTimeout(() => {
        const iv = window.setInterval(() => {
          setCountdown((c) => {
            if (c <= 0) {
              window.clearInterval(iv);
              setPhase('pause');
              window.setTimeout(() => setCycle((x) => x + 1), 800);
              return 0;
            }
            return c - 60; // tick by 1 minute steps quickly
          });
        }, 600);
      }, 4000));

      return () => timers.forEach(t => window.clearTimeout(t));
    }, [cycle]);

    const mm = Math.floor(countdown / 60);
    const ss = String(countdown % 60).padStart(2, '0');

    return (
      <div className="space-y-3">
        {/* Email card */}
        {(phase === 'email' || phase === 'toast') && (
          <div className="border border-cyan-200 rounded-lg p-3 bg-white shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">You have a task due today</div>
              <div className="text-xs text-gray-600">“Explore the creation of additional games specifically for intergration into HapoPay, focusing on educational games".</div>
            </div>
          </div>
        )}

        {/* In-app toast with progress */}
        {(phase === 'toast') && (
          <div className="border border-cyan-300 rounded-lg p-2 bg-cyan-50 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-cyan-900">Task due soon</div>
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-1 rounded-md bg-white border border-cyan-300 text-cyan-800">Open task</button>
                <button className="px-2 py-1 rounded-md bg-white border border-cyan-300 text-cyan-800">Snooze 30m</button>
              </div>
            </div>
            <div className="mt-2 h-1 bg-cyan-200 rounded">
              <div className="h-full bg-cyan-600 rounded" style={{ width: `${toastProgress}%` }} />
            </div>
          </div>
        )}

        {/* Meeting banner */}
        {(phase === 'meeting' || phase === 'pause') && (
          <div className="border border-amber-300 rounded-lg p-3 bg-amber-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 text-sm">
              <AlarmClock className="w-4 h-4" />
              Dev team meeting starts in {mm}:{ss}
            </div>
            <button className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs animate-pulse">Join</button>
          </div>
        )}
      </div>
    );
  };
  // Time tracking demo: chat-style punches with a progress timeline (loops)
  const TimeDemo: React.FC = () => {
    const [phase, setPhase] = useState<'typingIn'|'confirmIn'|'typingBreak'|'confirmBreak'|'typingOut'|'confirmOut'|'summary'>('typingIn');
    const [typed, setTyped] = useState('');
    const [cycle, setCycle] = useState(0);

    // Alternate scenarios per loop: 08:00→17:00, then 09:00→16:00
    const startLabel = cycle % 2 === 0 ? '08:00' : '09:00';
    const endLabel = cycle % 2 === 0 ? '16:00' : '17:00';
    const greeting = 'Good morning team';
    const breakLabel = '12:00';

    const sequences = useMemo(() => ([
      { user: greeting, confirm: `Good morning! Clocked in ${startLabel}` },
      { user: 'break', confirm: `Lunch (Recurring) • ${breakLabel}` },
      { user: 'out', confirm: `Clocked out ${endLabel}` }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ]), [cycle]);

    // progress percentage across a mock day
    const progress = phase === 'typingIn' ? 0
      : phase === 'confirmIn' ? 15
      : phase === 'typingBreak' ? 45
      : phase === 'confirmBreak' ? 55
      : phase === 'typingOut' ? 90
      : phase === 'confirmOut' || phase === 'summary' ? 100
      : 0;

    useEffect(() => {
      // reset
      setTyped('');
      setPhase('typingIn');

      // helper to type text then proceed
      const typeText = (text: string, next: () => void) => {
        setTyped('');
        let i = 0;
        const t = setInterval(() => {
          setTyped(text.slice(0, i + 1));
          i++;
          if (i >= text.length) {
            clearInterval(t);
            setTimeout(next, 250);
          }
        }, 40);
      };

      // chain the phases
      typeText(sequences[0].user, () => {
        setPhase('confirmIn');
        setTimeout(() => {
          setPhase('typingBreak');
          typeText(sequences[1].user, () => {
            setPhase('confirmBreak');
            setTimeout(() => {
              setPhase('typingOut');
              typeText(sequences[2].user, () => {
                setPhase('confirmOut');
                setTimeout(() => {
                  setPhase('summary');
                  setTimeout(() => setCycle((c) => c + 1), 1800);
                }, 600);
              });
            }, 600);
          });
        }, 700);
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cycle]);

    return (
      <div className="space-y-3">
        {/* Chat rows */}
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 space-y-2 text-sm">
          {/* user typing */}
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-900" />
            <div className="px-3 py-2 rounded-lg bg-white border border-cyan-200 text-gray-800 min-h-[28px]">
              {phase === 'typingIn' || phase === 'typingBreak' || phase === 'typingOut' ? (
                <>
                  {typed}
                  <span className="inline-block w-[2px] h-4 align-middle bg-cyan-600 ml-px" />
                </>
              ) : (
                <span className="text-gray-400">Type a command…</span>
              )}
            </div>
          </div>

          {/* confirmations */}
          {(phase !== 'typingIn') && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-600" />
              <div className="px-3 py-2 rounded-lg bg-cyan-600/10 border border-cyan-300 text-cyan-800">
                {phase === 'confirmIn' && sequences[0].confirm}
                {phase === 'typingBreak' && sequences[0].confirm}
                {phase === 'confirmBreak' && (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-200 text-cyan-800 font-semibold">Calendar • Recurring</span>
                    {sequences[1].confirm}
                  </span>
                )}
                {phase === 'typingOut' && sequences[1].confirm}
                {(phase === 'confirmOut' || phase === 'summary') && sequences[2].confirm}
              </div>
            </div>
          )}

          {phase === 'summary' && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-600" />
              <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                Total: 7h 30m • Lunch Break: 60m • Synced to calendar
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="rounded-lg border border-cyan-200 p-3">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>{startLabel}</span>
            <span>{breakLabel}</span>
            <span>{endLabel}</span>
          </div>
          <div className="h-2 w-full bg-cyan-100 rounded-full overflow-hidden relative">
            {/* work progress */}
            <div className="h-full bg-cyan-400/70" style={{ width: `${Math.min(100, progress)}%` }} />
            {/* break segment marker */}
            <div className="absolute left-1/2 top-0 h-full w-6 bg-amber-300/50 -translate-x-1/2 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  // Transcript demo (looping): speaker waveform + bot typing transcript
  const TranscriptDemo: React.FC = () => {
    const sample = useMemo(
      () => "Thanks everyone. Let's start with last week's action items, then move to updates and timelines.",
      []
    );
    const [typed, setTyped] = useState('');
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
      setTyped('');
      let i = 0;
      const t = setInterval(() => {
        setTyped(sample.slice(0, i + 1));
        i++;
        if (i >= sample.length) {
          clearInterval(t);
          setTimeout(() => setCycle((c) => c + 1), 1500);
        }
      }, 30);
      return () => clearInterval(t);
    }, [sample, cycle]);

    return (
      <div className="relative rounded-xl border border-cyan-200 overflow-hidden">
        <style>
          {`
            @keyframes pillWave { 0%{ transform: scaleY(.4)} 50%{ transform: scaleY(1)} 100%{ transform: scaleY(.4)} }
          `}
        </style>
        <div className="p-4 bg-cyan-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 flex items-end gap-1 h-6">
              {[...Array(14)].map((_, j) => (
                <span key={j} className="w-1.5 bg-cyan-400/80 rounded-sm origin-bottom" style={{ height: `${6 + (j%5)*4}px`, animation: `pillWave 1.6s ease-in-out ${j*0.06}s infinite` }} />
              ))}
            </div>
            <span className="text-xs text-cyan-700 font-medium">Speaking…</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 rounded-lg bg-white border border-cyan-200 px-3 py-2 shadow-sm">
              <div className="text-gray-800 text-sm min-h-[20px]">{typed}<span className="inline-block w-[2px] h-4 align-middle bg-cyan-600 ml-px" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 10s looping recording demo (Teams-like mock)
  const RecordDemo: React.FC = () => {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white p-0">
        <style>
          {`
          @keyframes recProgress { from { width: 0% } to { width: 100% } }
          @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: .2 } }
          @keyframes waveUpDown { 0% { transform: scaleY(.4) } 50% { transform: scaleY(1) } 100% { transform: scaleY(.4) } }
        `}
        </style>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" style={{ animation: 'blink 1s linear infinite' }} />
            REC • Teams Meeting
          </div>
          <div className="text-xs text-white/60">00:00</div>
        </div>

        {/* Content area */}
        <div className="p-5 grid grid-cols-3 gap-4">
          {/* Avatars */}
          {[0,1,2].map(i => (
            <div key={i} className="col-span-1 bg-slate-800/60 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600" />
              <div className="flex-1 flex items-end gap-1 h-6">
                {[...Array(8)].map((_, j) => (
                  <span key={j} className="w-1.5 bg-cyan-300 rounded-sm origin-bottom" style={{ height: `${6 + (j%4)*4}px`, animation: `waveUpDown 1.8s ease-in-out ${j*0.1}s infinite` }} />
                ))}
              </div>
            </div>
          ))}
          {/* Share/controls mock */}
          <div className="col-span-3 mt-1 flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-xs">
            <div className="flex items-center gap-3 text-white/80">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Mic On</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Camera Off</span>
            </div>
            <div className="text-white/70">Recording…</div>
          </div>
        </div>

        {/* Progress bar 10s loop */}
        <div className="h-1 bg-slate-800">
          <div className="h-full bg-red-500" style={{ animation: 'recProgress 10s linear infinite' }} />
        </div>
      </div>
    );
  };

  // Actions demo: cursor clicks items to mark them done (looping)
  const ActionsDemo: React.FC<{ bullets: string[] }> = ({ bullets }) => {
    const [doneCount, setDoneCount] = useState(0);
    const [cursorPos, setCursorPos] = useState(0);
    const [cycle, setCycle] = useState(0);
    const assignees = useMemo(() => [
      'Sisanda Mavuso',
      'Phelokazi Madala',
      'Rethabile Ntsekhe',
    ], []);

    useEffect(() => {
      setDoneCount(0);
      setCursorPos(0);
      let idx = 0;
      const step = () => {
        setCursorPos(idx);
        setTimeout(() => {
          setDoneCount((d) => Math.min(bullets.length, d + 1));
          idx++;
          if (idx < bullets.length) {
            setTimeout(step, 700);
          } else {
            setTimeout(() => setCycle((c) => c + 1), 1500);
          }
        }, 350);
      };
      const timer = setTimeout(step, 300);
      return () => clearTimeout(timer);
    }, [bullets.length, cycle]);

    return (
      <div className="relative">
        <div className="space-y-2">
          {bullets.map((b, i) => {
            const isDone = i < doneCount;
            return (
              <div
                key={b}
                className={`relative rounded-lg px-3 py-2 border transition-all ${
                  isDone ? 'bg-green-50 border-green-200' : 'bg-cyan-100 border-cyan-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`flex items-center gap-2 ${isDone ? 'text-green-700' : 'text-gray-800'} text-xs sm:text-sm`}>
                    {isDone ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="w-4 h-4 inline-block rounded-full border border-gray-400" />
                    )}
                    {b}
                  </span>
                  <span className={`text-xs ${isDone ? 'text-green-600' : 'text-gray-500'}`}>26/09/2025</span>
                </div>
                <div className={`mt-1 text-xs ${isDone ? 'text-green-700' : 'text-gray-600'}`}>
                  Assigned to: <span className="font-medium">{assignees[i % assignees.length]}</span>
                </div>

                {cursorPos === i && doneCount <= i && (
                  <div className="absolute -right-4 -top-3">
                    <div className="relative">
                      <MousePointerClick className="w-5 h-5 text-slate-700 drop-shadow" />
                      <span className="absolute -left-2 -top-2 inline-block w-6 h-6 rounded-full bg-cyan-400/40 animate-ping" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
                  ? 'bg-[#0891b2] text-white border-[#0891b2]'
                  : 'bg-white text-slate-700 border-cyan-200 hover:border-cyan-300'
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
        <div className="rounded-2xl bg-gradient-to-b from-cyan-50 to-cyan-100 text-gray-900 p-8 shadow-xl border border-cyan-200">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
                <ActiveIcon className="w-4 h-4" /> {tabs.find(t => t.id === active)?.label}
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">{data.title}</h3>
              <p className="text-gray-700 text-lg max-w-xl">{data.description}</p>
              <button className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                LEARN MORE <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right mock UI / Demo */}
            <div className="bg-white rounded-xl p-4 border border-cyan-200">
              {active === 'agenda' ? (
                <AgendaDemo bullets={content.agenda.bullets} />
              ) : active === 'record' ? (
                <RecordDemo />
              ) : active === 'transcript' ? (
                <TranscriptDemo />
              ) : active === 'actions' ? (
                <ActionsDemo bullets={content.actions.bullets} />
              ) : active === 'time' ? (
                <TimeDemo />
              ) : active === 'reminders' ? (
                <RemindersDemo />
              ) : active === 'calendar' ? (
                <CalendarDemo />
              ) : active === 'leave' ? (
                <LeaveDemo />
              ) : active === 'innovation' ? (
                <InnovationDemo />
              ) : (
                <div className="space-y-3">
                  {data.bullets.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-cyan-100 rounded-lg px-4 py-3 border border-cyan-200">
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