# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed on your server.
- A Google Cloud Project with OAuth credentials configured.

## Google OAuth Setup (Step-by-Step)

### Phase 1: Create Project
1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Sign in with your Google account.
3. Click the project dropdown in the top-left (next to the Google Cloud logo).
4. Click **New Project**.
5. Name it "Portfolio Admin" (or similar) and click **Create**.
6. Wait a moment, then select your new project from the notification or dropdown.

### Phase 2: Configure Consent Screen
1. In the left sidebar, click **APIs & Services** > **OAuth consent screen**.
2. Select **External** for User Type and click **Create**.
3. **App Information**:
   - **App name**: Portfolio Admin
   - **User support email**: Select your email.
4. Scroll down to **Developer contact information** and enter your email again.
5. Click **Save and Continue**.
6. Skip "Scopes" (just click **Save and Continue**).
7. Skip "Test Users" (click **Save and Continue**).
8. Click **Back to Dashboard**.

### Phase 3: Create Credentials
1. In the left sidebar, click **Credentials**.
2. Click **+ CREATE CREDENTIALS** (top of screen) and select **OAuth client ID**.
3. **Application type**: Select **Web application**.
4. **Name**: Leave as "Web client 1" or name it "Portfolio App".
5. **Authorized redirect URIs** (Crucial Step):
   - Click **+ ADD URI**.
   - Enter: `http://localhost:5000/api/auth/google/callback`
   - *(If running on a public domain later, add `https://your-domain.com/api/auth/google/callback` as well)*.
6. Click **Create**.

### Phase 4: Copy Secrets
1. A popup will appear with "Your Client ID" and "Your Client Secret".
2. **Copy these strings**. You need them for the next step.
   - **Client ID** looks like: `12345...apps.googleusercontent.com`
   - **Client Secret** is a random string.

## Configuration
1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your values:
   - `SESSION_SECRET`: A long random string.
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console.
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.

## Local Deployment (Node.js)
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Database**:
   ```bash
   npm run db:push
   # Optional: Seed data
   npm run seed
   ```
3. **Build the Application**:
   ```bash
   npm run build
   ```
4. **Start the Production Server**:
   ```bash
   npm run start
   ```
   The app will serve at `http://localhost:5000`.

## Deploying with Docker
1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```
2. The application will be available at port 5000 (e.g., `http://localhost:5000`).

## Persistent Data
- The SQLite database is stored in `sqlite.db`. 
- The `docker-compose.yml` file maps this file to a volume, so your data persists across restarts.

## Gmail App Password Setup
To enable email notifications, you need a Google App Password (not your login password).

1. Go to your **[Google Account Security](https://myaccount.google.com/security)** page.
2. Under "How you sign in to Google", ensure **2-Step Verification** is turned **ON**.
3. Search for **"App passwords"** in the search bar at the top (or look under 2-Step Verification).
4. Create a new app password:
   - **App name**: Portfolio
   - Click **Create**.
5. Copy the 16-character code (e.g., `xxxx xxxx xxxx xxxx`).
6. Paste it into your `.env` file as `GMAIL_APP_PASSWORD`.

## Cloud Deployment Options

Since this application is containerized with Docker, you can deploy it to almost any cloud provider.

### Option 1: Railway / Render (Easiest)
These platforms support deployments directly from a GitHub repository.
1. Push your code to GitHub.
2. Connect your repository to **Railway** or **Render**.
3. They will automatically detect the `Dockerfile` and build it.
4. **Important**: Add your Environment Variables (`GOOGLE_CLIENT_ID`, `ADMIN_EMAIL`, etc.) in the dashboard of the cloud provider.

### Option 2: VPS (DigitalOcean, AWS, Hetzner)
For full control, rent a Linux server.
1. SSH into your server.
2. Install Docker and Docker Compose.
3. Clone your repository.
4. Create your `.env` file with production values.
5. Run `docker-compose up -d --build`.
6. Use Nginx or Caddy as a reverse proxy to handle HTTPS (SSL) and forward traffic to port 5000.

### Option 3: Replit
This project supports Replit natively.
1. Create a new Repl and import this repository.
2. Add your secrets used in `.env` to the Replit "Secrets" tool.
3. Click "Run".

### ❌ Why not GitHub Pages?
**You cannot deploy this full application to GitHub Pages.**

GitHub Pages only hosts **static** websites (HTML/CSS/JS). This application requires a **server** (Node.js) to handle:
- Google OAuth Login
- SQLite Database (storing blogs/messages)
- Sending Emails via Gmail
- Admin Dashboard protection

If you deploy to GitHub Pages, none of these features will work. Use one of the options above (Railway/Render/VPS) instead.

## Estimated Monthly Costs (Continuous Running)
For a small application like this (Node.js + SQLite), here are the estimated costs for running 24/7:

| Provider | Service | Spec | Est. Price/Month | Free Tier? |
| :--- | :--- | :--- | :--- | :--- |
| **AWS** | EC2 (t3.micro) | 2 vCPU, 1GB RAM | **~$7.50** | 12 months free |
| **Azure** | VM (B1s) | 1 vCPU, 1GB RAM | **~$8.00** | 12 months free |
| **Google Cloud** | Compute (e2-micro) | 2 vCPU, 1GB RAM | **~$7.00** | **Always Free** (in US regions) |
| **DigitalOcean** | Droplet | 1 vCPU, 1GB RAM | **$6.00** | No |
| **Hetzner** | Cloud | 2 vCPU, 4GB RAM | **~$5.00** | No (Cheapest performance) |
| **Railway** | Starter | Shared RAM | **$5.00** | Trial credits |
| **Render** | Web Service | 512MB RAM | **$7.00** | Free plan (spins down) |

> **Recommendation**: **Google Cloud (e2-micro)** is likely your best option if you want it free forever (requires configuration). **Hetzner** or **DigitalOcean** are the easiest/cheapest paid options for raw power.

### ⚠️ Important: GCP "Always Free" Conditions
To get Google Cloud for **$0/month**, you must strictly follow these rules:
1.  **Region**: You MUST select `us-central1`, `us-west1`, or `us-east1`. (Other regions cost money).
2.  **Instance**: You MUST select `e2-micro`.
3.  **Disk**: Standard Persistent Disk up to 30GB.
4.  **Traffic**: 1GB network egress is free (usually enough for a small portfolio).

*If you pick a different region (like Asia/Europe) or a larger server, you will be charged ~$7/month.*

### Google Cloud Deployment Guide
Here is exactly how to set up the free server:

1.  **Create Instance**:
    *   Go to **Compute Engine** > **VM Instances**.
    *   Click **Create Instance**.
    *   **Name**: `portfolio-server`.
    *   **Region**: `us-central1` (Important!).
    *   **Machine configuration**: Series `E2`, Machine type `e2-micro` (2 vCPU, 1 GB memory).
    *   **Boot Disk**: Click Change. Select `Standard persistent disk`, Size `30 GB`.
    *   **Firewall**: Check "Allow HTTP traffic" and "Allow HTTPS traffic".
    *   Click **Create**.

2.  **Connect**:
    *   Click the **SSH** button next to your new instance in the list.
    *   A terminal window will open.

3.  **Install Software & Configure Swap** (Run these commands in the SSH window):
    *   **Crucial Step:** The free `e2-micro` only has 1GB RAM. You MUST create a swap file or the build will crash.
    ```bash
    # 1. Update and install tools
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose git

    # 2. Start Docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # 3. Create 2GB Swap File (Prevents "Out of Memory" crashes)
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```

4.  **Deploy App**:
    ```bash
    # 1. Clone your code
    git clone https://github.com/ParitKansal/portfolio-site.git
    cd portfolio-site

    # 2. Create .env file
    nano .env
    # (Paste your .env content: ADMIN_EMAIL, GMAIL_APP_PASSWORD, etc.)
    # Press Ctrl+X, then Y, then Enter to save.

    # 3. PRE-CREATE DATABASE FILE (Prevents "SQLITE_CANTOPEN" error)
    touch sqlite.db
    chmod 666 sqlite.db

    # 4. Start the app (This takes ~5-10 mins on the free tier)
    sudo docker-compose up -d --build
    ```

5.  **allow Port 5000 (Firewall)**:
    *   By default, Google Cloud blocks everything except port 80/443.
    *   Go to **VPC Network** > **Firewall**.
    *   Click **Create Firewall Rule**.
    *   **Name**: `allow-port-5000`.
    *   **Targets**: All instances in the network.
    *   **Source IPv4 ranges**: `0.0.0.0/0`.
    *   **Protocols and ports**: Check `tcp` and type `5000`.
    *   Click **Create**.

6.  **Access with Magic DNS (Crucial for Login)**:
    *   Google Login will **FAIL** if you use the raw IP.
    *   You MUST use this magic domain: `http://YOUR_EXTERNAL_IP.nip.io:5000`
    *   Example: `http://34.30.174.42.nip.io:5000`

7.  **Initialize Database (First Time Only)**:
    Only do this once to set up the admin user.
    ```bash
    # Create the tables
    sudo docker-compose exec app npm run db:push

    # Create the admin user
    sudo docker-compose exec app npx tsx server/seed.ts
    ```

8.  **Connect Custom Domain (paritkansal.in)**:
    *   **GoDaddy DNS**:
        *   Go to your Domain DNS Management.
        *   Add an **A Record**:
            *   **Name**: `@`
            *   **Value**: `34.30.174.42`
            *   **TTL**: `600` (or leaving default is fine)
    *   **Google Cloud Firewall**:
        *   Go to **VPC network** > **Firewall**.
        *   Create Firewall Rule: `allow-http-80`.
        *   **Targets**: All instances in the network.
        *   **Source IPv4 ranges**: `0.0.0.0/0`.
        *   **Protocols and ports**: `tcp` and `80`.
    *   **Google OAuth**:
        *   Add `http://paritkansal.in/api/auth/google/callback` to Authorized Redirect URIs.

## 🔄 Updating Your Live Site
Since you have already deployed once, you don't need to do everything again! 
To update your website with new changes:

1.  **Push your changes** from your computer:
    ```bash
    git push
    ```
2.  **Connect to your Server** (Click "SSH" on Google Cloud Console).
3.  **Run these update commands**:
    ```bash
    cd portfolio-site
    git pull                          # Get the new code
    sudo docker-compose up -d --build # Rebuild and restart
    ```
    *Wait ~3-5 minutes for it to finish rebuilding.*
