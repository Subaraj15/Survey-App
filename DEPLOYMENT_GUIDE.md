# Deployment Guide

This guide will help you deploy the Survey/Feedback Application to production environments.

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Code reviewed and cleaned up
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security review completed
- [ ] Performance optimized

---

## Backend Deployment

### Option 1: Heroku Deployment

#### Prerequisites

- Heroku account (free tier available)
- Heroku CLI installed
- Git repository initialized

#### Steps

1. **Create Heroku app:**

```bash
cd Server
heroku create your-app-name
```

2. **Set environment variables:**

```bash
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secure_secret_key
heroku config:set NODE_ENV=production
```

3. **Add Procfile** (in Server directory):

```
web: node server.js
```

4. **Deploy:**

```bash
git push heroku main
```

5. **View logs:**

```bash
heroku logs --tail
```

### Option 2: AWS EC2 Deployment

#### Prerequisites

- AWS account
- EC2 instance (Ubuntu recommended)
- Node.js installed on instance

#### Steps

1. **SSH into instance:**

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. **Install dependencies:**

```bash
sudo apt update
sudo apt install nodejs npm git
```

3. **Clone repository:**

```bash
git clone your-repo-url
cd survey/Server
```

4. **Install Node packages:**

```bash
npm install
npm install -g pm2
```

5. **Create .env file:**

```bash
nano .env
```

6. **Start with PM2:**

```bash
pm2 start server.js --name "survey-api"
pm2 startup
pm2 save
```

7. **Configure nginx as reverse proxy:**

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Restart nginx:**

```bash
sudo systemctl restart nginx
```

### Option 3: DigitalOcean App Platform

#### Steps

1. **Push to GitHub**
2. **Connect GitHub repository to DigitalOcean**
3. **Configure build settings:**

   - Runtime: Node.js
   - Build command: `npm install`
   - Run command: `node server.js`

4. **Set environment variables:**

   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production

5. **Deploy**

---

## Frontend Deployment

### Option 1: Netlify Deployment

#### Prerequisites

- Netlify account
- GitHub repository

#### Steps

1. **Build frontend:**

```bash
cd Client
npm run build
```

2. **Connect to Netlify:**

   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your GitHub repository

3. **Configure build settings:**

   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables:**

   - VITE_API_URL: `https://your-api-domain.com/api`

5. **Deploy** - Netlify will automatically deploy on push to main

### Option 2: Vercel Deployment

#### Steps

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
cd Client
vercel
```

3. **Follow prompts** to configure project

4. **Add environment variable:**

```bash
vercel env add VITE_API_URL
```

### Option 3: GitHub Pages

#### Steps

1. **Update vite.config.js:**

```javascript
export default defineConfig({
  base: "/survey/",
  // ... rest of config
});
```

2. **Add deploy script to package.json:**

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Build and deploy:**

```bash
npm run build
npm run deploy
```

---

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas

2. **Create a cluster:**

   - Choose cloud provider (AWS, Google Cloud, Azure)
   - Select region close to your users
   - Choose M0 (free) cluster

3. **Create database user:**

   - Go to Database Access
   - Create user with strong password

4. **Get connection string:**

   - Go to Clusters
   - Click Connect
   - Copy connection string
   - Replace `<username>` and `<password>`

5. **Set in environment variables:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-app
```

### Option 2: Self-Hosted MongoDB

1. **Install MongoDB** on your server
2. **Configure MongoDB:**

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **Create admin user:**

```bash
mongo
use admin
db.createUser({user: "admin", pwd: "password", roles: ["root"]})
```

---

## Security Best Practices

### 1. Environment Variables

```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use strong random strings
openssl rand -hex 32  # For JWT_SECRET
```

### 2. MongoDB

```bash
# Enable authentication
# Create separate users for each application
# Use strong passwords
# Enable IP whitelist in MongoDB Atlas
```

### 3. HTTPS/SSL

```bash
# Use Let's Encrypt for free SSL certificates
# On Heroku: automatic
# On AWS/DigitalOcean: use Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### 4. Update Dependencies

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update
```

### 5. Rate Limiting

Add to server.js:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 6. CORS Configuration

Update server.js:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-domain.com",
    credentials: true,
  })
);
```

---

## CI/CD Pipeline Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy Backend
        run: |
          cd Server
          npm install
          # Deploy commands

      - name: Deploy Frontend
        run: |
          cd Client
          npm install
          npm run build
          # Deploy commands
```

---

## Monitoring & Logging

### Backend Logging

Install Winston:

```bash
npm install winston
```

Add to server.js:

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Error Tracking

Use services like:

- **Sentry** - Error tracking
- **Datadog** - Full stack monitoring
- **New Relic** - Performance monitoring

### Uptime Monitoring

Use services like:

- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Website monitoring
- **CloudFlare** - CDN and DDoS protection

---

## Performance Optimization

### Backend

```bash
# Enable gzip compression
npm install compression

# Use caching
npm install redis
```

### Frontend

```bash
# Optimize bundle
npm run build -- --analyze

# Lazy load routes
# Code splitting

# Image optimization
```

### CDN Setup

- Use CloudFlare or AWS CloudFront
- Serve static assets from CDN
- Cache headers configuration

---

## Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri "mongodb+srv://user:pass@host/db"

# Schedule regular backups
# Store in S3 or backup service
```

### Application Backups

- Git repository (always backed up on GitHub)
- Environment variables (store securely)
- Database backups (automated daily)

---

## Troubleshooting Production Issues

### "Cannot find module" Error

```bash
npm install
npm ci  # Use in production
```

### Database Connection Issues

```bash
# Check connection string
# Verify IP whitelist
# Check authentication credentials
```

### High Memory Usage

```bash
# Monitor with PM2
pm2 monit

# Optimize queries
# Add indexes to database
```

### Slow API Responses

```bash
# Check database queries
# Add caching
# Optimize endpoints
# Use CDN
```

---

## Rollback Procedure

### Heroku Rollback

```bash
heroku releases
heroku rollback v10
```

### Manual Rollback

```bash
git revert <commit-hash>
git push
# Redeploy
```

---

## Domain & SSL Setup

### 1. Point Domain to Server

```bash
# Update DNS records
A record: your-domain.com -> your-server-ip
CNAME record: www.your-domain.com -> your-domain.com
```

### 2. Enable HTTPS

```bash
# Let's Encrypt (free)
sudo certbot certonly --nginx -d your-domain.com

# Update nginx
sudo nano /etc/nginx/sites-available/default

# Add SSL configuration
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

---

## Post-Deployment Testing

- [ ] Backend API accessible
- [ ] Frontend loads without errors
- [ ] Authentication works
- [ ] Can create surveys
- [ ] Can submit responses
- [ ] Charts display correctly
- [ ] Database connects successfully
- [ ] HTTPS working
- [ ] No console errors
- [ ] Performance acceptable

---

## Maintenance Plan

### Daily

- Monitor uptime
- Check error logs
- Monitor performance

### Weekly

- Review analytics
- Check security alerts
- Database integrity check

### Monthly

- Update dependencies
- Security audit
- Performance review
- Backup verification

### Quarterly

- Major updates
- Code review
- Architecture review
- Disaster recovery testing

---

## Useful Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Support

For deployment help:

1. Check service documentation
2. Review error logs
3. Contact service support
4. Check community forums

---

**Last Updated:** January 2025
