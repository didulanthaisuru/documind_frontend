# DocuMind Frontend

A modern React-based frontend for the DocuMind RAG (Retrieval-Augmented Generation) Document Assistant application.

## 🎨 Design System

- **Colors**: White, Black, and Grey with Orange (#ff6b35) as the accent color
- **Typography**: Inter font family
- **Components**: Modern, accessible UI components with smooth animations
- **Responsive**: Mobile-first design that works on all devices

## 🚀 Features

- **Document Upload**: Drag-and-drop file upload with progress tracking
- **Document Management**: View, select, and delete uploaded documents
- **Query Interface**: Ask questions about documents with AI-powered answers
- **Source References**: View and copy source text with similarity scores
- **System Monitoring**: Real-time system health and statistics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- DocuMind backend running on `http://localhost:8000`

## 🛠️ Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd documind_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Backend Connection

The frontend is configured to connect to the backend at `http://localhost:8000`. If your backend is running on a different URL, update the `baseURL` in `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://your-backend-url:port',
  // ...
});
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── Header.tsx      # Application header
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── DocumentUpload.tsx
│   ├── DocumentList.tsx
│   └── QueryInterface.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🎯 Usage Guide

### 1. Uploading Documents

1. Navigate to the "Upload Documents" section
2. Drag and drop files or click to browse
3. Supported formats: PDF, DOCX, TXT
4. Maximum file size: 50MB
5. Monitor upload progress and processing status

### 2. Managing Documents

1. View all uploaded documents in the "Document Library"
2. See document status, file size, and processing information
3. Select documents for targeted querying
4. Delete documents when no longer needed

### 3. Querying Documents

1. Go to the "Query Interface" section
2. Optionally select specific documents to query
3. Type your question in natural language
4. View AI-generated answers with confidence scores
5. Examine source references with similarity scores

### 4. System Monitoring

1. Check system status in the sidebar
2. Monitor document count, chunks, and vectors
3. View system uptime and model information

## 🔌 API Integration

The frontend integrates with the following backend endpoints:

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system statistics

### Document Management
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents` - List all documents
- `GET /api/v1/documents/{id}` - Get document details
- `DELETE /api/v1/documents/{id}` - Delete document

### Query Interface
- `POST /api/v1/query` - Submit query
- `GET /api/v1/query/stats` - Get query statistics

## 🎨 Customization

### Colors

Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    orange: '#ff6b35',
    'orange-hover': '#e55a2b',
    // ...
  }
}
```

### Components

All UI components are built with Tailwind CSS and can be customized by modifying their className props or extending the base styles.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploy to Static Hosting

The build output can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build/` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `build/` contents to an S3 bucket
- **GitHub Pages**: Use the `build/` folder as the source

### Environment Configuration

For production deployment, ensure your backend URL is correctly configured and CORS is properly set up on the backend.

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure the backend is running on `http://localhost:8000`
   - Check CORS configuration in the backend
   - Verify network connectivity

2. **File Upload Issues**
   - Check file size (max 50MB)
   - Verify file format (PDF, DOCX, TXT only)
   - Ensure backend storage is properly configured

3. **Query Processing Errors**
   - Verify documents are fully processed (status: "completed")
   - Check backend logs for processing errors
   - Ensure embedding model is loaded

### Debug Mode

Enable debug logging by setting the environment variable:

```env
REACT_APP_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the backend documentation
2. Review the API documentation at `http://localhost:8000/docs`
3. Check the application logs
4. Open an issue in the repository

## 🔗 Related Links

- [Backend Documentation](../rag_sentence_transformers/README.md)
- [API Documentation](http://localhost:8000/docs)
- [Swagger UI](http://localhost:8000/docs)
- [ReDoc](http://localhost:8000/redoc) 