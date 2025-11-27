# Deployment Guide for Heroku

## Prerequisites

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku: `heroku login`

## Initial Setup

### 1. Create Heroku App

```bash
heroku create your-portfolio-name
```

### 2. Set Environment Variables

```bash
# Set your backend API URL
heroku config:set API_BASE_URL=https://api.mohandb.dev

# Set Node environment (optional, defaults to production)
heroku config:set NODE_ENV=production
```

### 3. Add Buildpack (if not automatically detected)

```bash
heroku buildpacks:set heroku/nodejs
```

## Deployment

### Deploy from Git

```bash
# Add Heroku remote (if not already added)
git remote add heroku https://git.heroku.com/your-portfolio-name.git

# Push to Heroku
git push heroku main
```

### Check Deployment Status

```bash
# View logs
heroku logs --tail

# Open app in browser
heroku open
```

## Environment Variables

All sensitive configuration should be set via Heroku config vars:

- `API_BASE_URL`: Your backend API base URL (required)
- `PORT`: Automatically set by Heroku
- `NODE_ENV`: Set to 'production' automatically by Heroku

## Build Process

When you push to Heroku:

1. Heroku detects Node.js project
2. Runs `npm install` to install dependencies
3. Runs `npm run heroku-postbuild` which executes production build
4. Starts the server using the Procfile command

## Troubleshooting

### Check build logs
```bash
heroku logs --tail
```

### Restart the app
```bash
heroku restart
```

### Access the Heroku bash
```bash
heroku run bash
```

### Check environment variables
```bash
heroku config
```

## Rollback

If something goes wrong:

```bash
# Rollback to previous version
heroku rollback

# Or rollback to specific version
heroku releases
heroku rollback v123
```

## Performance Tips

1. Enable HTTP/2 on Heroku (automatic with newer dynos)
2. Use CDN for static assets (Cloudflare, etc.)
3. Enable gzip compression (already configured in Express)
4. Monitor performance with Heroku metrics

## Security Checklist

- ✅ Environment variables stored in Heroku config (not in code)
- ✅ .env files excluded from git
- ✅ Production mode enabled
- ✅ HTTPS enforced (automatic on Heroku)
- ✅ Dependencies up to date

## Cost

- Free tier: Available with limited hours
- Hobby tier: $7/month for 24/7 uptime
- Production tier: Starts at $25/month with enhanced features
