# ZipFolio backend

The API behind ZipFolio, a portfolio builder. Users sign in with Google in the
admin panel, fill in their portfolio, and the public site reads it from here.

Live: https://zipfolio-backend-kth.onrender.com

## What it uses

- NestJS 11 (TypeScript)
- MongoDB with Mongoose
- Google sign-in (Passport) and JWT tokens
- Jest and Supertest for tests
- Docker, GitHub Actions, Terraform

## Endpoints

| Method and path | What it does | Login needed |
|---|---|---|
| `GET /` | Health check | No |
| `GET /site/:wildcard` | A user's public site data | No |
| `GET /flags` | Feature flags, for example `{ "template2": false }` | No |
| `GET /auth/google/login` | Starts Google sign-in | No |
| `GET /auth/google/redirect` | Google sends the user back here, then to the admin with a token | No |
| `GET /users` | The signed-in user's data | Yes |
| `PUT /users` | Save the signed-in user's data | Yes |
| `PATCH /users/wildcard/:wildcard` | Change the site name (the subdomain) | Yes |

## Run it locally

You need Node 20, a MongoDB database and a Google OAuth client.

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run start:dev         # http://localhost:3000
```

For a quick local MongoDB: `docker run -d -p 27017:27017 mongo:7`

Settings in `.env`:

| Variable | What it is |
|---|---|
| `MONGO_URI` | MongoDB connection string, for example `mongodb://127.0.0.1:27017` |
| `DB_NAME` | Database name, for example `zipfolio` |
| `JWT_SECRET` | Any long random string; signs login tokens |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | From your Google Cloud OAuth client |
| `BACKEND_URL` | Where this API is reachable, for example `http://localhost:3000` |
| `ADMIN_URL` | Where the admin panel runs; users are sent here after login, for example `http://localhost:5173` |

The app does not start without `JWT_SECRET`, `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET`. `.env` is not committed.

## Tests and checks

```bash
npm test             # unit tests (Jest)
npm run test:cov     # unit tests with a coverage report
npm run test:e2e     # end-to-end test, needs MongoDB on 127.0.0.1:27017
npm run lint         # ESLint (also fixes what it can)
npm run build        # compile to dist/
```

- Unit tests are next to the code they test, in files named `*.spec.ts`
  (services, controllers, validation, login strategies, feature flags).
- The end-to-end test is in `test/` and starts the whole app against a real MongoDB.
- Coverage must stay at 60% or higher, otherwise the build fails.

## How it is checked and deployed

- **Every pull request:** GitHub Actions runs lint, a type check, the unit
  tests, the end-to-end test (with a MongoDB container), the build, and a check
  that the Docker image builds. CodeQL scans the code for security problems.
- **Merge to `main`:** the Docker image is built from `Dockerfile.prod`, pushed to
  GitHub Container Registry as `ghcr.io/val0007/web-site-backend:<commit>`, and
  Render is told to run that image. This only happens after the checks pass.
- **`main` is protected:** changes go through a pull request, and the CI check
  must pass. A pull request that adds a high-severity CodeQL alert cannot be merged.
- **Dependabot** opens weekly pull requests for npm packages and Docker base images.

## Infrastructure

`infra/` holds the Terraform that describes the Render service and the MongoDB
Atlas cluster. See `infra/README.md` for how to use it.

## Files worth knowing

- `Dockerfile` for development, `Dockerfile.prod` for production
- `docker-compose.yml` and `docker-compose.prod.yml`
- `.github/workflows/` for the pipelines (`ci.yml`, `codeql.yml`, `terraform.yml`)
