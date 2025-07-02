## Movie Ranking API  
![Status](https://img.shields.io/badge/status-complete-brightgreen)  
![Tech](https://img.shields.io/badge/-NestJS-E0234E) ![Tech](https://img.shields.io/badge/-React-61DAFB) ![Tech](https://img.shields.io/badge/-TypeScript-3178C6) ![Tech](https://img.shields.io/badge/-PostgreSQL-4169E1) ![Tech](https://img.shields.io/badge/-SSE-010101)  

🖼️ **Preview**:  
![Movie API Preview](https://cdn.glitch.global/0c5397c2-8b81-453e-a90c-14d5c20cfd5d/movie.png)  

🌐 **Live Demo**: [https://movieranker-gavh.onrender.com](https://movieranker-gavh.onrender.com)  

### ✨ Features  
- JWT authentication with bcrypt hashing  
- Movie/actor/director ranking system  
- Real-time updates via Server-Sent Events (SSE)  
- Integration with TMDB for movie data  
- RESTful API endpoints  

### 🛠️ Tech Stack  
- **Backend**: ![NestJS](https://img.shields.io/badge/-NestJS-E0234E) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748)  
- **Frontend**: ![React](https://img.shields.io/badge/-React-61DAFB) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6)  
- **Database**: ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1)  
- **Security**: ![JWT](https://img.shields.io/badge/-JWT-000000) ![Bcrypt](https://img.shields.io/badge/-Bcrypt-FF5722)  

### 📝 Notes  
🎬 **Data Source**: Pulls movie data from [TMDB](https://www.themoviedb.org/)  
⚡ **Realtime**: Uses SSE (not WebSockets) for live updates  

### 🔌 API Endpoints  
| Type       | Endpoint                | Description                          |
|------------|-------------------------|--------------------------------------|
| `POST`     | `/auth/register`        | User registration                   |
| `POST`     | `/auth/login`           | Login + JWT token                   |
| `GET`      | `/movies/updates`       | SSE stream for real-time updates    |
| `POST`     | `/movies/rate`          | Rate movies/people (auth required)  |
