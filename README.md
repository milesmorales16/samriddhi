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

**2. Development Mode** (Hot-reload enabled)
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
