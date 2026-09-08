# 1Fi Marketplace - Complete Mobile E-Commerce Platform

A full-stack mobile marketplace application built with React Native (Expo) and Express.js, featuring EMI-based purchasing with no-cost installment plans.

## 🎯 Project Overview

**1Fi Marketplace** is a production-ready mobile e-commerce platform that allows users to browse electronics products and purchase them using flexible No-Cost EMI plans backed by mutual funds. The application demonstrates modern mobile development practices and full-stack engineering capabilities.

### Key Features

✅ **Product Browsing**: Browse 8+ products across 6 categories (Smartphones, Laptops, TVs, Audio, Tablets, Wearables)  
✅ **Category Filtering**: Filter products by category with smooth animations  
✅ **Product Details**: View detailed product information, specifications, and images  
✅ **Variant Selection**: Choose product variants (Storage, Color, RAM, Size, etc.)  
✅ **EMI Plans**: Select from multiple EMI payment options (3, 6, 9, 12 months)  
✅ **Shopping Cart**: Add products to cart with selected variants and EMI plans  
✅ **User Authentication**: JWT-based secure authentication  
✅ **Order Management**: Create and track orders with delivery status  
✅ **Backend API**: RESTful API with PostgreSQL database  

## 🏗️ Tech Stack

### Frontend (Mobile App)
- **Framework**: Expo SDK 57.0.20
- **Language**: TypeScript 6.0.3
- **UI Framework**: React Native 0.86.3
- **Navigation**: Expo Router (file-based routing)
- **React**: 19.2.3
- **State Management**: React Hooks
- **Safe Area**: react-native-safe-area-context

### Backend (API)
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6.1
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs, CORS

## 📁 Project Structure

```
1fi2/
├── app/                              # Frontend - Expo Router screens
│   ├── (tabs)/                       # Tab navigation
│   │   ├── index.tsx                 # Home screen
│   │   ├── shop.tsx                  # Shop screen with marketplace
│   │   ├── portfolio.tsx             # Portfolio screen
│   │   ├── profile.tsx               # Profile screen
│   │   └── _layout.tsx               # Tab navigator layout
│   ├── marketplace/                  # Marketplace screens
│   │   ├── index.tsx                 # Product listing
│   │   └── product/[id].tsx          # Product details
│   └── _layout.tsx                   # Root layout
│
├── backend/                          # Backend API
│   ├── src/
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.ts               # Authentication endpoints
│   │   │   ├── products.ts           # Product endpoints
│   │   │   ├── cart.ts               # Cart endpoints
│   │   │   └── orders.ts             # Order endpoints
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.ts               # JWT authentication
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── server.ts                 # Express app setup
│   │   └── seed.ts                   # Database seeding
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── services/                         # Frontend services
│   ├── marketplaceService.ts         # Product service
│   └── apiService.ts                 # API client (new)
│
├── types/                            # TypeScript types
│   └── product.ts                    # Product interfaces
│
├── config/                           # Configuration (new)
│   └── api.ts                        # API configuration
│
├── contexts/                         # React contexts (new)
│   └── AuthContext.tsx               # Authentication context
│
├── assets/                           # Images and icons
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript config
├── app.json                          # Expo configuration
│
└── Documentation/
    ├── README.md                     # This file
    ├── QUICKSTART.md                 # Quick start guide
    ├── MARKETPLACE_IMPLEMENTATION.md # Frontend details
    ├── BACKEND_SETUP.md              # Backend setup guide
    └── FULL_STACK_INTEGRATION.md     # Integration guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed (or Docker)
- Expo Go app on mobile device
- npm or yarn package manager

### Setup (10 Minutes)

#### 1. Clone and Install

```bash
cd 1fi2
npm install
```

#### 2. Set Up Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# Edit .env with your PostgreSQL credentials

# Initialize database
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Start backend server
npm run dev
```

Backend will run on http://localhost:3000

#### 3. Start Frontend

```bash
# In project root
npm start
```

#### 4. Open on Device

1. Install **Expo Go** on your phone
2. Scan QR code from terminal
3. App opens with marketplace ready!

### Verification

- Backend health: http://localhost:3000/health
- Products API: http://localhost:3000/api/products
- Navigate to Shop → 1Fi Marketplace → Browse Products

## 📱 User Journey

```
App Launch
   ↓
Bottom Tabs (Home, Shop, Portfolio, Profile)
   ↓
Shop Tab → 1Fi Marketplace Section
   ↓
Browse All Products Button
   ↓
Marketplace Listing (Grid View)
   ↓ Filter by Category (Optional)
   ↓
Select Product Card
   ↓
Product Details Screen
   ↓
Select Variants (Storage, Color, etc.)
   ↓
Choose EMI Plan (3/6/9/12 months)
   ↓
Review Selection in Bottom Bar
   ↓
Continue to Cart
   ↓
Checkout & Create Order
   ↓
Order Confirmation
```

## 🔌 API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/meta/categories` - Get categories

### Protected Endpoints (Require JWT)

- `GET /api/auth/me` - Get current user
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `POST /api/orders/:id/cancel` - Cancel order

## 🎨 Design System

### Colors
- Primary: `#1E40AF` (Blue)
- Background: `#F9FAFB` (Light Gray)
- Success: `#10B981` (Green)
- Error: `#DC2626` (Red)

### Typography
- Headings: Semibold, 18-28px
- Body: Regular, 14px
- Captions: Regular, 12px

### Components
- Cards with subtle shadows
- Blue primary buttons
- Radio button selections
- Fixed bottom CTAs

## 🗄️ Database Schema

### Core Models

- **User**: Authentication and profile
- **Product**: Product catalog
- **ProductVariant**: Product options (Storage, Color, etc.)
- **EMIPlan**: Payment plans
- **Order**: Customer orders
- **OrderItem**: Order line items
- **CartItem**: Shopping cart

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@1fi.in","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### Frontend Tests

```bash
# Type checking
npx tsc --noEmit

# Expo diagnostics
npx expo-doctor
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed backend setup
- **[FULL_STACK_INTEGRATION.md](./FULL_STACK_INTEGRATION.md)** - Connect frontend to backend
- **[MARKETPLACE_IMPLEMENTATION.md](./MARKETPLACE_IMPLEMENTATION.md)** - Frontend architecture
- **[backend/README.md](./backend/README.md)** - Backend API documentation

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)

## 🚀 Deployment

### Backend Deployment

**Recommended Platforms:**
- Railway (easiest)
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean

**Database:**
- Railway Postgres
- Heroku Postgres
- AWS RDS
- Supabase

### Frontend Deployment

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit
```

## 📈 Roadmap

### Phase 1 (Current) ✅
- Product browsing and filtering
- Product details with variants
- EMI plan selection
- Backend API with database
- Authentication system
- Shopping cart functionality
- Order management

### Phase 2 (Next)
- [ ] Search functionality
- [ ] Wishlist/favorites
- [ ] Product reviews and ratings
- [ ] User profile management
- [ ] Order tracking with notifications
- [ ] Payment gateway integration

### Phase 3 (Future)
- [ ] Top Brands section
- [ ] Nearby Stores with geolocation
- [ ] AR product preview
- [ ] Video product demos
- [ ] Live chat support
- [ ] Recommendation engine
- [ ] Multi-language support

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
npx prisma studio  # Test connection
```

**Port 3000 in use:**
```bash
# Change PORT in .env or kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend Issues

**Metro bundler error:**
```bash
npx expo start --clear
```

**Products not loading:**
- Check backend is running
- Verify IP address in config/api.ts
- Ensure phone and computer on same WiFi

## 🤝 Contributing

This is an assignment project for 1Fi/Fiquity Technology Private Limited.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Developer

Built as an SDE Intern assignment demonstrating:
- Full-stack mobile development
- React Native expertise
- Backend API development
- Database design
- Authentication systems
- E-commerce workflows
- Production-ready code quality

## 📞 Support

For questions and issues:
1. Check documentation files
2. Review API documentation
3. Test with provided curl commands
4. Verify environment configuration

## 🎉 Acknowledgments

- Built with Expo SDK 57
- UI inspired by 1Fi fintech design language
- Sample products use Unsplash images
- PostgreSQL for reliable data storage
- Prisma for type-safe database access

---


For detailed setup instructions, see [BACKEND_SETUP.md](./BACKEND_SETUP.md) and [FULL_STACK_INTEGRATION.md](./FULL_STACK_INTEGRATION.md).
