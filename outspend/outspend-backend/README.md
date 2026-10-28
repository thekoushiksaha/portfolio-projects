# OutSpend Backend

REST API for **OutSpend**, an expense-tracking app. Users sign up, log expenses, set monthly spending limits and see monthly summaries and spending trends. The app tracks expenses only, not income.

## Features

- **Authentication:** registration and login with JWT. Access tokens last 15 minutes. Refresh tokens last 7 days and are rotated on every use, and reusing a revoked token revokes all of that user's sessions.
- **Expenses:** create, read, update and delete, with filtering by category and date range, plus pagination. Categories: `FOOD`, `TRANSPORT`, `BILLS`, `SHOPPING`, `HEALTH`, `OTHER`.
- **Monthly limits:** set or update a monthly spending limit per category.
- **Summaries:** a monthly summary and a multi-month trend.
- **Users:** view and update a profile, change password. Changing the password revokes all refresh tokens.
- **Public endpoints:** an "about" endpoint and a contact form.
- **Roles:** `USER` and `ADMIN`, with an admin account created on first startup. Admins can read the contact messages through a protected endpoint.
- **Operations:** Flyway migrations, OpenAPI docs, a health endpoint, a scheduled cleanup of expired refresh tokens, and one consistent JSON error format.

## Tech stack

Java 25 · Spring Boot 4.1 · Spring Security · Spring Data JPA · PostgreSQL 16 · Flyway · springdoc OpenAPI · Maven · Docker and Docker Compose · GitHub Actions · Dependabot

## Quick start with Docker

Requires Docker Desktop (or Docker Engine with the Compose plugin).

```bash
cd outspend/outspend-backend
cp .env.example .env        # then edit the values, see "Configuration"
docker compose up --build
```

Wait for `Started OutspendApplication` in the logs, then:

- Health check: http://localhost:8080/actuator/health
- API docs (only if `SWAGGER_ENABLED=true` in `.env`): http://localhost:8080/swagger-ui.html

Stop everything with `docker compose down`. Add `-v` to also delete the database data.

## Running locally without Docker

You need JDK 25 and a local PostgreSQL with an empty database named `outspend`.

1. Copy `.env.example` to `.env` and fill it in.
2. Load the variables and start the app.
   - **Windows (PowerShell):** `./run.ps1` reads `.env` and runs `./mvnw spring-boot:run`.
   - **macOS / Linux:**
     ```bash
     set -a; source .env; set +a
     ./mvnw spring-boot:run
     ```

Flyway creates the schema on first start. Locally the default profile is used, so Swagger is enabled.

## Configuration

All settings come from environment variables.

| Variable                              | Required | Description                                                                                                                                                          |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DB_PASSWORD`                         | yes      | Postgres password                                                                                                                                                    |
| `JWT_SECRET`                          | yes      | Token signing key, at least 32 bytes. Generate one with `openssl rand -base64 48`                                                                                    |
| `ADMIN_EMAIL`                         | yes      | Email of the admin account created on first startup                                                                                                                  |
| `ADMIN_PASSWORD`                      | yes      | Password of that admin account                                                                                                                                       |
| `DB_URL`                              | no       | Defaults to `jdbc:postgresql://localhost:5432/outspend`. Docker Compose sets it to the `db` container                                                                |
| `DB_USERNAME`                         | no       | Defaults to `postgres`                                                                                                                                               |
| `SWAGGER_ENABLED`                     | no       | Only used with the `prod` profile (which Compose sets). Defaults to `false`                                                                                          |
| `APP_CORS_ALLOWED_ORIGINS`            | no       | Comma-separated browser origins allowed to call the API. Defaults to `http://localhost:3000,http://localhost:5173`. Set it to your web frontend's URL when deploying |
| `app.rate-limit.enabled`              | no       | Turn rate limiting on or off. Default `true`                                                                                                                         |
| `app.rate-limit.auth-max-requests`    | no       | Login + register requests allowed per IP per window. Default `10`                                                                                                    |
| `app.rate-limit.contact-max-requests` | no       | Contact-form requests allowed per IP per window. Default `5`                                                                                                         |
| `app.rate-limit.window-seconds`       | no       | Window length in seconds. Default `60`                                                                                                                               |

The app refuses to start if a required variable is missing, so there are no insecure defaults.

## API overview

Every response uses the same envelope, and errors come back in the same shape with the right HTTP status. Protected endpoints need the header `Authorization: Bearer <access token>`. The full request and response schemas are in Swagger.

| Method | Path                             | Auth   | Purpose                                                                    |
| ------ | -------------------------------- | ------ | -------------------------------------------------------------------------- |
| POST   | `/api/v1/auth/register`          | public | Create an account                                                          |
| POST   | `/api/v1/auth/login`             | public | Log in, returns access and refresh tokens                                  |
| POST   | `/api/v1/auth/refresh`           | public | Exchange a refresh token for a new pair                                    |
| POST   | `/api/v1/auth/logout`            | public | Revoke a refresh token                                                     |
| GET    | `/api/v1/users/me`               | user   | Current profile                                                            |
| PUT    | `/api/v1/users/me`               | user   | Update profile                                                             |
| PUT    | `/api/v1/users/me/password`      | user   | Change password                                                            |
| POST   | `/api/v1/expenses`               | user   | Add an expense                                                             |
| GET    | `/api/v1/expenses`               | user   | List expenses. Query: `category`, `from`, `to` (ISO dates), `page`, `size` |
| GET    | `/api/v1/expenses/{id}`          | user   | Get one expense                                                            |
| PUT    | `/api/v1/expenses/{id}`          | user   | Update an expense                                                          |
| DELETE | `/api/v1/expenses/{id}`          | user   | Delete an expense                                                          |
| PUT    | `/api/v1/limits`                 | user   | Create or update a limit for a category                                    |
| GET    | `/api/v1/limits`                 | user   | List limits. Query: `month` (`yyyy-MM`)                                    |
| DELETE | `/api/v1/limits/{id}`            | user   | Delete a limit                                                             |
| GET    | `/api/v1/summary/monthly`        | user   | Monthly summary. Query: `month` (`yyyy-MM`)                                |
| GET    | `/api/v1/summary/trend`          | user   | Spending trend. Query: `months` (default 6)                                |
| GET    | `/api/v1/public/about`           | public | About the app                                                              |
| POST   | `/api/v1/public/contact`         | public | Send a contact message                                                     |
| GET    | `/api/v1/admin/contact-messages` | admin  | List contact messages, newest first. Query: `page`, `size` (max 50)        |
| GET    | `/actuator/health`               | public | Health check                                                               |

Each user can only see and change their own data.

Example:

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.com","password":"a-strong-password"}'
```

## Tests

The suite has 54 tests: unit tests for JWT and mapping, and integration tests that call the real HTTP endpoints against a real PostgreSQL database. They cover authentication and refresh-token reuse, expense and limit rules, monthly summaries and trends, profile and password changes, admin-only access, access isolation between users, and the public endpoints.

The tests use a separate database so they never touch your development data:

```bash
# once: create the test database
createdb -U postgres outspend_test

./mvnw verify
```

Test settings are in `src/test/resources/application-test.yml`. They default to `localhost:5432/outspend_test` with user `postgres` and password from `DB_PASSWORD` (or `password` if unset). Override with `TEST_DB_URL` and `TEST_DB_USERNAME`.

## CI

GitHub Actions (`.github/workflows/ci.yml` at the repo root) runs on every push to `main` and on pull requests. It starts a PostgreSQL service container, runs `./mvnw verify` on Java 25, and then checks that the Docker image builds. Dependabot opens weekly update PRs for Maven dependencies and GitHub Actions.

## Project structure

```
src/main/java/com/koushik/outspend
├── admin/      admin-only endpoints (contact messages)
├── auth/       register, login, refresh and logout, refresh-token storage and cleanup
├── user/       profile and password
├── expense/    expenses and summaries
├── limit/      monthly spending limits
├── publicapi/  about and contact
├── security/   JWT utilities, request filter, user loading
├── config/     security config, seeders
└── common/     response envelope and exception handling

src/main/resources/db/migration   Flyway SQL migrations
```

## Design notes

- **Schema changes go through Flyway.** Hibernate only validates the schema (`ddl-auto: validate`), so a mismatch fails at startup instead of silently altering the database. Migrations that have already run are never edited, only added to.
- **Refresh-token rotation:** each refresh token is single-use. Presenting one that was already used is treated as theft, and all of that user's sessions are revoked.
- **No secrets in the repo.** `.env` is gitignored and `.env.example` documents what is needed. The Docker image runs as a non-root user.
- **Access tokens are short-lived on purpose.** They are not stored server-side, so after logout or a password change an already-issued access token stays valid until it expires (at most 15 minutes). Refresh tokens are revoked immediately, so no new tokens can be issued.
- **Rate limiting.** Login, register and the contact form are limited per client IP with an in-memory fixed window; extra requests get `429` with a `Retry-After` header. It is meant for a single instance. Running several instances would need a shared store such as Redis.

## Possible next steps

- Rate limiting on login and the contact form
- Storing refresh tokens as hashes
- Testcontainers so tests don't need a local Postgres
