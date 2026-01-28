import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../api/fileApi';
import './FileUpload.css';

function FileUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBy, setUploadedBy] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setMessageType('error');
      setMessage('❌ Invalid file type. Only PDF and image files are allowed.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setMessageType('error');
      setMessage('❌ File is too large. Maximum size is 50MB.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setMessage('⏳ Uploading...');
      setMessageType('info');

      const response = await uploadFile(file, uploadedBy || 'Anonymous', description);

      setUploadProgress(100);
      setMessageType('success');
      setMessage(`✅ File "${file.name}" uploaded successfully!`);
      setUploadedBy('');
      setDescription('');
      
      // Reset form
      setTimeout(() => setMessage(''), 3000);
      onUploadSuccess();
    } catch (error) {
      setMessageType('error');
      const errorMsg = error.response?.data?.error || error.message || 'Upload failed';
      setMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
  });

  return (
    <div className="file-upload-container">
      <div className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'disabled' : ''}`} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <span className="dropzone-icon">📤</span>
          <h2>Drop files here or click to select</h2>
          <p>Supported: PDF, JPG, PNG, GIF, BMP, WebP (Max 50MB)</p>
        </div>
      </div>

      <div className="upload-form">
        <div className="form-group">
          <label htmlFor="uploadedBy">Uploaded By (Optional):</label>
          <input
            id="uploadedBy"
            type="text"
            placeholder="Your name or identifier"
            value={uploadedBy}
            onChange={(e) => setUploadedBy(e.target.value)}
            disabled={uploading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            placeholder="Add a description for this file..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
            className="form-textarea"
            rows="3"
          />
        </div>
      </div>

      {uploading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
            {uploadProgress}%
          </div>
        </div>
      )}

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
