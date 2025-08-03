import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { documentsAPI, apiUtils } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import { DocumentUploadResponse } from '../types';

interface DocumentUploadProps {
  onUploadComplete: (documentId: string) => void;
  onUploadError: (error: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type
    if (!apiUtils.validateFileType(file)) {
      const error = 'Unsupported file type. Please upload PDF, DOCX, or TXT files.';
      setErrorMessage(error);
      onUploadError(error);
      return;
    }

    // Validate file size
    if (!apiUtils.validateFileSize(file)) {
      const error = 'File size exceeds 50MB limit.';
      setErrorMessage(error);
      onUploadError(error);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result: DocumentUploadResponse = await documentsAPI.uploadDocument(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('processing');

      // Start polling for status updates
      apiUtils.pollDocumentStatus(
        result.document_id,
        (status) => {
          if (status === 'completed') {
            setUploadStatus('completed');
            onUploadComplete(result.document_id);
            setTimeout(() => {
              setUploadStatus('idle');
              setUploadProgress(0);
            }, 2000);
          } else if (status === 'failed') {
            setUploadStatus('error');
            setErrorMessage('Document processing failed. Please try again.');
            onUploadError('Document processing failed');
          }
        },
        30, // max attempts
        2000 // interval
      );

    } catch (error: any) {
      setUploadStatus('error');
      const errorMsg = error.response?.data?.detail || 'Upload failed. Please try again.';
      setErrorMessage(errorMsg);
      onUploadError(errorMsg);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, onUploadError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-orange"></div>;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Upload className="h-6 w-6 text-grey-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading document...';
      case 'processing':
        return 'Processing document...';
      case 'completed':
        return 'Document uploaded successfully!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Drag and drop a document here, or click to browse';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-grey-900 mb-2">Upload Document</h2>
        <p className="text-grey-600 mb-6">
          Upload PDF, DOCX, or TXT files to start querying your documents
        </p>

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer
            ${isDragOver 
              ? 'border-primary-orange bg-orange-50' 
              : uploadStatus === 'error'
              ? 'border-red-300 bg-red-50'
              : uploadStatus === 'completed'
              ? 'border-green-300 bg-green-50'
              : 'border-grey-300 hover:border-grey-400'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div className="text-center">
              <p className={`text-sm font-medium ${
                uploadStatus === 'error' ? 'text-red-600' :
                uploadStatus === 'completed' ? 'text-green-600' :
                'text-grey-600'
              }`}>
                {getStatusText()}
              </p>
              
              {uploadStatus === 'idle' && (
                <p className="text-xs text-grey-500 mt-1">
                  Maximum file size: 50MB
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
              <div className="w-full max-w-xs">
                <div className="bg-grey-200 rounded-full h-2">
                  <div
                    className="bg-primary-orange h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-grey-500 mt-1">
                  {uploadProgress}% complete
                </p>
              </div>
            )}

            {/* Error Message */}
            {uploadStatus === 'error' && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-w-xs">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Retry Button */}
            {uploadStatus === 'error' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadStatus('idle');
                  setErrorMessage('');
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>

        {/* File Type Info */}
        <div className="mt-6 flex justify-center space-x-6 text-sm text-grey-500">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>DOCX</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>TXT</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentUpload; 