import React from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hapoMark from '../assets/hapo-mark.svg';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-2xl w-11 h-11 shadow-sm flex flex-col items-center justify-center overflow-hidden">
              <img src={hapoMark} alt="Hapo logo" className="h-5 w-5 object-contain" />
              <span className="text-[10px] leading-none font-semibold text-black mt-0.5">hapo</span>
            </div>
            <span className="text-3xl font-extrabold text-black font-serif">
              Meeting Bot
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
            <a href="#integrations" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Integrations</a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">About</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Pricing</a>
            <button
              onClick={handleSignIn}
              className="border-2 border-purple-600 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#integrations" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Integrations</a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">About</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Pricing</a>
              <button
                onClick={handleSignIn}
                className="border-2 border-purple-600 text-purple-600 px-5 py-2 rounded-full hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2 w-fit"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
