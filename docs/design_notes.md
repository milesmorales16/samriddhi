# Design & Implementation Notes

> [!IMPORTANT]
> **MAINTAIN REVERSE CHRONOLOGICAL ORDER**
> Newest entries must always be added to the TOP of this list, immediately after this header.

## 2025-11-21: Secrets Management
- **Decision:** Use environment-specific `.env` files for database credentials.
    - `.env.dev` for development (database: `samriddhi_dev`)
    - `.env.prod` for production (database: `samriddhi`)
    - `.env.example` provides a template for setup.
    - All `.env*` files are gitignored to prevent credential leakage.
    - Docker Compose services use `env_file: .env.{dev|prod}` to load credentials.
- **Rationale:** Ensures complete isolation between dev and prod databases. Simple, standard practice for local-first development. Machine-level encryption (encrypted volumes) provides additional security layer.

## 2025-11-21: Network Architecture Refinement
- **Decision:** Unified Caddy Configuration.
    - **Internal:** Caddy listens on `:80` and proxies to `backend:8000` and `frontend:5173`.
    - **Dev:** Host `8000` -> Container `80` (Caddy).
    - **Prod:** Host `8080` -> Container `80` (Caddy).
- **Rationale:** Ensures consistent internal routing while allowing distinct external ports for dev/prod environments without port conflicts.
- **Status:** Backend folder deleted due to permission issues; pending rebuild.

## 2025-11-21: Developer Experience
- **Workflow:** Added `.agent/workflows/setup_docker_permissions.md` to help non-root users manage Docker containers.

## 2025-11-21: Project Initialization & Architecture
- **Decision:** Adopted a "Twin-Engine" Docker strategy.
    - `docker-compose.dev.yml`: Optimized for DX (hot-reload, ephemeral volumes).
    - `docker-compose.prod.yml`: Optimized for stability (restart policies, bind mounts).
- **Decision:** Use **Bind Mounts** for production data (`./data/prod/postgres`) to ensure data visibility and ease of backup for the user.
- **Decision:** Tech Stack finalized:
    - Backend: FastAPI + SQLModel (Python).
    - Frontend: Vite + React (TypeScript).
    - Proxy: Caddy (for automatic HTTPS & LAN access).
- **Security:**
    - Uploads will be stored in `./data/prod/uploads`.
    - HTTPS will be enforced via Caddy.
