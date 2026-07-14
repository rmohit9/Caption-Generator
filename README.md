# Caption & Hashtag Generator

## Overview

This is a full-stack web application that generates context-aware social media captions and hashtags optimized for multiple platforms using Google Gemini AI.

The application enables users to generate platform-specific content for Instagram, LinkedIn, Twitter/X, Facebook, YouTube, and TikTok from a single prompt. It also provides secure authentication, workspace management, campaign organization, persistent history, and an administrative dashboard for managing AI configuration.

---

## Features

### AI Content Generation

* Generate captions and hashtags for multiple social media platforms simultaneously.
* Customize generated content using topic, audience, tone, and brand information.
* Produce platform-specific outputs optimized for engagement.

### Workspace Management

* Create and manage multiple workspaces.
* Organize campaigns within each workspace.
* Store brand-specific information and writing preferences.

### Authentication

* JWT-based authentication.
* Email OTP verification.
* Password reset using OTP.
* Secure protected API endpoints.
* Token blacklisting.

### Guest Access

* One free AI generation for unauthenticated users.
* Cookie and IP-based usage tracking.
* Registration required after guest usage limit is reached.

### History

* Save generated captions.
* Retrieve previous generations.
* Reuse generated content.

### Administration

* Configure Gemini API keys.
* Manage AI token limits.
* Update production settings without code changes.

---

## Technology Stack

### Backend

| Component                 | Technology                     |
| ------------------------- | ------------------------------ |
| Framework                 | Django 5.2.12                  |
| REST API                  | Django REST Framework 3.16.1   |
| Authentication            | Simple JWT                     |
| Database                  | PostgreSQL                     |
| AI Integration            | Google Gemini (`google-genai`) |
| Email Service             | Brevo                          |
| Environment Configuration | python-dotenv                  |

### Frontend

| Component        | Technology       |
| ---------------- | ---------------- |
| Framework        | React 19         |
| Build Tool       | Vite             |
| Styling          | Tailwind CSS v4  |
| Routing          | React Router DOM |
| State Management | Context API      |
| HTTP Client      | Axios            |
| Notifications    | React Hot Toast  |
| Animations       | Framer Motion    |

---

## Project Structure

```text
Graphura-AI/
│
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── services/
│   │   ├── middleware.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── core/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## System Architecture

```text
                +----------------------+
                |      React (Vite)    |
                +----------+-----------+
                           |
                           |
                    REST API (Axios)
                           |
                           |
                +----------v-----------+
                | Django REST Backend  |
                +----------+-----------+
                           |
         +-----------------+------------------+
         |                 |                  |
         |                 |                  |
   Google Gemini      PostgreSQL         Brevo Email
      AI API            Database         OTP Service
```

---

## Prerequisites

Before running the project, ensure the following software is installed:

* Python 3.10 or later
* Node.js 18 or later
* PostgreSQL
* Git

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/<username>/graphura-ai.git

cd graphura-ai
```

---

## Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate the virtual environment.

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file.

```env
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=postgres://username:password@localhost:5432/caption_db

GEMINI_API_KEY=your_gemini_api_key

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_email

BREVO_SENDER_NAME=Graphura AI

ADMIN_ACCESS_KEY=your_admin_key
```

Apply database migrations.

```bash
python manage.py migrate
```

Run the backend server.

```bash
python manage.py runserver
```

Backend will be available at

```
http://127.0.0.1:8000
```

---

## Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the development server.

```bash
npm run dev
```

Frontend will be available at

```
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/register/`   | Register a new user            |
| POST   | `/api/verify-otp/` | Verify email OTP               |
| POST   | `/api/login/`      | User login                     |
| POST   | `/api/logout/`     | User logout                    |
| POST   | `/api/generate/`   | Generate captions and hashtags |
| GET    | `/api/history/`    | Retrieve generation history    |
| GET    | `/api/workspaces/` | List workspaces                |
| POST   | `/api/workspaces/` | Create workspace               |
| GET    | `/api/campaigns/`  | List campaigns                 |
| POST   | `/api/campaigns/`  | Create campaign                |

---

## Configuration

### Backend Environment Variables

| Variable           | Description                  |
| ------------------ | ---------------------------- |
| SECRET_KEY         | Django secret key            |
| DEBUG              | Debug mode                   |
| DATABASE_URL       | PostgreSQL connection string |
| GEMINI_API_KEY     | Google Gemini API key        |
| BREVO_API_KEY      | Brevo API key                |
| BREVO_SENDER_EMAIL | Sender email                 |
| BREVO_SENDER_NAME  | Sender name                  |
| ADMIN_ACCESS_KEY   | Admin authentication key     |

### Frontend Environment Variables

| Variable          | Description     |
| ----------------- | --------------- |
| VITE_API_BASE_URL | Backend API URL |

---

## Deployment

The application can be deployed using the following services.

| Component     | Recommended Platform |
| ------------- | -------------------- |
| Frontend      | Vercel               |
| Backend       | Render               |
| Database      | PostgreSQL           |
| Email Service | Brevo                |
| AI Service    | Google Gemini        |

---

## Future Enhancements

* Team collaboration
* Scheduled content publishing
* Analytics dashboard
* Brand voice learning
* Multiple AI model support
* Content calendar
* Export to PDF and CSV
* Social media API integrations

---

## License

This project is intended for educational and portfolio purposes.

---

## Author

**Mohit Raut**

B.Tech in Artificial Intelligence

Backend Development • Python • Django • React • Generative AI

GitHub: https://github.com/your-username

LinkedIn: https://linkedin.com/in/your-profile
