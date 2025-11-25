# Job Portal Frontend

A complete frontend-only job portal system built with HTML, CSS, and JavaScript using localStorage for data persistence.

## Features

### User Accounts & Profiles
- **Job Seekers**: Create profile, upload CV/resume, add work experience, skills, and education
- **Employers**: Company profile, branding, logo upload, company description
- **Admin**: Platform administration and management

### Job Listings
- Post detailed job listings (title, description, location, salary, experience, job type)
- Categorize jobs by industry, remote, full-time, part-time, etc.
- Edit and delete job postings

### Advanced Search & Filtering
- Search by keywords, skills, location
- Filter by job type, salary, experience level, industry
- Skills-based search with synonym matching
- Save search criteria

### Job Applications
- Upload resume and cover letter
- One-click apply option (uses profile data)
- Track application status (Pending, Viewed, Interview, Accepted, Rejected)
- Application dashboard for job seekers

### Communication Tools
- Messaging system between job seekers and employers
- Real-time conversation threads
- Notification badges for unread messages

### Additional Features
- **Bookmarks**: Save jobs for later review
- **Job Alerts**: Set up customizable job alerts
- **Analytics**: View statistics for jobs and applications
- **Responsive Design**: Mobile-friendly interface
- **Admin Dashboard**: Manage users, jobs, and platform analytics

## Getting Started

1. Open `index.html` in a web browser
2. The system will automatically initialize with mock data
3. You can register as:
   - **Job Seeker**: Browse and apply to jobs
   - **Employer**: Post jobs and manage applications
   - **Admin**: Use admin credentials (admin@jobportal.com / admin123)

## Default Accounts

### Admin
- Email: `admin@jobportal.com`
- Password: `admin123`

### Job Seeker (Mock)
- Email: `john@example.com`
- Password: `password123`

### Employer (Mock)
- Email: `hr@techcorp.com`
- Password: `password123`

## File Structure

```
job-portal/
├── index.html                  # Landing page
├── login.html                  # Login page
├── register.html               # Registration page
├── job-listings.html           # Browse all jobs
├── job-detail.html             # Individual job details
├── job-seeker-dashboard.html   # Job seeker dashboard
├── employer-dashboard.html     # Employer dashboard
├── admin-dashboard.html        # Admin dashboard
├── profile.html                # Profile management
├── applications.html           # Application tracking
├── messages.html               # Messaging interface
├── post-job.html               # Post/edit job form
├── css/
│   ├── style.css              # Main stylesheet
│   └── responsive.css         # Mobile responsive styles
└── js/
    ├── storage.js              # localStorage utilities
    ├── auth.js                 # Authentication logic
    ├── jobs.js                 # Job management
    ├── search.js               # Search and filtering
    ├── messaging.js            # Messaging system
    ├── admin.js                # Admin functions
    └── main.js                 # Core functionality
```

## Data Storage

All data is stored in browser localStorage under the key `jobPortalData`. The data structure includes:
- Users (job seekers, employers, admins)
- Jobs
- Applications
- Messages
- Bookmarks
- Alerts
- Reviews

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## Notes

- This is a frontend-only application with no backend server
- Data persists in browser localStorage (cleared if browser data is cleared)
- File uploads (resume, logo) are simulated (file names are stored, not actual files)
- All features work client-side with no external dependencies

## Features Implemented

✅ User authentication (login/register)
✅ Job seeker and employer profiles
✅ Job posting and management
✅ Advanced search with filters
✅ Job applications with status tracking
✅ Messaging system
✅ Bookmarks functionality
✅ Job alerts (structure ready)
✅ Admin dashboard
✅ Responsive design
✅ Analytics and statistics
✅ One-click apply
✅ Skills-based matching

Enjoy using the Job Portal!

