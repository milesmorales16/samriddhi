# Samriddhi: Personal Risk Engine & Trading Journal

Samriddhi is a multi-entity trading ledger designed to track the lifecycle of complex trading campaigns. It provides hedge-fund-grade back-office analytics, risk projection, and tax compliance for the active retail trader.

## 🚀 Quick Start

### Prerequisites

**Operating System:** Linux (Ubuntu 22.04 LTS or later recommended)

**1. Install Git**
```bash
sudo apt update
sudo apt install git
```

**2. Install Docker & Docker Compose**
We recommend using the official Docker repository.
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker packages:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**3. Configure Permissions**
Allow your user to run Docker commands without `sudo`:
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

### Running Locally

**1. Configure Environment Variables**
Copy the example environment file and update with your credentials:
```bash
# For development
cp .env.example .env.dev
# Edit .env.dev and set secure values for POSTGRES_PASSWORD

# For production (when ready)
cp .env.example .env.prod
# Edit .env.prod: change POSTGRES_DB to 'samriddhi' and set secure password
```

- **Data:** Persisted in `./data/prod/postgres`
- **Uploads:** Stored in `./data/prod/uploads`

### 3. Generate SSL Certificates (Required for HTTPS)
This project uses HTTPS by default. You must generate trusted certificates for your LAN IP.

1.  **Install mkcert:**
    - Linux: `sudo apt install libnss3-tools && mkcert -install`
    - macOS: `brew install mkcert && mkcert -install`
    - Windows: `choco install mkcert && mkcert -install`

2.  **Generate & Rename Certificates:**
    Run the following command in the project root, replacing `192.168.x.x` with your machine's LAN IP:
    ```bash
    mkcert -key-file cert-key.pem -cert-file cert.pem 192.168.x.x localhost 127.0.0.1 ::1
    ```
    *Note: This command directly generates the files with the generic names `cert.pem` and `cert-key.pem` expected by Docker Compose.*

### 4. Start the Application

**Development (Hot Reload):**
```bash
docker compose -p samriddhi-dev -f docker-compose.yml -f docker-compose.dev.yml up -d
```
- **Frontend:** `https://<LAN_IP>:8443` (proxied) or `http://localhost:5173` (direct)
- **Backend:** `https://<LAN_IP>:8443/api` (proxied) or `http://localhost:8000` (direct)
- **DB Port:** 5432

**Production (Optimized):**
```bash
docker compose -p samriddhi-prod -f docker-compose.yml -f docker-compose.prod.yml up -d
```
- **Application:** `https://<LAN_IP>:9443`
- **DB Port:** 5433 (to avoid conflict with dev)

**Note:** Replace `<LAN_IP>` with your machine's IP address (e.g., `192.168.4.4`). HTTP requests to ports 8000 (Dev) and 9000 (Prod) are automatically redirected to HTTPS.

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
