# ⚡ TechHub Rwanda — E-Commerce Web Application

> Rwanda's #1 Electronics Store | Final Examination Project — EWA408510

![TechHub Rwanda](https://img.shields.io/badge/TechHub-Rwanda-E63946?style=for-the-badge&logo=shopify&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🌍 **Frontend (Live)** | [https://techhub-rwanda.vercel.app](https://techhub-rwanda.vercel.app) |
| ⚙️ **Backend API** | [https://techhub-rwanda.onrender.com](https://techhub-rwanda.onrender.com) |
| 📁 **GitHub Repo** | [https://github.com/mahamat6626/techhub-rwanda](https://github.com/mahamat6626/techhub-rwanda) |

---

## 👨‍🎓 Student Information

| Field | Details |
|-------|---------|
| **Name** | Mahamat Ibrahim Mahamat |
| **Student ID** | 22758/2023 |
| **Program** | Bachelor of Software Engineering |
| **Session** | Evening |
| **Course** | EWA408510 — E-Commerce and Web Application |
| **Instructor** | Eric Maniraguha |
| **University** | University of Lay Adventists of Kigali (UNILAK) |
| **Academic Year** | 2025-2026 |

---

## 📌 Project Overview

**TechHub Rwanda** is a fully functional e-commerce web application for an electronics business in Rwanda. Customers can browse 95+ products across 5 categories, add items to a cart, and place orders via MTN Mobile Money or Airtel Money.

### 🏪 Store Categories
- 📱 Phones & Tablets
- 💻 Computers & Laptops
- 🎧 Audio (Headphones & Speakers)
- 📺 TVs & Displays
- 🔌 Accessories & Gadgets

---

## ✨ Features

- ✅ Responsive & professional UI (desktop + mobile)
- ✅ Homepage with hero section, categories, featured products
- ✅ Product listing with search and category filters
- ✅ Product detail pages with quantity selector
- ✅ Shopping cart (add, remove, update quantities)
- ✅ Checkout with MTN Mobile Money & Airtel Money (Paypack)
- ✅ Order confirmation with order tracking
- ✅ Deals page with discounted products
- ✅ Contact page with Google Maps integration
- ✅ Track Order functionality
- ✅ SQLite database with 95+ products seeded
- ✅ RESTful API backend
- ✅ Docker containerization
- ✅ CI/CD with GitHub Actions
- ✅ Deployed on Vercel + Render

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router DOM v7, Axios |
| Backend | Node.js, Express.js |
| Database | SQLite3 |
| Payment | Paypack (MTN MoMo + Airtel Money) |
| Containerization | Docker, docker-compose |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
techhub-rwanda/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── backend/
│   ├── routes/
│   │   ├── products.js        # Product & category API routes
│   │   └── orders.js          # Order management routes
│   ├── database.js            # SQLite DB setup & seed data
│   ├── server.js              # Express server entry point
│   ├── Dockerfile             # Backend Docker config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, ProductCard
│   │   ├── context/           # CartContext (global state)
│   │   └── pages/             # Home, Shop, Cart, Checkout, Confirmation
│   ├── Dockerfile             # Frontend multi-stage Docker build
│   └── package.json
├── report/
│   └── TechHub_Rwanda_Final_Report.docx  # Project report
├── docker-compose.yml         # Multi-container orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Docker Desktop
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mahamat6626/techhub-rwanda.git
cd techhub-rwanda
```

### 2. Run with Docker (Recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost
- Backend API: http://localhost:5000

### 3. Run Locally (Without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/categories/all` | Get all categories |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/:id` | Get order by ID |

---

## 🐳 Docker

```bash
# Build and start all containers
docker-compose up --build

# Stop containers
docker-compose down
```

| Container | Image | Port |
|-----------|-------|------|
| techhub-backend | node:18-alpine | 5000 |
| techhub-frontend | nginx:alpine | 80 |

---

## ⚙️ CI/CD Pipeline

The project uses **GitHub Actions** for CI/CD. On every push to `main`:

1. ✅ Checkout source code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Build React frontend
5. ✅ Build Docker images
6. ✅ Auto-deploy to Vercel & Render

---

## 📄 Project Report

The full project report is available in the `/report` folder:
- 📄 [TechHub_Rwanda_Final_Report.docx](./report/TechHub_Rwanda_Final_Report.docx)

---

## 📸 Screenshots

### Homepage
![Homepage](https://techhub-rwanda.vercel.app)

---

## 📜 License

This project was developed for academic purposes at UNILAK.

---

<p align="center">
  Made with ❤️ by <strong>Mahamat Ibrahim Mahamat</strong> | UNILAK 2025-2026
</p>
