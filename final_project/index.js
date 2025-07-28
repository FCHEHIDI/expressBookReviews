/**
 * Book Review Application - Main Server File
 * 
 * This is the main entry point for the Book Review Application server.
 * It sets up an Express.js server with JWT-based session authentication,
 * handles both public and authenticated routes, and provides middleware
 * for session management and user authentication.
 * 
 * Features:
 * - Express.js web server
 * - Session-based authentication using express-session
 * - JWT token validation for protected routes
 * - Separation of public and authenticated user routes
 * - JSON request/response handling
 * 
 * @author: Fares Chehidi
 * @version: 1.0.0
 */

const express = require('express');           // Express.js framework for building web applications
const jwt = require('jsonwebtoken');         // Library for creating and verifying JSON Web Tokens
const session = require('express-session')   // Session middleware for Express.js

// Import route handlers for authenticated and general user operations
const customer_routes = require('./router/auth_users.js').authenticated;  // Protected routes requiring authentication
const genl_routes = require('./router/general.js').general;               // Public routes accessible to all users

// Create Express application instance
const app = express();

/**
 * Middleware Configuration
 */

// Enable JSON parsing for incoming requests
// This allows the server to automatically parse JSON data from request bodies
app.use(express.json());

/**
 * Session Configuration for Customer Routes
 * 
 * Sets up session management for all routes under /customer/*
 * Sessions are used to store user authentication state and JWT tokens
 * 
 * Configuration:
 * - secret: Used to sign the session ID cookie (should be more secure in production)
 * - resave: Forces session to be saved even when unmodified
 * - saveUninitialized: Forces uninitialized sessions to be saved
 */
app.use("/customer",session({
    secret:"fingerprint_customer",  // Secret key for signing session cookies
    resave: true,                   // Save session even if not modified
    saveUninitialized: true         // Save new but not modified sessions
}));

/**
 * Authentication middleware for protected routes
 * This middleware validates JWT tokens stored in the session for all routes under /customer/auth/*
 * Only authenticated users with valid JWT tokens can access these protected endpoints
 */
app.use("/customer/auth/*", function auth(req,res,next){
    // Check if the user is authenticated by verifying the JWT token in session
    if(req.session.authorization) {
        // Extract the JWT token from the session authorization
        let token = req.session.authorization['accessToken'];
        
        // Verify the JWT token using the secret key
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Token is valid - attach user info to request object for use in route handlers
                req.user = user;
                next(); // Proceed to the next middleware/route handler
            } else {
                // Token verification failed - send unauthorized response
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        // No authorization token found in session - user is not logged in
        return res.status(403).json({message: "User not logged in"});
    }
});

/**
 * Server Configuration
 */
const PORT = 5000;  // Port number for the server to listen on

/**
 * Route Registration
 * 
 * Register route handlers for different URL patterns:
 * - /customer/* : Routes for authenticated users (login, reviews, etc.)
 * - /* : Public routes accessible to all users (book browsing, registration, etc.)
 */
app.use("/customer", customer_routes);  // Mount authenticated user routes
app.use("/", genl_routes);             // Mount general/public routes

/**
 * Start the Express server
 * 
 * The server will listen on the specified PORT and log a confirmation message
 * when successfully started. This should be the last line in the file.
 */
app.listen(PORT, () => console.log("Server is running on port " + PORT));
