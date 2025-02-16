# Task Management - Backend

This is the backend service for the **Task Management** application, built using **Node.js, Express, and MongoDB**.

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/dharshan29/task-management-backend.git
cd task-management-backend
```

### 2. Create a `.env` File
Inside the project root, create a `.env` file and add the following:

```
PORT=5000
JWT_SECRET="your-secret-key"
MONGODB_URL=mongodb+srv://username:password@your-cluster.mongodb.net/database-name
```

> Replace the values with your actual **PORT, JWT_SECRET, and MongoDB connection string**.

### 3. Install Dependencies
```sh
npm install
```

### 4. Run the Server

- **For development mode:**  
  ```sh
  npm run dev
  ```  
- **For production mode:**  
  ```sh
  npm start
  ```

## API Documentation
(You can add API routes and usage details here)

## Tech Stack
- **Node.js** - Runtime  
- **Express.js** - Web Framework  
- **MongoDB** - Database  
- **JWT** - Authentication  

---
