# PropertyPro Netlify Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment Steps

#### 1. Environment Variables Setup
Set these environment variables in Netlify dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/propertypro

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-site-name.netlify.app

# API Keys
OPENAI_API_KEY=sk-your-openai-api-key
HUGGINGFACE_API_KEY=hf-your-huggingface-api-key
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Yoco Payment
YOCO_SECRET_KEY=sk_test_your-yoco-secret-key
YOCO_PUBLIC_KEY=pk_test_your-yoco-public-key

# Email
FROM_EMAIL=noreply@propertypro.co.za
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# App Settings
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NODE_ENV=production
```

#### 2. Build Settings
In Netlify dashboard, configure:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18`
- **NPM version**: `9`

#### 3. Database Setup
Ensure MongoDB Atlas is configured with:
- IP whitelist includes `0.0.0.0/0` (Netlify's IP range)
- Database user has read/write permissions
- Connection string uses the correct format

### Common Netlify Deployment Issues & Solutions

#### Issue 1: Build Timeout
**Problem**: Build exceeds 10-minute timeout
**Solution**:
- Optimize bundle size by removing unused dependencies
- Use `next build --no-lint` if ESLint is slow
- Consider upgrading to Netlify's build plan for longer timeouts

#### Issue 2: API Routes Not Working
**Problem**: API routes return 404 or 500 errors
**Solution**:
- Ensure `netlify.toml` has correct redirects:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```
- Check that API routes export proper handlers
- Verify environment variables are set correctly

#### Issue 3: Database Connection Issues
**Problem**: MongoDB connection fails
**Solution**:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user credentials are correct
- Test connection locally first

#### Issue 4: Image Optimization Errors
**Problem**: Next.js image optimization fails
**Solution**:
- Set `unoptimized: true` in `next.config.ts` for Netlify
- Use external image CDN (Cloudinary, Imgix)
- Ensure images are properly sized

#### Issue 5: Build Command Errors
**Problem**: `npm run build` fails
**Solution**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility

### Netlify-Specific Optimizations

#### 1. Bundle Analysis
```bash
# Add to package.json scripts
"analyze": "ANALYZE=true npm run build"
```

#### 2. Build Optimization
```javascript
// next.config.ts
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
};
```

#### 3. Function Optimization
```toml
# netlify.toml
[functions]
  node_bundler = "esbuild"
  included_files = ["src/lib/**"]
```

### Post-Deployment Verification

#### 1. Basic Functionality Tests
- [ ] Homepage loads correctly
- [ ] Authentication works (login/signup)
- [ ] Dashboard displays properly
- [ ] API routes respond correctly

#### 2. Core Feature Tests
- [ ] Web scraping functionality
- [ ] Template editor works
- [ ] AI description generation
- [ ] CRM features operational

#### 3. Performance Checks
- [ ] Page load times under 3 seconds
- [ ] Core Web Vitals scores good
- [ ] API response times under 2 seconds

### Troubleshooting Commands

#### Local Testing
```bash
# Test build locally
npm run build

# Test production build
npm run start

# Check for build issues
npm run lint
```

#### Netlify CLI Debugging
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test build locally
netlify build

# Deploy to draft
netlify deploy --dir=.next --prod=false
```

### Environment-Specific Configurations

#### Development vs Production
```javascript
// Use different settings based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isNetlify = process.env.NETLIFY === 'true';

if (isNetlify) {
  // Netlify-specific configurations
  config.images = { unoptimized: true };
}
```

#### Database Connection
```javascript
// Handle different database URLs
const dbUrl = process.env.MONGODB_URI || process.env.DATABASE_URL;
```

### Monitoring & Maintenance

#### 1. Error Tracking
- Set up error logging (Sentry, LogRocket)
- Monitor API response times
- Track user interactions

#### 2. Performance Monitoring
- Use Netlify Analytics
- Monitor Core Web Vitals
- Set up uptime monitoring

#### 3. Backup Strategy
- Database backups (MongoDB Atlas automated)
- Code repository backups
- Configuration backups

### Security Considerations

#### 1. Environment Variables
- Never commit secrets to repository
- Use Netlify's encrypted environment variables
- Rotate API keys regularly

#### 2. CORS Configuration
```javascript
// next.config.ts
async headers() {
  return [
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
      ],
    },
  ];
}
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Build settings verified
- [ ] API routes functional
- [ ] Images optimized
- [ ] Security headers set
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Monitoring set up

### Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PropertyPro Support](mailto:support@propertypro.co.za)

---

**Last Updated**: January 2025
**Version**: 1.0.0