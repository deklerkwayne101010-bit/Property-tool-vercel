# 🏠 Property Enhancer - AI-Powered Real Estate Tools

An advanced web application for real estate professionals featuring AI-powered property description generation, Canva-style photo editing, and comprehensive CRM functionality.

## ✨ Features

### 🎨 Canva-Style Editor
- **Drag-and-drop canvas** with Fabric.js
- **Advanced image filters**: brightness, contrast, saturation, hue, blur, sepia
- **AI-powered enhancements**: image upscaling, background removal, color correction
- **Virtual staging templates** for different room types
- **Real-time collaboration** with user cursors and presence indicators
- **Multiple export formats**: PNG, PDF, JPG

### 🤖 AI Property Description Generator
- **OpenAI GPT-4 integration** for professional descriptions
- **Customizable tones**: Professional, Casual, Enthusiastic, Luxury
- **Platform optimization**: Property24, Zillow, Rightmove, Facebook Marketplace
- **SEO-friendly content** with keyword integration
- **Length customization**: Short, Medium, Long descriptions

### 👥 CRM & Collaboration
- **Contact management** with lead tracking
- **WhatsApp integration** for client communication
- **Calendar functionality** for scheduling showings
- **Real-time collaboration** features
- **User presence indicators**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- OpenAI API key
- Hugging Face API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deklerkwayne101010-bit/Property-tool-vercel.git
   cd property-enhancer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   HF_API_KEY=your-huggingface-api-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, NextAuth.js
- **AI Services**: OpenAI GPT-4, Hugging Face
- **Canvas**: Fabric.js
- **Real-time**: Socket.io (framework ready)
- **Deployment**: Vercel

## 📁 Project Structure

```
property-enhancer-app/
├── src/
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   │   ├── auth/           # Authentication routes
│   │   │   ├── images/         # Image processing
│   │   │   └── property/       # Property description
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── editor/             # Canvas editor components
│   │   │   ├── CanvasEditor.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── AIEnhancementPanel.tsx
│   │   │   ├── TemplatePanel.tsx
│   │   │   ├── CollaborationPanel.tsx
│   │   │   └── CollaboratorCursors.tsx
│   │   └── property/           # Property components
│   │       └── PropertyDescriptionGenerator.tsx
│   ├── lib/
│   │   ├── mongodb.ts          # Database connection
│   │   ├── auth-middleware.ts  # Authentication middleware
│   │   └── collaboration-manager.ts # Real-time collaboration
│   └── models/                 # MongoDB schemas
│       ├── User.ts
│       ├── Property.ts
│       ├── Contact.ts
│       └── Event.ts
├── public/                     # Static assets
├── vercel.json                 # Vercel configuration
├── .env.example               # Environment variables template
└── README.md
```

## 🚀 Deployment to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/deklerkwayne101010-bit/Property-tool-vercel.git)

### Option 2: Manual Deployment

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   ```

3. **Configure Environment Variables**
   In your Vercel dashboard, add these environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `HF_API_KEY`: Your Hugging Face API key
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your Vercel app URL

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Property Management
- `POST /api/property/generate-description` - Generate AI descriptions

### Image Processing
- `POST /api/images/enhance` - AI image enhancement

## 🎯 Usage Guide

### Canva-Style Editor
1. **Upload Images**: Use the upload button or drag-and-drop
2. **Apply Filters**: Use the Filters tab for adjustments
3. **AI Enhancement**: Use the AI tab for intelligent processing
4. **Add Text/Shapes**: Use the Tools tab
5. **Export**: Choose your preferred format

### Property Description Generator
1. **Fill Property Details**: Enter basic property information
2. **Select Amenities**: Choose relevant features
3. **Choose Settings**: Pick tone, platform, and length
4. **Add Keywords**: Include SEO keywords
5. **Generate**: Click to create AI-powered description

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@propertyenhancer.com or join our Discord community.

## 🔄 Roadmap

- [ ] CRM dashboard with contact management
- [ ] WhatsApp integration
- [ ] Calendar functionality
- [ ] Mobile app version
- [ ] Advanced analytics
- [ ] Multi-language support

---

Built with ❤️ for real estate professionals
