# File Manager Application
## Django Backend + React Frontend

A full-stack web application for uploading, managing, and sharing PDF files and images.

---

## 📋 Project Structure

```
project/
├── backend/                 # Django REST API
│   ├── config/             # Django configuration
│   ├── filemanager/        # File management app
│   ├── media/              # Uploaded files storage
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API client
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Container orchestration
└── README.md
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn
- Docker & Docker Compose (optional)

### Backend Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   Server runs at: `http://localhost:8000`
   Admin panel: `http://localhost:8000/admin`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   App opens at: `http://localhost:3000`

---

## 🐳 Docker Setup (Recommended for Production)

### Build and Run with Docker Compose

1. **Create .env file in project root:**
   ```bash
   DEBUG=False
   SECRET_KEY=your-secure-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
   CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
   DB_USER=filemanager
   DB_PASSWORD=securepassword123
   ```

2. **Build and start containers:**
   ```bash
   docker-compose up -d --build
   ```

3. **Run migrations:**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - Admin: `http://localhost:8000/admin`

---

## 📡 API Endpoints

### File Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files/` | List all files |
| POST | `/api/files/` | Upload new file |
| GET | `/api/files/{id}/` | Get file details |
| DELETE | `/api/files/{id}/` | Delete file |
| GET | `/api/files/images/` | List all images |
| GET | `/api/files/pdfs/` | List all PDFs |
| GET | `/api/files/{id}/download/` | Download file |

### Upload Example
```bash
curl -X POST http://localhost:8000/api/files/ \
  -F "file=@document.pdf" \
  -F "uploaded_by=John Doe" \
  -F "description=Project proposal"
```

---

## 🛠️ Configuration & Customization

### Environment Variables

**Backend (.env)**
- `DEBUG`: Enable/disable debug mode
- `SECRET_KEY`: Django secret key (change in production!)
- `ALLOWED_HOSTS`: Comma-separated allowed hosts
- `CORS_ALLOWED_ORIGINS`: Allowed frontend origins
- `DB_ENGINE`: Database engine (sqlite3/postgresql)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database credentials

### Database

**Development:** SQLite (default)
**Production:** PostgreSQL (recommended)

To switch to PostgreSQL, uncomment the PostgreSQL section in `backend/config/settings.py` and set environment variables.

### File Upload Settings

Edit `backend/config/settings.py`:
- `MAX_UPLOAD_SIZE`: Maximum file size (default: 50MB)
- `ALLOWED_FILE_TYPES`: Allowed extensions
- `MEDIA_ROOT`: Upload storage location

### AWS S3 Storage (for scaling)

For production hosting with S3:
1. Uncomment S3 configuration in `settings.py`
2. Install boto3: `pip install boto3 django-storages`
3. Set AWS credentials in environment variables

---

## 🚢 Deployment Guide

### Hosting Options

#### 1. **Heroku**
```bash
# Install Heroku CLI, then:
heroku login
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

#### 2. **DigitalOcean App Platform**
1. Push code to GitHub
2. Connect repository to DigitalOcean
3. Set environment variables
4. Deploy using docker-compose

#### 3. **AWS (EC2 + RDS + S3)**
1. Launch EC2 instance (Ubuntu)
2. Install Docker & Docker Compose
3. Configure RDS PostgreSQL
4. Set up S3 bucket for media storage
5. Use docker-compose to deploy

#### 4. **Railway.app** (Simplest for beginners)
1. Push to GitHub
2. Connect Railway to your GitHub repo
3. Set environment variables
4. Railway auto-deploys on push

### Production Checklist

- [ ] Change `SECRET_KEY` to a secure value
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure proper database (PostgreSQL)
- [ ] Set up file storage (S3 or local with backups)
- [ ] Configure CORS for your domain
- [ ] Set up email backend for notifications
- [ ] Enable Django security middleware
- [ ] Set up monitoring & logging
- [ ] Configure backup strategy

---

## 🔒 Security Features

✅ CORS configuration for frontend/backend separation
✅ File type validation (only PDF & images allowed)
✅ File size limits (50MB max)
✅ CSRF protection enabled
✅ SQL injection protection (Django ORM)
✅ XSS protection headers
✅ Secure password hashing
✅ Environment variable security

---

## 📦 Technologies Used

### Backend
- **Django** 4.2 - Web framework
- **Django REST Framework** - REST API
- **PostgreSQL** - Production database
- **Gunicorn** - WSGI server
- **Pillow** - Image processing
- **python-decouple** - Environment management

### Frontend
- **React** 18 - UI framework
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **CSS3** - Styling

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Clear database (development only)
rm backend/db.sqlite3
```

### Frontend won't connect to backend
- Check CORS_ALLOWED_ORIGINS in backend settings
- Verify backend is running on port 8000
- Check browser console for CORS errors

### Database connection error
- Verify database credentials in .env
- Check database is running: `docker-compose exec db psql -U filemanager -d filemanager`

---

## 📞 Support & Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Documentation](https://docs.docker.com/)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🎯 Future Enhancements

- [ ] User authentication & profiles
- [ ] File sharing & permissions
- [ ] Image cropping & editing
- [ ] PDF annotation tools
- [ ] Search functionality
- [ ] File tags & categories
- [ ] Analytics & usage stats
- [ ] Mobile app (React Native)
- [ ] WebRTC for real-time collaboration

---

**Happy coding! 🚀**
