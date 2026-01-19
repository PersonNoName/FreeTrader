# FreeTrader Project Context

## Project Overview

FreeTrader is a full-stack fund tracking application designed to help users monitor ETF performance, manage collections, and analyze sector trends.

-   **Backend:** Java Spring Boot application providing REST APIs, authentication, and data management.
-   **Frontend:** Next.js (React) application offering a modern, responsive user interface.
-   **Database:** MySQL for persistent storage of user data, ETF info, and historical performance.

## Technology Stack

### Backend (`/backend`)
-   **Framework:** Spring Boot 3.2.1
-   **Language:** Java 17
-   **ORM:** MyBatis-Plus 3.5.5
-   **Security:** Spring Security + JWT
-   **Database Driver:** MySQL Connector
-   **Build Tool:** Maven

### Frontend (`/frontend`)
-   **Framework:** Next.js 16.1 (App Router)
-   **UI Library:** React 19
-   **Styling:** Tailwind CSS 4
-   **Components:** Radix UI, Shadcn UI patterns
-   **State Management:** Zustand
-   **Charts:** Lightweight Charts
-   **HTTP Client:** Axios
-   **Build Tool:** NPM

## Setup & Running

### Prerequisites
-   Java 17+
-   Node.js 18+ (Recommended)
-   Maven 3.8+
-   MySQL 8.0+

### Database Setup
The project currently points to a remote database in `application.yml` (`106.12.52.116:1999`).
To run locally, initialize your database using the scripts in `/sql`:
1.  Create database `freetrader`.
2.  Run scripts in order: `user_info.sql`, `etf_info.sql`, `etf_netasset.sql`, `category.sql`, `calendar.sql`, `user_collection.sql`.

### Backend
1.  Navigate to `backend/`.
2.  Configure database in `src/main/resources/application.yml` if not using the remote default.
3.  Run: `mvn spring-boot:run`
    *   Server runs on: `http://localhost:8080`

### Frontend
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
    *   Application runs on: `http://localhost:3000`
    *   API requests are directed to `http://localhost:8080/api` (Configured in `src/lib/api.ts`).

## Development Conventions

### Backend Architecture
-   **Controller:** Handles HTTP requests (`src/main/java/.../controller`).
-   **Service:** Business logic (`src/main/java/.../service`).
-   **Mapper:** Database interactions via MyBatis-Plus (`src/main/java/.../mapper`).
-   **Entity:** Database models (`src/main/java/.../entity`).
-   **DTO:** Data Transfer Objects for API requests/responses (`src/main/java/.../dto`).

### Frontend Architecture
-   **App Router:** Pages located in `src/app`.
-   **Components:** Reusable UI components in `src/components`.
-   **Lib:** Utilities, API clients, and types in `src/lib`.
-   **Store:** Global state management in `src/store` (Zustand).

### Authentication
-   **Mechanism:** JWT (JSON Web Token).
-   **Flow:**
    1.  User logs in (`/auth/login`).
    2.  Backend returns JWT.
    3.  Frontend stores JWT in `localStorage`.
    4.  Axios interceptor (`src/lib/api.ts`) attaches `Bearer <token>` to subsequent requests.
    5.  `JwtAuthFilter` in backend validates token.

## Key Configuration Files
-   **Backend Config:** `backend/src/main/resources/application.yml` (DB connection, JWT secret, server port).
-   **Frontend API Config:** `frontend/src/lib/api.ts` (Base URL, Axios interceptors).
-   **Frontend Styles:** `frontend/src/app/globals.css`, `frontend/tailwind.config.ts` (implicit in v4).
