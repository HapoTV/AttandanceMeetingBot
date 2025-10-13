import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA: React.FC = () => {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Setup in under 5 minutes",
    "24/7 support included"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your
            <span className="block text-cyan-600">Workplace Productivity?</span>
          </h2>
          
          <p className="text-base lg:text-lg text-gray-600 mb-6 leading-relaxed max-w-xl mx-auto">
            Join thousands of teams already using Hapo AI to streamline their meetings, 
            manage time off, and boost productivity with intelligent automation.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-8 max-w-xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-left">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm lg:text-base">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border-2 border-cyan-600 text-cyan-600 px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors font-medium text-base">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;