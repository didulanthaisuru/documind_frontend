// Document Status Enum
export enum DocumentStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing", 
  COMPLETED = "completed",
  FAILED = "failed"
}

// Document Chunk Interface
export interface DocumentChunk {
  chunk_id: string;
  text: string;
  start_index: number;
  end_index: number;
  embedding_index?: number;
}

// Document Metadata Interface
export interface DocumentMetadata {
  document_id: string;
  filename: string;
  file_size: number;
  file_type: string;
  upload_time: string;
  status: DocumentStatus;
  total_chunks: number;
  total_tokens: number;
  chunks: DocumentChunk[];
}

// Document Upload Response Interface
export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  status: DocumentStatus;
  message: string;
  upload_time: string;
}

// Document List Response Interface
export interface DocumentListResponse {
  documents: DocumentMetadata[];
  total_count: number;
}

// Query Request Interface
export interface QueryRequest {
  question: string;
  document_ids?: string[];
  top_k?: number;
  include_sources?: boolean;
}

// Source Information Interface
export interface SourceInfo {
  document_id: string;
  filename: string;
  chunk_id: string;
  text: string;
  similarity_score: number;
  start_index: number;
  end_index: number;
}

// Query Response Interface
export interface QueryResponse {
  answer: string;
  confidence: number;
  sources: SourceInfo[];
  processing_time: number;
  total_sources_found: number;
}

// Health Check Response Interface
export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
}

// Detailed Health Response Interface
export interface DetailedHealthResponse {
  status: string;
  service: string;
  version: string;
  system_stats: {
    total_documents: number;
    total_chunks: number;
    total_vectors: number;
    embedding_model: string;
    vector_dimension: number;
    index_type: string;
    uptime: number;
  };
}

// Error Response Interface
export interface ErrorResponse {
  detail: string;
  status_code?: number;
}

// Query Statistics Interface
export interface QueryStats {
  total_queries: number;
  average_processing_time: number;
  total_documents_queried: number;
  most_common_questions: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
} 