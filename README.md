# HNG i14 Stage 0 Backend Task

A simple Express API that enriches a name using external prediction services (Genderize, Agify, Nationalize), processes the results, and stores structured profile data in a database.

The service validates input, fetches data from multiple APIs in parallel, derives additional metadata like age group and country probability, and returns a normalized JSON response. It also supports deduplication using case-insensitive name matching.

---

## Getting started

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm run dev
```

Start production server:

```bash
pnpm run start
```

The API will be available at:

```
http://localhost:3000
```

---

## API endpoint

### POST `/api/profiles`

Creates or retrieves a profile based on a given name.
The service fetches predictions from external APIs and stores a normalized profile in the database.

---

### Request body

| Field | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| name  | string | yes      | Name to classify |

---

### Validation rules

* `name` is required
* `name` cannot be empty
* `name` must not be numeric

---

### Example request

```http
POST /api/profiles
Content-Type: application/json

{
  "name": "alex"
}
```

---

## Success responses

### 200 OK (new profile created)

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "alex",
    "gender": "male",
    "gender_probability": 0.99,
    "age": 28,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.87,
    "sample_size": 1234
  }
}
```

---

### 409 Conflict (profile already exists)

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": 1,
    "name": "alex",
    "gender": "male",
    "age": 28,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.87,
    "sample_size": 1234
  }
}
```

---

## Error responses

### 400 Bad Request

```json
{
  "status": "error",
  "message": "'name' is required in request body"
}
```

---

### 422 Unprocessable Entity

```json
{
  "status": "error",
  "message": "'name' must not be a number"
}
```

or

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

---

### 502 Bad Gateway

Returned when any external API fails.

```json
{
  "status": "error",
  "message": "Error calling Genderize API"
}
```

---

### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Features

* Express REST API with TypeScript
* Parallel external API calls (Genderize, Agify, Nationalize)
* Database persistence with deduplication (case-insensitive name match)
* Age group classification (child, teenager, adult, senior)
* Country probability extraction (highest probability selection)
* Input validation middleware
* Centralized error handling
* CORS support
* Structured and consistent JSON responses

---

## Project structure

```
hng-i14-task-0-david-uzondu/
├── apps/
│   └── server/        # Express backend API
├── packages/          # Shared packages (types, env, db, etc.)
```

---

## Available scripts

* `pnpm run dev` – Start development server
* `pnpm run start` – Start production server
* `pnpm run build` – Build the application
* `pnpm run check` – Lint and format code

---

## Environment variables

```env
CORS_ORIGIN=*
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url_here
```
