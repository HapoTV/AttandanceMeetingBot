import React from 'react';
import { MessageSquare, Video } from 'lucide-react';

const Integrations: React.FC = () => {
  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-cyan-600 font-semibold text-sm tracking-wide uppercase mb-4">
            PLATFORM INTEGRATIONS
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Works Where You
            <span className="block text-cyan-600">Already Collaborate</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Seamlessly integrate with your existing workflow on Microsoft Teams and Slack. 
            No disruption, maximum productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Microsoft Teams</h3>
                <p className="text-blue-600 font-medium">Enterprise Ready</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Native integration with Microsoft Teams for seamless meeting recording, 
              transcription, and workforce management within your existing Teams environment.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full md:w-auto">
              Add to Teams
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-600 p-3 rounded-xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Slack</h3>
                <p className="text-green-600 font-medium">Team Favorite</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Perfect for agile teams using Slack. Get all the AI-powered features 
              directly in your Slack channels with simple commands and notifications.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full md:w-auto">
              Add to Slack
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;