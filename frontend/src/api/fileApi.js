import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = (file, uploadedBy = 'Anonymous', description = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploaded_by', uploadedBy);
  formData.append('description', description);

  return api.post('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFiles = (fileType = null) => {
  const params = fileType ? { file_type: fileType } : {};
  return api.get('/files/', { params });
};

export const getImages = () => {
  return api.get('/files/images/');
};

export const getPDFs = () => {
  return api.get('/files/pdfs/');
};

export const deleteFile = (fileId) => {
  return api.delete(`/files/${fileId}/`);
};

export const getFileDetails = (fileId) => {
  return api.get(`/files/${fileId}/`);
};

export default api;
