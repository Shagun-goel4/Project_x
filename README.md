# 🔗 Lynkly — Link Sharing Platform

A beautiful, full-stack link-sharing web application where users can curate their social profiles, share a public link page, and track engagement analytics — all in one place.

> **Live Frontend:** [linky-54.netlify.app](https://linky-54.netlify.app)  
> **Live Backend API:** [project-x-sdkb.onrender.com](https://project-x-sdkb.onrender.com)

---

## ✨ Features

- **🔐 Authentication** — Secure JWT-based registration and login with form validation.
- **🔗 Link Manager** — Add, edit, remove, and reorder social links with drag-and-drop.
- **🎨 Platform Detection** — Auto-detects platforms (GitHub, YouTube, LinkedIn, etc.) from pasted URLs.
- **👤 Profile Customization** — Update your name, bio, and avatar with Cloudinary image upload.
- **📱 Live Preview** — See changes in real-time on an interactive mobile phone mockup.
- **🌐 Public Profile Page** — Shareable, read-only profile accessible via `/u/:userId`.
- **📊 Analytics Dashboard** — Track total clicks, active links, and top-performing platforms.
- **📤 QR Code Sharing** — Generate a scannable QR code linking to your public profile.
- **🔒 Secure Logout** — One-click session clearing and redirect.

---

## 📸 Screenshots

### Login & Registration
<p align="center">
  <img src="screenshots/login.png" alt="Login Page" width="48%"/>
  <img src="screenshots/register.png" alt="Register Page" width="48%"/>
</p>

### Link Manager with Live Preview
<p align="center">
  <img src="screenshots/links.png" alt="Links Page" width="90%"/>
</p>

### Profile Customization
<p align="center">
  <img src="screenshots/profile.png" alt="Profile Page" width="90%"/>
</p>

### Analytics Dashboard
<p align="center">
  <img src="screenshots/analytics.png" alt="Analytics Dashboard" width="90%"/>
</p>

### Share & QR Code Modal
<p align="center">
  <img src="screenshots/share_modal.png" alt="Share Modal" width="90%"/>
</p>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **React Hook Form + Zod** | Form management & validation |
| **@hello-pangea/dnd** | Drag-and-drop link reordering |
| **Framer Motion** | Smooth modal & page animations |
| **qrcode.react** | QR code generation |
| **Lucide React** | Icon library |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express 5** | HTTP framework |
| **Prisma ORM** | Database access layer |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Avatar image storage |
| **Multer** | File upload middleware |

### Deployment
| Platform | Purpose |
|---|---|
| **Netlify** | Frontend static hosting |
| **Render** | Backend web service |
| **Prisma Accelerate** | Managed PostgreSQL |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (or a Prisma-compatible cloud DB)

### 1. Clone the repository
```bash
git clone https://github.com/Shagun-goel4/Project_x.git
cd Project_x
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables
Create a `backend/.env` file:
```env
PORT=4000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
```

### 4. Setup the database
```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### 5. Run the development servers
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
Project/
├── backend/
│   ├── prisma/              # Schema & migrations
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── routes/           # API route definitions
│   │   └── index.js          # Express server entry
│   └── package.json
├── frontend/
│   ├── public/               # Static assets & _redirects
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Preview contexts
│   │   ├── pages/            # Route page components
│   │   ├── utils/            # API client & helpers
│   │   └── App.jsx           # Root component & routing
│   └── package.json
├── screenshots/              # UI screenshots
├── render.yaml               # Render deployment blueprint
└── package.json              # Root orchestration scripts
```

---

## 📄 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/profile/me` | Get current user profile |
| `PUT` | `/api/profile/me` | Update profile details |
| `GET` | `/api/profile/public/:userId` | Get public profile |
| `GET` | `/api/links` | Get user's links |
| `POST` | `/api/links` | Create a new link |
| `PUT` | `/api/links/:id` | Update a link |
| `DELETE` | `/api/links/:id` | Delete a link |
| `PUT` | `/api/links/reorder` | Bulk reorder links |
| `POST` | `/api/analytics/track/:linkId` | Track a link click |
| `GET` | `/api/analytics/dashboard` | Get analytics data |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Shagun-goel4">Shagun Goel</a>
</p>
