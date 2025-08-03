import React from 'react';
import { Brain, Menu, X } from 'lucide-react';
import Button from './ui/Button';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="bg-white border-b border-grey-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="bg-primary-orange rounded-lg p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-grey-900">DocuMind</h1>
                <p className="text-xs text-grey-500">Intelligent Document Assistant</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#upload"
              className="text-grey-600 hover:text-primary-orange transition-colors"
            >
              Upload
            </a>
            <a
              href="#documents"
              className="text-grey-600 hover:text-primary-orange transition-colors"
            >
              Documents
            </a>
            <a
              href="#query"
              className="text-grey-600 hover:text-primary-orange transition-colors"
            >
              Query
            </a>
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1 text-sm text-grey-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 