# ⚡ Quick Start Guide (5 Minutes)

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Python 3.9+
- Node.js 16+
- One terminal window split into 2

---

## Terminal 1: Backend

```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server (leave running)
python manage.py runserver
```

✅ Backend ready at: **http://localhost:8000**  
✅ Admin panel at: **http://localhost:8000/admin**

---

## Terminal 2: Frontend

```bash
# Navigate to frontend
cd frontend

# Install & start
npm install
npm start
```

✅ App opens automatically at: **http://localhost:3000**

---

## 🎉 That's It!

### What You Can Do Now:
1. **Upload Files:**
   - Drag & drop or click to upload
   - Supports: PDF, JPG, PNG, GIF, BMP, WebP
   - Max size: 50MB

2. **Manage Files:**
   - View all uploaded files
   - Filter by type (All, Images, PDFs)
   - Download or delete files

3. **Admin Access:**
   - Go to http://localhost:8000/admin
   - Create superuser: `python manage.py createsuperuser`
   - Manage uploads from dashboard

---

## 📚 What's Next?

### To Learn More:
- **Setup Details:** Read [SETUP.md](./SETUP.md)
- **API Reference:** Check [API.md](./API.md)
- **Deploy Online:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Plan:** Review [PLANNING.md](./PLANNING.md)

### Common Tasks:

**Create Admin User:**
```bash
cd backend
python manage.py createsuperuser
# Follow prompts to create account
```

**Stop Servers:**
```bash
# Backend: Press Ctrl+C in terminal 1
# Frontend: Press Ctrl+C in terminal 2
```

**Clear Database:**
```bash
cd backend
rm db.sqlite3
python manage.py migrate
```

**Change Ports:**
```bash
# Backend on different port
python manage.py runserver 8001

# Frontend on different port
PORT=3001 npm start
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Kill process: `lsof -i :8000` (Mac/Linux) |
| Module not found | Activate venv: `source venv/bin/activate` |
| npm install fails | Clear cache: `npm cache clean --force` |
| CORS errors | Check `.env` CORS_ALLOWED_ORIGINS |

---

## 📦 Project Structure

```
project/
├── backend/          # Django API (port 8000)
├── frontend/         # React App (port 3000)
├── docker-compose.yml
├── README.md
├── SETUP.md
├── API.md
├── DEPLOYMENT.md
└── PLANNING.md
```

---

## 🎯 Ready to Deploy?

When you're ready to go online:

1. **Choose Platform:** Railway, Heroku, DigitalOcean, AWS
2. **Read:** [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Follow Steps:** 10-15 minutes to deploy
4. **Get URL:** Share your app!

---

## 💡 Pro Tips

✨ **Better Performance:**
- Use PostgreSQL instead of SQLite
- Store files on AWS S3
- Enable caching with Redis

✨ **Better Security:**
- Change SECRET_KEY in .env
- Use strong passwords
- Enable HTTPS/SSL
- Set DEBUG=False in production

✨ **Better Development:**
- Use VS Code with extensions
- Install Django Debug Toolbar
- Use Postman for API testing
- Write unit tests

---

## 📞 Get Help

- **Docs:** Check README.md, SETUP.md, API.md
- **Stack Overflow:** Tag your questions #django #react
- **GitHub Issues:** Report bugs in your repo
- **Official Docs:** https://docs.djangoproject.com/

---

**Happy coding! 🚀 You're all set to start building!**
