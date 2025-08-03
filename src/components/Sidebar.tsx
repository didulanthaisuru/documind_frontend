import React, { useEffect, useState } from 'react';
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Activity, 
  Settings, 
  Database,
  Cpu,
  HardDrive,
  Clock
} from 'lucide-react';
import { healthAPI } from '../services/api';
import Card from './ui/Card';
import { DetailedHealthResponse } from '../types';

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
  const [healthData, setHealthData] = useState<DetailedHealthResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setLoading(true);
        const data = await healthAPI.getDetailedHealth();
        setHealthData(data);
      } catch (error) {
        console.error('Failed to load health data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadHealthData();
    }
  }, [isOpen]);

  const navigationItems = [
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'documents', label: 'Document Library', icon: FileText },
    { id: 'query', label: 'Query Interface', icon: MessageSquare },
    { id: 'system', label: 'System Status', icon: Activity },
  ];

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

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

          {/* System Status */}
          <div className="p-4 border-t border-grey-200">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-grey-900 mb-3 flex items-center space-x-2">
                <Activity className="h-4 w-4 text-primary-orange" />
                <span>System Status</span>
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-orange"></div>
                </div>
              ) : healthData ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-grey-600">Status</span>
                    <span className="text-green-600 font-medium">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-grey-600">Documents</span>
                    <span className="font-medium">{healthData.system_stats.total_documents}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-grey-600">Chunks</span>
                    <span className="font-medium">{(healthData.system_stats.total_chunks || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-grey-600">Vectors</span>
                    <span className="font-medium">{(healthData.system_stats.total_vectors || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-grey-600">Uptime</span>
                    <span className="font-medium">{formatUptime(healthData.system_stats.uptime || 0)}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-grey-100">
                    <div className="flex items-center justify-between">
                      <span className="text-grey-600">Model</span>
                      <span className="font-medium text-xs truncate max-w-24">
                        {healthData.system_stats.embedding_model?.split('/').pop() || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-grey-500">Unable to load system status</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 