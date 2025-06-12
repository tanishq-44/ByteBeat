# ByteBeat - Blog Application

ByteBeat is a feature-rich blogging platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- JWT-based authentication for user security
- Rich Text Editor (React Quill) for blog formatting
- Add/edit/delete blogs with optional images (via Cloudinary)
- Like and comment system to engage with content
- Profile management to view your authored blogs
- Search by keyword and filter by category/tag

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Multer and Cloudinary for image uploads

### Frontend
- React with TypeScript
- React Router for navigation
- React Quill for rich text editing
- Context API for state management
- Responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account for image uploads

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bytebeat.git
cd bytebeat
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a single blog
- `POST /api/blogs` - Create a new blog (protected)
- `PUT /api/blogs/:id` - Update a blog (protected)
- `DELETE /api/blogs/:id` - Delete a blog (protected)

### Likes and Comments
- `PUT /api/blogs/:id/like` - Like/unlike a blog (protected)
- `POST /api/blogs/:id/comments` - Add a comment to a blog (protected)
- `DELETE /api/blogs/:id/comments/:comment_id` - Delete a comment (protected)

## License

This project is licensed under the MIT License. 