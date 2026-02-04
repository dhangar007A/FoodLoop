# 🍕 FoodLoop

A modern social media platform for food enthusiasts and food partners to share, discover, and engage with food content through an Instagram-style reel feed experience.

## 📖 Overview

FoodLoop is a full-stack web application that combines social media features with food discovery. Users can browse food content in a vertical reel format, save their favorites, follow food partners, rate dishes, and engage through comments and likes. Food partners can showcase their culinary creations and connect with their audience.

## ✨ Features

### For Users
- 📱 **Reel-Style Feed**: Swipe through food content in a vertical, Instagram-like interface
- 💾 **Save & Organize**: Bookmark favorite food items for later
- ⭐ **Rating System**: Rate and review dishes
- 💬 **Comments & Likes**: Engage with food content through comments and reactions
- 👥 **Follow System**: Follow your favorite food partners and see their latest posts
- 🔔 **Notifications**: Stay updated with likes, comments, and new followers
- 🔍 **Search & Explore**: Discover new food by categories or search
- 🌙 **Dark Mode**: Toggle between light and dark themes

### For Food Partners
- 📤 **Upload Content**: Share food items with images and descriptions
- 📊 **Profile Management**: Showcase your culinary creations
- 👀 **View Analytics**: Track views and engagement on your posts
- 💬 **Interact**: Respond to ratings and comments from users

### General Features
- 🔐 **Secure Authentication**: JWT-based auth with HTTP-only cookies
- 📱 **Responsive Design**: Optimized for mobile and desktop
- 🖼️ **Image Storage**: Cloud-based image hosting via ImageKit
- 🔄 **Real-time Updates**: Dynamic content loading and notifications

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 - UI library
- **React Router** 7.9.1 - Client-side routing
- **Axios** - HTTP client
- **Vite** 7.1.6 - Build tool and dev server
- **CSS3** - Styling with custom themes

### Backend
- **Node.js** with **Express** 5.1.0 - Server framework
- **MongoDB** with **Mongoose** 8.18.1 - Database
- **JWT** (jsonwebtoken) - Authentication
- **Bcrypt.js** - Password hashing
- **ImageKit** - Image storage and CDN
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie management

## 📁 Project Structure

```
Food_App/
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Auth & validation
│   │   ├── services/      # External services (ImageKit)
│   │   └── db/           # Database connection
│   ├── API.md            # API documentation
│   └── server.js         # Entry point
│
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login/Register pages
│   │   │   ├── food-partner/  # Partner-specific pages
│   │   │   └── general/  # User pages
│   │   ├── components/   # Reusable components
│   │   ├── routes/       # Route configuration
│   │   └── styles/       # CSS files
│   └── index.html
│
└── videos/               # Video assets (if any)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **ImageKit Account** (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhangar007A/FoodLoop.git
   cd Food_App
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   CLIENT_URL=http://localhost:5173
   ```

   Start the backend server:
   ```bash
   npm start
   # or with nodemon
   nodemon server.js
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📚 API Documentation

Complete API documentation is available in [backend/API.md](backend/API.md).

### Main Endpoints

- **Auth**: User and Food Partner registration/login
- **Food**: CRUD operations for food items
- **User**: Profile management
- **Comments**: Comment on food posts
- **Ratings**: Rate food items
- **Follow**: Follow/unfollow food partners
- **Notifications**: User notifications
- **Search**: Search and explore content

## 🔒 Authentication Flow

1. User/Food Partner registers or logs in
2. Server generates JWT token and stores in HTTP-only cookie
3. Client includes `withCredentials: true` in API requests
4. Middleware validates token on protected routes

## 🎨 Key Features Implementation

### Reel Feed
- Vertical scrolling interface for food content
- Auto-play videos (if applicable)
- Like, comment, save, and share actions
- View count tracking

### Follow System
- Users can follow food partners
- Following feed shows content from followed partners
- Mutual follow detection

### Rating System
- 5-star rating with review text
- Average rating calculation
- User can rate each food item once

### Notification System
- Notifies users of likes, comments, and new followers
- Real-time notification updates
- Unread notification counter

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**dhangar007A**

- GitHub: [@dhangar007A](https://github.com/dhangar007A)

## 🙏 Acknowledgments

- Inspired by Instagram Reels and TikTok's content discovery experience
- Built with modern web technologies for optimal performance
- Special thanks to all contributors and food enthusiasts!

---

⭐ If you like this project, please give it a star on GitHub!
