# Portfolio Site - Parit Kansal

A modern, full-stack portfolio application with an integrated admin dashboard, blog, and knowledge vault. Built with React, Express, Vite, and SQLite.

## Overview

This repository contains the source code for [paritkansal.in](http://paritkansal.in). It's a complete full-stack web application designed not only to showcase projects and experience but also to manage content dynamically via a secure admin interface.

Features include:
- **Admin Dashboard**: Protected by Google OAuth to manage blog posts and messages.
- **Blog & Knowledge Vault**: Dynamic content management with Markdown rendering and PDF generation.
- **Secure Authentication**: Google OAuth and session-based authentication.
- **Responsive Design**: Tailored user interface built using Tailwind CSS and Radix UI.
- **Persistent Storage**: Uses SQLite with Drizzle ORM for data persistence.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Radix UI Primitives, React Markdown / KaTeX for rich text rendering.
- **Backend**: Express.js, Node.js.
- **Database**: SQLite controlled via Drizzle ORM.
- **Authentication**: Passport.js (Google OAuth2.0 strategies).
- **Deployment**: Docker, Docker Compose, Google Cloud Compute Engine.

## Getting Started

### Prerequisites

Node.js, npm, Docker (optional, but recommended for production-like environments). Google Cloud Project configured for OAuth (if you intend to use the Admin login).

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ParitKansal/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your secrets (e.g., Google OAuth keys, session secret).
   ```bash
   cp .env.example .env
   ```

4. **Initialize the Database:**
   ```bash
   npm run db:push
   # Optional: Seed initial data
   # npx tsx server/seed.ts
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

### Production Build

To build and start the production server locally:
```bash
npm run build
npm run start
```
The application will be served at `http://localhost:5000`.

## Deployment

This application is fully containerized using Docker.
For comprehensive deployment instructions—including setting up Google Cloud, running via Docker, and domain configuration—please see the [DEPLOY.md](DEPLOY.md) guide.