# MindClash - Interactive Learning Platform

## 🏆 Google Developers Group Kutaisi Hackathon 2025 Project

MindClash (StudyBattle) is an AI-powered educational platform that combines learning with competitive elements to make studying more engaging for high school students (grades 9-12). The application allows students to master subjects through interactive learning modules and real-time quiz battles against peers.

## 📚 Features

- **AI-Powered Learning Modules**: Personalized learning materials for grades 9-12 in subjects including Mathematics, English, and History
- **Live 1v1 Battles**: Test knowledge in real-time quiz competitions against other students
- **Progress Tracking**: Monitor learning journey with detailed statistics
- **ELO Rating System**: Competitive matchmaking based on skill levels
- **Subject-Specific Content**: Curated learning materials organized by grade and subject
- **User Profiles**: Customizable student profiles with progress tracking
- **Leaderboard**: Global ranking system to foster healthy competition

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.1.7 + Django REST Framework
- **Authentication**: Token-based authentication
- **Database**: SQLite (development)
- **AI Integration**: Google Cloud Vertex AI (Gemini Pro) for:
  - Question generation
  - Answer evaluation
  - Content personalization

### Frontend
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.4.1
- **HTTP Client**: Axios
- **Styling**: Custom CSS with animations

## 🏗️ Project Structure

```
mindClash/
├── backend/
│   └── studybattle/
│       ├── api/               # Django application with models, views, etc.
│       ├── studybattle/       # Django project settings
│       ├── manage.py          # Django management script
│       └── requirements.txt   # Python dependencies
└── frontend/
    └── my-app/                # React application
        ├── public/            # Static assets
        └── src/
            ├── pages/         # React components for each page
            └── utils/         # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm 8+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd mindClash/studybattle/backend/studybattle
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Google Cloud Vertex AI:
   - Create a Google Cloud project
   - Enable Vertex AI API
   - Create a service account and download the JSON key
   - Place the JSON key in the backend directory
   - Update `GOOGLE_APPLICATION_CREDENTIALS` in settings.py

5. Apply migrations and run server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd mindClash/studybattle/frontend/my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application at http://localhost:3000

## 👨‍💻 Key Features Implemented

### User Authentication System
- Registration with profile creation
- Login/logout functionality
- Token-based authorization

### Learning Path Feature
- Grade-specific content (9-12)
- Subject categorization (Mathematics, English, History)
- Topic-based learning modules with practice exercises

### Battle System
- Subject selection for battles
- AI-powered question generation
- Real-time answer evaluation
- ELO-based rating system for fair matchmaking
- Detailed battle results with scoring

### User Interface
- Responsive design for different screen sizes
- Animated components for better user experience
- Intuitive navigation between features

## 🔮 Future Enhancements

- **Multiplayer Real-Time Battles**: Replace bot opponents with real users
- **Advanced Analytics**: Detailed performance metrics and learning recommendations
- **Content Expansion**: Additional subjects and topics
- **Mobile Application**: Native mobile experience
- **Social Features**: Friends, messaging, and group study sessions

## 🔒 Privacy and Security

- Personal data is protected with token-based authentication
- All API endpoints requiring authentication are properly secured
- Passwords are hashed and never stored in plain text

## 📄 License

This project was created for the Google Developers Group Kutaisi Hackathon 2025 and is available for educational purposes.

## 👥 Contributors

- Archil Gergedava
- Juli Chaphidze
- Sandro Iobidze
- Sandro Paikidze
- Elene Kiphiani

---

*MindClash: Learn. Compete. Excel.*
