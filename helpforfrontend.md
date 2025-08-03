# Frontend Developer Help Guide

## 🎯 Overview
This guide provides all the necessary information for frontend developers to build a user interface for the RAG (Retrieval-Augmented Generation) Document Assistant application.

## 📋 Table of Contents
- [API Base Information](#api-base-information)
- [Authentication](#authentication)
- [Data Types & Schemas](#data-types--schemas)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Frontend Integration Examples](#frontend-integration-examples)
- [Real-time Updates](#real-time-updates)
- [Best Practices](#best-practices)

---

## 🔗 API Base Information

### Base URL
```
http://localhost:8000
```

### API Version
```
/api/v1
```

### Full API Base URL
```
http://localhost:8000/api/v1
```

### API Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🔐 Authentication

**Currently, the API does not require authentication.** All endpoints are publicly accessible.

---

## 📊 Data Types & Schemas

### 1. Document Status Enum
```typescript
enum DocumentStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing", 
  COMPLETED = "completed",
  FAILED = "failed"
}
```

### 2. Document Chunk
```typescript
interface DocumentChunk {
  chunk_id: string;           // Unique chunk identifier
  text: string;               // Chunk text content
  start_index: number;        // Start position in original text
  end_index: number;          // End position in original text
  embedding_index?: number;   // Index in vector store (optional)
}
```

### 3. Document Metadata
```typescript
interface DocumentMetadata {
  document_id: string;        // Unique document identifier
  filename: string;           // Original filename
  file_size: number;          // File size in bytes
  file_type: string;          // File extension (pdf, docx, txt)
  upload_time: string;        // ISO 8601 timestamp
  status: DocumentStatus;     // Current processing status
  total_chunks: number;       // Number of text chunks
  total_tokens: number;       // Approximate token count
  chunks: DocumentChunk[];    // Array of text chunks
}
```

### 4. Document Upload Response
```typescript
interface DocumentUploadResponse {
  document_id: string;        // Unique document identifier
  filename: string;           // Original filename
  status: DocumentStatus;     // Initial status (usually "uploading")
  message: string;            // Success/error message
  upload_time: string;        // ISO 8601 timestamp
}
```

### 5. Document List Response
```typescript
interface DocumentListResponse {
  documents: DocumentMetadata[];  // Array of all documents
  total_count: number;            // Total number of documents
}
```

### 6. Query Request
```typescript
interface QueryRequest {
  question: string;                    // User's question (required)
  document_ids?: string[];             // Specific document IDs to search (optional)
  top_k?: number;                      // Number of results (1-20, default: 5)
  include_sources?: boolean;           // Include source info (default: true)
}
```

### 7. Source Information
```typescript
interface SourceInfo {
  document_id: string;        // Source document ID
  filename: string;           // Source filename
  chunk_id: string;           // Source chunk ID
  text: string;               // Source text content
  similarity_score: number;   // Similarity score (0-1)
  start_index: number;        // Start position in original text
  end_index: number;          // End position in original text
}
```

### 8. Query Response
```typescript
interface QueryResponse {
  answer: string;             // Generated answer
  confidence: number;         // Confidence score (0-1)
  sources: SourceInfo[];      // Array of source information
  processing_time: number;    // Processing time in seconds
  total_sources_found: number; // Total sources found
}
```

### 9. Health Check Response
```typescript
interface HealthCheckResponse {
  status: string;             // "healthy"
  service: string;            // "RAG Document Assistant"
  version: string;            // "1.0.0"
}
```

### 10. Detailed Health Response
```typescript
interface DetailedHealthResponse {
  status: string;             // "healthy"
  service: string;            // "RAG Document Assistant"
  version: string;            // "1.0.0"
  system_stats: {
    total_documents: number;      // Total documents in system
    total_chunks: number;         // Total text chunks
    total_vectors: number;        // Total vectors in index
    embedding_model: string;      // Current embedding model
    vector_dimension: number;     // Vector dimension
    index_type: string;          // FAISS index type
    uptime: number;              // System uptime in seconds
  };
}
```

### 11. Error Response
```typescript
interface ErrorResponse {
  detail: string;             // Error message
  status_code?: number;       // HTTP status code
}
```

---

## 🛣️ API Endpoints

### Health Check Endpoints

#### 1. Basic Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "RAG Document Assistant",
  "version": "1.0.0"
}
```

#### 2. Detailed Health Check
```http
GET /health/detailed
```

**Response:**
```json
{
  "status": "healthy",
  "service": "RAG Document Assistant",
  "version": "1.0.0",
  "system_stats": {
    "total_documents": 5,
    "total_chunks": 150,
    "total_vectors": 150,
    "embedding_model": "sentence-transformers/all-mpnet-base-v2",
    "vector_dimension": 768,
    "index_type": "IndexFlatIP",
    "uptime": 3600
  }
}
```

### Document Management Endpoints

#### 3. Upload Document
```http
POST /api/v1/documents/upload
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: File upload (PDF, DOCX, TXT)

**Response:**
```json
{
  "document_id": "doc_1234567890",
  "filename": "sample.pdf",
  "status": "uploading",
  "message": "Document uploaded successfully. Processing started.",
  "upload_time": "2024-01-15T10:30:00Z"
}
```

**Notes:**
- File size limit: 50MB
- Supported formats: PDF, DOCX, TXT
- Processing happens in background
- Check document status to know when processing is complete

#### 4. List All Documents
```http
GET /api/v1/documents
```

**Response:**
```json
{
  "documents": [
    {
      "document_id": "doc_1234567890",
      "filename": "sample.pdf",
      "file_size": 1024000,
      "file_type": "pdf",
      "upload_time": "2024-01-15T10:30:00Z",
      "status": "completed",
      "total_chunks": 25,
      "total_tokens": 5000,
      "chunks": [...]
    }
  ],
  "total_count": 1
}
```

#### 5. Get Document Details
```http
GET /api/v1/documents/{document_id}
```

**Response:**
```json
{
  "document_id": "doc_1234567890",
  "filename": "sample.pdf",
  "file_size": 1024000,
  "file_type": "pdf",
  "upload_time": "2024-01-15T10:30:00Z",
  "status": "completed",
  "total_chunks": 25,
  "total_tokens": 5000,
  "chunks": [
    {
      "chunk_id": "chunk_1",
      "text": "This is the first chunk of text...",
      "start_index": 0,
      "end_index": 999,
      "embedding_index": 0
    }
  ]
}
```

#### 6. Delete Document
```http
DELETE /api/v1/documents/{document_id}
```

**Response:**
```json
{
  "message": "Document deleted successfully",
  "document_id": "doc_1234567890"
}
```

### Query Endpoints

#### 7. Query Documents
```http
POST /api/v1/query
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What is the main topic of the document?",
  "document_ids": ["doc_1234567890"],
  "top_k": 5,
  "include_sources": true
}
```

**Response:**
```json
{
  "answer": "The main topic of the document is artificial intelligence and its applications in modern technology.",
  "confidence": 0.85,
  "sources": [
    {
      "document_id": "doc_1234567890",
      "filename": "sample.pdf",
      "chunk_id": "chunk_1",
      "text": "Artificial intelligence (AI) is a branch of computer science...",
      "similarity_score": 0.92,
      "start_index": 0,
      "end_index": 500
    }
  ],
  "processing_time": 1.25,
  "total_sources_found": 3
}
```

#### 8. Query Statistics
```http
GET /api/v1/query/stats
```

**Response:**
```json
{
  "total_queries": 150,
  "average_processing_time": 1.2,
  "total_documents_queried": 25,
  "most_common_questions": [
    "What is the main topic?",
    "How does it work?",
    "What are the benefits?"
  ]
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found (document not found)
- `422`: Validation Error (invalid data format)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Error Scenarios

#### 1. File Upload Errors
```json
{
  "detail": "File size exceeds maximum limit of 50MB"
}
```

```json
{
  "detail": "Unsupported file type. Allowed: pdf, docx, txt"
}
```

#### 2. Document Not Found
```json
{
  "detail": "Document with ID 'doc_123' not found"
}
```

#### 3. Query Errors
```json
{
  "detail": "No documents available for querying"
}
```

```json
{
  "detail": "Question cannot be empty"
}
```

---

## 💻 Frontend Integration Examples

### JavaScript/TypeScript Examples

#### 1. Upload Document
```typescript
async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

// Usage
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
fileInput.addEventListener('change', async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      const result = await uploadDocument(file);
      console.log('Upload successful:', result);
      // Start polling for status updates
      pollDocumentStatus(result.document_id);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
});
```

#### 2. Poll Document Status
```typescript
async function pollDocumentStatus(documentId: string): Promise<void> {
  const maxAttempts = 30; // 5 minutes with 10-second intervals
  let attempts = 0;

  const poll = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/documents/${documentId}`);
      const document = await response.json();

      if (document.status === 'completed') {
        console.log('Document processing completed!');
        updateUI(document);
        return;
      } else if (document.status === 'failed') {
        console.error('Document processing failed');
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 10000); // Poll every 10 seconds
      } else {
        console.error('Document processing timeout');
      }
    } catch (error) {
      console.error('Error polling status:', error);
    }
  };

  poll();
}
```

#### 3. List Documents
```typescript
async function listDocuments(): Promise<DocumentListResponse> {
  const response = await fetch('http://localhost:8000/api/v1/documents');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  return response.json();
}

// Usage
async function loadDocumentList() {
  try {
    const result = await listDocuments();
    displayDocuments(result.documents);
  } catch (error) {
    console.error('Failed to load documents:', error);
  }
}
```

#### 4. Query Documents
```typescript
async function queryDocuments(request: QueryRequest): Promise<QueryResponse> {
  const response = await fetch('http://localhost:8000/api/v1/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return response.json();
}

// Usage
async function askQuestion(question: string, documentIds?: string[]) {
  try {
    const request: QueryRequest = {
      question,
      document_ids: documentIds,
      top_k: 5,
      include_sources: true,
    };

    const result = await queryDocuments(request);
    displayAnswer(result);
  } catch (error) {
    console.error('Query failed:', error);
  }
}
```

### React Example Components

#### 1. Document Upload Component
```tsx
import React, { useState } from 'react';

interface DocumentUploadProps {
  onUploadComplete: (documentId: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setProgress(100);
      onUploadComplete(result.document_id);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
```

#### 2. Document List Component
```tsx
import React, { useEffect, useState } from 'react';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/documents');
      const result = await response.json();
      setDocuments(result.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/documents/${documentId}`, {
        method: 'DELETE',
      });
      loadDocuments(); // Reload list
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  if (loading) return <div>Loading documents...</div>;

  return (
    <div className="document-list">
      {documents.map((doc) => (
        <div key={doc.document_id} className="document-item">
          <h3>{doc.filename}</h3>
          <p>Status: {doc.status}</p>
          <p>Chunks: {doc.total_chunks}</p>
          <p>Uploaded: {new Date(doc.upload_time).toLocaleDateString()}</p>
          <button onClick={() => deleteDocument(doc.document_id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
```

#### 3. Query Interface Component
```tsx
import React, { useState } from 'react';

const QueryInterface: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          top_k: 5,
          include_sources: true,
        }),
      });

      const result = await response.json();
      setAnswer(result);
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-interface">
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Ask Question'}
        </button>
      </form>

      {answer && (
        <div className="answer">
          <h3>Answer</h3>
          <p>{answer.answer}</p>
          <p>Confidence: {(answer.confidence * 100).toFixed(1)}%</p>
          
          <h4>Sources</h4>
          {answer.sources.map((source, index) => (
            <div key={index} className="source">
              <p><strong>{source.filename}</strong></p>
              <p>{source.text}</p>
              <p>Similarity: {(source.similarity_score * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryInterface;
```

---

## 🔄 Real-time Updates

### Polling Strategy
Since the API doesn't support WebSockets, implement polling for real-time updates:

```typescript
class DocumentStatusPoller {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  startPolling(documentId: string, onStatusChange: (status: DocumentStatus) => void) {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/documents/${documentId}`);
        const document = await response.json();
        
        onStatusChange(document.status);
        
        if (document.status === 'completed' || document.status === 'failed') {
          this.stopPolling(documentId);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    this.intervals.set(documentId, interval);
  }

  stopPolling(documentId: string) {
    const interval = this.intervals.get(documentId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(documentId);
    }
  }

  stopAll() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}
```

---

## 🎨 Best Practices

### 1. Error Handling
- Always handle network errors gracefully
- Show user-friendly error messages
- Implement retry logic for failed requests
- Validate user input before sending requests

### 2. Loading States
- Show loading indicators during API calls
- Disable buttons during processing
- Provide progress feedback for long operations

### 3. User Experience
- Implement optimistic updates where appropriate
- Cache document list to reduce API calls
- Provide clear feedback for all user actions
- Use appropriate loading and error states

### 4. Performance
- Implement debouncing for search queries
- Use pagination for large document lists
- Cache frequently accessed data
- Optimize re-renders in React components

### 5. File Upload
- Validate file types and sizes on the frontend
- Show upload progress
- Handle large files gracefully
- Provide clear feedback about processing status

### 6. Query Interface
- Implement auto-complete for document selection
- Show query history
- Provide query suggestions
- Display confidence scores clearly

---

## 🚀 Getting Started Checklist

1. **Set up your frontend project**
2. **Install necessary dependencies** (fetch, form handling, etc.)
3. **Create API service layer** with proper error handling
4. **Implement document upload** with progress tracking
5. **Create document list** with status polling
6. **Build query interface** with source display
7. **Add error boundaries** and loading states
8. **Test all API endpoints** thoroughly
9. **Implement responsive design** for mobile compatibility
10. **Add accessibility features** (ARIA labels, keyboard navigation)

---

## 📞 Support

If you encounter issues or need clarification:
1. Check the API documentation at `http://localhost:8000/docs`
2. Review the error responses for specific issues
3. Test endpoints using the Swagger UI
4. Check the application logs for backend errors

---

## 🔗 Useful Links

- **API Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`
- **Detailed Health**: `http://localhost:8000/health/detailed` 