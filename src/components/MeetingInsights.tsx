import React, { useState, useEffect } from 'react';
import { Sun, Calendar, CheckSquare, Users } from 'lucide-react';

const MeetingInsights: React.FC = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  const insights = [
    {
      id: 1,
      icon: <Sun className="w-5 h-5 text-white" />,
      title: "Great insights from the Hapo AI Meeting Recorder today!",
      content: "In the meeting held from 09:00 to 09:06, you and Phelokazi discussed the progress on the project. Here are the key takeaways:",
      points: [
        "Phelokazi is collaborating with Asandile on the backend, and they plan to combine their research soon.",
        "It seems there are some issues with the front-end prototypes, which need addressing.",
        "You suggested including features similar to the decisions tool in your project, which could enhance its functionality.",
        "Action item: Please reach out to Asandile to check on his research progress and ensure he joins future meetings."
      ],
      footer: "Keep up the great work! 💪",
      bgColor: "from-orange-500/80 to-orange-600/80",
      borderColor: "border-white/30"
    },
    {
      id: 2,
      icon: <Calendar className="w-5 h-5 text-white" />,
      title: "Meeting Summary - Project Updates",
      content: "Key decisions and updates from today's project meeting:",
      points: [
        "The team agreed to limit currencies in the 72X application to Rands and US Dollars to simplify debugging efforts.",
        "The migration of individual project databases to a centralised company database will proceed in phases after cleaning up dummy data.",
        "Monica Ndlovu will focus on creating user training manuals for the 72X application instead of CMS documentation since existing CMS materials are sufficient.",
        "The MVP for the restaurant ordering system will be completed by 26 September 2025 before approaching potential clients with a sample."
      ],
      footer: "",
      bgColor: "from-blue-500/80 to-blue-600/80",
      borderColor: "border-white/30"
    },
    {
      id: 3,
      icon: <CheckSquare className="w-5 h-5 text-white" />,
      title: "Action Items",
      content: "Tasks assigned during the meeting:",
      points: [
        "Develop a multilingual chatbot integrated with WhatsApp to handle customer queries and automate CV creation processes. @Development Team",
        "Design an AI tool for CV automation that extracts customer data from forms or images and populates pre-designed templates. @Development Team",
        "Propose a new responsive website design to replace the existing Canva-based site, ensuring it supports chatbot integration and other interactive features. @Web Development Team"
      ],
      footer: "",
      bgColor: "from-green-500/80 to-green-600/80",
      borderColor: "border-white/30"
    },
    {
      id: 4,
      icon: <Users className="w-5 h-5 text-white" />,
      title: "Project Assignments & Deadlines",
      content: "Team assignments with specific deadlines:",
      points: [
        "Explore the creation of additional games specifically for integration into HapoPay, focusing on educational games. Phelokazi Madala by 12 Sep",
        "Develop a payment page for the SIM card dashboard that supports EFT as a payment method. Setu Xolilizwe, Asandile Nkala by 09 Sep",
        "Link field reports with tickets in the Service Desk system to improve traceability between reported issues and technician actions. Mbali Kgatlhane by 16 Sep"
      ],
      footer: "",
      bgColor: "from-purple-500/80 to-purple-600/80",
      borderColor: "border-white/30"
    }
  ];

  // Typewriter states
  const [typedTitle, setTypedTitle] = useState('');
  const [typedContent, setTypedContent] = useState('');
  const [typedPoints, setTypedPoints] = useState<string[]>([]);
  const [currentPointText, setCurrentPointText] = useState('');
  const [phase, setPhase] = useState<'title' | 'content' | 'points' | 'done'>('title');
  const [pointIndex, setPointIndex] = useState(0);
  

  // Reset typewriter when slide changes
  useEffect(() => {
    setTypedTitle('');
    setTypedContent('');
    setTypedPoints([]);
    setCurrentPointText('');
    setPointIndex(0);
    setPhase('title');
  }, [currentInsight]);

  const TYPE_SPEED = 18; // ms per character
  const SECTION_DELAY = 400; // delay between sections
  const POINT_DELAY = 250; // delay between finishing one point and starting next

  // Type title
  useEffect(() => {
    if (phase !== 'title') return;
    const full = insights[currentInsight].title;
    if (typedTitle.length === full.length) {
      const t = setTimeout(() => setPhase('content'), SECTION_DELAY);
      return () => clearTimeout(t);
    }
    const id = setTimeout(() => setTypedTitle(full.slice(0, typedTitle.length + 1)), TYPE_SPEED);
    return () => clearTimeout(id);
  }, [phase, typedTitle, currentInsight]);

  // Type content
  useEffect(() => {
    if (phase !== 'content') return;
    const full = insights[currentInsight].content;
    if (typedContent.length === full.length) {
      const t = setTimeout(() => setPhase('points'), SECTION_DELAY);
      return () => clearTimeout(t);
    }
    const id = setTimeout(() => setTypedContent(full.slice(0, typedContent.length + 1)), TYPE_SPEED);
    return () => clearTimeout(id);
  }, [phase, typedContent, currentInsight]);

  // Type points sequentially
  useEffect(() => {
    if (phase !== 'points') return;
    const pts = insights[currentInsight].points;
    if (pointIndex >= pts.length) {
      // finished all points
      const t = setTimeout(() => setPhase('done'), SECTION_DELAY);
      return () => clearTimeout(t);
    }
    const full = pts[pointIndex];
    if (currentPointText.length === full.length) {
      // commit this point and move to next after a short delay
      const t = setTimeout(() => {
        setTypedPoints(prev => [...prev, full]);
        setCurrentPointText('');
        setPointIndex(prev => prev + 1);
      }, POINT_DELAY);
      return () => clearTimeout(t);
    }
    const id = setTimeout(() => setCurrentPointText(full.slice(0, currentPointText.length + 1)), TYPE_SPEED);
    return () => clearTimeout(id);
  }, [phase, pointIndex, currentPointText, currentInsight]);

  // After done, advance to next insight automatically
  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  const current = insights[currentInsight];

  return (
    <div className="relative h-[400px] overflow-hidden">
      <div
        className={`bg-gradient-to-br ${current.bgColor} rounded-xl p-4 border ${current.borderColor} shadow-xl backdrop-blur-sm transition-all duration-500 ease-in-out transform h-full`}
        key={current.id}
      >
        <div className="flex items-start space-x-2 mb-3">
          <div className="bg-black/20 p-1.5 rounded-lg flex-shrink-0">
            {current.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-2 leading-tight">{typedTitle}</h3>
            <p className="text-white/90 text-xs mb-3 leading-relaxed">{typedContent}</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-3 overflow-hidden">
          {typedPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-1.5">
              <div className="w-1 h-1 bg-white/80 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-white/90 text-xs leading-relaxed">{point}</p>
            </div>
          ))}
          {phase === 'points' && currentPointText && (
            <div className="flex items-start space-x-1.5">
              <div className="w-1 h-1 bg-white/80 rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-white/90 text-xs leading-relaxed">{currentPointText}</p>
            </div>
          )}
        </div>

        {current.footer && (
          <p className="text-white font-medium text-xs mt-3">
            {current.footer}
          </p>
        )}

        {/* Progress indicators */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {insights.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentInsight ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingInsights;