require("dotenv").config();
require('express-async-errors');
const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors');
const app = express();

const mainRouter = require("./routes/user"); 
const patientRouter = require("./routes/patient"); 
const residentRouter = require("./routes/resident");
const dashboardRouter = require("./routes/dashboard");
const healthProgressRouter = require('./routes/healthProgress');
const activitiesRouter = require('./routes/activities');
const mealRouter = require("./routes/meal");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const authRoute = require("./routes/auth");

const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Updated CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://lifeec-web.onrender.com', 'https://lifeec.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Add root route handler
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'LIFEEC API is running',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/user',
            patients: '/api/v1/patient',
            residents: '/api/v1/resident',
            dashboard: '/api/v1/dashboard',
            healthProgress: '/api/v1/health-progress',
            activities: '/api/v1/activities',
            meal: '/api/v1/meal',
            messages: '/api/v1/messages'
        }
    });
});

// Routes
app.use("/api/v1", mainRouter); 
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/resident", residentRouter);
app.use("/api/v1/health-progress", healthProgressRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("/api/v1/meal", mealRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/auth", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const port = process.env.PORT || 10000;

// Seeder function to add Owner and Admin users
const seedUsers = async () => {
    try {
        // Clear existing users if needed
        await User.deleteMany({});

        // Password hashing
        const salt = await bcrypt.genSalt(10);

        // User data
        const users = [
            {
                name: "Owner User",
                email: "owner@example.com",
                password: await bcrypt.hash("12345", salt),
                userType: "Owner",
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: await bcrypt.hash("12345", salt),
                userType: "Admin",
            },
        ];

        // Insert users into the database
        await User.insertMany(users);
        console.log("Users seeded successfully.");
    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

// Main start function
const start = async () => {
    try {
        console.log('🚀 Starting server...');
        console.log('📦 MongoDB URI exists:', !!process.env.MONGO_URI);
        
        await connectDB(process.env.MONGO_URI);
        
        app.listen(port, () => {
            console.log(`✅ Server is listening on port ${port}`);
            console.log('📝 Available routes:');
            console.log('  - GET / (API documentation)');
            console.log('  - GET /api/v1/auth (Authentication endpoints)');
            console.log('  - GET /api/v1/user (User management)');
            console.log(`💻 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔒 JWT Secret exists: ${!!process.env.JWT_SECRET}`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

start();