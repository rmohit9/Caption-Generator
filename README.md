````md
#  Caption & Hashtag Generator

It is a full-stack AI-powered web application that generates context-aware social media captions and hashtags optimized for multiple platforms including **Instagram, LinkedIn, Twitter/X, Facebook, YouTube, and TikTok** using **Google Gemini AI**.

The platform is designed for creators, marketers, and businesses to streamline content creation while providing secure authentication, workspace management, campaign organization, and enterprise-ready administration features.

---

## ✨ Features

### 🤖 AI-Powered Multi-Platform Generation
- Generate platform-specific captions and hashtags from a single prompt.
- Supports Instagram, LinkedIn, Twitter/X, Facebook, YouTube, and TikTok.
- Customizable tone, audience, and content style.
- AI-powered hashtag optimization.

### 👤 Guest Mode
- One free generation for unauthenticated users.
- Browser cookie + IP-based usage tracking.
- Encourages registration after guest usage limit.

### 🏢 Workspace & Campaign Management
- Create multiple workspaces.
- Organize campaigns inside each workspace.
- Store brand information.
- Save audience preferences.
- Configure custom writing tones.

### 🔐 Authentication & Security
- JWT Authentication
- Email OTP Verification
- Password Reset via OTP
- Token Blacklisting
- Protected API Routes

### 📜 History Management
- Save generated captions.
- View previous generations.
- Reuse generated content.

### ⚙️ Admin Dashboard
- Configure Gemini API keys.
- Change AI token limits.
- Manage application settings.
- Production-ready API key swapping.

---

# 🛠 Tech Stack

## Backend

| Technology | Purpose |
|------------|----------|
| Django 5.2.12 | Backend Framework |
| Django REST Framework | REST APIs |
| PostgreSQL | Database |
| Simple JWT | Authentication |
| Google Gemini AI | AI Content Generation |
| Brevo | Email Service |
| dj-database-url | Database Configuration |

---

## Frontend

| Technology | Purpose |
|------------|----------|
| React 19 | Frontend |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| React Router DOM | Routing |
| Axios | API Communication |
| React Hot Toast | Notifications |
| Context API | State Management |

---

# 📂 Project Structure

```text
Graphura-AI/
│
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── middleware.py
│   │   ├── permissions.py
│   │   ├── services/
│   │   │   ├── ai_router.py
│   │   │   ├── brevo.py
│   │   │   └── utils.py
│   │   └── migrations/
│   │
│   ├── core/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── Context/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── hooks/
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── package.json
    └── vite.config.js
```

---

# ⚙️ Environment Variables

## Backend (`backend/.env`)

```env
SECRET_KEY=your_django_secure_secret_key
DEBUG=True

DATABASE_URL=postgres://username:password@localhost:5432/caption_db

# Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key

# Brevo Email
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=hr@graphura.in
BREVO_SENDER_NAME=Graphura AI

# JWT
ACCESS_TOKEN_LIFETIME=30
REFRESH_TOKEN_LIFETIME=7

# Admin
ADMIN_ACCESS_KEY=your_super_secret_admin_key
```

---

## Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

# 🔧 Installation

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Git

---

## Clone Repository

```bash
git clone https://github.com/yourusername/graphura-ai.git

cd graphura-ai
```

---

# Backend Setup

Navigate to backend

```bash
cd backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate environment

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Start backend

```bash
python manage.py runserver
```

Backend will run at

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Frontend will run at

```
http://localhost:5173
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register/` | Register User |
| POST | `/api/verify-otp/` | Verify OTP |
| POST | `/api/login/` | Login |
| POST | `/api/logout/` | Logout |
| POST | `/api/generate/` | Generate Captions |
| GET | `/api/history/` | User History |
| POST | `/api/workspace/` | Create Workspace |
| GET | `/api/workspace/` | List Workspaces |
| POST | `/api/campaign/` | Create Campaign |

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |
| Email | Brevo |
| AI | Google Gemini AI |

---

# 🔮 Future Improvements

- Team collaboration
- Analytics dashboard
- AI content calendar
- Scheduled posting
- Multiple AI model support
- Image caption generation
- Brand voice learning
- Export to PDF/CSV
- Social media integrations

---

# 👨‍💻 Author

**Mohit Raut**

B.Tech Artificial Intelligence

Backend Developer | Generative AI | Python | Django | React

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.
````
