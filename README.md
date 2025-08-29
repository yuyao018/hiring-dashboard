# High5 Recruitment Portal
- **Project**: Hiring Dashboard (Recruitment Portal) with User-friendly Interface

## Team Members
- Vaenesa Gayatri (Leader)       - develop chatbot
- Chan Hew Yan                   - develop chatbot
- Chook Yao Yu                   - develop applicants' career site, and recruitment portal
- Shirlyn Chew Ming Huey         - develop applicants' career site, and recruitment portal
- Muhammad Rasuli Bin Akbar Ali  - survey

## Problem and Solution Summary

### Scenario - Company Background
High5 is a small-to-medium IT services company based in Kuala Lumpur with around 60 employees. They specialize in providing cloud infrastructure, cybersecurity solutions, and custom software development for SMEs. The company is growing rapidly and needs to expand its workforce, especially in software engineering, data analysis, and cybersecurity.

### Problem Statement
Traditional recruitment processes are often time-consuming, inefficient, and lack systematic evaluation methods. Recruiters struggle with:
- Manual screening of numerous applications
- Inconsistent evaluation criteria
- Difficulty in tracking applicant progress
- Lack of automated scoring and ranking systems
- Poor user experience for both recruiters and applicants

### Solution Overview
**High5 Recruitment Portal** is a comprehensive hiring management system that streamlines the recruitment process through:

- **Automated Applicant Scoring**: AI-powered compatibility analysis based on education, skills, personality, and achievements
- **Smart Dashboard**: Real-time visualization of applicant data with filtering and sorting capabilities
- **Job Management**: Complete CRUD operations for job postings with status tracking
- **Applicant Tracking**: Status management (Reviewing, Shortlisted, Rejected) with detailed applicant profiles
- **Resume Management**: Secure file upload and download system for applicant resumes
- **Admin Authentication**: Secure login system for recruiters and administrators

### Key Features
- 📊 **Intelligent Scoring System**: Automated evaluation of applicants based on multiple criteria
- 🎯 **Qualification Assessment**: Visual indicators for qualified/not qualified candidates
- 📈 **Performance Analytics**: Circular progress indicators and detailed breakdowns
- 🔍 **Advanced Filtering**: Filter by job title, applicant status, and recruitment scope
- 📱 **Responsive Design**: Modern UI with Material-UI components
- 🔐 **Secure Authentication**: Protected admin access with session management

## Technology Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.8.1** - Client-side routing for single-page applications
- **Material-UI 7.3.1** - React component library for consistent design
- **React Icons 5.5.0** - Icon library for enhanced UI elements
- **Axios 1.11.0** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database management system
- **pg 8.16.3** - PostgreSQL client for Node.js
- **bcrypt 6.0.0** - Password hashing for security
- **multer 2.0.2** - File upload middleware for resume handling
- **cors 2.8.5** - Cross-origin resource sharing middleware
- **Dotenv 17.2.1** - Environment variable management

### Development Tools
- **React Scripts 5.0.1** - Build tools and development server
- **ESLint** - Code linting and quality assurance
- **Web Vitals 2.1.4** - Performance monitoring

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

**Note for Windows Users**: If you encounter execution policy errors, run this command in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Database Setup
1. **Install PostgreSQL**, link to download [https://www.postgresql.org/]
2. **Create database**
```CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  --auto-generate UUID for primary key

-- Create Applicant table
CREATE TABLE Applicant (
 applicant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), --UUID as PK
 applicant_name VARCHAR(50) NOT NULL,
 contact_number VARCHAR(15),
 email VARCHAR(50) UNIQUE NOT NULL,
 address VARCHAR(255),
 resume VARCHAR(250), -- resume file name
 role_applied UUID NOT NULL,   -- FK to job_id
 personality_type VARCHAR(50),
 status VARCHAR(20), -- 'Reviewing', 'Shortlisted', 'Rejected'
 personality_test_score TEXT,
 compatibility_score INT CHECK (compatibility_score BETWEEN 0 AND 100),
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 compatibility_breakdown TEXT
);

-- Add foreign key constraint for role_applied referencing job(job_id)
ALTER TABLE Applicant
ADD CONSTRAINT fk_role_applied
FOREIGN KEY (role_applied) REFERENCES job(job_id)
ON DELETE CASCADE;

-- Create Job table
CREATE TABLE Job (
   job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),        -- UUID PK
   job VARCHAR(50) NOT NULL,                                  -- job title e.g. "Software Engineer"
   job_type VARCHAR(20) DEFAULT 'Full-time'
      CHECK (job_type IN ('Full-time', 'Part-time', 'Intern')), -- job type
   experience VARCHAR(100),                                   -- e.g. "2 years", "None"
   education VARCHAR(100),                                    -- e.g. "Degree in Computer Science"
   requirement TEXT,                                          -- general requirements
   description TEXT,                                          -- detailed job description
   status VARCHAR(10) DEFAULT 'active',                       -- job status (active, draft, closed)
   created_by UUID,                                           -- FK to admin_id
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT fk_job_created_by
      FOREIGN KEY (created_by) REFERENCES admin(admin_id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
   );

   -- Create Admin table
   CREATE TABLE Admin (
   admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- UUID as PK
   name VARCHAR(50) NOT NULL,
   email VARCHAR(50) UNIQUE NOT NULL,
   password VARCHAR(12) NOT NULL,                        -- store a hashed password, not plain text
   role VARCHAR(20) NOT NULL                              -- e.g. HR Manager, Hiring Manager
   );

   -- Add in sample data to log in hiring system
   -- Insert sample Admin
   INSERT INTO admin (name, email, password, role) VALUES
   ('Alice Tan', 'alice@company.com', '123', 'Hiring Manager'),
   ('Bob Lee', 'bob@company.com', '123', 'IT Manager');
   ```

1. **Create environment variables** by creating a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PORT=5432
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   RESUME_UPLOAD_PATH="C://path//to//store//resume"
   ```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone git@github.com:yuyao018/hiring-dashboard.git
   cd hiring-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Core React dependencies
   npm install react
   npm install react-dom
   npm install react-router-dom
   npm install react-phone-input-2

   # HTTP client and utilities
   npm install axios
   npm install dayjs

   # Backend dependencies
   npm install pg
   npm install cors
   npm install multer
   npm install express
   npm install bcrypt
   npm install natural

   # UI components and icons
   npm install react-icons
   npm install @mui/material @emotion/react @emotion/styled
   ```

3. **Start the backend server**
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:4000`

4. **Start the frontend development server**
   ```bash
   npm start
   ```
   The application will open on `http://localhost:3000`

### Database Schema
The application uses the following main tables:
- `admins` - Administrator accounts
- `jobs` - Job postings and requirements
- `applicants` - Applicant information and scores

## Usage Guide

### Admin Login
1. Navigate to the login page
2. Enter admin credentials
3. Access the dashboard upon successful authentication

### Job Management
1. **Create Jobs**: Use the "Create Job" button to add new positions
2. **Manage Jobs**: View, edit, and update job statuses
3. **Publish/Close**: Control job visibility and application status

### Applicant Review
1. **View Applicants**: See all applicants in the dashboard
2. **Filter Results**: Use dropdown filters to narrow down candidates
3. **Review Details**: Click on applicant cards to view detailed profiles
4. **Update Status**: Shortlist or reject applicants using action buttons
5. **Download Resumes**: Access applicant resumes for detailed review

### Scoring System
The application automatically evaluates applicants based on:
- **Education Qualification**: Academic background assessment
- **Required Skills**: Skills match percentage
- **Grades**: CGPA calculation and evaluation
- **Achievements**: Recognition and accomplishments
- **Projects**: Project experience and complexity

## Reflection on Challenges and Learnings

### Technical Challenges

1. **Database Integration Complexity**
   - **Challenge**: Integrating PostgreSQL with Node.js and handling complex queries
   - **Learning**: Improved understanding of database design patterns and connection pooling
   - **Solution**: Implemented proper error handling and connection management

2. **State Management in React**
   - **Challenge**: Managing complex state across multiple components and API calls
   - **Learning**: Better understanding of React hooks, useEffect dependencies, and state synchronization
   - **Solution**: Implemented proper state lifting and useEffect cleanup

3. **File Upload and Storage**
   - **Challenge**: Implementing secure resume upload and download functionality
   - **Learning**: Understanding file handling, security considerations, and storage best practices
   - **Solution**: Used multer middleware with proper validation and secure file serving

4. **Real-time Data Updates**
   - **Challenge**: Keeping the UI synchronized with backend data changes
   - **Learning**: Importance of proper API design and state management patterns
   - **Solution**: Implemented optimistic updates and proper error handling

### Key Learnings

1. **Full-Stack Development**: Gained comprehensive experience in both frontend and backend development
2. **Database Design**: Learned proper schema design and query optimization
3. **Security Best Practices**: Implemented authentication, input validation, and secure file handling
4. **API Design**: Created RESTful APIs with proper error handling and status codes
5. **User Experience**: Focused on creating intuitive interfaces for complex data management
6. **Performance Optimization**: Learned techniques for efficient data loading and rendering

### Future Improvements

1. **Real-time Notifications**: Implement WebSocket connections for live updates
2. **Advanced Analytics**: Add detailed reporting and analytics dashboards
3. **AI Enhancement**: Implement more sophisticated AI algorithms for candidate matching
4. **Multi-tenant Architecture**: Support for multiple organizations