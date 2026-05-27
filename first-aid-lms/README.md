# First Aid Learning Management System (LMS)

A full-stack admin LMS portal built with React, Vite, Express.js, and PostgreSQL for managing First Aid training courses.

## Features

- **Course Management**: Create, edit, delete courses with descriptions, thumbnails, and categories
- **Module Management**: Organize courses into modules with lessons
- **Lesson Management**: Add lessons with text content and multimedia
- **Assessments & Quizzes**: Create quizzes with multiple choice and true/false questions
- **Learner Management**: Manage learner records and enrollments
- **Dashboard**: View system statistics and recent activity
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Axios, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
cd first-aid-lms

# Backend setup
cd backend
npm install

# Frontend setup (in another terminal)
cd frontend
npm install
```

### 2. Database Configuration

Create a `.env` file in the `backend` directory:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db"
PORT=5000
NODE_ENV=development
```

**Update `YOUR_PASSWORD` with your PostgreSQL password.**

### 3. Database Setup

```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course with modules and lessons
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/stats` - Get dashboard statistics

### Modules
- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create module
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Learners
- `GET /api/learners` - Get all learners
- `POST /api/learners` - Create learner
- `PUT /api/learners/:id` - Update learner
- `DELETE /api/learners/:id` - Delete learner

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get assessment with questions
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

## Project Structure

```
first-aid-lms/
├── backend/
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── middleware/         # Custom middleware
│   ├── seed/               # Seed scripts
│   ├── server.js           # Express app entry point
│   ├── package.json
│   └── .env                # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
```

## Sample Data

The database is pre-seeded with:
- 2 complete First Aid courses
- 8 modules (4 per course)
- 28 lessons total
- 4 assessments with questions
- 50 learner records
- Multiple course enrollments

## Development

### Adding New Courses
1. Go to the Courses page
2. Click "Add New Course"
3. Fill in course details
4. Create modules and add lessons to modules

### Creating Assessments
1. Navigate to a module
2. Click "Add Assessment"
3. Create quiz questions with correct answers

### Managing Learners
1. Go to the Learners page
2. Add learner records or bulk import
3. Enroll learners into courses

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` file
- Check PostgreSQL credentials

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Vite will use next available port

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.
