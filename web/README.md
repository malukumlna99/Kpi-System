# 🌐 KPI Management System - Web Frontend

Web frontend application untuk sistem penilaian KPI karyawan Soerbaja 45 Printing.

## 📋 Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Data Fetching**: React Query
- **Charts**: Chart.js + react-chartjs-2
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API running

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure API endpoint in .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Development

```bash
npm run dev
```

App akan berjalan di `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output di folder `dist/`

## 📂 Project Structure

```
web/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout/       # Layout components
│   │   └── common/       # Common UI components
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Devisi/
│   │   ├── KPI/
│   │   ├── Users/
│   │   └── Reports/
│   ├── services/         # API services
│   │   └── api.js
│   ├── store/            # Zustand stores
│   │   └── authStore.js
│   ├── hooks/            # Custom hooks
│   │   └── useAuth.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
└── package.json
```

## 🔑 Features

### For Manager:
- ✅ Dashboard dengan statistik lengkap
- ✅ Manajemen Devisi (CRUD)
- ✅ Manajemen KPI (CRUD)
- ✅ Manajemen User (CRUD)
- ✅ Review Assessment Karyawan
- ✅ Laporan & Analytics
- ✅ Export Data

### For Karyawan:
- ✅ Dashboard personal
- ✅ Lihat & Isi KPI Assessment
- ✅ Riwayat Penilaian
- ✅ Lihat Feedback Manager
- ✅ Profile Management

## 🎨 UI Components

All components menggunakan Tailwind CSS untuk styling dan fully responsive.

### Common Components:
- Button
- Input
- Select
- Card
- Modal
- Table
- Badge
- Loading
- StatCard

### Layout Components:
- Layout (Main wrapper)
- Navbar
- Sidebar

## 🔐 Authentication

Menggunakan JWT token yang disimpan di localStorage:
- Access Token (24 jam)
- Refresh Token (7 hari)

Auto-refresh token saat expired.

## 📊 State Management

- **Zustand** untuk global state (auth, user data)
- **React Query** untuk server state & caching
- **React Hook Form** untuk form state

## 🌐 API Integration

Base URL dikonfigurasi via environment variable:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Semua request menggunakan axios interceptor untuk:
- Auto attach JWT token
- Auto refresh token
- Error handling
- Request/response logging

## 🧪 Testing

```bash
npm test
```

## 📱 Responsive Design

- Desktop: >= 1024px
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🚀 Deployment

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel

```bash
npm run build
vercel --prod
```

### Manual (Nginx)

```bash
npm run build
# Upload dist/ folder to server
```

## 🔧 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=KPI Management System
VITE_APP_VERSION=1.0.0
```

## 📝 Default Credentials

```
Manager:
Email: manager@soerbaja45.com
Password: Manager123

Karyawan:
Email: budi@soerbaja45.com
Password: Karyawan123
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - Soerbaja 45 Printing © 2024
