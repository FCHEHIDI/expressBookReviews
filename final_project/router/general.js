/**
 * General User Routes - general.js
 * 
 * This module handles all public routes that don't require authentication.
 * It includes functionality for user registration, book browsing, and
 * searching for books by various criteria.
 * 
 * UPDATED: Now includes async/await and Promise implementations for Tasks 1-4
 * to demonstrate modern JavaScript asynchronous programming patterns.
 * 
 * Features:
 * - User registration for new accounts
 * - Browse all available books (with async/await)
 * - Search books by ISBN, author, or title (with Promises)
 * - View book reviews
 * - Public access to book information
 * - Async/await and Promise callback implementations
 * 
 * @author: Fares Chehidi
 * @version: 2.0.0 (Updated with async patterns)
 */

const express = require('express');                    // Express.js framework
const axios = require('axios');                       // Axios HTTP client for async operations
let books = require("./booksdb.js");                  // Import books database
let isValid = require("./auth_users.js").isValid;    // Import username validation function
let users = require("./auth_users.js").users;        // Import users array

const public_users = express.Router();                // Create router instance for public routes


/**
 * User Registration Endpoint
 * 
 * POST /register
 * 
 * This endpoint allows new users to create an account in the system.
 * It validates the provided username and password, checks for duplicates,
 * and adds the new user to the users array.
 * 
 * Request Body:
 * - username: String (required) - Desired username (must be unique)
 * - password: String (required) - User's password
 * 
 * Response:
 * - 200: User registered successfully
 * - 400: Missing username/password or validation error
 * - 409: Username already exists
 */
public_users.post("/register", (req,res) => {
    const username = req.body.username;  // Extract username from request body
    const password = req.body.password;  // Extract password from request body

    // Validate that both username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if the username already exists in the system
    if (isValid(username)) {
        // Username is already taken
        return res.status(409).json({message: "Username already exists. Please choose a different username."});
    } else {
        // Username is available - create new user account
        users.push({
            "username": username,
            "password": password
        });
        
        // Send success response with registration confirmation
        return res.status(200).json({message: "User registered successfully. You can now login."});
    }
});

/**
 * TASK 1 - Get All Books Endpoint (Updated with Async/Await)
 * 
 * GET /
 * 
 * This endpoint returns a list of all books available in the shop using async/await pattern.
 * UPDATED: Now demonstrates async/await with simulated asynchronous operations
 * and better error handling for modern JavaScript development.
 * 
 * Benefits of Async/Await Implementation:
 * - Non-blocking operations
 * - Clean, readable syntax
 * - Better error handling with try-catch
 * - Simulates real-world database queries
 * 
 * Response:
 * - 200: Returns complete books catalog with all details
 * - 500: Server error (if any issues with book database)
 */
public_users.get('/', async function (req, res) {
    try {
        // Log the start of the async operation
        console.log('🔄 Task 1: Starting async operation - Get All Books');
        const startTime = Date.now();

        // Simulate asynchronous database operation using Promise with setTimeout
        // This demonstrates how async/await handles asynchronous operations
        const getBooksAsync = () => {
            return new Promise((resolve, reject) => {
                // Simulate network delay (real database would have similar latency)
                setTimeout(() => {
                    try {
                        // Simulate potential database connection issues (rare)
                        if (Math.random() > 0.95) {
                            reject(new Error('Simulated database connection error'));
                            return;
                        }
                        
                        // Return the books data after "async" operation
                        resolve(books);
                    } catch (error) {
                        reject(error);
                    }
                }, 10); // 10ms delay to simulate async operation
            });
        };

        // Use await to wait for the asynchronous operation to complete
        const booksData = await getBooksAsync();
        
        // Calculate operation duration for performance monitoring
        const duration = Date.now() - startTime;
        
        // Log successful completion
        console.log(`✅ Task 1: Successfully retrieved ${Object.keys(booksData).length} books`);
        console.log(`⏱️ Task 1: Operation completed in ${duration}ms`);

        // Return the complete books database in a formatted JSON response
        return res.status(200).json({
            message: "Books retrieved successfully using Async/Await",
            method: "async-await",
            totalBooks: Object.keys(booksData).length,
            operationDuration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            books: JSON.parse(JSON.stringify(booksData, null, 2))
        });

    } catch (error) {
        // Handle any errors that occurred during the async operation
        console.error('❌ Task 1: Error in async books operation:', error.message);
        
        // Return appropriate error response
        return res.status(500).json({
            message: "Error retrieving books using Async/Await",
            method: "async-await",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * TASK 2 - Get Book Details by ISBN Endpoint (Updated with Promise Callbacks)
 * 
 * GET /isbn/:isbn
 * 
 * This endpoint returns detailed information about a specific book using Promise callbacks.
 * UPDATED: Now demonstrates Promise-based approach with .then() and .catch() callbacks
 * for handling asynchronous operations in a different pattern from async/await.
 * 
 * Benefits of Promise Callbacks Implementation:
 * - Explicit Promise handling
 * - Chain multiple operations easily
 * - Clear separation of success and error handling
 * - Demonstrates different async patterns
 * 
 * URL Parameters:
 * - isbn: String (required) - The ISBN of the book to retrieve
 * 
 * Response:
 * - 200: Returns book details for the specified ISBN
 * - 404: Book not found with the provided ISBN
 * - 500: Server error during Promise operation
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Extract ISBN from URL parameters
    
    // Log the start of the Promise operation
    console.log(`🔄 Task 2: Starting Promise operation - Get Book by ISBN ${isbn}`);
    const startTime = Date.now();

    // Create a Promise-based function to simulate async book retrieval
    const getBookByIsbnPromise = (bookIsbn) => {
        return new Promise((resolve, reject) => {
            // Simulate asynchronous database lookup with setTimeout
            setTimeout(() => {
                try {
                    // Simulate potential network issues (rare)
                    if (Math.random() > 0.98) {
                        reject(new Error('Simulated network timeout'));
                        return;
                    }

                    // Check if book exists in the database
                    if (books[bookIsbn]) {
                        // Book found - resolve with book data
                        resolve({
                            found: true,
                            book: books[bookIsbn],
                            isbn: bookIsbn
                        });
                    } else {
                        // Book not found - resolve with not found status
                        resolve({
                            found: false,
                            isbn: bookIsbn
                        });
                    }
                } catch (error) {
                    // Reject the Promise if any error occurs
                    reject(error);
                }
            }, 15); // 15ms delay to simulate async database query
        });
    };

    // Use Promise callbacks with .then() and .catch()
    getBookByIsbnPromise(isbn)
        .then(result => {
            // Success callback - executed when Promise resolves
            const duration = Date.now() - startTime;
            
            if (result.found) {
                // Book was found - return success response
                console.log(`✅ Task 2: Successfully retrieved book with ISBN ${isbn}`);
                console.log(`📖 Task 2: Book title: "${result.book.title}"`);
                console.log(`⏱️ Task 2: Operation completed in ${duration}ms`);
                
                res.status(200).json({
                    message: `Book with ISBN ${isbn} retrieved successfully using Promise Callbacks`,
                    method: "promise-callbacks",
                    isbn: isbn,
                    operationDuration: `${duration}ms`,
                    timestamp: new Date().toISOString(),
                    book: result.book
                });
            } else {
                // Book was not found - return 404 response
                console.log(`❌ Task 2: Book with ISBN ${isbn} not found`);
                console.log(`⏱️ Task 2: Search completed in ${duration}ms`);
                
                res.status(404).json({
                    message: `Book with ISBN ${isbn} not found using Promise Callbacks`,
                    method: "promise-callbacks",
                    isbn: isbn,
                    operationDuration: `${duration}ms`,
                    timestamp: new Date().toISOString()
                });
            }
        })
        .catch(error => {
            // Error callback - executed when Promise rejects
            const duration = Date.now() - startTime;
            
            console.error(`❌ Task 2: Error in Promise ISBN operation for ${isbn}:`, error.message);
            console.error(`⏱️ Task 2: Operation failed after ${duration}ms`);
            
            // Send error response
            res.status(500).json({
                message: `Error retrieving book with ISBN ${isbn} using Promise Callbacks`,
                method: "promise-callbacks",
                isbn: isbn,
                operationDuration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                error: error.message
            });
        });
});
  
/**
 * TASK 3 - Get Books by Author Endpoint (Updated with Async/Await)
 * 
 * GET /author/:author
 * 
 * This endpoint returns all books by a specific author using async/await pattern.
 * UPDATED: Now demonstrates modern async/await with enhanced error handling and
 * performance monitoring for complex search operations.
 * 
 * Benefits of Async/Await Implementation:
 * - Clean, readable code that looks synchronous
 * - Easy error handling with try/catch blocks
 * - Excellent debugging experience
 * - Natural control flow for multiple async operations
 * 
 * URL Parameters:
 * - author: String (required) - The author name to search for
 * 
 * Response:
 * - 200: Returns array of books by the specified author
 * - 404: No books found for the specified author
 * - 500: Server error during async operation
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;  // Extract author from URL parameters
    
    // Log the start of the async operation
    console.log(`🔄 Task 3: Starting async/await operation - Get Books by Author "${author}"`);
    const startTime = Date.now();

    try {
        // Simulate async database search operation
        const searchResult = await performAuthorSearch(author);
        
        const duration = Date.now() - startTime;
        
        if (searchResult.books.length > 0) {
            // Books found for the author
            console.log(`✅ Task 3: Found ${searchResult.books.length} book(s) by author "${author}"`);
            console.log(`📚 Task 3: Books found: ${searchResult.books.map(b => `"${b.title}"`).join(', ')}`);
            console.log(`⏱️ Task 3: Search completed in ${duration}ms`);
            
            res.status(200).json({
                message: `Books by author "${author}" retrieved successfully using Async/Await`,
                method: "async-await",
                author: author,
                booksFound: searchResult.books.length,
                operationDuration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                books: searchResult.books
            });
        } else {
            // No books found for the author
            console.log(`❌ Task 3: No books found by author "${author}"`);
            console.log(`⏱️ Task 3: Search completed in ${duration}ms`);
            
            res.status(404).json({
                message: `No books found by author "${author}" using Async/Await`,
                method: "async-await",
                author: author,
                booksFound: 0,
                operationDuration: `${duration}ms`,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        // Handle any errors that occur during the async operation
        const duration = Date.now() - startTime;
        
        console.error(`❌ Task 3: Error in async author search for "${author}":`, error.message);
        console.error(`⏱️ Task 3: Operation failed after ${duration}ms`);
        
        res.status(500).json({
            message: `Error searching for books by author "${author}" using Async/Await`,
            method: "async-await",
            author: author,
            operationDuration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

/**
 * Helper Function: Perform Author Search (Async)
 * 
 * This function simulates an asynchronous database search for books by author.
 * It includes multiple async operations and comprehensive error handling.
 */
async function performAuthorSearch(authorName) {
    return new Promise((resolve, reject) => {
        // Simulate async database operation with setTimeout
        setTimeout(async () => {
            try {
                // Simulate potential network/database issues
                if (Math.random() > 0.97) {
                    reject(new Error('Simulated database connection timeout'));
                    return;
                }

                // Convert author name to lowercase for case-insensitive search
                const searchAuthor = authorName.toLowerCase();
                const matchingBooks = [];

                // Search through all books in the database
                for (const isbn in books) {
                    const book = books[isbn];
                    
                    // Simulate async validation for each book
                    await new Promise(resolve => setTimeout(resolve, 2)); // 2ms per book check
                    
                    // Check if author matches (case-insensitive)
                    if (book.author.toLowerCase().includes(searchAuthor)) {
                        matchingBooks.push({
                            isbn: isbn,
                            title: book.title,
                            author: book.author,
                            reviews: book.reviews
                        });
                    }
                }

                // Additional async operation - sort results
                await new Promise(resolve => setTimeout(resolve, 5)); // 5ms sorting delay
                
                // Sort books by title for consistent results
                matchingBooks.sort((a, b) => a.title.localeCompare(b.title));

                resolve({
                    books: matchingBooks,
                    searchTerm: authorName,
                    totalChecked: Object.keys(books).length
                });
            } catch (error) {
                reject(error);
            }
        }, 20); // 20ms initial delay to simulate database query
    });
}

/**
 * TASK 4 - Get Books by Title Endpoint (Updated with Promise Chaining)
 * 
 * GET /title/:title
 * 
 * This endpoint returns all books with a specific title using Promise chaining pattern.
 * UPDATED: Now demonstrates Promise chaining with .then().then().catch() pattern
 * for handling multiple sequential asynchronous operations.
 * 
 * Benefits of Promise Chaining Implementation:
 * - Sequential operation handling
 * - Clear separation of async steps
 * - Flexible error handling at any step
 * - Demonstrates different Promise patterns from callbacks
 * 
 * URL Parameters:
 * - title: String (required) - The title of the book(s) to search for
 * 
 * Response:
 * - 200: Returns array of books with the specified title
 * - 404: No books found with the specified title
 * - 500: Server error during Promise chain operation
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;  // Extract title from URL parameters
    
    // Log the start of the Promise chain operation
    console.log(`🔄 Task 4: Starting Promise chain operation - Get Books by Title "${title}"`);
    const startTime = Date.now();

    // Create the initial Promise for title search
    const initiateSearch = (searchTitle) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate potential search initialization issues
                    if (Math.random() > 0.98) {
                        reject(new Error('Search initialization failed'));
                        return;
                    }

                    console.log(`🔍 Task 4: Search initialized for title "${searchTitle}"`);
                    resolve({
                        searchTerm: searchTitle,
                        searchId: Math.random().toString(36).substr(2, 9),
                        startTime: Date.now()
                    });
                } catch (error) {
                    reject(error);
                }
            }, 8); // 8ms initialization delay
        });
    };

    // Create Promise for performing the actual search
    const performTitleSearch = (searchContext) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate potential database connection issues
                    if (Math.random() > 0.97) {
                        reject(new Error('Database connection timeout during search'));
                        return;
                    }

                    const matchingBooks = [];
                    const searchTitle = searchContext.searchTerm.toLowerCase();

                    // Search through all books for title matches
                    for (const isbn in books) {
                        const book = books[isbn];
                        
                        // Case-insensitive title search
                        if (book.title.toLowerCase().includes(searchTitle)) {
                            matchingBooks.push({
                                isbn: isbn,
                                title: book.title,
                                author: book.author,
                                reviews: book.reviews
                            });
                        }
                    }

                    console.log(`🔍 Task 4: Search completed, found ${matchingBooks.books} matches`);
                    
                    resolve({
                        ...searchContext,
                        books: matchingBooks,
                        searchCompleted: Date.now()
                    });
                } catch (error) {
                    reject(error);
                }
            }, 12); // 12ms search delay
        });
    };

    // Create Promise for post-processing results
    const processResults = (searchResult) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate potential processing issues
                    if (Math.random() > 0.99) {
                        reject(new Error('Result processing failed'));
                        return;
                    }

                    // Sort results by author name for consistent ordering
                    const sortedBooks = searchResult.books.sort((a, b) => a.author.localeCompare(b.author));
                    
                    console.log(`✨ Task 4: Results processed and sorted`);
                    
                    resolve({
                        ...searchResult,
                        books: sortedBooks,
                        processingCompleted: Date.now(),
                        totalProcessingTime: Date.now() - searchResult.startTime
                    });
                } catch (error) {
                    reject(error);
                }
            }, 5); // 5ms processing delay
        });
    };

    // Execute Promise chain with .then().then().catch()
    initiateSearch(title)
        .then(searchContext => {
            // First .then() - perform the search
            console.log(`⚡ Task 4: Search context created with ID ${searchContext.searchId}`);
            return performTitleSearch(searchContext);
        })
        .then(searchResult => {
            // Second .then() - process the results
            console.log(`⚡ Task 4: Search found ${searchResult.books.length} books, now processing...`);
            return processResults(searchResult);
        })
        .then(finalResult => {
            // Final .then() - send response
            const duration = Date.now() - startTime;
            
            if (finalResult.books.length > 0) {
                // Books found with the title
                console.log(`✅ Task 4: Found ${finalResult.books.length} book(s) with title "${title}"`);
                console.log(`📚 Task 4: Books found: ${finalResult.books.map(b => `"${b.title}" by ${b.author}`).join(', ')}`);
                console.log(`⏱️ Task 4: Promise chain completed in ${duration}ms`);
                
                res.status(200).json({
                    message: `Books with title "${title}" retrieved successfully using Promise Chaining`,
                    method: "promise-chaining",
                    title: title,
                    booksFound: finalResult.books.length,
                    operationDuration: `${duration}ms`,
                    processingTime: `${finalResult.totalProcessingTime}ms`,
                    timestamp: new Date().toISOString(),
                    books: finalResult.books
                });
            } else {
                // No books found with the title
                console.log(`❌ Task 4: No books found with title "${title}"`);
                console.log(`⏱️ Task 4: Promise chain completed in ${duration}ms`);
                
                res.status(404).json({
                    message: `No books found with title "${title}" using Promise Chaining`,
                    method: "promise-chaining",
                    title: title,
                    booksFound: 0,
                    operationDuration: `${duration}ms`,
                    processingTime: `${finalResult.totalProcessingTime}ms`,
                    timestamp: new Date().toISOString()
                });
            }
        })
        .catch(error => {
            // .catch() - handle any errors from the Promise chain
            const duration = Date.now() - startTime;
            
            console.error(`❌ Task 4: Error in Promise chain for title "${title}":`, error.message);
            console.error(`⏱️ Task 4: Operation failed after ${duration}ms`);
            
            res.status(500).json({
                message: `Error searching for books with title "${title}" using Promise Chaining`,
                method: "promise-chaining",
                title: title,
                operationDuration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                error: error.message
            });
        });
});

/**
 * Get Book Reviews Endpoint
 * 
 * GET /review/:isbn
 * 
 * This endpoint returns all reviews for a specific book identified by its ISBN.
 * Reviews are stored as an object where keys are usernames and values are review texts.
 * 
 * URL Parameters:
 * - isbn: String (required) - The ISBN of the book whose reviews to retrieve
 * 
 * Response:
 * - 200: Returns all reviews for the specified book
 * - 404: Book not found or no reviews available
 */
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;  // Extract ISBN from URL parameters

    // Check if book exists in the database
    if (books[isbn]) {
        // Check if the book has any reviews
        if (books[isbn].reviews && Object.keys(books[isbn].reviews).length > 0) {
            // Reviews exist - return them
            return res.status(200).json({
                message: `Reviews for book with ISBN ${isbn} retrieved successfully`,
                bookTitle: books[isbn].title,
                reviews: books[isbn].reviews,
                reviewCount: Object.keys(books[isbn].reviews).length
            });
        } else {
            // Book exists but has no reviews
            return res.status(200).json({
                message: `No reviews found for book with ISBN ${isbn}`,
                bookTitle: books[isbn].title,
                reviews: {},
                reviewCount: 0
            });
        }
    } else {
        // Book not found
        return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
});

/**
 * Module Exports
 * 
 * Export the public_users router containing all general/public routes.
 * This router is imported by index.js and mounted on the root path "/".
 * 
 * Available routes:
 * - POST /register: User registration
 * - GET /: Get all books
 * - GET /isbn/:isbn: Get book by ISBN
 * - GET /author/:author: Get books by author
 * - GET /title/:title: Get books by title
 * - GET /review/:isbn: Get book reviews
 */
module.exports.general = public_users;
