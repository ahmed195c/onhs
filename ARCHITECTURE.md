# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    ┌─────────────┐              ┌──────────────┐
    │   Frontend  │              │   Backend    │
    │   React     │◄────────────►│   Django     │
    │  Port 3000  │    JSON      │  Port 8000   │
    └─────────────┘              └──────┬───────┘
         │                              │
         │                    ┌─────────┴─────────┐
         │                    ▼                   ▼
         │            ┌──────────────┐   ┌──────────────┐
         │            │  PostgreSQL  │   │   AWS S3     │
         │            │  Database    │   │   Storage    │
         │            └──────────────┘   └──────────────┘
         │
         └─────────────────────┐
                               ▼
                    ┌──────────────────┐
                    │  Static Files    │
                    │  CSS, JS, Images │
                    └──────────────────┘
```

---

## Request Flow: File Upload

```
1. User selects file
   │
   ▼
2. Browser validates
   - File size < 50MB
   - File type allowed
   │
   ▼
3. FormData created
   - file: binary data
   - uploaded_by: name
   - description: text
   │
   ▼
4. Axios sends POST
   POST /api/files/
   │
   ▼
5. Backend receives
   - Validates file again
   - Generates filename
   - Saves to media/
   │
   ▼
6. Django creates record
   - Saves metadata
   - Creates index
   │
   ▼
7. Response sent back
   {
     "id": 1,
     "file_url": "...",
     "file_type": "pdf",
     ...
   }
   │
   ▼
8. Frontend updates UI
   - Add to file list
   - Show success message
   - Reset form
```

---

## Component Hierarchy: Frontend

```
App (Main Component)
├── Header
│   └── Title & Description
│
├── FileUpload Component
│   ├── Dropzone Area
│   │   ├── Icon
│   │   ├── Title
│   │   └── Instructions
│   ├── Upload Form
│   │   ├── Input: uploaded_by
│   │   └── Textarea: description
│   └── Feedback
│       ├── Progress Bar
│       └── Message (success/error/info)
│
└── FileList Component
    ├── Header
    │   ├── Title
    │   └── Filter Buttons (All, Images, PDFs)
    │
    └── Files Grid
        └── File Card (repeated for each file)
            ├── Preview
            │   ├── Image (if image)
            │   └── PDF Icon (if PDF)
            ├── Info
            │   ├── Filename
            │   ├── Size
            │   ├── Date
            │   ├── Uploader
            │   ├── Description
            │   └── Dimensions (if image)
            └── Actions
                ├── Download Button
                └── Delete Button
```

---

## Database Schema

```
┌─────────────────────────────────────┐
│       UploadedFile                  │
├─────────────────────────────────────┤
│ id (PK)              Integer         │
│ file                 FileField       │
│ file_type            Char(10)        │
│ original_filename    Varchar(255)    │
│ file_size            Integer         │
│ uploaded_by          Varchar(255)    │
│ upload_date          DateTime        │
│ description          TextField       │
│ image_width          Integer (null)  │
│ image_height         Integer (null)  │
├─────────────────────────────────────┤
│ Indexes:                            │
│ - (file_type, upload_date)          │
│ - (uploaded_by)                     │
└─────────────────────────────────────┘
```

---

## API Endpoint Structure

```
/api/
├── /files/
│   ├── GET      → List all files (with filtering)
│   ├── POST     → Upload new file
│   │
│   ├── /{id}/
│   │   ├── GET    → Get file details
│   │   ├── PUT    → Update file (future)
│   │   ├── DELETE → Delete file
│   │   │
│   │   └── /download/
│   │       └── GET → Get download URL
│   │
│   ├── /images/
│   │   └── GET → List images only
│   │
│   └── /pdfs/
│       └── GET → List PDFs only
```

---

## Data Flow: File List Retrieval

```
React Component (FileList)
        │
        │ useEffect([refreshTrigger, filter])
        │
        ▼
API Call: getFiles(fileType)
        │
        ▼
Axios GET request
        │
        ▼
Django Router
        │
        ▼
FileViewSet.list()
        │
        ├─ Filter by type (if provided)
        │
        ├─ Get from database
        │
        ├─ Order by date
        │
        ├─ Paginate results
        │
        ▼
Serializer converts to JSON
        │
        ▼
Response sent to frontend
        │
        ▼
setState(files)
        │
        ▼
Re-render with file grid
```

---

## Deployment Architecture: Production

```
┌──────────────────────────────────────────────────────────┐
│                    CDN (CloudFlare)                      │
│         (Caches static files & images)                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                    HTTPS/SSL
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼────┐                   ┌─────▼──────┐
    │ Frontend │                   │  Backend   │
    │  Nginx   │                   │ Gunicorn   │
    │ (Static) │                   │  (Port 8) │
    └────┬────┘                   └─────┬──────┘
         │                               │
         └───────────┬───────────────────┘
                     │
         ┌───────────┴──────────┐
         ▼                      ▼
    ┌─────────────┐      ┌──────────────┐
    │ PostgreSQL  │      │  AWS S3      │
    │   RDS       │      │  Bucket      │
    └──────┬──────┘      └──────────────┘
           │
      Backups │
           │
           ▼
    ┌──────────────┐
    │ S3 (Glacier) │
    │  Archives    │
    └──────────────┘
```

---

## CI/CD Pipeline (GitHub Actions)

```
Developer pushes to main
        │
        ▼
GitHub Actions triggered
        │
        ├─ Run linter
        │
        ├─ Run backend tests
        │
        ├─ Run frontend tests
        │
        ├─ Build Docker images
        │
        ▼
All tests pass?
        │
   Yes  │  No → Stop, notify developer
        │
        ▼
Push to Docker registry
        │
        ▼
Deploy to production server
        │
        ├─ Pull images
        │
        ├─ Run migrations
        │
        ├─ Start containers
        │
        ▼
Health check
        │
        ▼
Notify deployment success
```

---

## File Organization Logic

```
media/
└── uploads/
    └── YYYY/           (Year)
        └── MM/         (Month)
            └── DD/     (Day)
                ├── document_1.pdf
                ├── image_1.jpg
                ├── image_2.png
                └── ...

Example: media/uploads/2024/01/28/document.pdf
```

---

## User Interaction Flow

```
┌─────────────────────────────────────────────────┐
│           User Opens Application                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │  See File Upload Area   │
        │  See File List (if any) │
        └────────┬────────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
    Drag & Drop    Click to Browse
         │               │
         └───────┬───────┘
                 │
                 ▼
         ┌──────────────────────┐
         │ File Selected        │
         └────────┬─────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ Fill Optional Fields     │
         │ - Uploaded By            │
         │ - Description            │
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────┐
         │ Click Upload Button  │
         │ (Auto on drop)       │
         └────────┬─────────────┘
                  │
              ┌───┴───┐
              ▼       ▼
          Success  Error
              │       │
              ▼       ▼
         Update   Show Message
         File List  (Clear after 3s)
```

---

## Security Layers

```
Frontend Layer
├─ Input validation
├─ File type check
├─ File size check
└─ Error handling

Network Layer
├─ HTTPS/SSL
├─ CORS validation
└─ Rate limiting

Backend Layer
├─ File type validation (again)
├─ File size validation (again)
├─ Malware scanning (optional)
├─ Virus scanning (optional)
└─ Database constraints

Storage Layer
├─ Secure permissions
├─ Encrypted storage
├─ Backup & redundancy
└─ Access logs

Application Layer
├─ Authentication
├─ Authorization
├─ Audit logging
└─ Rate limiting per user
```

---

## Scaling Strategy

```
Phase 1: Single Server
┌─────────────────────┐
│ Django + React      │
│ + PostgreSQL        │
│ + Local Storage     │
└─────────────────────┘

Phase 2: Separate Servers
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Frontend       │  │   Backend        │  │   Database       │
│   (Nginx)        │  │   (Gunicorn)     │  │   (PostgreSQL)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                       │
         └────────┬───────────┴───────────┬───────────┘
                  ▼                       ▼
          ┌──────────────┐        ┌──────────────┐
          │  Static CDN  │        │   S3 Files   │
          └──────────────┘        └──────────────┘

Phase 3: Distributed & Scaled
         ┌─────────────────────────────────────┐
         │         Load Balancer               │
         │         (CloudFlare / AWS LB)       │
         └────────┬────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
    ┌───▼──┐  ┌──▼──┐  ┌──▼──┐
    │  FE  │  │ BE  │  │ BE  │  (Multiple instances)
    └───┬──┘  └──┬──┘  └──┬──┘
        │        │        │
    ┌───▼────────▼────────▼───┐
    │    PostgreSQL Cluster    │  (Master-Replica)
    │    + Redis Cache         │
    │    + S3 Storage          │
    └──────────────────────────┘
```

---

**These diagrams show the complete architecture and data flow of your application!**
