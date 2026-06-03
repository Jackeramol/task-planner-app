# Task Planner

A full-stack task management application built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## Project Structure

```
task-planner/
├── server/              # Backend API
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   ├── server.js       # Express server
│   ├── .env            # Environment variables
│   └── package.json
└── client/             # React frontend
    ├── src/
    │   ├── App.jsx         # Main app component
    │   ├── Login.jsx       # Login form
    │   ├── Register.jsx    # Registration form
    │   ├── TaskForm.jsx    # Task creation form
    │   ├── TaskList.jsx    # Task display
    │   ├── api.js          # API service
    │   └── index.css       # Tailwind CSS
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Features

- **User Authentication**: Register and login with JWT tokens
- **Task CRUD**: Create, read, update, and delete tasks
- **Task Management**: Organize tasks by status, category, and due date
- **Responsive UI**: Built with Tailwind CSS

## Installation

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd task-planner/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/task-planner
   JWT_SECRET=your_jwt_secret_here
   PORT=5001
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5001`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd task-planner/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Login and get JWT token

### Tasks (Protected - requires JWT)
- `GET /api/tasks` - Fetch user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Usage

1. Open `http://localhost:3000` in your browser
2. Sign up for a new account or login
3. Create, edit, and manage your tasks
4. Tasks are automatically saved to the database

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Database**: MongoDB
- **Authentication**: JWT with Bcrypt

## Learning Outcomes

- REST API design and implementation
- Authentication with JWT tokens
- Database design with MongoDB/Mongoose
- React hooks and state management
- Tailwind CSS for styling
- Full-stack development workflow

## Next Steps for Enhancement

- Add task search and filters
- Implement task priority levels
- Add user profile management
- Add task reminders/notifications
- Deploy to production
- Add unit and integration tests

## License

MIT
