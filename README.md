# User Management App

A full-featured user management web application built with **Node.js**, **Express.js**, **MySQL**, and **EJS**. Connects to a real MySQL database to perform CRUD operations on user records.

## Tech Stack

- **Node.js** — runtime environment
- **Express.js** — web framework and routing
- **MySQL2** — real database connectivity
- **EJS** — server-side HTML templating
- **Faker.js** — random user data generation
- **dotenv** — secure environment variable management
- **method-override** — PATCH/DELETE support for HTML forms

## Features

- View total user count on home page
- View all users in a table
- Edit a user's username (with password verification)
- Add random fake users for testing (using Faker.js)
- Delete user (coming soon)
- Secure DB credentials via `.env` file
- SQL injection prevention using prepared statements

## Project Structure

```
user-management/
├── views/
│   ├── Home.ejs     # home page with user count
│   ├── show.ejs     # all users table
│   └── edit.ejs     # edit username form
├── database/
│   └── schema.sql   # MySQL table definition
├── index.js         # main server file
├── package.json
├── .env.example     # environment variable template
└── .gitignore
```

## Database Schema

```sql
CREATE TABLE user (
  id       VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email    VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL
);
```

## Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/amitkorgavkar/user-management-app.git

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env and add your MySQL credentials

# 4. Setup the database
# Open MySQL and run:
source database/schema.sql

# 5. Start the server
node index.js

# 6. Open in browser
http://localhost:8080
```

## Routes

| Method | Route              | Description                        |
|--------|--------------------|------------------------------------|
| GET    | /                  | Home page — total user count       |
| GET    | /users             | View all users                     |
| POST   | /users             | Add a random fake user             |
| GET    | /users/:id/edit    | Show edit form for a user          |
| PATCH  | /users/:id         | Update username (requires password)|

## Known Limitations

- Passwords are stored as plain text — bcrypt hashing will be added in a future update
- Delete route also available
- No frontend framework used — pure EJS templating 

## Notes

- Uses **prepared statements** (`?` placeholders) to prevent SQL injection
- DB credentials are stored in `.env` file — never committed to GitHub
