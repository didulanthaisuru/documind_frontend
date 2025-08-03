import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import QueryInterface from './components/QueryInterface';
import { QueryResponse } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('upload');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [queryHistory, setQueryHistory] = useState<Array<{ question: string; response: QueryResponse }>>([]);

  const handleUploadComplete = (documentId: string) => {
    // Refresh document list
    setRefreshTrigger(prev => prev + 1);
    
    // Switch to documents section
    setActiveSection('documents');
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You could add a toast notification here
  };

  const handleQueryComplete = (question: string, response: QueryResponse) => {
    setQueryHistory(prev => [...prev, { question, response }]);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-grey-900 mb-2">Welcome to DocuMind</h1>
              <p className="text-lg text-grey-600 max-w-2xl mx-auto">
                Upload your documents and start asking intelligent questions. 
                Our AI-powered system will help you find answers quickly and accurately.
              </p>
            </div>
            <DocumentUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        );

      case 'documents':
        return (
          <DocumentList
            selectedDocuments={selectedDocuments}
            onSelectionChange={setSelectedDocuments}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'query':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-grey-900 mb-2">Query Your Documents</h1>
              <p className="text-lg text-grey-600">
                Ask questions about your uploaded documents and get intelligent answers with source references.
              </p>
            </div>
            <QueryInterface
              selectedDocuments={selectedDocuments}
              onQueryComplete={handleQueryComplete}
            />
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-grey-900 mb-2">System Status</h1>
              <p className="text-lg text-grey-600">
                Monitor the health and performance of your DocuMind system.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* System status cards would go here */}
              <div className="bg-white rounded-lg border border-grey-200 p-6">
                <h3 className="text-lg font-semibold text-grey-900 mb-2">System Health</h3>
                <p className="text-green-600 font-medium">All systems operational</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-grey-50">
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App; 