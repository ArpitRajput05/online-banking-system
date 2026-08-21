# Online Banking System

A full-stack Online Banking System built with Spring Boot 4.x and React TypeScript, deployed publicly.

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | _URL to be added after deployment_ |
| **Backend API** | _URL to be added after deployment_ |
| **Swagger UI** | _URL to be added after deployment_ |

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4.x** (Spring Framework 7)
- **Spring Security** + **JWT** (Stateless authentication)
- **Spring Data JPA** + **Hibernate** (ORM)
- **MySQL** (Production database on Aiven)
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
- **Railway** (Backend hosting, Nixpacks auto-build)
- **Aiven** (Managed MySQL 8 database)
- **GitHub** (Version control)

## Features

### Customer Features
- ? User registration (auto-creates bank account with initial balance)
- ? JWT-based login (stateless, secure)
- ? Customer dashboard with account overview
- ? Bank account management (view account number, balance)
- ? Balance enquiry
- ? Beneficiary management (add, list, delete)
- ? Fund transfer (with real-time balance update)
- ? Transaction history

### Admin Features
- ? Admin dashboard
- ? View all users
- ? Audit log viewer (all system actions)

### Security
- ? BCrypt password hashing
- ? JWT token authentication
- ? Role-based authorization (CUSTOMER, ADMIN)
- ? CORS configured for production
- ? Environment variable-based secrets (no hardcoded credentials)

## Architecture

```
React (Vercel)
     ?
Axios (with JWT interceptor)
     ?
Spring Boot REST API (Railway)
     ?
Spring Security / JWT Filter
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
| GET | /api/admin/audit-logs | ADMIN | Audit logs |
| GET | /actuator/health | None | Health check |
| GET | /swagger-ui.html | None | API docs |

## Database Schema

```
users
  +-- id, username, email, password, role, enabled, created_at

bank_accounts
  +-- id, account_number, user_id (FK), balance, account_type, created_at

beneficiaries
  +-- id, owner_user_id (FK), beneficiary_name, account_number, bank_name, created_at

transactions
  +-- id, sender_account_id (FK), receiver_account_number, type, amount, description, balance_after, created_at

audit_logs
  +-- id, user_id, username, action, entity_type, entity_id, details, ip_address, created_at
```

## Local Development

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 20+
- MySQL 8.x (local)

### Backend Setup
```bash
cd backend

# Create database
mysql -u root -p -e "CREATE DATABASE banking_db;"

# Run (uses application.properties defaults)
mvn spring-boot:run

# API available at: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local

# Run
npm run dev

# App available at: http://localhost:5173
```

### Default Admin Account
After first run, create an admin via SQL:
```sql
-- After registering any user, update their role:
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
```

## Production Deployment

### Environment Variables Required

#### Railway (Backend)
| Variable | Description |
|----------|-------------|
| DATABASE_HOST | Aiven MySQL hostname |
| DATABASE_PORT | MySQL port (default 3306) |
| DATABASE_NAME | Database name |
| DATABASE_USERNAME | DB username |
| DATABASE_PASSWORD | DB password |
| JWT_SECRET | Long random secret (min 32 chars) |
| FRONTEND_URL | Vercel frontend URL (for CORS) |
| SPRING_PROFILES_ACTIVE | prod |

#### Vercel (Frontend)
| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Railway backend URL |

## Security Notes

- Passwords are BCrypt hashed (never stored in plain text)
- JWT tokens expire after 24 hours
- All production secrets stored as environment variables
- `.env` files are excluded from Git
- `application-prod.properties` excluded from Git
- CORS allows only the configured frontend URL

## License

MIT License - Built for interview/portfolio purposes.
