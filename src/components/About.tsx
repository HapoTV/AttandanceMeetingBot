import React from 'react';
import { Target, Zap, Shield, Users } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Effortless Integration",
      description: "Seamlessly integrate into your existing workflow without disrupting your team's productivity."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Automation",
      description: "Advanced AI that learns and adapts to your team's patterns for smarter workplace management."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption ensuring your data is always protected."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team-Centric Design",
      description: "Built for modern teams with hybrid work support and collaborative features at its core."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-cyan-600 font-semibold text-sm tracking-wide uppercase mb-4">
                ABOUT HAPO AI
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                The Future of
                <span className="block">Workplace Intelligence</span>
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-600">
                <p>
                  Hapo AI revolutionizes how teams collaborate, manage time, and extract value 
                  from meetings. Our advanced AI doesn't just transcribe—it understands context, 
                  identifies action items, and seamlessly manages your workforce operations.
                </p>
                <p>
                  From Fortune 500 companies to agile startups, teams trust Hapo AI to transform 
                  their workplace productivity with intelligent automation that actually works.
                </p>
              </div>
            </div>

            {/* Stats removed for now */}
          </div>

          <div className="space-y-6">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-cyan-600 p-3 rounded-lg flex-shrink-0 text-white">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;