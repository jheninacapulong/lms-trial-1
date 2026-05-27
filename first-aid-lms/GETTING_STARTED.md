# 🚑 First Aid LMS - Getting Started Guide

## ✅ What's Been Done

Your complete full-stack First Aid Learning Management System is ready! Here's what has been set up:

### Backend (Node.js + Express)
- ✅ Complete REST API with all CRUD operations
- ✅ PostgreSQL database with Prisma ORM
- ✅ Database schema with all required models
- ✅ Comprehensive seed script with sample data
- ✅ All controllers: Courses, Modules, Lessons, Learners, Enrollments, Assessments, Questions
- ✅ All routes properly configured
- ✅ Dependencies installed

### Frontend (React + Vite)
- ✅ Modern responsive dashboard
- ✅ Course management UI
- ✅ Learner management interface
- ✅ Module and lesson viewing
- ✅ TailwindCSS styling
- ✅ React Router navigation
- ✅ Dependencies installed

### Database
- ✅ Prisma schema configured
- ✅ 7 data models (Course, Module, Lesson, Assessment, Question, Learner, Enrollment)
- ✅ Seed script ready with 50+ sample learners and 2 complete courses

---

## 🚀 How to Run (3 Simple Steps)

### Step 1: Start PostgreSQL

**Windows (Services):**
1. Press `Win + R`
2. Type: `services.msc`
3. Find "PostgreSQL"
4. Right-click → Start

**Or use Command Line (Windows):**
```powershell
psql -U postgres -c "SELECT version();"
```

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Step 2: Run Database Setup

```powershell
cd backend
npx prisma migrate dev --name init
npm run seed
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
✅ Should show: `Server running on port 5000`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
✅ Should show: `Local: http://localhost:5173/`

**Visit:** [http://localhost:5173](http://localhost:5173)

---

## 📊 Sample Data Included

After running the seed script, you'll have:

- **2 Courses:**
  - Basic First Aid Fundamentals (4 modules, 14 lessons)
  - CPR and Emergency Response (4 modules, 14 lessons)

- **8 Modules** total (4 per course)

- **28 Lessons** with:
  - Rich HTML content
  - Multiple choice questions
  - True/False assessments
  - Learning objectives

- **4 Assessments** with quizzes

- **50 Learner Records** with:
  - Realistic names and emails
  - Random course enrollments
  - Progress percentages (0-100%)
  - Completion status

---

## 🎯 Key Features

### Dashboard
- Real-time statistics (Courses, Modules, Lessons, Learners)
- Clean, modern UI with cards
- Responsive design

### Course Management
- Create new courses with details
- View all courses in card layout
- Click to view course details
- Edit and delete courses
- View module and lesson structure

### Module Management
- Add modules to courses
- Organize modules with order
- View lessons within modules
- Delete modules

### Lesson Management
- Rich text content support
- HTML content editing
- Delete lessons
- Organized by module

### Learner Management
- Add new learners
- View learner details
- Track enrollments
- Monitor progress
- View completion status
- Delete learners

### Assessments (Framework Ready)
- Quiz structure in place
- Multiple question types
- Passing score tracking
- Ready for expansion

---

## 📡 API Endpoints

All endpoints are available at `http://localhost:5000/api/`

### Courses
```
GET    /courses              # Get all courses
GET    /courses/:id          # Get course with modules and lessons
POST   /courses              # Create course
PUT    /courses/:id          # Update course
DELETE /courses/:id          # Delete course
GET    /courses/stats        # Get dashboard statistics
```

### Modules, Lessons, Learners, Enrollments, Assessments, Questions
```
GET    /{resource}           # Get all
GET    /{resource}/:id       # Get one
POST   /{resource}           # Create
PUT    /{resource}/:id       # Update
DELETE /{resource}/:id       # Delete
```

---

## 🛠️ Troubleshooting

### "Can't reach database server at `localhost:5432`"
**Solution:** PostgreSQL is not running
```powershell
# Check if running
psql -U postgres -c "SELECT version();"

# If not running, start it (Windows Services)
```

### "ERROR: database 'lms_db' does not exist"
**Solution:** Create the database
```powershell
psql -U postgres -c "CREATE DATABASE lms_db;"
```

### "FATAL: password authentication failed"
**Solution:** Update `.env` file with correct credentials
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db"
```

### Port Already in Use
**Backend:** Edit `backend/.env`:
```
PORT=5001
```

**Frontend:** Vite auto-detects next available port

### Missing Dependencies
```powershell
# Reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 📁 Project Structure

```
first-aid-lms/
├── backend/
│   ├── controllers/        # Route handlers
│   ├── routes/             # API endpoints
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── prismaClient.js
│   ├── seed/seed.js        # Sample data
│   ├── server.js           # Express app
│   ├── package.json
│   └── .env               # Configuration
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/api.js # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── README.md              # Full documentation
├── SETUP.md               # Detailed setup guide
└── QUICKSTART.bat         # Windows automated setup
```

---

## 🎓 Next Steps

1. ✅ **Verify Setup**
   - Both servers running
   - Dashboard loads
   - Sample data visible

2. 📚 **Explore Features**
   - Create a new course
   - Add modules and lessons
   - Manage learners
   - View statistics

3. 🔧 **Customize**
   - Add more courses
   - Create assessments
   - Customize styling
   - Add new features

4. 🚀 **Deploy**
   - Build frontend: `npm run build`
   - Deploy to server
   - Configure environment variables

---

## 📞 Common Tasks

### Add a New Course
1. Go to Courses page
2. Click "+ Add New Course"
3. Fill in details (title, description, category, duration)
4. Click "Create Course"

### Enroll Learners
1. Go to Learners page
2. View enrolled learners
3. Enrollments created during seeding

### Create Assessments
1. Access through course modules
2. Framework ready for expansion
3. Support for MC and T/F questions

### Export Data
- Use Prisma Studio: `npx prisma studio`
- Query API endpoints
- Database queries with psql

---

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup and troubleshooting
- **QUICKSTART.bat** - Windows automation script
- **.env.example** - Environment variable template

---

## 🎉 You're All Set!

Your First Aid LMS is ready to use. Start both servers and begin managing your training courses!

**Questions?** Check the documentation files or review the API endpoints.

**Enjoy! 🚑**
