# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently uses session-based authentication. Can be upgraded to JWT tokens.

---

## Endpoints

### Files List & Upload

#### GET /files/
List all uploaded files

**Query Parameters:**
- `file_type` (optional): Filter by 'image' or 'pdf'

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "file": "/media/uploads/2024/01/document.pdf",
      "file_url": "http://localhost:8000/media/uploads/2024/01/document.pdf",
      "file_type": "pdf",
      "original_filename": "document.pdf",
      "file_size": 1024000,
      "file_extension": "pdf",
      "uploaded_by": "John Doe",
      "upload_date": "2024-01-15T10:30:00Z",
      "description": "Important document",
      "image_width": null,
      "image_height": null
    }
  ]
}
```

#### POST /files/
Upload a new file

**Form Data:**
```
file: <binary file data>
uploaded_by: "Your Name" (optional)
description: "File description" (optional)
```

**Response:**
```json
{
  "id": 1,
  "file": "/media/uploads/2024/01/document.pdf",
  "file_url": "http://localhost:8000/media/uploads/2024/01/document.pdf",
  "file_type": "pdf",
  "original_filename": "document.pdf",
  "file_size": 1024000,
  "file_extension": "pdf",
  "uploaded_by": "John Doe",
  "upload_date": "2024-01-15T10:30:00Z",
  "description": "Important document",
  "image_width": null,
  "image_height": null
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:8000/api/files/ \
  -F "file=@/path/to/document.pdf" \
  -F "uploaded_by=John Doe" \
  -F "description=Important document"
```

**Example with JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('uploaded_by', 'John Doe');
formData.append('description', 'Important document');

fetch('http://localhost:8000/api/files/', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

#### GET /files/{id}/
Get details of a specific file

**Response:**
```json
{
  "id": 1,
  "file": "/media/uploads/2024/01/document.pdf",
  "file_url": "http://localhost:8000/media/uploads/2024/01/document.pdf",
  "file_type": "pdf",
  "original_filename": "document.pdf",
  "file_size": 1024000,
  "file_extension": "pdf",
  "uploaded_by": "John Doe",
  "upload_date": "2024-01-15T10:30:00Z",
  "description": "Important document",
  "image_width": null,
  "image_height": null
}
```

#### DELETE /files/{id}/
Delete a file

**Response:**
```
HTTP 204 No Content
```

#### GET /files/{id}/download/
Get download URL for a file

**Response:**
```json
{
  "download_url": "http://localhost:8000/media/uploads/2024/01/document.pdf",
  "filename": "document.pdf"
}
```

### Convenience Endpoints

#### GET /files/images/
List only image files

**Response:** Same as /files/ but filtered to images

#### GET /files/pdfs/
List only PDF files

**Response:** Same as /files/ but filtered to PDFs

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "No file provided"
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 413 Payload Too Large
```json
{
  "error": "File size exceeds 50MB limit"
}
```

### 415 Unsupported Media Type
```json
{
  "error": "File type .exe not allowed"
}
```

---

## File Size Limits

| Limit | Value |
|-------|-------|
| Max File Size | 50 MB |
| Max Upload Memory | 50 MB |

---

## Allowed File Types

| Type | Extensions |
|------|-----------|
| Images | jpg, jpeg, png, gif, bmp, webp |
| Documents | pdf |

---

## Pagination

Default page size: 10 items

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page

**Example:**
```
GET /files/?page=2&page_size=20
```

---

## Search & Filtering

**Search by filename:**
```
GET /files/?search=document
```

**Filter by type:**
```
GET /files/?file_type=image
```

**Order by field:**
```
GET /files/?ordering=-upload_date
```

---

## Rate Limiting

Currently: 100 requests per hour for anonymous users

---

## CORS Headers

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Testing the API

### Using Postman

1. Import collection (create new request)
2. URL: `http://localhost:8000/api/files/`
3. Method: POST
4. Body: form-data
5. Add file field and select file
6. Click Send

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set URL and method
4. Add form data
5. Send

### Using REST Client (VS Code)

Create `test.http`:
```http
POST http://localhost:8000/api/files/ HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="test.pdf"
Content-Type: application/pdf

< ./test.pdf
------WebKitFormBoundary
Content-Disposition: form-data; name="uploaded_by"

John Doe
------WebKitFormBoundary--
```

---

## Troubleshooting

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in backend settings
- Ensure frontend URL matches allowed origins

### File Upload Fails
- Check file size (must be < 50MB)
- Check file type (only PDF and images allowed)
- Verify server has write permissions to media directory

### Connection Refused
- Ensure backend is running: `python manage.py runserver`
- Check backend URL is correct
- Verify firewall isn't blocking port 8000

---

**For more information, check [README.md](./README.md)**
