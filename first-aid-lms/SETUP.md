# First Aid LMS - Complete Setup Guide

All dependencies have been installed! Follow these steps to get the application running.

## Step 1: Start PostgreSQL

### Windows (using pgAdmin or Command Line)

**Option A: Using Services (Recommended)**
1. Press `Win + R` and type `services.msc`
2. Find "PostgreSQL" in the list
3. Right-click → "Start"

**Option B: Using Command Line**
```powershell
# If PostgreSQL is installed in Program Files
& "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" -D "C:\Program Files\PostgreSQL\15\data" -l logfile start
```

**Option C: Verify PostgreSQL is Running**
```powershell
psql -U postgres -c "SELECT version();"
```

### macOS
```bash
brew services start postgresql
# or
pg_ctl -D /usr/local/var/postgres start
```

### Linux
```bash
sudo systemctl start postgresql
```

## Step 2: Create the Database

Open a terminal and connect to PostgreSQL:

```powershell
psql -U postgres
```

In the PostgreSQL prompt:
```sql
CREATE DATABASE lms_db;
\q
```

## Step 3: Configure Environment Variables

The `.env` file has been created with default values. If needed, update it:

**File:** `backend/.env`
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db"
PORT=5000
NODE_ENV=development
```

Replace `YOUR_PASSWORD` with your PostgreSQL password (default is usually `postgres`).

## Step 4: Run Database Migrations

Open a terminal in the `backend` directory:

```powershell
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init

# This will:
# - Create all necessary tables
# - Generate Prisma client
```

## Step 5: Seed the Database (Optional but Recommended)

Populate the database with sample First Aid courses and learner data:

```powershell
# Still in backend directory
npm run seed
```

This creates:
- 2 complete First Aid courses
- 8 modules with 28 lessons
- 4 assessments with quiz questions
- 50 realistic learner records

## Step 6: Start the Backend Server

**Terminal 1:**
```powershell
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
```

Visit: `http://localhost:5000`
- You should see: `{"message":"LMS API Running"}`

## Step 7: Start the Frontend Server

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v8.0.12 ready in 123 ms

➜  Local:   http://localhost:5173/
```

Visit: `http://localhost:5173`

## Step 8: Access the Dashboard

You're now ready to use the LMS!

### Available Features:

1. **Dashboard** - View system statistics
2. **Courses** - Create, edit, delete courses
3. **Modules** - Manage course modules
4. **Lessons** - Add and edit lesson content
5. **Learners** - Manage learner records
6. **Assessments** - Create quizzes (premium)

## Troubleshooting

### "Can't reach database server at `localhost:5432`"
- **Solution**: PostgreSQL is not running
- Start PostgreSQL using the steps above
- Verify: `psql -U postgres -c "SELECT version();"`

### "ERROR: database "lms_db" does not exist"
- **Solution**: Create the database
```powershell
psql -U postgres -c "CREATE DATABASE lms_db;"
```

### "FATAL: password authentication failed"
- **Solution**: Update `DATABASE_URL` in `backend/.env` with correct password
- Default PostgreSQL password is often `postgres`

### Port 5000 already in use (Backend)
- Edit `backend/.env` and change:
```
PORT=5001
```

### Port 5173 already in use (Frontend)
- Vite will automatically use the next available port

### Dependencies not installed
```powershell
# Clear and reinstall
rm -r node_modules package-lock.json
npm install
```

### Prisma Client not generated
```powershell
cd backend
npx prisma generate
```

## Common Commands

```powershell
# Backend
cd backend
npm run dev          # Start development server
npm run seed         # Seed database
npx prisma studio   # Open Prisma database GUI

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

## API Testing

### Test the API with curl or Postman:

```bash
# Get all courses
curl http://localhost:5000/api/courses

# Get dashboard stats
curl http://localhost:5000/api/courses/stats

# Get all learners
curl http://localhost:5000/api/learners
```

## Next Steps

1. ✅ Verify both servers are running
2. ✅ Test the dashboard loads
3. ✅ Try creating a new course
4. ✅ Add modules and lessons
5. ✅ Manage learners and enrollments

## Support

If you encounter issues:
1. Check the logs in both terminals
2. Verify PostgreSQL is running
3. Ensure all ports (5000, 5173) are available
4. Try restarting both servers

Enjoy using the First Aid LMS! 🚑
