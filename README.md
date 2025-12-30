# Survey/Feedback Application

A full-stack web application that allows users to create surveys, collect responses, and analyze results with interactive charts.

## Features

✅ **User Authentication**

- Register and login with JWT authentication
- Secure password hashing with bcryptjs
- Protected routes for authenticated users

✅ **Survey Management**

- Create surveys with multiple question types
- Support for multiple-choice, short answer, long answer, and rating questions
- Edit and delete surveys
- View all available surveys
- Track active/inactive surveys

✅ **Survey Responses**

- Users can anonymously or authenticated respond to surveys
- Real-time response submission
- Response tracking and management
- View survey statistics

✅ **Analytics & Results**

- Beautiful dashboard showing survey results
- Interactive charts using Chart.js
- Pie charts for multiple-choice questions
- Bar charts for rating questions
- Response count summaries

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React ChartJS 2** - React wrapper for Chart.js
- **Vite** - Build tool

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the Server directory:

```bash
cd Server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the Server directory:

```env
MONGO_URI=mongodb://localhost:27017/survey-app
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

4. Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Client directory:

```bash
cd Client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
survey/
├── Server/
│   ├── src/
│   │   ├── models/          # Database models
│   │   │   ├── User.js
│   │   │   ├── Survey.js
│   │   │   └── Response.js
│   │   ├── controllers/     # Business logic
│   │   │   ├── authController.js
│   │   │   ├── surveyController.js
│   │   │   └── responseController.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── surveys.js
│   │   │   └── responses.js
│   │   └── middleware/      # Custom middleware
│   │       └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── Client/
    ├── src/
    │   ├── components/      # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── styles.css
    │   ├── pages/           # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreateSurvey.jsx
    │   │   ├── SurveyList.jsx
    │   │   ├── TakeSurvey.jsx
    │   │   ├── MySurveys.jsx
    │   │   ├── SurveyResults.jsx
    │   │   └── styles.css
    │   ├── context/         # React context
    │   │   └── AuthContext.jsx
    │   ├── services/        # API services
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Surveys

- `GET /api/surveys` - Get all active surveys
- `POST /api/surveys` - Create a new survey (protected)
- `GET /api/surveys/:id` - Get survey by ID
- `GET /api/surveys/user/my-surveys` - Get user's surveys (protected)
- `PUT /api/surveys/:id` - Update survey (protected)
- `DELETE /api/surveys/:id` - Delete survey (protected)

### Responses

- `POST /api/responses/submit` - Submit survey response (protected)
- `GET /api/responses/survey/:surveyId` - Get survey responses (protected)
- `GET /api/responses/survey/:surveyId/stats` - Get survey statistics
- `GET /api/responses/user/my-responses` - Get user's responses (protected)

## Usage

### Creating a Survey

1. Log in to your account
2. Click "Create Survey" in the navigation
3. Add survey title and description
4. Add questions with different types:
   - Multiple Choice
   - Short Answer
   - Long Answer
   - Rating (1-5)
5. For multiple-choice, add options
6. Click "Create Survey"

### Taking a Survey

1. Click "Take Survey" on the home page
2. Browse available surveys
3. Click "Take Survey" on any survey
4. Fill out all questions
5. Click "Submit Survey"

### Viewing Results

1. Go to "My Surveys"
2. Click the 📊 icon to view results
3. See charts and statistics for each question
4. View total response count

## Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server generates a JWT token
3. Token is stored in localStorage
4. Token is sent with every authenticated request in the Authorization header
5. Backend validates the token before processing protected routes

## Features Breakdown

### Multiple Choice Questions

- Display as pie/doughnut charts
- Show percentage distribution of answers
- Interactive tooltips

### Rating Questions

- Display as bar charts
- Show count of responses for each rating
- Easy comparison of ratings

### Text Questions

- Short answer and long answer questions tracked
- Statistics show response count
- Detailed responses viewable in admin panel

## Environment Variables

### Server (.env)

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Client

- API base URL is configured in `src/services/api.js`
- Default: `http://localhost:5000/api`

## Security Considerations

1. **Password Hashing** - Passwords are hashed using bcryptjs
2. **JWT Authentication** - Secure token-based authentication
3. **Protected Routes** - Frontend routes protected with ProtectedRoute component
4. **API Authorization** - Backend validates JWT tokens
5. **CORS** - Configured to allow frontend-backend communication
6. **Environment Variables** - Sensitive data stored in .env files

## Future Enhancements

- Real-time updates with Socket.io
- Advanced analytics dashboard
- Survey templates
- Survey sharing and collaboration
- Email notifications
- Survey branching/conditional questions
- Response export (CSV/PDF)
- User roles and permissions
- Survey scheduling and expiration
- A/B testing surveys

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGO_URI` in .env file
- Verify connection string format

### JWT Token Issues

- Clear localStorage and login again
- Check `JWT_SECRET` in .env matches
- Verify token is sent in Authorization header

### CORS Errors

- Ensure backend is running on port 5000
- Check frontend is running on port 3000
- Verify proxy configuration in vite.config.js

## Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd Server
npm run dev

# Terminal 2 - Frontend
cd Client
npm run dev
```

### Building for Production

```bash
# Backend
npm run build

# Frontend
npm run build
```

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, email support@surveyapp.com or open an issue on GitHub.
