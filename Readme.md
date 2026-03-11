# 🎬 Playtube Backend API

A **Playtube-like backend API** built with **Node.js, Express.js, and MongoDB**.  
This project provides the backend functionality for a video streaming platform including **authentication, video management, playlists, likes, comments, and subscriptions**.

---

# 🚀 Features

## 🔐 Authentication
- User registration
- Login with JWT authentication
- Secure password hashing using bcrypt
- Refresh token support
- Protected routes using middleware

## 👤 User Management
- Update profile
- Change password
- Upload avatar and cover image
- View user channel profile
- Subscribe / unsubscribe to channels

## 🎥 Video Management
- Upload video
- Update video details
- Delete video
- Get video by ID
- Get all videos with pagination and search

## 💬 Comments
- Add comment to video
- Update comment
- Delete comment
- Get comments for a video

## ❤️ Likes
- Like / unlike videos
- Like / unlike comments

## 📂 Playlists
- Create playlist
- Add video to playlist
- Remove video from playlist
- Delete playlist
- Get playlist videos

## 📊 Aggregation Features
- Get channel statistics
- Get user watch history
- Populate owner details using aggregation pipeline

---

# 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcrypt

### File Upload
- Multer
- Cloudinary (for storing videos and images)

### Utilities
- MongoDB Aggregation Pipeline
- Custom API Error Handling
- Async Handler Middleware

---

# 📁 Project Structure

```
src
│
├── controllers
│   ├── auth.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   └── subscription.controller.js
│
├── models
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   └── subscription.model.js
│
├── routes
│   ├── auth.routes.js
│   ├── video.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   └── subscription.routes.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── error.middleware.js
│
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
│
└── app.js
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/youtube-backend.git
```

Move into the project folder:

```bash
cd youtube-backend
```

Install dependencies:

```bash
npm install
```

Run the server:

```bash
npm run dev
```

---

---

# 📡 API Modules

| Module | Description |
|------|------|
| Auth | Login, Register, Logout |
| Users | Profile management |
| Videos | Upload and manage videos |
| Comments | Manage video comments |
| Likes | Like videos and comments |
| Playlists | Manage playlists |
| Subscriptions | Subscribe to channels |

---

# 🧪 API Testing

You can test all APIs using:

- Postman
- Thunder Client
- Insomnia

---

# 📌 Future Improvements

- Video streaming optimization
- Video recommendations
- Notification system
- Watch later feature
- Live streaming support

---

# 🤝 Contributing

If you wish to contribute to this project, feel free to fork the repository and submit a pull request.

Any improvements, suggestions, or bug fixes are welcome!

---

# 📄 License

This project is created for learning purposes based on the [**ChaiAurCode Backend Development Course**](https://www.youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW).
