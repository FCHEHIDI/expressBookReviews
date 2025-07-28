# 📚 Book Review Application

A comprehensive **Node.js** web application built with **Express.js** that provides a complete book review system with user authentication, JWT session management, and modern asynchronous programming patterns.

## 🎯 **Project Overview**

This application demonstrates advanced backend development concepts including:
- **RESTful API Design** with complete CRUD operations
- **JWT Authentication** with session management
- **Modern Async Patterns** (async/await, Promises, Promise chaining)
- **Comprehensive Error Handling** and input validation
- **Middleware Architecture** for authentication and routing
- **In-memory Database** simulation with detailed documentation

## 🚀 **Features**

### **Public Features (No Authentication Required)**
- ✅ **Browse Books**: View complete catalog of available books
- ✅ **Search by ISBN**: Find specific books using ISBN numbers
- ✅ **Search by Author**: Discover books by your favorite authors
- ✅ **Search by Title**: Locate books by title (partial matching supported)
- ✅ **User Registration**: Create new user accounts
- ✅ **View Reviews**: Read book reviews from other users

### **Authenticated Features (Login Required)**
- 🔐 **User Login**: Secure JWT-based authentication system
- 📝 **Add Reviews**: Write and publish book reviews
- ✏️ **Modify Reviews**: Update your existing reviews
- 🗑️ **Delete Reviews**: Remove your reviews
- 🔒 **Session Management**: Automatic token expiration and renewal

### **Advanced Technical Features**
- 🔄 **Async/Await Patterns**: Modern JavaScript asynchronous programming
- 🔗 **Promise Callbacks**: Traditional Promise handling with .then()/.catch()
- ⛓️ **Promise Chaining**: Sequential async operations with multiple .then() blocks
- 🛡️ **Comprehensive Error Handling**: Robust error management and user feedback
- 📊 **Performance Monitoring**: Request timing and operation logging
- 🧪 **Postman Ready**: Full API testing suite compatibility

## 🏗️ **Architecture**

```
expressBookReviews/
├── final_project/                  # Main application directory
│   ├── index.js                   # Server entry point & authentication middleware
│   ├── package.json               # Dependencies and project configuration
│   └── router/                    # Route handlers and business logic
│       ├── auth_users.js          # Authenticated routes (login, reviews)
│       ├── general.js             # Public routes with async patterns
│       └── booksdb.js            # In-memory book database
├── README.md                      # Project documentation (this file)
└── LabGuide.txt                  # Original lab instructions
```

## 🔧 **Technical Stack**

- **Runtime**: Node.js v22.17.1+
- **Framework**: Express.js v4.18.1
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Session Management**: express-session
- **HTTP Client**: Axios v1.7.9
- **Development**: Nodemon for auto-restart

## 📚 **API Endpoints**

### **Public Endpoints**
| Method | Endpoint | Description | Async Pattern |
|--------|----------|-------------|---------------|
| `GET` | `/` | Get all books | Async/Await |
| `GET` | `/isbn/:isbn` | Get book by ISBN | Promise Callbacks |
| `GET` | `/author/:author` | Get books by author | Async/Await |
| `GET` | `/title/:title` | Get books by title | Promise Chaining |
| `POST` | `/register` | Register new user | Synchronous |
| `GET` | `/review/:isbn` | Get book reviews | Synchronous |

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/customer/login` | User login with JWT |

### **Protected Endpoints** (Authentication Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/customer/auth/review/:isbn` | Add/modify book review |
| `DELETE` | `/customer/auth/review/:isbn` | Delete book review |

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js v22.17.1 or higher
- npm package manager

### **Installation Steps**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd expressBookReviews/final_project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or for development with auto-restart:
   nodemon index.js
   ```

4. **Server will be running at:**
   ```
   http://localhost:5000
   ```

## 🧪 **Testing with Postman**

The application is fully compatible with Postman for API testing:

### **Sample Test Workflow:**
1. **Register a user**: `POST /register`
2. **Login**: `POST /customer/login` (saves JWT token)
3. **Browse books**: `GET /` 
4. **Search books**: `GET /isbn/1`, `GET /author/Chinua Achebe`
5. **Add review**: `PUT /customer/auth/review/1?review=Great book!`
6. **View reviews**: `GET /review/1`
7. **Delete review**: `DELETE /customer/auth/review/1`

### **Authentication Setup:**
- After login, use the JWT token in subsequent requests
- Session automatically manages token validation
- Token expires after 1 hour

## 📖 **Sample Data**

The application includes 10 classic literature books:

- **Things Fall Apart** by Chinua Achebe
- **Fairy tales** by Hans Christian Andersen  
- **The Divine Comedy** by Dante Alighieri
- **The Epic Of Gilgamesh** by Unknown
- **The Book Of Job** by Unknown
- **One Thousand and One Nights** by Unknown
- **Nj\u00e1l's Saga** by Unknown
- **Pride and Prejudice** by Jane Austen
- **Le P\u00e8re Goriot** by Honor\u00e9 de Balzac
- **Molloy, Malone Dies, The Unnamable** by Samuel Beckett

## 🔄 **Async Programming Demonstrations**

This project showcases **4 different asynchronous programming patterns**:

1. **Task 1 - Async/Await**: Clean, readable async code with try/catch error handling
2. **Task 2 - Promise Callbacks**: Traditional .then()/.catch() Promise handling
3. **Task 3 - Advanced Async/Await**: Complex async operations with helper functions
4. **Task 4 - Promise Chaining**: Sequential async operations with multiple .then() blocks

Each pattern includes:
- ✅ Performance timing and monitoring
- ✅ Comprehensive error handling
- ✅ Detailed logging for debugging
- ✅ Response metadata and operation details

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based user sessions
- **Session Management**: Automatic token validation middleware
- **Input Validation**: Comprehensive request data validation
- **Error Handling**: Secure error messages without information leakage
- **Token Expiration**: 1-hour automatic token expiry

## 🚀 **Development Notes**

This application was built as part of a comprehensive backend development course, demonstrating:

- **Modern JavaScript**: ES6+ features, async/await, destructuring
- **Express.js Best Practices**: Middleware usage, routing, error handling
- **Authentication Patterns**: JWT implementation, session management
- **API Design**: RESTful endpoints, proper HTTP status codes
- **Code Documentation**: Comprehensive inline documentation and comments
- **Testing Ready**: Postman-compatible API design

## 📝 **License**

This project is part of an educational exercise and is available for learning purposes.

## 👨‍💻 **Author**

**Fares Chehidi**  
*Full-Stack Developer specializing in Node.js backend development*

---

**🎯 Ready to explore? Start the server and begin testing with Postman!**