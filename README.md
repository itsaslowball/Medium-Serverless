# Medium-Type Blogging App

This project is a Medium-style blogging platform with a serverless architecture, built using Cloudflare Workers and the Hono library. It features a user authentication system using refresh tokens and access tokens and is designed with scalability and efficiency in mind.

## Key Features

- **Serverless Architecture:** The backend is fully serverless, powered by Cloudflare Workers and the Hono framework, allowing for seamless scalability and low-latency responses.
- **Type-Safe Data Sharing:** All data types (user, blog, etc.) are stored in a shared NPM package, allowing both the frontend and backend to use the same type definitions for consistency and ease of development.
- **Authentication:** The app uses refresh tokens and access tokens for secure authentication. Tokens are managed and refreshed as needed to keep users logged in without requiring frequent re-authentication.
- **Data Validation with Zod:** The project uses Zod to enforce data validation and schema definitions on both frontend and backend.
- **PostgreSQL & Prisma:** The database is powered by PostgreSQL, with Prisma ORM providing type-safe queries and migrations.
- **Frontend with React & Tailwind:** The frontend is built using React with TypeScript for type safety and Tailwind CSS for fast and responsive UI development.

## Tech Stack

### Backend

- **Cloudflare Workers:** Serverless functions running on Cloudflare's global network, ensuring low-latency and high availability.
- **Hono Framework:** A lightweight framework for building serverless applications with Cloudflare Workers.
- **PostgreSQL:** A powerful relational database for storing user and blog data.
- **Prisma ORM:** A type-safe ORM for PostgreSQL, handling database interactions and migrations.
- **Zod:** A TypeScript-first schema declaration and validation library.

### Frontend

- **React with TypeScript:** For building a responsive, type-safe UI.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **React Query:** For handling data fetching, caching, and synchronization.


The `common/` folder is hosted as an NPM package and shared between both the frontend and backend.

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/medium-serverless.git
   cd medium-serverless
   ```

2. **Install Dependencies:**
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Set Up Environment Variables:**
   - Inside the `backend/` directory, create a `.env` file:
     ```env
     DATABASE_URL="PASTE DATABASE URL"
     ```
   - The `DATABASE_URL` should be the Aiven PostgreSQL URL.

4. **Creating a Prisma Connection Pool:**
   - Go to the [Prisma website](https://www.prisma.io/) and create a new project.
   - Enable **Accelerate** and use your Aiven DB URL as the connection string.
   - Click on **Enable Accelerate** and generate an API key.
   - Prisma will provide a connection pool URL. Use this URL in the `wrangler.toml` file.

5. **Configure `wrangler.toml`:**
   Inside the `backend/` directory, create a `wrangler.toml` file:
   ```toml
   name = "backend"
   compatibility_date = "2023-12-01"

   [vars]
   DATABASE_URL = "PASTE the PRISMA URL (Connection Pool)"
   JWT_SECRET = "something"
   REFRESH_TOKEN_SECRET="something"
   ```

6. **Run the Backend:**
   The backend runs as a Cloudflare Worker:
   ```bash
   npm run dev
   ```

7. **Run the Frontend:**
   ```bash
   npm run dev
   ```

8. **Database Setup:**
   NOTE If you make changes in the database i.e schema.prisma file you need to migrate using the follwing command to tell the database the the table you had added is been altered.
   ```bash
   npx prisma migrate dev --name init_schema
   ```
   It will generate migration folder inside prisma.
   And then Generate the prisma client
   ```bash
   npx prisma generate --no-engine
   ```
   

## Authentication Flow

- **Access Token:** Stored in local storage and used for authenticating API requests.
- **Refresh Token:** Stored in HTTP-only cookies and used to regenerate access tokens when they expire.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.
