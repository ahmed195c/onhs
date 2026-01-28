# Detailed Setup Instructions

## 🖥️ System Requirements

- **OS:** Windows, macOS, or Linux
- **Python:** 3.9 or higher
- **Node.js:** 16 or higher
- **npm:** 8 or higher
- **RAM:** 2GB minimum, 4GB recommended
- **Storage:** 500MB for development

---

## 📥 Installation Steps

### Step 1: Clone/Download the Project

```bash
# If using git
git clone <your-repo-url>
cd <project-directory>

# Or download and extract ZIP file
```

### Step 2: Backend Setup

#### 2.1 Create Python Virtual Environment
```bash
cd backend

# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.3 Create Environment File
```bash
# Copy example to create actual .env
copy .env.example .env          # Windows
# or
cp .env.example .env            # macOS/Linux
```

Edit `.env` file and set:
```env
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### 2.4 Run Database Migrations
```bash
python manage.py migrate
```

**Expected output:**
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  [... more migrations ...]
  Applying filemanager.0001_initial... OK
```

#### 2.5 Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
```

**Follow prompts:**
```
Username: admin
Email address: admin@example.com
Password: (enter secure password)
Password (again): (confirm password)
```

#### 2.6 Start Backend Server
```bash
python manage.py runserver
```

**Expected output:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
January 28, 2024 - 10:30:45
Django version 4.2.0, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ Backend is running at `http://localhost:8000`

### Step 3: Frontend Setup

#### 3.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### 3.2 Install Node Dependencies
```bash
npm install
```

**Wait for all packages to install** (~3-5 minutes)

#### 3.3 Start Development Server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view file-manager-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

✅ Frontend is running at `http://localhost:3000`

---

## 🧪 Testing the Application

### 1. Access the Frontend
- Open browser and go to: `http://localhost:3000`
- You should see the File Manager interface

### 2. Test File Upload
- Click on the upload area or drag a file
- Supported files: PDF, JPG, PNG, GIF, BMP, WebP
- File size: max 50MB
- Fill in optional fields (name, description)
- Click upload

### 3. View Uploaded Files
- Files should appear in the list below upload area
- Filter by "All Files", "Images", or "PDFs"
- Click download to get files
- Click delete to remove files

### 4. Access Admin Panel
- Go to: `http://localhost:8000/admin`
- Login with superuser credentials created earlier
- Browse uploaded files, filter, and manage

---

## 🔧 Troubleshooting

### Backend Issues

#### Port 8000 Already in Use
```bash
# Change port
python manage.py runserver 8001

# Or kill process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# macOS/Linux
lsof -i :8000
kill -9 <process_id>
```

#### Module Not Found Error
```bash
# Ensure virtual environment is activated
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### Database Lock Error
```bash
# Delete database and remigrate
rm backend/db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Issues

#### npm install fails
```bash
# Clear npm cache and try again
npm cache clean --force
npm install

# Or use yarn
npm install -g yarn
yarn install
```

#### Port 3000 Already in Use
```bash
# Change port
PORT=3001 npm start
```

#### CORS Errors in Console
- Check backend CORS settings in `.env`
- Make sure `CORS_ALLOWED_ORIGINS` includes frontend URL
- Restart backend after changes

### Connection Issues

#### Frontend can't reach backend
```bash
# Check if backend is running
curl http://localhost:8000/api/files/

# Check CORS configuration
# Backend must have CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### API returns 403 CSRF Error
- This shouldn't happen with REST API
- If it does, check that POST requests use correct headers
- Frontend code handles this automatically

---

## 📊 Project Structure Walkthrough

### Backend Files

```
backend/
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
├── config/
│   ├── settings.py           # Main Django settings
│   ├── urls.py               # URL routing
│   └── wsgi.py               # Production entry point
├── filemanager/
│   ├── models.py             # Database models
│   ├── views.py              # API views
│   ├── serializers.py        # Data serializers
│   ├── urls.py               # App URLs
│   └── admin.py              # Admin interface
└── media/                    # Uploaded files directory
```

### Frontend Files

```
frontend/
├── package.json              # Dependencies
├── src/
│   ├── index.js             # Entry point
│   ├── App.js               # Main component
│   ├── App.css              # Styles
│   ├── api/
│   │   └── fileApi.js       # API calls
│   └── components/
│       ├── FileUpload.js    # Upload form
│       ├── FileUpload.css
│       ├── FileList.js      # File listing
│       └── FileList.css
└── public/
    └── index.html           # HTML template
```

---

## 🎯 Next Steps

### For Development
1. ✅ Explore the code
2. ✅ Add more features (user auth, comments, etc.)
3. ✅ Write tests
4. ✅ Deploy to staging

### For Production
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Choose hosting platform (Railway, Heroku, AWS)
3. Set up PostgreSQL database
4. Configure AWS S3 for file storage
5. Deploy using Docker Compose
6. Set up CI/CD pipeline

---

## 📚 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework Tutorial](https://www.django-rest-framework.org/tutorial/quickstart/)
- [React Official Tutorial](https://react.dev/learn)
- [Docker Getting Started](https://docs.docker.com/get-started/)

---

**Need help? Check the [README.md](./README.md) or [API.md](./API.md) files!**
