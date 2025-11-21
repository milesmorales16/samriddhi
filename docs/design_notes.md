# Design & Implementation Notes

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

## 2025-11-21: Developer Experience
- **Workflow:** Added `.agent/workflows/setup_docker_permissions.md` to help non-root users manage Docker containers.
