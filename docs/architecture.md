# Architecture & Technology Stack

## 1. Overview
Samriddhi is a personal risk engine and trading journal designed to track the lifecycle of complex trading campaigns. The system is built as a multi-service application using Docker for orchestration, ensuring consistency across development and potential future deployment.

## 2. Technology Stack

### 2.1. Backend: Python (FastAPI)
*   **Framework:** **FastAPI**
    *   *Why:* High performance (async), automatic OpenAPI documentation, and strong typing support.
*   **Data Validation:** **Pydantic**
    *   *Why:* Robust data validation that integrates seamlessly with FastAPI.
*   **Database ORM:** **SQLModel**
    *   *Why:* Combines SQLAlchemy and Pydantic, reducing boilerplate by allowing a single class to define both the database schema and the API model.
*   **CLI:** **Typer**
    *   *Why:* Shares the same type-hinting philosophy as FastAPI, allowing us to reuse validation logic for the Phase 1 CLI tools.

### 2.2. Frontend: React (Vite)
*   **Framework:** **React** (TypeScript)
*   **Build Tool:** **Vite**
    *   *Why:* Extremely fast build times and simple setup for Single Page Applications (SPAs). Ideal for a dashboard where SEO is not a priority.
*   **Styling:** **Tailwind CSS** (Anticipated)
    *   *Why:* Rapid UI development with utility-first classes.

### 2.3. Database
*   **Engine:** **PostgreSQL**
    *   *Why:* Robust, ACID-compliant, and supports complex queries required for the "Risk Engine" and "Immutable Ledger".
*   **Versioning:** **Alembic** (via SQLModel/SQLAlchemy)
    *   *Why:* Manages database schema migrations.

### 2.4. Infrastructure & DevOps
*   **Containerization:** **Docker** & **Docker Compose**
    *   *Why:* Ensures the development environment matches production. Simplifies spinning up the DB, Backend, and Frontend services together.
*   **Repository:** Monorepo structure.

## 3. Development & Deployment Plan

### 3.1. Development Workflow
1.  **Local Environment:** Developers run `docker-compose up` to start all services.
    *   Backend runs with hot-reload (`uvicorn --reload`).
    *   Frontend runs with HMR (Hot Module Replacement).
    *   Database persists data to a local volume.
2.  **Database Changes:**
    *   Modify SQLModel classes.
    *   Run `alembic revision --autogenerate` to create migration scripts.
    *   Apply migrations on container startup.

### 3.2. Deployment (Local Production)
*   **Strategy:** "Twin-Engine" Docker Setup.
    *   **Dev:** `docker-compose.dev.yml` (Hot-reload, ephemeral volumes).
    *   **Prod:** `docker-compose.prod.yml` (Optimized builds, restart policies).
*   **Data Safety:**
    *   **Layer A (Bind Mounts):** Production database maps to a visible host directory (`./data/prod/postgres`) for easy access and manual backup.
    *   **Layer B (Nightly Dump):** Cron job to `pg_dump` to a separate backup directory.
    *   **Layer C (Offsite):** Sync backup directory to cloud storage (Dropbox/Drive).
*   **Security & Access:**
    *   **Encrypted Storage:** User-uploaded CSVs will be stored in a dedicated bind mount (`./data/prod/uploads`) which should be on an encrypted partition (LUKS) or handled via application-level encryption (Phase 2). For Phase 1, we will rely on host-level disk encryption.
    *   **LAN Access:** The Nginx reverse proxy will listen on `0.0.0.0` to allow access from the home network.
    *   **HTTPS:** We will use a self-signed certificate (mkcert) or Let's Encrypt (via Caddy/Traefik) to enforce HTTPS. **Decision:** Use **Caddy** as the reverse proxy for automatic HTTPS (even with self-signed/local CA).

## 4. Alternatives Considered

### 4.1. Backend: Django vs. FastAPI
*   **Django:**
    *   *Pros:* "Batteries included" (Auth, Admin panel built-in).
    *   *Cons:* Too heavy for a focused microservice/API. The ORM is synchronous by default (though improving).
    *   *Verdict:* Rejected. We need the speed and modern async capabilities of FastAPI for the calculation engine.

### 4.2. Frontend: Next.js vs. Vite
*   **Next.js:**
    *   *Pros:* Server-Side Rendering (SSR), excellent SEO, full-stack capabilities.
    *   *Cons:* Higher complexity, opinionated routing, overkill for a private dashboard.
    *   *Verdict:* Rejected. Since this is an internal tool/SaaS behind a login, SEO is irrelevant. Vite offers a simpler developer experience (DX) and faster build times.

### 4.3. ORM: SQLAlchemy (Raw) vs. SQLModel
*   **SQLAlchemy:**
    *   *Pros:* The industry standard, extremely powerful.
    *   *Cons:* Verbose. Requires defining models twice (once for DB, once for Pydantic schemas).
    *   *Verdict:* Rejected in favor of SQLModel, which wraps SQLAlchemy to solve the "double definition" problem while keeping the power of the underlying engine.
