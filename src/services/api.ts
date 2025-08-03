import axios, { AxiosResponse } from 'axios';
import {
  DocumentMetadata,
  DocumentUploadResponse,
  DocumentListResponse,
  QueryRequest,
  QueryResponse,
  HealthCheckResponse,
  DetailedHealthResponse,
  QueryStats,
  ErrorResponse
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health Check API
export const healthAPI = {
  // Basic health check
  checkHealth: async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/health');
    return response.data;
  },

  // Detailed health check
  getDetailedHealth: async (): Promise<DetailedHealthResponse> => {
    const response = await api.get<DetailedHealthResponse>('/health/detailed');
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  // Upload document
  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<DocumentUploadResponse>(
      '/api/v1/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get all documents
  getDocuments: async (): Promise<DocumentListResponse> => {
    const response = await api.get<DocumentListResponse>('/api/v1/documents');
    return response.data;
  },

  // Get document by ID
  getDocument: async (documentId: string): Promise<DocumentMetadata> => {
    const response = await api.get<DocumentMetadata>(`/api/v1/documents/${documentId}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (documentId: string): Promise<{ message: string; document_id: string }> => {
    const response = await api.delete<{ message: string; document_id: string }>(
      `/api/v1/documents/${documentId}`
    );
    return response.data;
  },
};

// Query API
export const queryAPI = {
  // Submit query
  submitQuery: async (queryRequest: QueryRequest): Promise<QueryResponse> => {
    const response = await api.post<QueryResponse>('/api/v1/query', queryRequest);
    return response.data;
  },

  // Get query statistics
  getQueryStats: async (): Promise<QueryStats> => {
    const response = await api.get<QueryStats>('/api/v1/query/stats');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Poll document status
  pollDocumentStatus: async (
    documentId: string,
    onStatusChange: (status: string) => void,
    maxAttempts: number = 30,
    interval: number = 2000
  ): Promise<void> => {
    let attempts = 0;

    const poll = async () => {
      try {
        const document = await documentsAPI.getDocument(documentId);
        onStatusChange(document.status);

        if (document.status === 'completed' || document.status === 'failed') {
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        } else {
          console.error('Document processing timeout');
        }
      } catch (error) {
        console.error('Error polling document status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        }
      }
    };

    poll();
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Validate file type
  validateFileType: (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    return allowedTypes.includes(file.type);
  },

  // Validate file size (50MB limit)
  validateFileSize: (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    return file.size <= maxSize;
  },
};

export default api; 