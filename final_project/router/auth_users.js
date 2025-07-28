/**
 * Authenticated User Routes - auth_users.js
 * 
 * This module handles all routes that require user authentication.
 * It includes functionality for user login, book reviews management,
 * and user validation functions.
 * 
 * Features:
 * - User authentication and login
 * - JWT token generation for session management
 * - Book review creation, modification, and deletion
 * - User validation utilities
 * 
 * @author: Fares Chehidi
 * @version: 1.0.0
 */

const express = require('express');     // Express.js framework
const jwt = require('jsonwebtoken');   // JSON Web Token library for authentication
let books = require("./booksdb.js");   // Import books database

const regd_users = express.Router();   // Create router instance for registered users

/**
 * In-memory user storage
 * In a production environment, this should be replaced with a proper database
 * Structure: Array of user objects with username and password
 */
let users = [];

/**
 * Validates if a username exists in the system
 * 
 * @param {string} username - The username to validate
 * @returns {boolean} - Returns true if username exists, false otherwise
 * 
 * This function checks if the provided username already exists in the users array.
 * It's used during registration to prevent duplicate usernames and during login
 * to verify user existence.
 */
const isValid = (username) => {
    // Filter the users array to find any user with the matching username
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    
    // If array length is greater than 0, username exists
    if (userswithsamename.length > 0) {
        return true;  // Username exists
    } else {
        return false; // Username does not exist
    }
}

/**
 * Authenticates a user by validating username and password
 * 
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to validate
 * @returns {boolean} - Returns true if credentials are valid, false otherwise
 * 
 * This function checks if the provided username and password combination
 * matches an existing user in the system. It's used during the login process.
 */
const authenticatedUser = (username, password) => {
    // Filter users array to find user with matching username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    
    // If valid user found, return true
    if (validusers.length > 0) {
        return true;  // Valid credentials
    } else {
        return false; // Invalid credentials
    }
}

/**
 * User Login Endpoint
 * 
 * POST /customer/login
 * 
 * This endpoint authenticates a user and creates a JWT session token.
 * Only registered users with valid credentials can successfully log in.
 * Upon successful authentication, a JWT token is created and stored in the session.
 * 
 * Request Body:
 * - username: String (required) - The user's username
 * - password: String (required) - The user's password
 * 
 * Response:
 * - 200: Login successful with JWT token
 * - 208: User already logged in
 * - 404: Invalid username or password
 * - 400: Missing username or password
 */
regd_users.post("/login", (req,res) => {
    const username = req.body.username;  // Extract username from request body
    const password = req.body.password;  // Extract password from request body

    // Validate that both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if user credentials are valid
    if (authenticatedUser(username, password)) {
        // Generate JWT access token for the authenticated user
        // The token contains the username and is signed with a secret key
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 }); // Token expires in 1 hour

        // Store the access token in the session
        // This allows the authentication middleware to validate future requests
        req.session.authorization = {
            accessToken, 
            username
        }
        
        // Send success response with login confirmation
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        // Invalid credentials provided
        return res.status(404).json({message: "Invalid Login. Check username and password"});
    }
});

/**
 * Add or Modify Book Review Endpoint
 * 
 * PUT /customer/auth/review/:isbn
 * 
 * This protected endpoint allows authenticated users to add or modify book reviews.
 * The route requires authentication (handled by the auth middleware in index.js).
 * If a user has already reviewed a book, their review will be updated.
 * If they haven't reviewed it before, a new review will be added.
 * 
 * URL Parameters:
 * - isbn: String (required) - The ISBN of the book to review
 * 
 * Query Parameters:
 * - review: String (required) - The review text content
 * 
 * Response:
 * - 200: Review added/modified successfully
 * - 400: Missing review content or invalid ISBN
 * - 403: User not authenticated (handled by middleware)
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;        // Extract ISBN from URL parameters
    const review = req.query.review;     // Extract review content from query parameters
    const username = req.session.authorization.username; // Get username from session

    // Validate that review content is provided
    if (!review) {
        return res.status(400).json({message: "Review content is required"});
    }

    // Check if the book exists in the database
    if (books[isbn]) {
        // Initialize reviews object if it doesn't exist for this book
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Add or update the review for this user
        // Each user can have only one review per book (identified by username)
        books[isbn].reviews[username] = review;

        // Send success response with confirmation message
        return res.status(200).json({
            message: `Review for book with ISBN ${isbn} has been added/modified successfully`,
            review: review,
            user: username
        });
    } else {
        // Book with the provided ISBN does not exist
        return res.status(400).json({message: "Book not found"});
    }
});

/**
 * Delete Book Review Endpoint
 * 
 * DELETE /customer/auth/review/:isbn
 * 
 * This protected endpoint allows authenticated users to delete their own book reviews.
 * Users can only delete reviews they have written, not reviews by other users.
 * The route requires authentication (handled by the auth middleware in index.js).
 * 
 * URL Parameters:
 * - isbn: String (required) - The ISBN of the book whose review should be deleted
 * 
 * Response:
 * - 200: Review deleted successfully
 * - 404: Review not found or book not found
 * - 403: User not authenticated (handled by middleware)
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;        // Extract ISBN from URL parameters
    const username = req.session.authorization.username; // Get username from session

    // Check if the book exists in the database
    if (books[isbn]) {
        // Check if reviews exist for this book
        if (books[isbn].reviews && books[isbn].reviews[username]) {
            // Delete the user's review for this book
            delete books[isbn].reviews[username];

            // Send success response with confirmation
            return res.status(200).json({
                message: `Review for book with ISBN ${isbn} has been deleted successfully`,
                user: username
            });
        } else {
            // User hasn't reviewed this book
            return res.status(404).json({message: "Review not found for this user"});
        }
    } else {
        // Book with the provided ISBN does not exist
        return res.status(404).json({message: "Book not found"});
    }
});

/**
 * Module Exports
 * 
 * Export the necessary components for use in other modules:
 * - authenticated: The router instance with all authenticated routes
 * - isValid: Utility function to check username validity
 * - users: Array containing registered users
 * 
 * These exports are imported by:
 * - index.js: Uses the authenticated router and mounts it on /customer
 * - general.js: Uses isValid and users for registration functionality
 */
module.exports.authenticated = regd_users;  // Export the authenticated routes router
module.exports.isValid = isValid;          // Export username validation function
module.exports.users = users;              // Export users array for registration access
