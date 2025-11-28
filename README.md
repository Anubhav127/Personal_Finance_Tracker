# Most Important
- Backend is hosted on render free account so it may take 50sec time to spun up after first request to backend
- Please wait for atleast 50sec for backend to spun up completety
- Before proceeding further



# 💰 Personal Finance Tracker

A modern, full-stack web application for managing personal finances with comprehensive transaction tracking, analytics, and user management features.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14+-blue.svg)](https://postgresql.org/)

## 🌟 Features

### 🔐 **Authentication & Security**
- JWT-based authentication system
- Role-based access control (Admin, User, Read-only)
- Rate limiting for API endpoints
- XSS protection and input sanitization
- Secure password hashing with bcrypt

### 💳 **Transaction Management**
- Create, read, update, and delete transactions
- Income and expense categorization
- Advanced filtering by date, category, and type
- Search functionality for transaction descriptions
- Pagination support for large datasets

### 📊 **Analytics & Reporting**
- Monthly income vs expense analysis
- Category-wise spending breakdown
- Financial trends visualization
- Interactive charts with Chart.js
- Customizable date ranges for reports

### 👥 **User Management**
- Admin dashboard for user oversight
- Profile management
- Transaction count tracking per user
- Role assignment capabilities

### 📱 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Interactive data visualizations
- Real-time updates
- Clean, intuitive interface

## 🏗️ Architecture

```
Personal Finance Tracker/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── db/            # Database schemas & migrations
│   │   ├── middleware/    # Authentication & rate limiting
│   │   ├── models/        # Data models
│   │   ├── routes/        # API endpoints
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Application entry point
│   ├── api-docs.json      # OpenAPI 3.0 specification
│   └── package.json
├── frontend/               # React Vite application
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Anubhav127/Personal_Finance_Tracker.git
cd Personal_Finance_Tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your database credentials
```

#### Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=personal_finance_tracker
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Database Setup

```bash
# Create PostgreSQL database
createdb personal_finance_tracker

# Run database migrations
npm run db:migrate

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure API endpoint
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

### Key API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/transactions` | Get user transactions | ✅ |
| `POST` | `/api/transactions` | Create transaction | ✅ |
| `PATCH` | `/api/transactions/:id` | Update transaction | ✅ |
| `DELETE` | `/api/transactions/:id` | Delete transaction | ✅ |
| `GET` | `/api/analytics/monthly` | Monthly analytics | ✅ |
| `GET` | `/api/analytics/category` | Category breakdown | ✅ |
| `GET` | `/api/analytics/trends` | Financial trends | ✅ |
| `GET` | `/api/users/profile` | Get user profiles (Admin) | ✅ |
| `PUT` | `/api/users/profile/:id` | Update user (Admin) | ✅ |

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛠️ Development

### Backend Development

```bash
cd backend

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Run database migrations
npm run db:migrate
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Available Scripts

#### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations

#### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Database**: PostgreSQL v14+
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, XSS Protection
- **Validation**: express-validator
- **Password Hashing**: bcrypt
- **Rate Limiting**: express-rate-limit

### Frontend
- **Framework**: React v19
- **Build Tool**: Vite v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios v1
- **Charts**: Chart.js v4 + react-chartjs-2
- **Routing**: React Router v7
- **State Management**: React Context API

### Development Tools
- **Testing**: Jest (Backend)
- **Linting**: ESLint
- **Development**: Nodemon, Hot Module Replacement
- **API Testing**: Swagger UI, Postman compatible

## 🔧 Configuration

### Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **transactions** - Financial transaction records
- **categories** - Transaction categories
- **user_sessions** - Session management

### Security Features

- **JWT Authentication** with secure secret keys
- **Rate Limiting** to prevent API abuse
- **CORS Protection** for cross-origin requests
- **XSS Protection** for input sanitization
- **Helmet.js** for security headers
- **bcrypt** for password hashing

### Performance Optimizations

- **Database Indexing** for optimized queries
- **Pagination** for large datasets
- **React.memo** and **useMemo** for component optimization
- **Code Splitting** with dynamic imports

## 📊 Analytics Features

### Monthly Analytics
- Income vs expense comparison
- Net savings calculation
- Transaction count metrics
- Month-over-month growth

### Category Breakdown
- Spending distribution by category
- Percentage-based analysis
- Visual pie charts and bar graphs
- Customizable date ranges

### Financial Trends
- Historical spending patterns
- Income trend analysis
- Savings rate tracking
- Predictive insights