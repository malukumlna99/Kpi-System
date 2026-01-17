# 🚀 KPI Management System - Backend API

API Backend untuk Sistem Penilaian KPI Karyawan Soerbaja 45 Printing.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ / MySQL 8+
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: winston
- **Testing**: Jest, Supertest

---

## ✅ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 15.0 (atau MySQL >= 8.0)
- Git

---

## 📥 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Database

**PostgreSQL:**
```sql
CREATE DATABASE kpi_soerbaja45;
CREATE USER kpi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kpi_soerbaja45 TO kpi_user;
```

**MySQL:**
```sql
CREATE DATABASE kpi_soerbaja45;
CREATE USER 'kpi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON kpi_soerbaja45.* TO 'kpi_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ⚙️ Configuration

### 1. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Configure `.env`

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kpi_soerbaja45
DB_USER=kpi_user
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Generate Secure Keys

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production Mode

```bash
npm start
```

### Database Seeding

```bash
npm run seed
```

**Default Credentials:**
- Manager: `manager@soerbaja45.com` / `Manager123`
- Karyawan: `budi@soerbaja45.com` / `Karyawan123`

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.soerbaja45.com/v1
```

### Authentication

Semua protected endpoints memerlukan Bearer Token:

```bash
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh token | Public |
| GET | `/auth/me` | Get current user | Protected |
| POST | `/auth/logout` | Logout | Protected |
| POST | `/auth/change-password` | Change password | Protected |
| POST | `/auth/register` | Register user | Manager |

#### 👥 Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Manager |
| GET | `/users/:id` | Get user by ID | Manager |
| POST | `/users` | Create user | Manager |
| PUT | `/users/:id` | Update user | Manager |
| DELETE | `/users/:id` | Deactivate user | Manager |
| PATCH | `/users/:id/activate` | Activate user | Manager |

#### 🏢 Devisi

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/devisi` | Get all devisi | Manager |
| GET | `/devisi/:id` | Get devisi by ID | Manager |
| POST | `/devisi` | Create devisi | Manager |
| PUT | `/devisi/:id` | Update devisi | Manager |
| DELETE | `/devisi/:id` | Delete devisi | Manager |

#### 📊 KPI

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/kpi` | Get all KPI | Manager |
| GET | `/kpi/:id` | Get KPI by ID | Manager |
| POST | `/kpi` | Create KPI | Manager |
| PUT | `/kpi/:id` | Update KPI | Manager |
| DELETE | `/kpi/:id` | Delete KPI | Manager |
| GET | `/kpi/my-kpis` | Get my KPIs | Karyawan |

#### ✍️ Assessments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/assessments/submit` | Submit assessment | Karyawan |
| POST | `/assessments/draft` | Save as draft | Karyawan |
| GET | `/assessments/my-history` | Get my history | Karyawan |
| GET | `/assessments/:id` | Get assessment detail | Both |
| POST | `/assessments/:id/review` | Review assessment | Manager |

#### 📈 Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/dashboard` | Dashboard summary | Manager |
| GET | `/reports/employees` | Employee performance | Manager |
| GET | `/reports/employees/:id` | User detailed report | Manager |
| GET | `/reports/kpi/:id/statistics` | KPI statistics | Manager |

### Example Request

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@soerbaja45.com",
    "password": "Manager123"
  }'
```

**Get Users:**
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Submit Assessment:**
```bash
curl -X POST http://localhost:3000/api/v1/assessments/submit \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "kpi_id": 1,
    "answers": [
      {"question_id": 1, "nilai_jawaban": 4},
      {"question_id": 2, "nilai_jawaban": 5}
    ],
    "catatan_karyawan": "Bulan ini fokus pada desain katalog"
  }'
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── auth.js               # Auth configuration
│   ├── models/
│   │   ├── index.js              # Models registry
│   │   ├── User.js
│   │   ├── Devisi.js
│   │   ├── Kpi.js
│   │   ├── KpiQuestion.js
│   │   ├── KpiAssessment.js
│   │   ├── KpiAnswer.js
│   │   └── KpiResult.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.validation.js
│   │   │   └── auth.routes.js
│   │   ├── user/
│   │   ├── devisi/
│   │   ├── kpi/
│   │   ├── assessment/
│   │   └── reports/
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── validator.js          # Validation handler
│   │   └── errorHandler.js       # Error handling
│   ├── utils/
│   │   ├── logger.js             # Winston logger
│   │   └── response.js           # Response helpers
│   ├── routes/
│   │   └── index.js              # Route registry
│   ├── database/
│   │   └── seed.js               # Database seeding
│   └── app.js                    # Main application
├── logs/                          # Application logs
├── .env.example                   # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   ├── users.test.js
│   └── kpi.test.js
└── setup.js
```

---

## 🔒 Security Checklist

- [x] JWT Authentication
- [x] Password hashing (bcrypt)
- [x] Rate limiting
- [x] Helmet security headers
- [x] CORS configuration
- [x] Input validation
- [x] SQL injection prevention (Sequelize ORM)
- [x] XSS prevention
- [x] Error handling & logging
- [x] Environment variables
- [ ] Token blacklist (implement if needed)
- [ ] 2FA (optional enhancement)

---

## 🚀 Deployment

### Using PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/app.js --name kpi-api

# View logs
pm2 logs kpi-api

# Monitoring
pm2 monit

# Restart
pm2 restart kpi-api

# Stop
pm2 stop kpi-api
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
```

```bash
docker build -t kpi-backend .
docker run -p 3000:3000 --env-file .env kpi-backend
```

---

## 📊 Performance Tips

1. **Database Indexing**: Index pada kolom yang sering di-query
2. **Connection Pooling**: Sudah dikonfigurasi di Sequelize
3. **Caching**: Implement Redis untuk frequently accessed data
4. **Compression**: Sudah enabled via compression middleware
5. **Rate Limiting**: Sudah implemented untuk protect API

---

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check database is running
systemctl status postgresql

# Check credentials in .env
# Verify database exists
psql -U postgres -c "\l"
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### JWT Token Invalid

- Pastikan JWT_SECRET di .env sudah benar
- Token mungkin expired (default 24 jam)
- Gunakan refresh token untuk generate token baru

---

## 📞 Support

Untuk bantuan dan pertanyaan:
- Email: support@soerbaja45.com
- Documentation: [API Docs](#)

---

## 📝 License

MIT License - Soerbaja 45 Printing © 2024