# DocuMind Frontend Setup Guide

This guide will help you set up and launch the DocuMind frontend application with your backend.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Backend Running**
   - Ensure your DocuMind backend is running on `http://localhost:8000`
   - Verify by visiting: http://localhost:8000/health

### Step 1: Install Dependencies

```bash
cd documind_frontend
npm install
```

### Step 2: Start the Frontend

```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## 🔧 Configuration

### Backend Connection

The frontend is pre-configured to connect to `http://localhost:8000`. If your backend runs on a different URL:

1. **Edit `src/services/api.ts`**
   ```typescript
   const api = axios.create({
     baseURL: 'http://your-backend-url:port',
     // ...
   });
   ```

2. **Or use environment variables**
   Create a `.env` file:
   ```env
   REACT_APP_API_BASE_URL=http://your-backend-url:port
   ```

### CORS Configuration

Ensure your backend has CORS properly configured. In your FastAPI backend, you should have:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📱 Application Features

### 1. Document Upload
- **Drag & Drop**: Simply drag files onto the upload area
- **File Browser**: Click to select files manually
- **Supported Formats**: PDF, DOCX, TXT
- **Size Limit**: 50MB per file
- **Progress Tracking**: Real-time upload and processing status

### 2. Document Management
- **View All Documents**: See all uploaded documents with status
- **Document Selection**: Select specific documents for querying
- **Delete Documents**: Remove documents when no longer needed
- **Status Monitoring**: Track processing status in real-time

### 3. Query Interface
- **Natural Language**: Ask questions in plain English
- **Targeted Queries**: Query specific documents or all documents
- **Source References**: View source text with similarity scores
- **Confidence Scores**: See how confident the AI is in its answers
- **Query History**: Review recent queries and answers

### 4. System Monitoring
- **Health Status**: Real-time system health monitoring
- **Statistics**: Document count, chunks, vectors, uptime
- **Model Information**: Current embedding model details

## 🔍 Troubleshooting

### Common Issues

#### 1. Backend Connection Failed
**Symptoms**: "Failed to load documents" or connection errors

**Solutions**:
- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS configuration in backend
- Ensure no firewall blocking port 8000
- Verify network connectivity

#### 2. File Upload Issues
**Symptoms**: Upload fails or files not processing

**Solutions**:
- Check file size (max 50MB)
- Verify file format (PDF, DOCX, TXT only)
- Ensure backend storage directory exists and is writable
- Check backend logs for processing errors

#### 3. Query Processing Errors
**Symptoms**: Queries fail or return errors

**Solutions**:
- Ensure documents are fully processed (status: "completed")
- Check backend logs for embedding model errors
- Verify sufficient system memory for processing
- Restart backend if necessary

#### 4. Frontend Not Loading
**Symptoms**: Blank page or React errors

**Solutions**:
- Clear browser cache and cookies
- Check browser console for JavaScript errors
- Verify all dependencies are installed: `npm install`
- Try different browser or incognito mode

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
# Windows
set REACT_APP_DEBUG=true
npm start

# Linux/Mac
REACT_APP_DEBUG=true npm start
```

### Browser Console

Open browser developer tools (F12) and check:
- **Console**: For JavaScript errors
- **Network**: For failed API requests
- **Application**: For storage issues

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

### Deployment Options

#### 1. Static Hosting (Recommended)
- **Netlify**: Drag and drop `build/` folder
- **Vercel**: Connect repository for auto-deploy
- **GitHub Pages**: Use `build/` as source
- **AWS S3**: Upload `build/` contents

#### 2. Docker Deployment
Create a `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Apache/Nginx
Copy `build/` contents to your web server directory.

### Environment Configuration

For production, update the backend URL:

```env
REACT_APP_API_BASE_URL=https://your-production-backend.com
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: React automatically splits code
- **Lazy Loading**: Components load on demand
- **Caching**: API responses are cached appropriately
- **Compression**: Build output is optimized and compressed

### Backend Considerations
- **CORS**: Configure for production domain
- **Rate Limiting**: Implement if needed
- **Caching**: Consider Redis for query caching
- **Load Balancing**: For high traffic scenarios

## 🔐 Security Considerations

### Frontend Security
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Don't expose sensitive data
- **Input Validation**: Validate user inputs
- **XSS Protection**: React provides built-in protection

### Backend Security
- **Authentication**: Consider adding user authentication
- **API Keys**: Implement API key validation
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: Sanitize all inputs

## 📞 Support

### Getting Help

1. **Check Documentation**:
   - Frontend README: `README.md`
   - Backend Documentation: `../rag_sentence_transformers/README.md`
   - API Docs: http://localhost:8000/docs

2. **Common Resources**:
   - React Documentation: https://reactjs.org/
   - Tailwind CSS: https://tailwindcss.com/
   - Axios: https://axios-http.com/

3. **Debug Steps**:
   - Check browser console
   - Verify backend logs
   - Test API endpoints directly
   - Check network connectivity

### Log Files

- **Frontend**: Browser console and network tab
- **Backend**: Check backend log files
- **System**: Check system logs for errors

## 🎯 Next Steps

After successful setup:

1. **Upload Test Documents**: Try uploading different file types
2. **Test Queries**: Ask various questions about your documents
3. **Explore Features**: Try document selection and management
4. **Monitor Performance**: Check system status and statistics
5. **Customize**: Modify colors, layout, or add features

## 🔗 Useful Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Install dependencies
npm install

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

## 📝 Notes

- The frontend automatically connects to the backend on startup
- Document processing happens asynchronously in the background
- The interface updates in real-time as documents are processed
- All API calls include proper error handling and user feedback
- The application is fully responsive and works on mobile devices 