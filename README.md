# HNG i14 Stage 0 Backend Task

A simple Express API that integrates with the Genderize API to classify a name and return gender predictions with processed metadata.

The service validates input, fetches data from an external API, transforms the response, and returns a structured JSON output with confidence scoring and timestamp metadata.

---

## Getting started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

The API will be available at:

```
http://localhost:3000
```

---

## API endpoint

### GET `/api/classify`

Classifies a name using the Genderize API and returns processed results.

### Query parameters

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| name      | string | yes      | Name to classify |

---

### Example request

```
GET /api/classify?name=alex
```

---

### Success response

```json
{
  "status": "success",
  "data": {
    "name": "alex",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-10T12:00:00.000Z"
  }
}
```
---

### Error responses

#### Missing or invalid input

```json
{
  "status": "error",
  "message": "'name' is required as a query parameter"
}
```

#### No prediction found

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

#### Server error

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Features

* TypeScript for type safety
* Express for API routing
* External API integration (Genderize)
* Input validation with strict error handling
* Confidence scoring logic
* CORS enabled for cross-origin access
* Structured JSON responses
* Timestamped processing metadata

---

## Project structure

```
hng-i14-task-0-david-uzondu/
├── apps/
│   └── server/        # Express backend API
├── packages/          # Shared packages (types, env, etc.)
```

---

## Available scripts

* `pnpm run dev` – Start development server
* `pnpm run start` – Start production server
* `pnpm run build` – Build the application
* `pnpm run check` – Lint and format code
