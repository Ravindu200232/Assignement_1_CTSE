<h1 align="center">🍔 Food Ordering Application</h1>

<p align="center">
  <strong>Cloud-Native Microservices Architecture | SLIIT SE4010 CTSE Assignment</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-ECS%20Fargate-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/SonarCloud-SAST-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white" />
  <img src="https://img.shields.io/badge/Snyk-Security-4C4A73?style=for-the-badge&logo=snyk&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/Jest-Unit%20Tests-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Microservices](#-microservices)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation (Swagger)](#-api-documentation-swagger)
- [API Endpoints Reference](#-api-endpoints-reference)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Docker & AWS Deployment](#-docker--aws-deployment)
- [Unit Testing](#-unit-testing)
- [Code Quality (SonarCloud)](#-code-quality-sonarcloud)
- [Security](#-security)
- [Roles](#-roles)

---

## 🌟 Project Overview

A fully cloud-native **Food Ordering Application** built using a **microservices architecture** deployed on **AWS ECS Fargate**. Each business domain is isolated into its own independently deployable Node.js/Express service, containerised with Docker, and published to AWS ECR through an automated GitHub Actions CI/CD pipeline.

### Key Features

- 🔐 **JWT Authentication** — Secure token-based auth across all services
- 📧 **Email Notifications** — OTP verification + order confirmation via Nodemailer
- 💳 **Secure Payments** — Card data encrypted with bcrypt before storage
- 📍 **Real-Time Delivery Tracking** — Live lat/lng location updates
- 🏪 **Restaurant Management** — Owner verification, open/close control
- 📊 **Admin Dashboard Support** — Role-based access across all endpoints
- 🧪 **Unit Tested** — Jest tests with LCOV coverage reporting
- 🔒 **DevSecOps** — Snyk + SonarCloud integrated in every pipeline run
- 📖 **Interactive API Docs** — Swagger UI live on every deployed service

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                               │
│                    http://[CLIENT_URL]                              │
└──────────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
           │          │          │          │          │
           ▼          ▼          ▼          ▼          ▼
┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│ user-service │ │restaurant│ │  order  │ │payment  │ │deliver-svc   │
│   :3001      │ │  :3002   │ │  :3003  │ │  :3004  │ │    :3005     │
│  JWT / OTP   │ │Listings  │ │ Orders  │ │ bcrypt  │ │Driver+Deliv. │
└──────┬───────┘ └────┬─────┘ └────┬────┘ └────┬────┘ └──────┬───────┘
       │              │            │            │             │
       └──────────────┴────────────┴────────────┴─────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   notification-server     │
                    │         :3006             │
                    │   Nodemailer / SMTP        │
                    └──────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐        ┌──────────┐        ┌──────────┐
        │ MongoDB  │        │  AWS ECR │        │AWS ECS   │
        │ Atlas /  │        │(Registry)│        │ Fargate  │
        │ Docker   │        └──────────┘        └──────────┘
        └──────────┘

CI/CD Flow:
  GitHub Push → GitHub Actions → Snyk Scan → Jest Tests → SonarCloud
             → Docker Build → ECR Push → ECS Task Update → ECS Deploy
```

---

## 🔧 Microservices

| # | Service | Port | Responsibility | Key Models |
|---|---------|------|----------------|------------|
| 1 | **user-service** | `3001` | User registration, login, JWT auth, OTP email verification, inquiry management | `User`, `OTP`, `Driver`, `Inquiry` |
| 2 | **restaurant-service** | `3002` | Restaurant CRUD, owner verification, open/close status, food collection | `Restaurant`, `Collection`, `Review` |
| 3 | **order-service** | `3003` | Order placement, quote calculation, status tracking, admin approval | `Order`, `Collection` |
| 4 | **payment-service** | `3004` | Secure card payment processing, bcrypt-encrypted card data storage | `Payment` |
| 5 | **deliver-service** | `3005` | Driver registration/login, delivery assignment, real-time GPS tracking | `Driver`, `Delivery` |
| 6 | **notification-server** | `3006` | Email notifications to driver, customer, and restaurant via Nodemailer | — |

### Inter-Service Communication

```
payment-service  ──PUT──►  order-service /api/v1/orders/status/:id   (mark order paid)
deliver-service  ──PUT──►  order-service /api/v1/orders/status/:id   (sync delivery status)
notification     ──GET──►  restaurant-service /:id                   (fetch restaurant info)
```

All inter-service calls use HTTP with `axios`. Services discover each other via environment variables (e.g. `ORDER_SERVICE_URL`, `RESTAURANT_SERVICE_URL`).

---

## 🛠️ Tech Stack

### Backend
| Category | Technology |
|----------|-----------|
| Runtime | Node.js 20 |
| Framework | Express.js 4.x |
| Database | MongoDB with Mongoose ODM |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcrypt` / `bcryptjs` |
| Email | Nodemailer (Gmail SMTP) |
| HTTP Client | Axios |
| API Docs | swagger-jsdoc + swagger-ui-express (OpenAPI 3.0) |

### DevOps & Cloud
| Category | Technology |
|----------|-----------|
| Containerisation | Docker (multi-stage Alpine builds) |
| Container Registry | AWS ECR |
| Orchestration | AWS ECS Fargate (serverless) |
| CI/CD | GitHub Actions (7 workflow files) |
| Security Scanning | Snyk (dependency CVEs) |
| Code Quality / SAST | SonarCloud |
| AWS Region | `eu-north-1` (Stockholm) |

### Testing & Quality
| Category | Technology |
|----------|-----------|
| Test Framework | Jest 29 |
| ESM Transformer | babel-jest + @babel/preset-env |
| Coverage Format | LCOV (uploaded to SonarCloud) |
| Mocking | `jest.mock()` with `__esModule: true` |
| Code Quality Platform | SonarCloud (org: `ravindu200232`) |

---

## 📁 Project Structure

```
food-ordering-app/
├── .github/
│   └── workflows/
│       ├── user-service.yml          # CI/CD: security scan → build → deploy
│       ├── restaurant-service.yml
│       ├── order-service.yml
│       ├── payment-service.yml
│       ├── deliver-service.yml
│       ├── notification-service.yml
│       └── client.yml
│
├── server/
│   ├── user-service/
│   │   ├── controllers/
│   │   │   ├── authController.js     # Role helpers: checkAdmin, checkCustomer…
│   │   │   ├── userController.js     # createUser, userLogin, getUsers…
│   │   │   └── InquiryController.js  # addInquiry, getInquiry, deleteInquiry…
│   │   ├── models/
│   │   │   ├── users.js
│   │   │   ├── otp.js
│   │   │   ├── driver.js
│   │   │   └── inquiry.js
│   │   ├── routes/
│   │   │   ├── userRoute.js          # Express routes with @swagger annotations
│   │   │   └── inquiryRouter.js
│   │   ├── __tests__/
│   │   │   ├── authController.test.js
│   │   │   ├── userController.test.js
│   │   │   └── inquiryController.test.js
│   │   ├── Server.js                 # Express entry point + Swagger setup
│   │   ├── Dockerfile                # Multi-stage build
│   │   ├── package.json              # Dependencies + Jest config
│   │   ├── babel.config.cjs          # Babel for ESM→CJS in Jest
│   │   └── sonar-project.properties  # SonarCloud project config
│   │
│   ├── Restaurant-service/           # Same internal structure
│   ├── order-service/                # Same internal structure
│   ├── payment-service/              # Same internal structure
│   ├── deliver-service/              # Same internal structure
│   └── notification-server/          # Same internal structure
│
├── client/                           # React frontend application
├── docker-compose.yml                # Local dev — all services together
├── .env.example                      # Environment variable documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node --version    # >= 20
docker --version  # >= 24
```

### Option A — Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone [YOUR_GITHUB_REPO_URL]
cd food-ordering-app

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gmail credentials

# 3. Start all 6 services + client
docker-compose up --build
```

| Service | Local URL |
|---------|-----------|
| User Service | http://localhost:3001 |
| Restaurant Service | http://localhost:3002 |
| Order Service | http://localhost:3003 |
| Payment Service | http://localhost:3004 |
| Deliver Service | http://localhost:3005 |
| Notification Service | http://localhost:3006 |

### Option B — Run a Single Service

```bash
cd server/user-service
npm install
npm start           # nodemon Server.js
```

### Option C — Run All Services Locally (No Docker)

```bash
# Install dependencies for all services
for dir in server/*/; do
  echo "Installing $dir..."
  (cd "$dir" && npm install)
done

# Start each service in a separate terminal
cd server/user-service        && npm start
cd server/Restaurant-service  && npm start
cd server/order-service       && npm start
cd server/payment-service     && npm start
cd server/deliver-service     && npm start
cd server/notification-server && npm start
```

---

## 🔑 Environment Variables

| Variable | Services | Description |
|----------|----------|-------------|
| `MONGO_URL` | All | MongoDB Atlas connection string |
| `PORT` | All | Port the service listens on |
| `SEKRET_KEY` | user, deliver, order, payment | JWT signing secret |
| `SERVER_URL` | All | Public base URL for Swagger "Try it out" |
| `ORDER_SERVICE_URL` | payment, deliver | Base URL of order-service |
| `RESTAURANT_SERVICE_URL` | notification | Base URL of restaurant-service |
| `GMAIL_USER` | user, notification | Gmail address for Nodemailer |
| `GMAIL_PASS` | user, notification | Gmail app password |

**Example — user-service `.env`:**
```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/foodapp
PORT=3001
SEKRET_KEY=your_super_secret_jwt_key_here
SERVER_URL=http://13.61.23.48:3001
GMAIL_USER=yourapp@gmail.com
GMAIL_PASS=xxxx xxxx xxxx xxxx
```

---

## 📖 API Documentation (Swagger)

Every service exposes an interactive Swagger UI built with **swagger-jsdoc** + **swagger-ui-express** using OpenAPI 3.0 annotations on all route files.

| Service | Live Swagger UI |
|---------|----------------|
| User Service | http://13.61.23.48:3001/api-docs |
| Restaurant Service | http://13.60.193.57:3002/api-docs |
| Order Service | http://13.61.5.15:3003/api-docs |
| Payment Service | http://13.61.23.48:3004/api-docs |
| Deliver Service | http://13.60.62.20:3005/api-docs |
| Notification Service | http://13.60.62.20:3006/api-docs |

> 💡 Raw JSON spec available at `/api-docs.json` on each service — import directly into Postman.

**Authentication in Swagger:** Click **Authorize** and enter your JWT as `Bearer <token>`.

---

## 📡 API Endpoints Reference

### 👤 User Service — `:3001`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/users/register` | Public | Register a new user account |
| `POST` | `/api/v1/users/login` | Public | Login and receive JWT token |
| `GET` | `/api/v1/users/` | 🔐 Admin | Get all users |
| `GET` | `/api/v1/users/:id` | 🔐 Any | Get user by ID |
| `PUT` | `/api/v1/users/:id` | 🔐 Any | Update user profile |
| `DELETE` | `/api/v1/users/:id` | 🔐 Any | Delete user account |
| `POST` | `/api/v1/users/change-password/:id` | 🔐 Any | Change password |
| `POST` | `/api/v1/users/send-otp` | 🔐 Any | Send OTP verification email |
| `POST` | `/api/v1/users/verify-otp` | 🔐 Any | Verify OTP and activate account |
| `GET` | `/api/v1/inquiry/` | 🔐 Any | Get inquiries (role-filtered) |
| `POST` | `/api/v1/inquiry/` | 🔐 Any | Submit a new inquiry |
| `DELETE` | `/api/v1/inquiry/:id` | 🔐 Admin/Owner | Delete inquiry |
| `PUT` | `/api/v1/inquiry/:id` | 🔐 Admin/Owner | Update inquiry |

### 🏪 Restaurant Service — `:3002`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/restaurants/` | 🔐 Restaurant | Create a restaurant listing |
| `GET` | `/api/v1/restaurants/` | Public/🔐 | Get restaurants (role-filtered) |
| `PUT` | `/api/v1/restaurants/:id` | 🔐 Admin/Owner | Update restaurant details |
| `DELETE` | `/api/v1/restaurants/:id` | 🔐 Admin/Owner | Delete restaurant |
| `PUT` | `/api/v1/restaurants/open/:id` | 🔐 Admin/Owner | Mark restaurant as open |
| `PUT` | `/api/v1/restaurants/close/:id` | 🔐 Admin/Owner | Mark restaurant as closed |
| `PUT` | `/api/v1/restaurants/verify/:id` | 🔐 Admin | Verify restaurant (admin only) |
| `GET` | `/api/v1/restaurants/:id` | Public | Get single restaurant by ID |

### 🛒 Order Service — `:3003`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/orders/` | 🔐 Customer | Place a new food order |
| `GET` | `/api/v1/orders/` | 🔐 Any | Get orders (role-filtered) |
| `DELETE` | `/api/v1/orders/:id` | 🔐 Admin/Owner | Delete order |
| `POST` | `/api/v1/orders/quote` | Public | Calculate order total before placing |
| `PUT` | `/api/v1/orders/status/:id` | 🔐 Any | Update order / payment status |
| `PUT` | `/api/v1/orders/approve/:id` | 🔐 Admin | Approve order |

### 💳 Payment Service — `:3004`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/payments/` | 🔐 Any | Process card payment (card data bcrypt-hashed) |
| `GET` | `/api/v1/payments/` | 🔐 Admin | Get all payments (sensitive fields excluded) |

### 🚗 Deliver Service — `:3005`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/drivers/` | Public | Register a new delivery driver |
| `POST` | `/api/v1/drivers/login` | Public | Driver login — returns JWT |
| `GET` | `/api/v1/drivers/` | 🔐 Any | Get drivers (role-filtered) |
| `PUT` | `/api/v1/drivers/:id` | 🔐 Admin/Driver | Update driver profile |
| `DELETE` | `/api/v1/drivers/:id` | 🔐 Admin/Driver | Delete driver account |
| `POST` | `/api/v1/deliveries/` | 🔐 Any | Create a delivery record |
| `GET` | `/api/v1/deliveries/` | 🔐 Any | Get deliveries (role-filtered) |
| `PUT` | `/api/v1/deliveries/location/:id` | 🔐 Driver | Update real-time GPS location (lat/lng) |
| `PUT` | `/api/v1/deliveries/status/:id` | 🔐 Driver | Update delivery status |
| `GET` | `/api/v1/deliveries/location/:id` | 🔐 Any | Get current delivery location |

### 📧 Notification Service — `:3006`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/notifications/send` | 🔐 Any | Send order emails to driver and customer |

---

## ⚙️ CI/CD Pipeline

Each microservice has a dedicated GitHub Actions workflow triggered by push and pull request events.

```
┌─────────────────────────────────────────────┐
│  Trigger: push to main  /  pull_request      │
└─────────────────────────────────────────────┘
                      │
          ┌───────────▼────────────┐
          │   Job 1: security-scan  │  ← ALL triggers
          │                         │
          │  1. npm install         │
          │  2. Snyk scan (CVEs)    │
          │  3. Jest tests + LCOV   │
          │  4. SonarCloud SAST     │
          └───────────┬────────────┘
                      │ push to main only
          ┌───────────▼────────────┐
          │  Job 2: build-and-push  │
          │                         │
          │  1. AWS credentials     │
          │  2. ECR login           │
          │  3. docker build        │
          │  4. docker push (ECR)   │
          └───────────┬────────────┘
                      │
          ┌───────────▼────────────┐
          │    Job 3: deploy        │
          │                         │
          │  1. Fetch ECS task def  │
          │  2. Update image URI    │
          │  3. ECS Fargate deploy  │
          └────────────────────────┘
```

### Workflow Files

| File | Service | Path Trigger |
|------|---------|--------------|
| `user-service.yml` | user-service | `server/user-service/**` |
| `restaurant-service.yml` | restaurant-service | `server/Restaurant-service/**` |
| `order-service.yml` | order-service | `server/order-service/**` |
| `payment-service.yml` | payment-service | `server/payment-service/**` |
| `deliver-service.yml` | deliver-service | `server/deliver-service/**` |
| `notification-service.yml` | notification-server | `server/notification-server/**` |
| `client.yml` | React client | `client/**` |

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | AWS IAM authentication |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM authentication |
| `SNYK_TOKEN` | Snyk dependency vulnerability scanning |
| `SONAR_TOKEN` | SonarCloud code quality analysis |

---

## 🐳 Docker & AWS Deployment

### Dockerfile — Multi-Stage Build

```dockerfile
# Stage 1: Install production dependencies only
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2: Lean, secure production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "Server.js"]
```

### Container Security Practices

| Practice | Benefit |
|----------|---------|
| `node:20-alpine` base | ~5 MB vs ~900 MB — minimal attack surface |
| `--only=production` deps | devDependencies (Jest, Babel) excluded |
| Non-root `appuser` | Prevents container privilege escalation |
| `HEALTHCHECK` | ECS auto-restarts unhealthy containers |
| Multi-stage build | Build tools absent from final image |

### AWS Infrastructure

```
Region: eu-north-1 (Stockholm)

ECS Cluster: food-ordering-cluster (Fargate — serverless)
│
├── user-service        EC2: 13.61.23.48   ECR: food-ordering/user-service
├── restaurant-service  EC2: 13.60.193.57  ECR: food-ordering/restaurant-service
├── order-service       EC2: 13.61.5.15    ECR: food-ordering/order-service
├── payment-service     EC2: 13.61.23.48   ECR: food-ordering/payment-service
├── deliver-service     EC2: 13.60.62.20   ECR: food-ordering/delivery-service
└── notification-server EC2: 13.60.62.20   ECR: food-ordering/notification-service
```

---

## 🧪 Unit Testing

All six services include Jest unit tests with complete mock isolation from databases and external services.

### Run Tests

```bash
# Single service — with coverage
cd server/user-service
npm test -- --coverage

# All services at once
for dir in server/*/; do
  echo "=== $dir ==="
  (cd "$dir" && npm test -- --coverage 2>/dev/null)
done
```

### Test Coverage Per Service

| Service | Test Files | Tests | Coverage Target |
|---------|-----------|-------|----------------|
| user-service | 3 | 37 | Controllers + Auth |
| restaurant-service | 1 | 19 | CRUD + Status |
| order-service | 1 | 15 | Orders + Quotes |
| payment-service | 1 | 8 | Payment + Admin |
| deliver-service | 2 | 21 | Drivers + Deliveries |
| notification-server | 1 | 6 | Email sending |

### Mock Strategy

**ESM modules** require `__esModule: true` in jest.mock for Babel compatibility:

```javascript
jest.mock('../models/users.js', () => {
  const MockUser = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'user123',
    save: jest.fn().mockResolvedValue({ _id: 'user123', ...data }),
  }));
  MockUser.findOne   = jest.fn();
  MockUser.find      = jest.fn();
  MockUser.updateOne = jest.fn();
  MockUser.deleteOne = jest.fn();
  return { __esModule: true, default: MockUser }; // ← required for Babel
});
```

**Chained Mongoose calls** (`.find().sort().limit()`) require nested mock chains:

```javascript
Order.find.mockReturnValue({
  sort: jest.fn().mockReturnValue({
    limit: jest.fn().mockResolvedValue([{ orderId: 'ORD0000' }]),
  }),
});
```

### Babel Config for Jest

All services use `"type": "module"`. Babel transforms ESM → CommonJS for Jest:

```javascript
// babel.config.cjs
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
```

---

## 📊 Code Quality (SonarCloud)

Continuous code quality and security analysis via **SonarCloud**, triggered on every pipeline run.

**Organisation:** [`ravindu200232`](https://sonarcloud.io/organizations/ravindu200232)

| Service | SonarCloud Project |
|---------|-------------------|
| user-service | [ravindu200232_food-ordering-user-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-user-service) |
| restaurant-service | [ravindu200232_food-ordering-restaurant-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-restaurant-service) |
| order-service | [ravindu200232_food-ordering-order-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-order-service) |
| payment-service | [ravindu200232_food-ordering-payment-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-payment-service) |
| deliver-service | [ravindu200232_food-ordering-deliver-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-deliver-service) |
| notification-server | [ravindu200232_food-ordering-notification-service](https://sonarcloud.io/project/overview?id=ravindu200232_food-ordering-notification-service) |

**Metrics tracked per service:**
- 🐛 Bugs — logic errors from static analysis
- 🔒 Vulnerabilities — security weaknesses in source code
- 🔥 Security Hotspots — manual review candidates
- 🧹 Code Smells — maintainability issues
- 📈 Coverage — % lines executed during Jest tests (LCOV)
- 🔁 Duplications — copy-paste code detection

---

## 🔒 Security

### Authentication & Authorisation

- **JWT Bearer tokens** signed with `SEKRET_KEY` — passed as `Authorization: Bearer <token>`
- **Role-based access control** via `authController.js` helper functions:

```javascript
checkAdmin(req)       // role === 'admin'
checkRestaurant(req)  // role === 'restaurant'
checkCustomer(req)    // role === 'customer'
checkDelivery(req)    // role === 'delivery'
checkHasAccount(req)  // any authenticated user (req.user != null)
```

### Payment Security

- `cardNumber`, `expiry`, and `cvv` **hashed with bcrypt** (10 salt rounds) before saving to MongoDB
- `GET /api/v1/payments/` uses `.select('-cardNumber -expiry -cvv')` — sensitive fields never returned
- Notifications to order-service on payment success via axios (non-blocking)

### Dependency Security

- **Snyk CLI** runs `snyk test --severity-threshold=high` on every pipeline run
- High and critical CVEs are flagged in GitHub Actions logs

### Container Security

- All containers run as **non-root user** (`appuser`)
- **Alpine Linux** base — minimal OS footprint
- Only **production npm dependencies** in the final image

---

## 👥 Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `admin` | Platform administrator | Full access to all resources across all services |
| `restaurant` | Restaurant owner | Manage own restaurant, view own orders, see available drivers |
| `customer` | End user | Place orders, make payments, view own inquiries and deliveries |
| `delivery` | Delivery driver | Accept deliveries, update GPS location and status |
| *(public)* | Unauthenticated | View verified restaurants, calculate order quotes |

---

<p align="center">
  Made with ❤️ for the<br/>
  <strong>SLIIT — Department of Computer Science & Software Engineering</strong><br/>
  SE4010 — Current Trends in Software Engineering (CTSE) — 2026
</p>
