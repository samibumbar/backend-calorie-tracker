# 🍽️ Backend Calories API

Welcome to the **Backend Calories API**, a powerful backend built with **Bun**, **Express**, **MongoDB (Mongoose)**, and **TypeScript**. This API allows users to authenticate, track their daily caloric intake, search for food products, and manage consumed meals. It follows a modular architecture, separating concerns between controllers, services, models, and routes.

## 🚀 Technologies Used

- **Bun** - A fast all-in-one JavaScript runtime
- **Express** - Web framework for building APIs
- **MongoDB & Mongoose** - NoSQL database and object data modeling library
- **TypeScript** - Type-safe JavaScript for better scalability
- **express-validator** - Input validation and sanitization
- **jsonwebtoken** - Token-based authentication (JWT)
- **bcrypt** - Password hashing for security
- **dotenv** - Manage environment variables securely

## 🔧 Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/backend-calories.git
   ```

2. **Install dependencies with Bun:**

   ```sh
   bun install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add:

   ```env
   MONGO_URI=mongodb://localhost:27017/calories_db
   JWT_SECRET=your_jwt_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   PORT=3000
   ```

4. **Start the server:**
   - Development mode:
     ```sh
     bun run dev
     ```
   - Production mode:
     ```sh
     bun start
     ```

By default, the API will run on `http://localhost:3000/api`.

## 📌 API Endpoints

### 🔑 Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - Logout user and blacklist refresh token
- **POST** `/api/auth/refresh` - Refresh access tokens

### 🔥 Caloric Intake

- **GET** `/api/calories/public` - Retrieve public calorie recommendations
- **GET** `/api/calories/private` - Retrieve user-specific calorie data _(requires authentication)_

### 🥗 Products

- **GET** `/api/products/search?query=<search_term>` - Search for products by name or category

### 📆 Daily Consumption

- **POST** `/api/days/add` - Add a consumed product for a specific day
- **DELETE** `/api/days/remove` - Remove a product from a specific day
- **GET** `/api/days/:date` - Get daily food consumption details

## 🔑 Authentication & Security

- **JWT Authentication**: Users must include an access token in the `Authorization` header for protected routes:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Token Blacklisting**: Logged-out tokens are stored in a blacklist to prevent reuse.
- **Password Hashing**: User passwords are securely hashed with bcrypt.
- **Input Validation**: All request data is validated and sanitized with `express-validator`.

---

_Developed with ❤️ using Bun, TypeScript, and MongoDB._
