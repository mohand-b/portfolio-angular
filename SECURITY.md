# Security Guidelines

## Environment Variables

### Never commit these files:
- `.env` - Local environment variables
- `.env.local` - Local overrides
- `.env.*.local` - Environment-specific local configs

### Always use:
- `.env.example` - Template for required variables (commit this)
- Heroku Config Vars - For production secrets

## Heroku Security Best Practices

### 1. Set Environment Variables via Heroku CLI

```bash
# Never hardcode secrets in code
heroku config:set API_BASE_URL=https://your-api.herokuapp.com
heroku config:set DATABASE_URL=your-database-url
heroku config:set JWT_SECRET=your-secret-key
```

### 2. Enable HTTPS Only

Heroku automatically provides HTTPS. Ensure your backend API also uses HTTPS.

### 3. Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### 4. Use Environment-Specific Configurations

- **Development**: `environments/environments.ts`
- **Production**: `environments/environment.prod.ts`

Never mix production credentials with development environment.

### 5. API Security

- Always validate input on both client and server
- Use CORS properly configured on your backend
- Implement rate limiting on API endpoints
- Use JWT tokens with short expiration times
- Store tokens securely (httpOnly cookies when possible)

### 6. Git Security

```bash
# Check if sensitive files are tracked
git ls-files | grep -E '\\.env$'

# If found, remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### 7. Heroku Dyno Security

- Use at least Hobby tier for production (more secure than free tier)
- Enable Heroku's security features
- Monitor logs for suspicious activity

## Reporting Security Issues

If you discover a security vulnerability, please email: security@yourdomain.com

Do NOT open public issues for security vulnerabilities.

## Security Checklist

Before deploying to production:

- [ ] All secrets stored in Heroku config vars
- [ ] .env files in .gitignore
- [ ] HTTPS enforced on all endpoints
- [ ] Dependencies audited (npm audit)
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Authentication/authorization working
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data
- [ ] Production build tested locally
