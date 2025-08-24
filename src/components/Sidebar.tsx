import React from 'react';
import { 
  Upload, 
  FileText, 
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
}) => {

  const navigationItems = [
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'documents', label: 'Document Library', icon: FileText },
    { id: 'query', label: 'Query Interface', icon: MessageSquare },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-grey-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive
                      ? 'bg-primary-orange text-white'
                      : 'text-grey-700 hover:bg-grey-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 