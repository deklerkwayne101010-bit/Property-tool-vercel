# 🚀 PropertyPro Deployment Guide

This guide will help you deploy PropertyPro to Netlify with all features working correctly.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **MongoDB Database**: Set up a MongoDB Atlas cluster
3. **API Keys**: Gather all required API keys (SendGrid, Twilio, Social Media APIs)

## Step 1: Prepare Your Repository

### 1.1 Install Dependencies
```bash
cd property-enhancer-app
npm install
```

### 1.2 Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your actual values in `.env.local`:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/propertypro

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
FROM_EMAIL=noreply@propertypro.co.za

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+27123456789

# And so on for other services...
```

## Step 2: Netlify Deployment

### 2.1 Connect Repository
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Select the `property-enhancer-app` folder as the base directory

### 2.2 Build Settings
Configure these build settings in Netlify:

**Build Command:**
```bash
npm run build
```

**Publish Directory:**
```bash
.next
```

**Node Version:**
```bash
18
```

### 2.3 Environment Variables
Add these environment variables in Netlify's dashboard:

1. Go to Site Settings → Environment Variables
2. Add each variable from your `.env.local` file

**Required Variables:**
- `MONGODB_URI`
- `JWT_SECRET`
- `SENDGRID_API_KEY`
- `FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `NEXT_PUBLIC_APP_URL` (set to your Netlify site URL)

**Optional Variables (for full functionality):**
- `FACEBOOK_ACCESS_TOKEN`
- `FACEBOOK_PAGE_ID`
- `LINKEDIN_ACCESS_TOKEN`
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_TOKEN_SECRET`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_ACCOUNT_ID`
- `OPENAI_API_KEY`

## Step 3: Database Setup

### 3.1 MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database called `propertypro`
3. Create a database user with read/write access
4. Whitelist your Netlify site's IP (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `MONGODB_URI`

### 3.2 Database Connection
The app will automatically create collections when first used. No manual schema setup required.

## Step 4: API Keys Setup

### 4.1 SendGrid (Email)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with full access
3. Verify your domain or single sender
4. Add the API key to `SENDGRID_API_KEY`

### 4.2 Twilio (SMS/WhatsApp)
1. Sign up at [twilio.com](https://twilio.com)
2. Purchase a phone number
3. Get your Account SID and Auth Token
4. Add them to `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`

### 4.3 Social Media APIs (Optional)
These are optional but enable social media posting:

**Facebook:**
1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add Facebook Login and Graph API
3. Get Page Access Token for your business page

**LinkedIn:**
1. Create an app at [developer.linkedin.com](https://developer.linkedin.com)
2. Get Client ID, Client Secret, and Access Token

**Twitter:**
1. Create an app at [developer.twitter.com](https://developer.twitter.com)
2. Get API keys and access tokens

## Step 5: Deploy and Test

### 5.1 Initial Deployment
1. Push your code to your repository
2. Netlify will automatically start building
3. Monitor the build logs for any errors
4. Once deployed, you'll get a `.netlify.app` URL

### 5.2 Test Core Features

**Test Property24 Import:**
1. Go to `/property24-import`
2. Try importing a Property24 URL
3. Check if data is scraped and saved

**Test Template Library:**
1. Go to `/templates/sa-library`
2. Browse and select templates
3. Test template preview functionality

**Test Social Media (if configured):**
1. Go to social media posting interface
2. Try generating and posting content

### 5.3 Troubleshooting

**Common Issues:**

1. **Build Failures:**
   - Check Node.js version (must be 18)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **API Function Timeouts:**
   - Netlify functions have a 10-second timeout for free tier
   - Some operations might need optimization

3. **Database Connection Issues:**
   - Verify MongoDB connection string
   - Check IP whitelisting
   - Ensure database user has correct permissions

4. **Environment Variables:**
   - Make sure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding new variables

## Step 6: Production Optimization

### 6.1 Performance
- Enable Netlify's CDN for faster loading
- Optimize images and assets
- Consider upgrading to Netlify Pro for better performance

### 6.2 Monitoring
- Set up Netlify Analytics
- Monitor function logs
- Track user interactions

### 6.3 Security
- Enable Netlify's built-in security headers
- Set up proper CORS policies
- Regularly update dependencies

## Step 7: Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB connection
5. Review API key configurations

## Features Available After Deployment

✅ **Property24 Smart Import**
- Automatic property data scraping
- South African market validation
- Database storage and management

✅ **Automated Follow-up Sequences**
- Email and SMS automation
- Sequence builder interface
- Analytics and reporting

✅ **One-Click Social Media**
- Multi-platform posting
- AI content generation
- Performance tracking

✅ **South African Templates**
- Localized template library
- Province-specific content
- Market segmentation

Your PropertyPro application is now ready for production! 🎉