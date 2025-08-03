import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, FileText, Clock, Target, Copy, Check } from 'lucide-react';
import { queryAPI } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import { QueryRequest, QueryResponse, SourceInfo } from '../types';

interface QueryInterfaceProps {
  selectedDocuments?: string[];
  onQueryComplete?: (query: string, response: QueryResponse) => void;
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({
  selectedDocuments = [],
  onQueryComplete,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSource, setCopiedSource] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<Array<{ question: string; response: QueryResponse }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const queryRequest: QueryRequest = {
        question: question.trim(),
        document_ids: selectedDocuments.length > 0 ? selectedDocuments : undefined,
        top_k: 5,
        include_sources: true,
      };

      const response = await queryAPI.submitQuery(queryRequest);
      setAnswer(response);
      setQueryHistory(prev => [...prev, { question: question.trim(), response }]);
      onQueryComplete?.(question.trim(), response);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to process query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, sourceId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSource(sourceId);
      setTimeout(() => setCopiedSource(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const formatConfidence = (confidence: number) => {
    const percentage = (confidence * 100).toFixed(1);
    if (confidence >= 0.8) return { text: `${percentage}%`, color: 'text-green-600' };
    if (confidence >= 0.6) return { text: `${percentage}%`, color: 'text-yellow-600' };
    return { text: `${percentage}%`, color: 'text-red-600' };
  };

  const formatSimilarity = (similarity: number) => {
    const percentage = (similarity * 100).toFixed(1);
    return `${percentage}%`;
  };

  const renderSource = (source: SourceInfo, index: number) => {
    const sourceId = `${source.document_id}-${source.chunk_id}`;
    const isCopied = copiedSource === sourceId;

    return (
      <Card key={sourceId} className="border-l-4 border-l-primary-orange">
        <div className="space-y-3">
          {/* Source Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-grey-500" />
              <div>
                <p className="text-sm font-medium text-grey-900">{source.filename}</p>
                <p className="text-xs text-grey-500">Chunk {source.chunk_id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-grey-500">
                Similarity: {formatSimilarity(source.similarity_score)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(source.text, sourceId)}
                className="h-6 w-6 p-0"
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-grey-500" />
                )}
              </Button>
            </div>
          </div>

          {/* Source Text */}
          <div className="bg-grey-50 rounded-md p-3">
            <p className="text-sm text-grey-700 leading-relaxed">
              "{source.text}"
            </p>
          </div>

          {/* Source Position */}
          <div className="text-xs text-grey-500">
            Position: {source.start_index} - {source.end_index}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Query Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-grey-700 mb-2">
              Ask a question about your documents
            </label>
            <div className="relative">
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is the main topic discussed in the documents?"
                rows={3}
                className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent resize-none"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!question.trim() || loading}
                loading={loading}
                className="absolute bottom-3 right-3"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedDocuments.length > 0 && (
            <div className="text-sm text-grey-600">
              <Target className="h-4 w-4 inline mr-1" />
              Querying {selectedDocuments.length} selected document{selectedDocuments.length !== 1 ? 's' : ''}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>
      </Card>

      {/* Answer Display */}
      {answer && (
        <div className="space-y-4">
          {/* Answer Card */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-primary-orange mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-grey-900 mb-2">Answer</h3>
                  <p className="text-grey-700 leading-relaxed">{answer.answer}</p>
                </div>
              </div>

              {/* Answer Metadata */}
              <div className="flex items-center space-x-4 pt-3 border-t border-grey-100">
                <div className="flex items-center space-x-1 text-sm text-grey-600">
                  <Target className="h-4 w-4" />
                  <span>Confidence: <span className={formatConfidence(answer.confidence).color}>
                    {formatConfidence(answer.confidence).text}
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-grey-600">
                  <Clock className="h-4 w-4" />
                  <span>{answer.processing_time.toFixed(2)}s</span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-grey-600">
                  <FileText className="h-4 w-4" />
                  <span>{answer.total_sources_found} sources</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sources */}
          {answer.sources && answer.sources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-grey-900 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary-orange" />
                <span>Sources</span>
              </h3>
              
              <div className="space-y-3">
                {answer.sources.map((source, index) => renderSource(source, index))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Query History */}
      {queryHistory.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-grey-900 mb-4">Recent Queries</h3>
          <div className="space-y-3">
            {queryHistory.slice(-3).reverse().map((item, index) => (
              <div key={index} className="border-l-2 border-grey-200 pl-4">
                <p className="text-sm font-medium text-grey-900 mb-1">{item.question}</p>
                <p className="text-xs text-grey-600">
                  Confidence: {formatConfidence(item.response.confidence).text} • 
                  {item.response.processing_time.toFixed(2)}s • 
                  {item.response.total_sources_found} sources
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default QueryInterface; 