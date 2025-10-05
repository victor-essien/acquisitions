# Acquisitions App: Docker & NeonDB Setup

This guide explains how to run the app locally with Docker and Neon Local, and how to configure for production with Neon Cloud.

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- (For production) Neon Cloud account and connection string

---

## Local Development with Neon Local

1. **Clone the repository**

2. **Configure environment variables:**
   - Edit `.env.development` if needed. Default `DATABASE_URL` is set for Neon Local:
     ```env
     DATABASE_URL=postgres://neon:neon@neon-local:5432/neondb
     ```

3. **Start the app and Neon Local:**

   ```sh
   docker-compose -f docker-compose.dev.yml up --build
   ```

   - The Express app will be available at [http://localhost:3000](http://localhost:3000)
   - Neon Local will be available at `localhost:5432` (user: `neon`, password: `neon`)
   - Neon Local will automatically create ephemeral branches for each git branch.

4. **Stopping the services:**

   ```sh
   docker-compose -f docker-compose.dev.yml down
   ```

5. **Hot Reloading:**
   - The app container mounts your local code, so changes are reflected without rebuilding.

---

## Production with Neon Cloud

1. **Set your Neon Cloud connection string in `.env.production`:**

   ```env
   DATABASE_URL=postgres://<user>:<password>@<host>.neon.tech/<db>?sslmode=require
   ```

2. **Start the app in production mode:**
   ```sh
   docker-compose -f docker-compose.prod.yml up --build
   ```

   - The app will use the `DATABASE_URL` from `.env.production`.
   - No Neon Local proxy is used in production.

---

## Environment Variable Switching

- **Development:**
  - `DATABASE_URL` is set in `.env.development` for Neon Local.
- **Production:**
  - `DATABASE_URL` is set in `.env.production` for Neon Cloud.

---

## References

- [Neon Local Docs](https://neon.com/docs/local/neon-local)
- [Neon Cloud](https://neon.tech/)
