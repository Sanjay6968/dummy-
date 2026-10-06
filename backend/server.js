// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database connection
const db = require("./db");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();


// =======================
// MIDDLEWARE
// =======================

// Allows React frontend to communicate with backend
app.use(cors());

// Allows Express to read JSON request bodies
app.use(express.json());


// =======================
// HOME ROUTE
// =======================

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager API is running"
    });
});


// =======================
// API ROUTES
// =======================

// Authentication routes
// POST /api/auth/register
// POST /api/auth/login
app.use("/api/auth", authRoutes);

// Task routes
// GET    /api/tasks
// POST   /api/tasks
// PUT    /api/tasks/:id
// DELETE /api/tasks/:id
app.use("/api/tasks", taskRoutes);


// =======================
// 404 HANDLER
// =======================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// =======================
// ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});


// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});