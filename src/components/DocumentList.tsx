import React, { useEffect, useState } from 'react';
import { Trash2, FileText, Calendar, HardDrive, Hash, RefreshCw } from 'lucide-react';
import { documentsAPI, apiUtils } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import { StatusBadge } from './ui/Badge';
import { DocumentMetadata, DocumentStatus } from '../types';

interface DocumentListProps {
  onDocumentSelect?: (documentId: string) => void;
  selectedDocuments?: string[];
  onSelectionChange?: (documentIds: string[]) => void;
  refreshTrigger?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({
  onDocumentSelect,
  selectedDocuments = [],
  onSelectionChange,
  refreshTrigger,
}) => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await documentsAPI.getDocuments();
      setDocuments(result.documents);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(documentId);
      await documentsAPI.deleteDocument(documentId);
      
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
      
      // Remove from selection if selected
      if (selectedDocuments.includes(documentId)) {
        const newSelection = selectedDocuments.filter(id => id !== documentId);
        onSelectionChange?.(newSelection);
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDocumentToggle = (documentId: string) => {
    if (!onSelectionChange) return;

    const isSelected = selectedDocuments.includes(documentId);
    if (isSelected) {
      onSelectionChange(selectedDocuments.filter(id => id !== documentId));
    } else {
      onSelectionChange([...selectedDocuments, documentId]);
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    
    const completedDocuments = documents.filter(doc => doc.status === DocumentStatus.COMPLETED);
    const completedIds = completedDocuments.map(doc => doc.document_id);
    
    if (selectedDocuments.length === completedIds.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(completedIds);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'txt':
        return <FileText className="h-5 w-5 text-grey-500" />;
      default:
        return <FileText className="h-5 w-5 text-grey-400" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
          <span className="ml-3 text-grey-600">Loading documents...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDocuments} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-grey-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-grey-900 mb-2">No documents uploaded</h3>
          <p className="text-grey-600">Upload your first document to get started</p>
        </div>
      </Card>
    );
  }

  const completedDocuments = documents.filter(doc => doc.status === DocumentStatus.COMPLETED);
  const allCompletedSelected = completedDocuments.length > 0 && 
    completedDocuments.every(doc => selectedDocuments.includes(doc.document_id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-grey-900">Documents</h2>
          <p className="text-sm text-grey-600">
            {documents.length} document{documents.length !== 1 ? 's' : ''} • {completedDocuments.length} ready for querying
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {onSelectionChange && completedDocuments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {allCompletedSelected ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDocuments}
            loading={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.document_id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getFileIcon(document.file_type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-grey-900 truncate">
                      {document.filename}
                    </h3>
                    <StatusBadge status={document.status} size="sm" />
                  </div>
                </div>
                
                {onSelectionChange && document.status === DocumentStatus.COMPLETED && (
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(document.document_id)}
                    onChange={() => handleDocumentToggle(document.document_id)}
                    className="h-4 w-4 text-primary-orange border-grey-300 rounded focus:ring-primary-orange"
                  />
                )}
              </div>

              {/* Document Info */}
              <div className="space-y-2 text-xs text-grey-600">
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-3 w-3" />
                  <span>{apiUtils.formatFileSize(document.file_size)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span>{document.total_chunks || 0} chunks • {(document.total_tokens || 0).toLocaleString()} tokens</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{apiUtils.formatDate(document.upload_time)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-grey-100">
                {onDocumentSelect && document.status === DocumentStatus.COMPLETED && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentSelect(document.document_id)}
                    className="text-primary-orange hover:text-primary-orange-hover"
                  >
                    View Details
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDocument(document.document_id)}
                  loading={deletingId === document.document_id}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentList; 