# ?? SecureBank

A full-stack Online Banking System built with **Spring Boot 4.0.0** and **React TypeScript**, publicly deployed for production use.

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | _To be added after deployment_ |
| **Backend API** | _To be added after deployment_ |
| **Swagger UI** | _To be added after deployment_ |

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 4.0.0** (Spring Framework 7)
- **Spring Security** + **JWT** (Stateless authentication)
- **Spring Data JPA** + **Hibernate** (ORM)
- **MySQL** (Production database)
- **Bean Validation** (Input validation)
- **Global Exception Handling** (@ControllerAdvice)
- **OpenAPI / Swagger UI** (API documentation)
- **Spring Boot Actuator** (Health monitoring)

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **React Router v6** (Client-side routing)
- **Axios** (HTTP client with interceptors)
- **Custom CSS** (Professional banking UI)

### Infrastructure
- **Vercel** (Frontend hosting)
- **Railway** (Backend hosting — Nixpacks auto-build)
- **Aiven** (Managed MySQL 8 database)
- **GitHub** (Version control)

## Features

### Customer Features
- User registration (auto-creates bank account with initial balance)
- JWT-based secure login
- Customer dashboard with account overview
- Bank account management (account number, balance)
- Balance enquiry
- Beneficiary management (add, list, delete)
- Fund transfer with real-time balance update
- Transaction history

### Admin Features
- Admin dashboard
- View all customers
- Full audit log viewer

### Security
- BCrypt password hashing
- JWT token authentication (24h expiry)
- Role-based authorization (CUSTOMER, ADMIN)
- CORS configured for production frontend URL
- No hardcoded credentials — all via environment variables

## Architecture

```
React (Vercel)
     ?
Axios (JWT interceptor)
     ?
Spring Boot REST API (Railway)
     ?
Spring Security + JWT Filter
     ?
Controller ? Service ? Repository
     ?
Hibernate / JPA
     ?
MySQL (Aiven)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | None | Register new customer |
| POST | /api/auth/login | None | Login, receive JWT |
| GET | /api/accounts/my | Bearer | Get own bank account |
| GET | /api/beneficiaries | Bearer | List beneficiaries |
| POST | /api/beneficiaries | Bearer | Add beneficiary |
| DELETE | /api/beneficiaries/{id} | Bearer | Remove beneficiary |
| POST | /api/transactions/transfer | Bearer | Fund transfer |
| GET | /api/transactions/my | Bearer | Transaction history |
| GET | /api/admin/users | ADMIN | All users |
| GET | /api/admin/audit-logs | ADMIN | All audit logs |
| GET | /actuator/health | None | Health check |
| GET | /swagger-ui.html | None | Swagger API docs |

## Database Schema

```
users               ? id, username, email, password, role, enabled, created_at
bank_accounts       ? id, account_number, user_id (FK), balance, account_type, created_at
beneficiaries       ? id, owner_user_id (FK), beneficiary_name, account_number, bank_name, created_at
transactions        ? id, sender_account_id (FK), receiver_account_number, type, amount, description, balance_after, created_at
audit_logs          ? id, user_id, username, action, entity_type, entity_id, details, ip_address, created_at
```

## Local Development

### Prerequisites
- Java 17+, Maven 3.9+, Node.js 20+, MySQL 8

### Backend
```bash
cd backend

# Create local database
mysql -u root -p -e "CREATE DATABASE banking_db;"

# Run (uses application.properties defaults)
mvn spring-boot:run

# Swagger UI ? http://localhost:8080/swagger-ui.html
```

### Frontend
```bash
cd frontend
npm install

# Create local env file
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local

npm run dev
# App ? http://localhost:5173
```

### Create Admin User (after first run)
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
```

## Production Environment Variables

### Railway (Backend)
| Variable | Description |
|----------|-------------|
| DATABASE_HOST | Aiven MySQL hostname |
| DATABASE_PORT | 3306 |
| DATABASE_NAME | Database name |
| DATABASE_USERNAME | DB username |
| DATABASE_PASSWORD | DB password |
| JWT_SECRET | Random secret (min 32 chars) |
| FRONTEND_URL | Vercel frontend URL (CORS) |
| SPRING_PROFILES_ACTIVE | prod |

### Vercel (Frontend)
| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Railway backend URL |

## Project Structure

```
securebank/
+-- backend/                        # Spring Boot 4.0.0
¦   +-- src/main/java/com/banking/
¦   ¦   +-- config/                 # Security, OpenAPI
¦   ¦   +-- controller/             # REST endpoints
¦   ¦   +-- dto/                    # Request & Response DTOs
¦   ¦   +-- entity/                 # JPA entities
¦   ¦   +-- enums/                  # Role, TransactionType, AccountType
¦   ¦   +-- exception/              # Global exception handling
¦   ¦   +-- repository/             # Spring Data JPA repos
¦   ¦   +-- security/               # JWT filter & provider
¦   ¦   +-- service/                # Business logic
¦   +-- src/test/                   # JUnit 5 + Mockito tests
+-- frontend/                       # React 18 + TypeScript + Vite
    +-- src/
    ¦   +-- pages/                  # All page components
    ¦   +-- components/             # Navbar, ProtectedRoute, Spinner
    ¦   +-- context/                # Auth context (JWT)
    ¦   +-- api/                    # Axios instance
    ¦   +-- types/                  # TypeScript interfaces
    +-- public/_redirects           # SPA routing fix for Vercel
```

## Security Notes
- Passwords are BCrypt hashed
- JWT tokens expire in 24 hours
- All secrets via environment variables
- `.env` and `application-prod.properties` excluded from Git
- CORS only allows configured frontend URL

---

Built with ?? for portfolio & interview demonstration.
