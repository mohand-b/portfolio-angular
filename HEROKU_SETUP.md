# Quick Heroku Setup Guide

## ✅ What's Been Configured

Your project is now **production-ready** for Heroku deployment with:

### Security
- ✅ Environment variables externalized
- ✅ `.env` files excluded from git
- ✅ Separate dev/prod configurations
- ✅ Heroku config vars setup ready

### Build Configuration
- ✅ `Procfile` - tells Heroku how to start your app
- ✅ `heroku-postbuild` script - automatic production build
- ✅ Node.js version specified in `package.json`
- ✅ Angular file replacements for production environment

### Files Created
- `Procfile` - Heroku process definition
- `.env.example` - Environment variables template
- `app.json` - Heroku app configuration
- `.herokuignore` - Optimization for deployment
- `environments/environment.prod.ts` - Production config
- `DEPLOYMENT.md` - Full deployment guide
- `SECURITY.md` - Security best practices

## 🚀 Quick Deployment (3 Steps)

### 1. Install Heroku CLI & Login

```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

### 2. Create Heroku App & Configure

```bash
# Create app
heroku create mohandb-portfolio

# Set your backend API URL
heroku config:set API_BASE_URL=https://api.mohandb.dev
```

### 3. Deploy

```bash
# Make sure all changes are committed
git add .
git commit -m "chore: prepare for Heroku deployment"

# Push to Heroku
git push heroku main

# Open your app
heroku open
```

## 📝 Important Next Steps

### After Deployment

1. **Set up custom domain** (see `CUSTOM_DOMAIN.md` for detailed guide):
   ```bash
   heroku domains:add mohandb.dev
   heroku domains:add www.mohandb.dev
   ```

2. **Configure DNS** at your domain registrar to point to Heroku

3. **Configure CORS** on your backend to allow requests from:
   - `https://mohandb.dev`
   - `https://www.mohandb.dev`

4. **Check logs** if something doesn't work:
   ```bash
   heroku logs --tail
   ```

### Before Going Live

- [ ] Set production API URL in Heroku config (https://api.mohandb.dev)
- [ ] Test all features work with production backend
- [ ] Configure custom domain mohandb.dev (see CUSTOM_DOMAIN.md)
- [ ] Enable HTTPS (automatic on Heroku Hobby+ tier)
- [ ] Update CORS on backend to allow mohandb.dev
- [ ] Monitor app performance

## 🔒 Security Checklist

- ✅ No secrets in code
- ✅ `.env` in `.gitignore`
- ✅ Environment-specific configs
- ⚠️ Update `API_BASE_URL` in Heroku config
- ⚠️ Configure CORS on backend

## 📦 What Happens on Deploy

1. Heroku detects Node.js project
2. Runs `npm install` (installs dependencies)
3. Runs `npm run heroku-postbuild` (builds Angular app)
4. Starts server with `node dist/portfolio-angular/server/server.mjs`

## 🐛 Troubleshooting

### Build fails
```bash
heroku logs --tail
```

### App crashes
```bash
heroku ps
heroku restart
```

### Check environment variables
```bash
heroku config
```

## 💰 Heroku Pricing

- **Free**: Limited hours per month
- **Hobby**: $7/month - 24/7 uptime
- **Production**: $25+/month - Enhanced features

## 📚 More Info

- Full guide: `DEPLOYMENT.md`
- Security: `SECURITY.md`
- Environment variables: `.env.example`
