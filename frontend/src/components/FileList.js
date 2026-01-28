import React, { useEffect, useState } from 'react';
import { getFiles, deleteFile } from '../api/fileApi';
import './FileList.css';

function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger, filter]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const fileType = filter === 'all' ? null : filter;
      const response = await getFiles(fileType);
      setFiles(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (window.confirm(`Delete "${filename}"?`)) {
      try {
        await deleteFile(fileId);
        setFiles(files.filter(f => f.id !== fileId));
      } catch (error) {
        setError('Failed to delete file');
        console.error(error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <h2>📂 Uploaded Files</h2>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Files {files.length > 0 && `(${files.length})`}
          </button>
          <button
            className={`filter-btn ${filter === 'image' ? 'active' : ''}`}
            onClick={() => setFilter('image')}
          >
            📷 Images
          </button>
          <button
            className={`filter-btn ${filter === 'pdf' ? 'active' : ''}`}
            onClick={() => setFilter('pdf')}
          >
            📄 PDFs
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <p>No files uploaded yet. Start by uploading a file above! 👆</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map(file => (
            <div key={file.id} className="file-card">
              <div className="file-preview">
                {file.file_type === 'image' ? (
                  <img src={file.file_url} alt={file.original_filename} />
                ) : (
                  <div className="pdf-icon">📄</div>
                )}
              </div>
              
              <div className="file-info">
                <h3 className="file-name" title={file.original_filename}>
                  {file.original_filename}
                </h3>
                
                <div className="file-meta">
                  <span className="file-size">📦 {formatFileSize(file.file_size)}</span>
                  <span className="file-date">📅 {formatDate(file.upload_date)}</span>
                </div>

                {file.uploaded_by && (
                  <div className="file-uploader">👤 {file.uploaded_by}</div>
                )}

                {file.description && (
                  <div className="file-description">{file.description}</div>
                )}

                {file.file_type === 'image' && file.image_width && (
                  <div className="file-dimensions">
                    🖼️ {file.image_width}×{file.image_height}px
                  </div>
                )}
              </div>

              <div className="file-actions">
                <a
                  href={file.file_url}
                  download={file.original_filename}
                  className="btn btn-download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⬇️ Download
                </a>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(file.id, file.original_filename)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileList;
