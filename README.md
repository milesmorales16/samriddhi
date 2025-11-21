# Samriddhi: Personal Risk Engine & Trading Journal

Samriddhi is a multi-entity trading ledger designed to track the lifecycle of complex trading campaigns. It provides hedge-fund-grade back-office analytics, risk projection, and tax compliance for the active retail trader.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Running Locally

**1. Development Mode** (Hot-reload enabled)
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- **Backend:** [http://localhost:8000](http://localhost:8000)
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

**2. Production Mode** (Local LAN Access)
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```
- **App:** [https://localhost](https://localhost) (or your LAN IP)
- **Data:** Persisted in `./data/prod/postgres`
- **Uploads:** Stored in `./data/prod/uploads`

## 📂 Documentation

- **[Product Requirements (PRD)](docs/prd.md):** Detailed functional requirements and roadmap.
- **[Architecture](docs/architecture.md):** Tech stack, deployment strategy, and security model.
- **[Design Notes](docs/design_notes.md):** Chronological log of design decisions.
- **[Issues & Roadmap](docs/issues.md):** Current tasks and known bugs.

## 🛠 Tech Stack

- **Backend:** Python (FastAPI, SQLModel, Typer)
- **Frontend:** TypeScript (React, Vite)
- **Database:** PostgreSQL (via Docker)
- **Proxy:** Caddy (Automatic HTTPS)

## 🔐 Security

- **HTTPS:** Enforced via Caddy (auto-generated self-signed certs).
- **Data Safety:** Production data is bind-mounted to `./data/prod` for easy backup.
- **Uploads:** Stored in a dedicated volume. Ensure the host disk is encrypted.
