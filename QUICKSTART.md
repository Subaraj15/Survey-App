# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

## Step 1: MongoDB Setup

### Option A: Local MongoDB

1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/survey-app`

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Use in `.env` as `MONGO_URI`

## Step 2: Backend Setup

```bash
# Navigate to Server folder
cd Server

# Install dependencies
npm install

# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/survey-app
# JWT_SECRET=your_secure_secret_key
# PORT=5000
# NODE_ENV=development

# Start backend
npm run dev
```

Backend will be available at: **http://localhost:5000**

## Step 3: Frontend Setup

```bash
# In a new terminal, navigate to Client folder
cd Client

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## Step 4: Test the Application

1. Open browser and go to `http://localhost:3000`
2. Register a new account
3. Log in
4. Create your first survey
5. View and take surveys
6. Check results dashboard

## Key Endpoints

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Common Issues

### "Cannot find module" Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Refused

- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check firewall settings

### Port Already in Use

- Backend (5000): `lsof -i :5000` then `kill -9 <PID>`
- Frontend (3000): `lsof -i :3000` then `kill -9 <PID>`

### CORS Errors

- Ensure both backend and frontend are running
- Check proxy settings in `Client/vite.config.js`

## Useful Commands

### Backend

```bash
npm run dev    # Run in development mode
npm start      # Run in production mode
npm test       # Run tests (if available)
```

### Frontend

```bash
npm run dev      # Run in development mode
npm run build    # Build for production
npm run preview  # Preview production build
```

## Next Steps

1. **Customize** the UI by modifying CSS files
2. **Add more question types** in the backend models
3. **Implement** real-time updates with Socket.io
4. **Deploy** to Heroku, Netlify, or your hosting platform
5. **Add** more analytics and advanced features

## Documentation

See [README.md](./README.md) for comprehensive documentation including:

- Complete API documentation
- Project structure overview
- Feature details
- Security considerations
- Future enhancements

## Need Help?

1. Check the README.md for detailed documentation
2. Review the code comments
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify database connectivity

Happy surveying! 📊
