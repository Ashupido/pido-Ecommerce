# Pido E-Commerce Platform - Developer Guide

A full-stack e-commerce application built with Node.js, Express, MongoDB, and React. This guide explains how everything works for junior developers.

## 📋 Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [How It Works](#how-it-works)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Authentication Flow](#authentication-flow)
8. [File Explanations](#file-explanations)

---

## 🛠️ Tech Stack

**Backend:**
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB database library
- **bcryptjs** - Password hashing
- **JWT (jsonwebtoken)** - Authentication tokens
- **CORS** - Cross-origin requests

**Frontend:**
- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

---

## 📁 Project Structure

```
pido-ecommerce/
├── backend/
│   ├── models/              # Database schemas
│   │   ├── User.js         # User data structure
│   │   ├── Product.js      # Product data structure
│   │   ├── Cart.js         # Shopping cart
│   │   └── Order.js        # Orders
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js   # Login/Register
│   │   ├── productRoutes.js # Product operations
│   │   ├── cartRoutes.js   # Cart operations
│   │   └── orderRoutes.js  # Order operations
│   ├── middleware/         # Helper functions
│   │   └── auth.js         # JWT verification
│   ├── .env                # Environment variables
│   └── server.js           # Main server file
│
└── frontend/
    └── src/
        ├── components/     # Reusable components
        │   └── Navbar.jsx
        ├── pages/         # Page components
        │   └── Products.jsx
        ├── services/      # API calls
        │   └── api.js
        ├── App.jsx        # Main app component
        └── main.jsx       # Entry point
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file with:**
```
MONGODB_URI=mongodb://localhost:27017/pido_ecommerce
JWT_SECRET=your-secret-key-123
NODE_ENV=development
```

4. **Start MongoDB** (if running locally):
```bash
mongod
```

5. **Start the server:**
```bash
node server.js
```
✅ You should see: `Server running on port 5000`

### Frontend Setup

1. **Navigate to frontend folder:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```
✅ Open `http://localhost:5173` in your browser

---

## 🎯 How It Works

### Overall Flow

```
User Browser (Frontend)
    ↓
Sends HTTP Request (with JWT token)
    ↓
Express Server (Backend)
    ↓
Database (MongoDB)
    ↓
Returns Response (JSON)
    ↓
Frontend displays data
```

### Example: User Registration

1. **User fills form** → Frontend collects name, email, password
2. **Frontend sends POST request** → `/api/auth/register` with data
3. **Backend receives request** → Validates input
4. **Password is hashed** → Using bcryptjs (secure storage)
5. **User saved to MongoDB** → New document created
6. **JWT token generated** → Secret key creates token
7. **Response sent back** → Token + User info
8. **Frontend stores token** → In localStorage
9. **Token sent with future requests** → Proves user is authenticated

### Example: View Products

1. **User navigates to Products page**
2. **Frontend sends GET request** → `/api/products`
3. **Backend queries MongoDB** → Finds all products
4. **Database returns data** → Array of products
5. **Frontend displays products** → Shows name, price, description

---

## 📡 API Endpoints

### Authentication Routes `/api/auth`

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user: { id, name, email } }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email } }
```

### Product Routes `/api/products`

#### Get All Products
```
GET /api/products
Response: [{ _id, name, price, description }, ...]
```

#### Add New Product
```
POST /api/products
Body: { name, price, description }
Response: { _id, name, price, description }
```

### Cart Routes `/api/cart`

#### Get User's Cart
```
GET /api/cart/:userId
Response: { user, items: [{ product, quantity }, ...] }
```

#### Add Item to Cart
```
POST /api/cart/add
Body: { userId, productId, quantity }
Response: { user, items: [...] }
```

### Order Routes `/api/orders`

#### Create Order from Cart
```
POST /api/orders/create/:userId
Response: { _id, user, items, total, status }
```

#### Get User's Orders
```
GET /api/orders/:userId
Response: [{ _id, user, items, total, status }, ...]
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  price: Number,
  description: String
}
```

### Cart Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number
    }
  ]
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: String (pending, paid, shipped, delivered),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication Flow

### How JWT Works

```
1. User logs in with email + password
   ↓
2. Backend checks password (compares hashed versions)
   ↓
3. Backend creates JWT token: jwt.sign({ userId }, SECRET_KEY)
   ↓
4. Token sent to frontend
   ↓
5. Frontend stores in localStorage
   ↓
6. For next request, frontend sends: Authorization: Bearer <token>
   ↓
7. Backend verifies token signature
   ↓
8. If valid → request allowed, if expired → return 401 error
```

### Password Security

```
User enters: "password123"
   ↓
bcryptjs generates random salt
   ↓
hash = bcrypt.hash(password, salt)
   ↓
Result: "$2a$10$..." (different every time!)
   ↓
Stored in database (NOT the actual password)
   ↓
When login: bcrypt.compare(entered_password, hashed_password)
```

---

## 📄 File Explanations

### Backend Files

#### `server.js` - Main Server Entry Point
- Imports Express and creates app
- Connects to MongoDB
- Sets up middleware (JSON parsing, CORS)
- Registers all API routes
- Starts server on port 5000

#### `models/User.js` - User Database Schema
- Defines user structure (name, email, password)
- **Pre-save hook** - Hashes password before saving
- **comparePassword method** - Checks if password is correct

#### `models/Product.js` - Product Database Schema
- Defines product structure (name, price, description)

#### `models/Cart.js` - Shopping Cart Schema
- References user and products
- Stores quantity for each product

#### `models/Order.js` - Order Schema
- References user and products
- Tracks order total and status
- Timestamps when created/updated

#### `routes/authRoutes.js` - Authentication Endpoints
- `/register` - Creates new user account
- `/login` - Authenticates user and returns token
- Validates input (password length, required fields)
- Handles duplicate email error

#### `routes/productRoutes.js` - Product Endpoints
- `/` GET - Fetches all products
- `/` POST - Creates new product
- Validates price is positive

#### `routes/cartRoutes.js` - Cart Endpoints
- `/:userId` GET - Retrieves user's cart
- `/add` POST - Adds product to cart
- Updates quantity if product already in cart

#### `routes/orderRoutes.js` - Order Endpoints
- `/create/:userId` POST - Creates order from cart items
- `/:userId` GET - Fetches all user orders
- Clears cart after order created

#### `middleware/auth.js` - JWT Verification
- Extracts token from request header
- Verifies token signature
- Adds userId to request object
- Rejects if token missing or invalid

### Frontend Files

#### `src/services/api.js` - API Client
- Creates axios instance with base URL
- Adds JWT token to every request automatically
- Handles 401 errors (token expired)
- Redirects to login if token invalid

#### `src/App.jsx` - Main App Component
- Renders Navbar and other pages
- Manages routing

#### `src/components/Navbar.jsx` - Navigation Bar
- Shows user name if logged in
- Logout button to clear token

#### `src/pages/Products.jsx` - Products Page
- Fetches and displays all products
- Shows add to cart buttons

---

## 🧪 Testing the API

### Using PowerShell

**Register a user:**
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Get all products:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/products" -Method GET
```

---

## 🔍 Key Concepts for Juniors

### What is Middleware?
Functions that run between request and response. Example: `express.json()` parses JSON body.

### What is MongoDB?
Database that stores data as JSON-like documents instead of tables. More flexible than SQL.

### What is JWT?
Token that proves you're logged in without storing session data on server. Stateless authentication.

### What is CORS?
Allows frontend (different domain) to make requests to backend.

### What is async/await?
Makes asynchronous code look synchronous. `await` waits for promise to complete.

### What is try-catch?
Catches errors so the app doesn't crash. `try` attempts code, `catch` handles errors.

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "next is not a function" | Check async middleware - don't call `next()` with async functions |
| MongoDB connection fails | Ensure MongoDB is running or check MONGODB_URI |
| CORS errors | Check if CORS middleware is added in server.js |
| 401 Unauthorized | Token missing or expired - login again |
| Validation errors | Check required fields (name, email, password) |

---

## 📚 Next Steps

1. **Add validation** - Use libraries like `joi` or `validator`
2. **Add payment integration** - Stripe or PayPal
3. **Add email notifications** - Send confirmation emails
4. **Add admin panel** - Manage products and orders
5. **Add search & filters** - Find products easily
6. **Add reviews & ratings** - Customer feedback
7. **Deploy** - Heroku, Railway, or Vercel

---

## 📖 Resources for Learning

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT.io](https://jwt.io) - JWT explanation
- [React Documentation](https://react.dev)
- [Mongoose Documentation](https://mongoosejs.com)

---

## 💡 Tips for Junior Developers

1. **Read error messages carefully** - They tell you what's wrong
2. **Use console.log()** - Debug by printing values
3. **Check Network tab** - See what requests are being sent
4. **Start simple** - Understand basics before adding complexity
5. **Ask questions** - Don't guess, ask or research
6. **Test endpoints first** - Use Postman or REST Client before frontend
7. **Version control** - Use Git to track changes

---

Happy coding! 🚀
