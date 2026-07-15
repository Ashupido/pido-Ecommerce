# Pido E-commerce

Pido is a full-stack e-commerce application with customer, admin, and seller experiences. The project uses React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

## Highlights

- Customer storefront for browsing products, cart, and orders
- Admin dashboard for analytics, user management, order management, and product management
- Seller workspace for catalog and inventory management
- JWT-based authentication and role-based access control
- Responsive UI built with Tailwind CSS

## Tech stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide icons

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- CORS

## Project structure

```text
pido-ecommerce/
├── backend/
│   ├── createAdmin.js
│   ├── seedProducts.js
│   ├── server.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rbac.js
│   ├── models/
│   │   ├── ActivityLog.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── managerRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   └── utils/
│       ├── activityLogger.js
│       └── roles.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── package.json
```

## Getting started

### 1) Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- npm

### 2) Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pido_ecommerce
JWT_SECRET=your-secret-key
```

Start the backend:

```bash
node server.js
```

The server runs on port `5000`.

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Authentication and roles

The app supports these roles:

- `user` — customer experience
- `seller` — seller workspace for catalog management
- `admin` — full control panel

## Authentication Flow (Updated)

The authentication system has been refactored to improve structure, security, and reliability:

- Introduced a dedicated controller in `backend/controllers/authController.js` to handle user registration and login logic, and connected it through `backend/routes/authRoutes.js`.
- Strengthened JWT authentication in `backend/middleware/auth.js` and role-based access control in `backend/middleware/rbac.js`, ensuring all protected routes consistently attach the authenticated user.
- Improved the authentication experience in `frontend/src/pages/Login.jsx` and `frontend/src/pages/Register.jsx` with stronger validation, clearer form handling, and better feedback.

### Key improvements

- Centralized authentication logic for easier maintenance
- Secure password handling using hashing
- Consistent user context across protected routes
- Cleaner and more responsive login/register UI

### Authentication architecture

- JWT-based authentication (stateless)
- Middleware for route protection
- Role-based authorization (admin, seller, user)
- Token stored in localStorage (frontend)

### Register / login
- Register a new account at `/register`
- Login at `/login`

### Create admin account
A helper script is included:

```bash
cd backend
node createAdmin.js --email admin@example.com --password MySecret123 --name "Site Admin"
```

This creates or promotes a user to `admin`.

### Create seller account
You can promote an existing user by updating the role in MongoDB:

```javascript
db.users.updateOne({ email: "seller@example.com" }, { $set: { role: "seller" } })
```

## Main routes

- `/products` — storefront
- `/product/:id` — product details
- `/cart` — cart
- `/orders` — customer orders
- `/admin` and `/admin/dashboard` — admin control panel
- `/seller` and `/seller/dashboard` — seller workspace

## Backend API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart
- `GET /api/cart/:userId`
- `POST /api/cart/add`

### Orders
- `POST /api/orders/create/:userId`
- `GET /api/orders/:userId`

### Admin
- `GET /api/admin/stats/dashboard`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`
- `GET /api/admin/logs/activity`

## Notes

- The frontend stores auth state in `localStorage`.
- Passwords are hashed before being saved.
- Admin and seller access are enforced in the frontend routes and backend role middleware.

## Build

To build the frontend:

```bash
cd frontend
npm run build
```

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
