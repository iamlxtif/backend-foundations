# Backend Foundations

A structured hands-on module covering production-style Node.js and Express development, PostgreSQL, authentication, and deployment. Every concept is applied directly — no tutorial-following, no copy-paste.

---

## What This Covers

### Node.js Production Habits
Setting up a professional Node.js project from scratch using ES Modules, proper folder structure, centralized error handling, environment variable validation, and a developer workflow with nodemon and conventional commits.

### Express API Development
Building a complete REST API with Express — routing, controllers, validation middleware using `express-validator`, custom error classes, proper HTTP status codes, request logging with Morgan, pagination, and search/filtering via query parameters.

### Security Fundamentals
Adding production-grade security to an API — rate limiting with `express-rate-limit`, security headers with Helmet, CORS configuration, and input sanitization.

### PostgreSQL & Database Design
Connecting Node.js to PostgreSQL using `pg`, writing parameterized queries, designing relational schemas, and managing schema changes with SQL migration files.

### Authentication & Authorization
Implementing JWT-based authentication from scratch — user registration, login, password hashing with bcrypt, token generation and verification, and protected route middleware.

### Deployment
Deploying a Node.js API with a live PostgreSQL database to Railway, configuring environment variables in production, and writing runnable documentation.

---

## Projects

### Books API
A fully deployed REST API for managing a books collection.

- Full CRUD with PostgreSQL persistence
- Search and filtering by title and author
- Pagination with configurable page size
- Input validation on all write operations
- Centralized error handling
- Rate limiting and security headers
- Morgan request logging

**Live:** [link]  
**Repo:** [link]

---

### Auth API
A production-ready authentication backend — the first real portfolio piece.

- User registration and login
- JWT access tokens
- Password hashing with bcrypt (cost factor 12)
- Protected routes with auth middleware
- Custom error classes with proper HTTP status codes
- SQL migrations for schema management
- Deployed to Railway with a cloud PostgreSQL database

**Live:** [link]  
**Repo:** [link]

---

## Tech Stack

- **Runtime:** Node.js 20 (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **Auth:** JSON Web Tokens, bcryptjs
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit, CORS
- **Logging:** Morgan
- **Deployment:** Railway

---

## How to Run Any Project Locally

Each project has its own repo with a complete setup guide. The general pattern across all projects:

```bash
git clone <repo-url>
cd <project>
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

Required environment variables are documented in each project's `.env.example`. No project has hardcoded secrets or requires manual configuration beyond filling in that file.

---

## Key Practices Applied Throughout

**Git discipline** — every feature on its own branch, conventional commit messages, PRs with descriptions before merging to main.

**No hardcoded values** — all configuration lives in environment variables, validated at startup.

**Consistent error handling** — one centralized error handler, custom error classes, no raw `500` responses.

**Parameterized queries only** — SQL injection not possible anywhere in the codebase.

**English documentation** — all READMEs, commit messages, and inline comments written in English.
