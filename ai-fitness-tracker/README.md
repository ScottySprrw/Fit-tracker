# AI Fitness Tracker

A modern web application for personal trainers to manage and monitor client progress with AI-powered exercise tracking.

## Features

- **User Profile Management**: Track client information, goals, and key performance indicators
- **Client Dashboard**: Overview of client progress with completed and upcoming workouts
- **Workout Detail Pages**: Track weights, sets, and reps with exercise history
- **Progress Metrics**: Visualize progress with interactive charts and performance analytics
- **AI-Ready Architecture**: Built to integrate with AI systems for personalized training programs

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Zustand for state management
- React Router for navigation
- Recharts for data visualization

### Backend
- Node.js with Express
- JSON file storage (easily replaceable with database)
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

## API Endpoints

### Profile
- `GET /api/profile` - Get client profile
- `POST /api/profile` - Create/update client profile

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout

### Progress
- `GET /api/progress` - Get all progress data
- `POST /api/progress` - Add progress entry
- `GET /api/progress/:exercise` - Get progress for specific exercise

## Project Structure

```
ai-fitness-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── WorkoutDetailPage.jsx
│   │   │   └── MetricsPage.jsx
│   │   ├── store/
│   │   │   └── useStore.js   # Zustand store
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── data/                 # JSON storage files
│   ├── server.js
│   └── package.json
└── README.md
```

## Usage

1. **Create Profile**: Start by setting up a client profile with personal information, goals, and KPIs
2. **Track Workouts**: Use the workout detail pages to log exercises with weights, sets, and reps
3. **Monitor Progress**: View progress charts and analytics on the metrics page
4. **Dashboard Overview**: Get a quick overview of client status and upcoming workouts

## Development

The application is designed with a clean separation between frontend and backend, making it easy to:
- Replace JSON storage with a database (PostgreSQL, MongoDB, etc.)
- Add authentication and multi-user support
- Integrate with AI services for workout generation
- Add more advanced analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.