# Class Schedule Tracker + Authentication System

A secure web application for managing personal class schedules with user authentication, registration, and session management.

## Overview

This application allows users to create accounts, securely log in, and manage their personal class schedules. Each user can only view and modify their own classes, ensuring complete data privacy and security.

## Resources

### 1. User Resource
**Represents application users with authentication capabilities**

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `email` | TEXT | Unique email address (used for login) |
| `password` | BLOB | Encrypted password using bcrypt |

### 2. Schedule Resource
**Represents individual class entries in a user's schedule**

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | INTEGER | Primary key, auto-increment |
| `type` | TEXT | Course type/department (e.g., "CS", "MATH") |
| `code` | TEXT | Course number (e.g., "3200", "2450") |
| `layman` | TEXT | Course title/description |
| `semester` | TEXT | Semester code (e.g., "FA25", "SP26") |
| `user_email` | TEXT | Foreign key linking to user's email |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
```

### Schedule Table
```sql
CREATE TABLE schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    code TEXT NOT NULL,
    layman TEXT NOT NULL,
    semester TEXT NOT NULL,
    user_email TEXT NOT NULL,
    FOREIGN KEY (user_email) REFERENCES users (email)
);
```

## REST API Endpoints

### User Management

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `POST` | `/users` | Create new user account | No |

### Authentication

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `POST` | `/sessions/auth` | Authenticate user credentials | No |
| `GET` | `/sessions` | Create/retrieve session ID | No |
| `DELETE` | `/sessions` | Delete session data | Yes |

### Class Schedule Management

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `GET` | `/classes` | Retrieve user's classes | Yes |
| `POST` | `/schedule` | Create new class entry | Yes |
| `DELETE` | `/classes/<class_id>` | Delete specific class | Yes |
| `PUT` | `/classes` | Update existing class | Yes |

### Session & Settings

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `PUT` | `/session/settings` | Update session preferences | Yes |
| `OPTIONS` | `/session/settings` | CORS preflight handling | No |

### Utility Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `GET` | `/` | Application status/info | No |
| `GET` | `/favicon.ico` | Serve favicon | No |

## Authentication & Security

### Password Hashing
- **Method**: [bcrypt](https://pypi.org/project/bcrypt/)
- **Algorithm**: bcrypt with salt generation
- **Implementation**: `bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())`
- **Verification**: `bcrypt.checkpw(password.encode('utf-8'), stored_hash)`

### Session Management
- **Storage**: In-memory session store with secure session IDs
- **Client Storage**: Session ID stored in browser localStorage
- **Authorization**: Bearer token authentication via HTTP headers
- **Session Data**: Stores user email and preferences

### Security Features
- **Email Uniqueness**: Server-side validation prevents duplicate accounts
- **User Isolation**: Users can only access their own data
- **CORS Support**: Proper cross-origin resource sharing configuration
- **Authorization Checks**: All protected endpoints validate user sessions
- **Ownership Validation**: Users can only modify their own classes

## Features

### 🔐 Authentication
- **User Registration**: Create new accounts with email validation
- **Secure Login**: bcrypt-hashed password authentication
- **Session Persistence**: Maintain login state across browser sessions
- **Secure Logout**: Complete session cleanup

### 📚 Class Management
- **Personal Schedules**: Each user maintains their own class list
- **CRUD Operations**: Create, read, update, and delete classes
- **Auto-formatting**: Course types automatically converted to uppercase
- **Confirmation Dialogs**: Prevent accidental deletions

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Patriotic Theme**: Red, white, and blue color scheme
- **Modal System**: Clean popup forms for login/registration
- **Real-time Feedback**: Success messages and error handling

### 🛡️ Authorization
- **Protected Routes**: Class management only available to logged-in users
- **User-specific Data**: Complete data isolation between users
- **Form Validation**: Client and server-side input validation

## Setup & Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd f25-authentication-sshb4
   ```

2. **Set up Python virtual environment**
   ```bash
   cd server
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   python3 init_db.py
   ```

5. **Start the Flask server**
   ```bash
   python3 app.py
   ```

6. **Open the client**
   - Open `client/index.html` in your web browser
   - Or serve via a local web server for best results

## Usage

### First Time Setup
1. **Create Account**: Click "Sign Up" and fill in your information
2. **Login**: Use your email and password to log in
3. **Add Classes**: Fill out the course form to add classes to your schedule

### Managing Your Schedule
- **View Classes**: All your classes appear in the schedule section
- **Add New Class**: Use the form at the top of the page
- **Delete Class**: Click the "Delete" button next to any class (with confirmation)
- **Auto-formatting**: Course types (CS, MATH, etc.) automatically capitalize

### Security Notes
- Each user can only see and manage their own classes
- Sessions automatically expire when the browser is closed
- Passwords are securely hashed and never stored in plain text
- Email addresses must be unique across all users

---

**Note**: This application uses vanilla JavaScript, HTML, and CSS without external frameworks, ensuring compatibility and security.
