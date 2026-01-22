# Backend Deployment Guide

## Overview
Panduan lengkap untuk deploy backend KPI System ke production server.

---

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15.0 / MySQL >= 8.0
- PM2 (untuk process management)
- Nginx (untuk reverse proxy)
- SSL Certificate (untuk HTTPS)

---

## Deployment Options

### Option 1: VPS (Ubuntu 22.04)
### Option 2: Docker
### Option 3: Cloud Platform (Heroku, Railway, etc)

---

## 1. VPS Deployment (Ubuntu)

### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### Step 3: Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 4: Create Database & User
```bash
sudo -u postgres psql

CREATE DATABASE kpi_soerbaja45;
CREATE USER kpi_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kpi_soerbaja45 TO kpi_user;
\q
```

### Step 5: Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/your-repo/kpi-system.git
cd kpi-system/backend
```

### Step 6: Install Dependencies
```bash
npm install --production
```

### Step 7: Configure Environment
```bash
cp .env.example .env
nano .env
```

**Production .env:**
```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=kpi_soerbaja45
DB_USER=kpi_user
DB_PASSWORD=your_secure_password
DB_DIALECT=postgres

JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=info
```

### Step 8: Run Database Migration & Seed
```bash
npm run migrate
npm run seed
```

### Step 9: Install PM2
```bash
sudo npm install -g pm2
```

### Step 10: Start Application with PM2
```bash
pm2 start src/app.js --name kpi-api
pm2 save
pm2 startup
```

**PM2 Configuration File (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'kpi-api',
    script: 'src/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    watch: false,
    autorestart: true
  }]
};
```

**Start with config:**
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Step 11: Configure Nginx Reverse Proxy

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Create Nginx Config:**
```bash
sudo nano /etc/nginx/sites-available/kpi-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/kpi-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 12: Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

**Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Step 13: Setup Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 2. Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: kpi_postgres
    environment:
      POSTGRES_DB: kpi_soerbaja45
      POSTGRES_USER: kpi_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kpi_network

  backend:
    build: .
    container_name: kpi_backend
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: kpi_soerbaja45
      DB_USER: kpi_user
      DB_PASSWORD: your_password
    ports:
      - "3000:3000"
    volumes:
      - ./logs:/app/logs
    networks:
      - kpi_network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: kpi_nginx
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    networks:
      - kpi_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  kpi_network:
    driver: bridge
```

**Run Docker:**
```bash
docker-compose up -d
```

---

## 3. Cloud Platform Deployment

### Heroku
```bash
# Login
heroku login

# Create app
heroku create kpi-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
heroku run npm run seed
```

### Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically

### DigitalOcean App Platform
1. Create new app
2. Connect GitHub
3. Configure build command: `npm install`
4. Configure run command: `npm start`
5. Add managed database
6. Set environment variables

---

## PM2 Commands
```bash
# Start
pm2 start kpi-api

# Stop
pm2 stop kpi-api

# Restart
pm2 restart kpi-api

# Delete
pm2 delete kpi-api

# Logs
pm2 logs kpi-api

# Monitor
pm2 monit

# List processes
pm2 list

# Save current processes
pm2 save

# Resurrect saved processes
pm2 resurrect
```

---

## Health Checks

### Application Health
```bash
curl http://localhost:3000/api/v1/health
```

### Database Connection
```bash
sudo -u postgres psql -d kpi_soerbaja45 -c "SELECT version();"
```

### PM2 Status
```bash
pm2 status
```

### Nginx Status
```bash
sudo systemctl status nginx
```

---

## Monitoring

### Application Logs
```bash
# PM2 logs
pm2 logs kpi-api

# Application logs
tail -f logs/combined.log
tail -f logs/error.log
```

### System Resources
```bash
pm2 monit
htop
```

### Database
```bash
# PostgreSQL
sudo -u postgres psql -d kpi_soerbaja45 -c "
  SELECT 
    datname, 
    numbackends, 
    xact_commit, 
    tup_returned, 
    tup_fetched 
  FROM pg_stat_database 
  WHERE datname = 'kpi_soerbaja45';
"
```

---

## Backup Strategy

### Database Backup (Daily)
```bash
# Create backup script
nano /home/scripts/backup-db.sh
```

**backup-db.sh:**
```bash
#!/bin/bash
BACKUP_DIR="/home/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="kpi_db_$DATE.sql"

mkdir -p $BACKUP_DIR
pg_dump -U kpi_user kpi_soerbaja45 > $BACKUP_DIR/$FILENAME
gzip $BACKUP_DIR/$FILENAME

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
```

**Make executable & schedule:**
```bash
chmod +x /home/scripts/backup-db.sh

# Add to crontab
crontab -e

# Run daily at 2 AM
0 2 * * * /home/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### Application Backup
```bash
tar -czf /home/backups/app_$(date +%Y%m%d).tar.gz /var/www/kpi-system
```

---

## Security Checklist

- [ ] Use strong passwords
- [ ] Configure firewall (UFW)
- [ ] Enable SSL/HTTPS
- [ ] Set secure JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Keep system updated
- [ ] Regular security audits
- [ ] Database password rotation
- [ ] Disable root SSH login
- [ ] Use SSH keys only
- [ ] Enable fail2ban

---

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs kpi-api

# Check environment
cat .env

# Check database connection
npm run migrate
```

### High memory usage
```bash
# Restart PM2
pm2 restart kpi-api

# Check memory
pm2 monit
```

### Database connection error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U kpi_user -d kpi_soerbaja45 -h localhost
```

---

## Rollback Strategy
```bash
# Stop application
pm2 stop kpi-api

# Restore database
psql -U kpi_user -d kpi_soerbaja45 < backup_20240122.sql

# Rollback code
git reset --hard previous_commit_hash
npm install

# Restart
pm2 restart kpi-api
```

---

## Performance Optimization

1. **Use clustering with PM2**
2. **Enable Gzip compression** (already configured)
3. **Implement Redis caching** (optional)
4. **Database connection pooling** (already configured)
5. **CDN for static assets**
6. **Database indexing** (already implemented)
