# 1Fi Marketplace Backend API

A RESTful API backend for the 1Fi Marketplace mobile application, built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based user authentication with secure password hashing
- **Product Management**: Browse products with filtering, search, and category support
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create orders with EMI plans and track order status
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Validation**: Input validation using express-validator
- **Security**: CORS protection, password hashing with bcrypt, JWT tokens

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **npm** or **yarn**: Package manager

## 🛠️ Installation

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file by copying the example:

```bash
copy .env.example .env
```

**For Windows CMD:**
```cmd
copy .env.example .env
```

Edit `.env` and configure your settings:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/onefi_marketplace?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS (Update with your Expo development URLs)
ALLOWED_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

### 4. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)

```bash
docker run --name onefi-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=onefi_marketplace -p 5432:5432 -d postgres:14
```

#### Option B: Local PostgreSQL Installation

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a new database:

```sql
CREATE DATABASE onefi_marketplace;
```

### 5. Run Database Migrations

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Seed the Database

Populate the database with sample products:

```bash
npm run seed
```

This will create 8 products matching the frontend mock data.

### 7. Start the Development Server

```bash
npm run dev
```

The API will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── products.ts       # Product endpoints
│   │   ├── cart.ts           # Shopping cart endpoints
│   │   └── orders.ts         # Order management endpoints
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication middleware
│   │   └── errorHandler.ts  # Global error handling
│   ├── server.ts             # Express app configuration
│   └── seed.ts               # Database seeding script
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🔌 API Endpoints

### Health Check

```
GET /health
```

Returns API health status.

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210" (optional)
}

Response: { user, token }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { user, token }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

### Products

#### Get All Products
```
GET /api/products
Query Parameters:
  - category: Filter by category (optional)
  - search: Search in name, brand, description (optional)

Response: { products: [...] }
```

#### Get Product by ID
```
GET /api/products/:id

Response: { product: {...} }
```

#### Get Categories
```
GET /api/products/meta/categories

Response: { categories: [...] }
```

### Shopping Cart (Protected Routes)

#### Get Cart
```
GET /api/cart
Authorization: Bearer <token>

Response: { cartItems: [...] }
```

#### Add to Cart
```
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",
  "selectedVariants": {
    "Storage": "variant-id",
    "Color": "variant-id"
  },
  "emiPlanId": "uuid" (optional),
  "quantity": 1
}

Response: { message, cartItem }
```

#### Update Cart Item
```
PUT /api/cart/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2,
  "selectedVariants": {...},
  "emiPlanId": "uuid"
}

Response: { message, cartItem }
```

#### Remove from Cart
```
DELETE /api/cart/:id
Authorization: Bearer <token>

Response: { message }
```

#### Clear Cart
```
DELETE /api/cart
Authorization: Bearer <token>

Response: { message }
```

### Orders (Protected Routes)

#### Get All Orders
```
GET /api/orders
Authorization: Bearer <token>

Response: { orders: [...] }
```

#### Get Order by ID
```
GET /api/orders/:id
Authorization: Bearer <token>

Response: { order: {...} }
```

#### Create Order from Cart
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}

Response: { message, order }
```

#### Cancel Order
```
POST /api/orders/:id/cancel
Authorization: Bearer <token>

Response: { message, order }
```

## 🗄️ Database Schema

### Models

- **User**: User accounts with authentication
- **Product**: Product catalog with pricing and details
- **ProductVariant**: Product variations (Storage, Color, etc.)
- **EMIPlan**: EMI payment plans for products
- **Order**: Customer orders
- **OrderItem**: Individual items in orders
- **CartItem**: Shopping cart items

See `prisma/schema.prisma` for detailed schema.

## 🧪 Testing the API

### Using curl

#### Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
```

#### Get products:
```bash
curl http://localhost:3000/api/products
```

#### Get products by category:
```bash
curl "http://localhost:3000/api/products?category=Smartphones"
```

### Using Postman or Insomnia

1. Import the API endpoints
2. Set base URL to `http://localhost:3000`
3. For protected routes, add Authorization header: `Bearer <your-token>`

## 📦 Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production server
npm start

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database with sample data
npm run seed
```

## 🔧 Database Management

### View Database in Browser

```bash
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555` where you can view and edit data.

### Reset Database

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run seed script (if configured)

### Create New Migration

```bash
npx prisma migrate dev --name your-migration-name
```

## 🔐 Security Best Practices

### For Production:

1. **Change JWT Secret**: Use a strong, random secret key
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Use HTTPS**: Configure SSL/TLS certificates

3. **Environment Variables**: Never commit `.env` file to version control

4. **Password Policy**: Enforce strong passwords on the client side

5. **Rate Limiting**: Add rate limiting middleware (e.g., express-rate-limit)

6. **Input Validation**: Already implemented with express-validator

7. **CORS**: Configure ALLOWED_ORIGINS to specific domains only

## 🚀 Deployment

### Prepare for Production

1. Set `NODE_ENV=production` in `.env`
2. Use a production PostgreSQL database (e.g., AWS RDS, Heroku Postgres)
3. Build the TypeScript code: `npm run build`
4. Start with: `npm start`

### Deploy to Heroku

```bash
heroku create onefi-marketplace-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
git push heroku main
heroku run npm run prisma:migrate
heroku run npm run seed
```

### Deploy to Railway

1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Set environment variables in Railway dashboard
4. Railway auto-deploys on push

### Deploy to AWS

Use AWS Elastic Beanstalk with RDS PostgreSQL or ECS with Fargate.

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Verify firewall settings
4. Test connection: `npx prisma db pull`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
Change PORT in `.env` or kill the process using port 3000:

Windows:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill
```

### Migration Errors

**Error**: `Migration failed`

**Solution**:
```bash
npx prisma migrate reset
npm run prisma:generate
npm run seed
```

### JWT Token Errors

**Error**: `Invalid or expired token`

**Solution**:
1. Ensure JWT_SECRET matches between registration and validation
2. Check token expiration (default: 7 days)
3. Re-login to get a fresh token

## 🧩 Integration with Frontend

### Update Frontend Service

Replace mock data in `services/marketplaceService.ts`:

```typescript
const API_URL = 'http://localhost:3000/api';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.products;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  return data.product;
}
```

### Authentication Flow

```typescript
// Store token after login
import AsyncStorage from '@react-native-async-storage/async-storage';

async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  await AsyncStorage.setItem('authToken', data.token);
  return data;
}

// Use token in requests
async function getCart() {
  const token = await AsyncStorage.getItem('authToken');
  const response = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://jwt.io/introduction)

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions:
1. Check existing documentation
2. Review error logs in console
3. Check database connection with `npx prisma studio`
4. Verify environment variables in `.env`

---

**Happy Coding! 🚀**
