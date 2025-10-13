import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import HapoLabsFooter from '../assets/Hapo_Labs_footer.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1f2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={HapoLabsFooter}
                alt="Hapo Technology logo"
                className="h-24 w-auto select-none"
                draggable={false}
              />
              <span className="text-xl font-bold">Hapo Technology</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              An AI-powered platform for meeting management, transcription, and workplace automation.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow us</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
               <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
             
             
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">User Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parent Company</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@Hapohub.co.za" className="hover:text-white transition-colors">
                  info@Hapohub.co.za
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>(+021) 140-8375</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Bridgeway Road, Bridgeway Precinct, Century City, Cape Town, South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Hapo Group. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;