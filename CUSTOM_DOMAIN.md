# Custom Domain Setup - mohandb.dev

## Overview

This guide will help you configure your custom domain `mohandb.dev` to point to your Heroku application.

## Prerequisites

- Heroku app created and deployed
- Access to your domain registrar (where you bought mohandb.dev)
- Heroku CLI installed

## Step 1: Add Domain to Heroku

```bash
# Add your custom domain
heroku domains:add mohandb.dev

# Add www subdomain (optional but recommended)
heroku domains:add www.mohandb.dev

# View DNS targets provided by Heroku
heroku domains
```

Heroku will give you DNS targets that look like:
```
mohandb.dev        DNS Target: abc123.herokudns.com
www.mohandb.dev    DNS Target: www-abc123.herokudns.com
```

## Step 2: Configure DNS at Your Domain Registrar

Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these records:

### Option A: Using CNAME (Recommended if supported)

If your registrar supports ALIAS/ANAME records for root domain:

```
Type    Name    Value                        TTL
------------------------------------------------------
ALIAS   @       abc123.herokudns.com         3600
CNAME   www     www-abc123.herokudns.com     3600
```

### Option B: Using A Records (if ALIAS not supported)

```
Type    Name    Value                        TTL
------------------------------------------------------
A       @       [Get from: heroku domains]   3600
CNAME   www     www-abc123.herokudns.com     3600
```

## Step 3: Enable SSL (HTTPS)

Heroku provides free SSL certificates via Let's Encrypt:

```bash
# SSL is automatically provisioned for custom domains on paid dynos
# Check SSL status
heroku certs:auto

# View certificate info
heroku certs
```

⚠️ **Note**: Automatic SSL requires at least a Hobby dyno ($7/month). Free dynos don't support custom domains with SSL.

## Step 4: Configure API Subdomain (Optional)

If your backend API is also on Heroku and you want to use `api.mohandb.dev`:

```bash
# On your backend Heroku app
heroku domains:add api.mohandb.dev

# Add DNS record at your registrar
Type    Name    Value                        TTL
------------------------------------------------------
CNAME   api     api-xyz789.herokudns.com     3600
```

Then update your frontend config:
```bash
heroku config:set API_BASE_URL=https://api.mohandb.dev
```

## Step 5: Redirect www to non-www (or vice versa)

You can configure this at DNS level or use Heroku's built-in redirect.

### At DNS Level (Cloudflare example)

If using Cloudflare, you can set up page rules to redirect www → non-www

### In Your App (Express middleware)

Already configured in `src/server.ts` - no action needed.

## Step 6: Verify Domain

```bash
# Check domain status
heroku domains

# Wait for DNS to propagate (can take up to 48 hours, usually much faster)
# Check DNS propagation
nslookup mohandb.dev
```

Test your site:
```bash
curl -I https://mohandb.dev
```

## Troubleshooting

### Domain shows Heroku default page
- DNS hasn't propagated yet (wait up to 48 hours)
- Verify DNS records are correct

### SSL certificate not working
- Ensure you're on a Hobby dyno or higher
- Wait for certificate provisioning (can take up to 1 hour)
- Check status: `heroku certs:auto`

### API calls failing with CORS
Update CORS configuration on your backend to allow:
- `https://mohandb.dev`
- `https://www.mohandb.dev`

### Mixed content warnings
Ensure all resources (images, fonts, etc.) are loaded via HTTPS

## Backend API Configuration

Don't forget to update your backend CORS settings to allow requests from:

```javascript
// Example CORS config
const allowedOrigins = [
  'https://mohandb.dev',
  'https://www.mohandb.dev',
  'http://localhost:4200',  // for local dev
  'http://localhost:4201'   // for local dev
];
```

## DNS Configuration Summary

Your final DNS configuration should look like:

```
Host    Type     Value
---------------------------------------------------
@       ALIAS    abc123.herokudns.com
www     CNAME    www-abc123.herokudns.com
api     CNAME    api-xyz789.herokudns.com (if using API subdomain)
```

## Useful Commands

```bash
# Check domain status
heroku domains

# Check SSL certificate status
heroku certs

# View app logs
heroku logs --tail

# Check DNS propagation
dig mohandb.dev
nslookup mohandb.dev

# Test HTTPS
curl -I https://mohandb.dev
```

## Cost

- **Domain Registration**: Varies by registrar (~$10-15/year for .dev domains)
- **Heroku Hobby Dyno**: $7/month (required for custom domain with SSL)
- **SSL Certificate**: Free (via Let's Encrypt, automatic on Hobby+)

## Next Steps After Setup

1. Update `API_BASE_URL` in Heroku config if using custom API domain
2. Test all functionality on the custom domain
3. Update social media links to use mohandb.dev
4. Submit to Google Search Console for indexing
5. Set up monitoring and analytics

## Resources

- [Heroku Custom Domains](https://devcenter.heroku.com/articles/custom-domains)
- [Heroku SSL](https://devcenter.heroku.com/articles/ssl)
- [DNS Checker Tool](https://dnschecker.org/)
