# FoodLoop - TikTok for Food 🍕

A vertical video feed app for discovering food from local restaurants and food partners.

## Features

### 🎬 Video Feed
- TikTok-style vertical scrolling video feed
- Auto-play on scroll with IntersectionObserver
- Double-tap to like with heart animation
- Sound toggle control
- For You / Following feed tabs

### ❤️ Interactions
- Like videos
- Save/bookmark videos
- Comment on videos with replies
- Share videos (native share API + social buttons)

### 🔍 Discovery
- Full-text search for foods and restaurants
- Category filters
- Trending section
- Explore page with curated content

### 👤 User Profile
- Profile picture upload
- Editable bio
- View liked videos
- View following list
- Theme toggle (Light/Dark/System)

### 🏪 Food Partner Profiles
- Restaurant/food partner pages
- Follow/unfollow system
- Star ratings and reviews
- Video grid of dishes

### 🔔 Notifications
- Like notifications
- Comment notifications
- Follow notifications
- New video alerts
- Mark as read functionality

### 🎨 Theming
- Light mode
- Dark mode
- System preference detection
- Smooth transitions

## Tech Stack

- **React** - UI Library
- **React Router** - Navigation
- **Axios** - API requests
- **Vite** - Build tool
- **CSS Variables** - Theming

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── BottomNav.jsx
│   ├── ReelFeed.jsx
│   ├── CommentsModal.jsx
│   ├── FollowButton.jsx
│   ├── RatingModal.jsx
│   ├── ShareModal.jsx
│   ├── ThemeToggle.jsx
│   ├── Header.jsx
│   └── NotificationBell.jsx
├── pages/
│   ├── auth/           # Login/Register pages
│   ├── food-partner/   # Food partner pages
│   └── general/        # User pages
├── routes/
│   └── AppRoutes.jsx   # Route definitions
└── styles/             # CSS files with theme variables
```

## Environment

The app expects the backend to be running at `http://localhost:3000/api`
