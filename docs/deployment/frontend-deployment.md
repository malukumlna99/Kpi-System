# Frontend (Web) Deployment Guide

## Overview
Panduan deploy web frontend (React/Vite) untuk KPI System.

---

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API deployed
- Domain & SSL certificate

---

## Build Production

### Step 1: Configure Environment

**Create `.env.production`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_APP_NAME=KPI Management System
VITE_APP_VERSION=1.0.0
```

### Step 2: Build
```bash
cd web
npm install
npm run build
```

Output akan ada di folder `dist/`

---

## Deployment Options

### Option 1: Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables
5. Deploy

### Option 2: Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 3: Static Hosting (Nginx)

**Upload files:**
```bash
scp -r dist/* user@server:/var/www/kpi-frontend
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    root /var/www/kpi-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Enable SSL:**
```bash
sudo certbot --nginx -d app.yourdomain.com
```

### Option 4: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run:**
```bash
docker build -t kpi-frontend .
docker run -d -p 80:80 kpi-frontend
```

---

## CI/CD with GitHub Actions

**.github/workflows/deploy-frontend.yml:**
```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - 'web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      working-directory: ./web
      run: npm ci
      
    - name: Build
      working-directory: ./web
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      run: npm run build
      
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --prod --dir=web/dist
```

---

## Performance Optimization

1. **Code Splitting** - Already handled by Vite
2. **Lazy Loading** - Use React.lazy()
3. **Image Optimization** - Compress images
4. **CDN** - Use CDN for static assets
5. **Caching** - Configure cache headers

---

## Monitoring

- Use Google Analytics
- Setup error tracking (Sentry)
- Monitor Core Web Vitals
