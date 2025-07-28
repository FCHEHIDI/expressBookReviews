/**
 * Books Database - booksdb.js
 * 
 * This module contains the in-memory database of books available in the bookshop.
 * It serves as the primary data source for all book-related operations in the application.
 * 
 * In a production environment, this would typically be replaced with a proper database
 * system like MongoDB, PostgreSQL, or MySQL. For this demonstration, we use a simple
 * JavaScript object to store book information.
 * 
 * Data Structure:
 * Each book is stored with a numeric key (ISBN) and contains:
 * - author: String - The book's author name
 * - title: String - The book's title
 * - reviews: Object - User reviews (username as key, review text as value)
 * 
 * Features:
 * - Pre-loaded with classic literature samples
 * - Supports dynamic review addition/modification
 * - Easy to query by ISBN (object key)
 * - Extensible structure for future enhancements
 * 
 * @author: Fares Chehidi
 * @version: 1.0.0
 */

/**
 * Books Database Object
 * 
 * This object stores all available books using ISBN as the key.
 * Each book entry contains author, title, and reviews information.
 * 
 * Structure: { [isbn]: { author, title, reviews: {} } }
 */
let books = {
    // Classic Literature Collection
    1: {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart", 
        "reviews": {} // Object to store user reviews: { username: reviewText }
    },
    2: {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales", 
        "reviews": {}
    },
    3: {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy", 
        "reviews": {}
    },
    4: {
        "author": "Unknown",
        "title": "The Epic Of Gilgamesh", 
        "reviews": {}
    },
    5: {
        "author": "Unknown",
        "title": "The Book Of Job", 
        "reviews": {}
    },
    6: {
        "author": "Unknown",
        "title": "One Thousand and One Nights", 
        "reviews": {}
    },
    7: {
        "author": "Unknown",
        "title": "Njál's Saga", 
        "reviews": {}
    },
    8: {
        "author": "Jane Austen",
        "title": "Pride and Prejudice", 
        "reviews": {}
    },
    9: {
        "author": "Honoré de Balzac",
        "title": "Le Père Goriot", 
        "reviews": {}
    },
    10: {
        "author": "Samuel Beckett",
        "title": "Molloy, Malone Dies, The Unnamable, the trilogy", 
        "reviews": {}
    }
};

/**
 * Export the books database for use by other modules
 * 
 * This allows other parts of the application to:
 * - Read book information
 * - Add/modify reviews
 * - Search and filter books
 * - Perform CRUD operations on book data
 */
module.exports = books;
