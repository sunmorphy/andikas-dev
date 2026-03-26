# Portfolio Backend API Documentation

Base URL: `http://localhost:3000/api`

## Localization (i18n)

> [!IMPORTANT]
> This API supports 5 languages: English (`en`), Indonesian (`id`), German (`de`), Japanese (`ja`), and Dutch (`nl`). 
> 
> **Fetching Data (`GET` requests):**
> By default, if you do **not** provide a `?lang=` parameter, the API returns the entire nested dictionary (e.g., `{"en": "Text", "id": "Teks"}`) for localized fields.
> You can append `?lang={code}` (e.g. `?lang=id`) to instruct the API to automatically flatten these objects and return only the requested language string.
> 
> **Sending Data (`POST`/`PUT` requests):**
> When creating or updating records, any field that supports localization **MUST** be sent as a JSON stringified object containing the language keys. English (`en`) is typically required.
> 
> **Example Payload Field:**
> ```json
> "title": "{\"en\": \"My Title\", \"id\": \"Judul Saya\", \"de\": \"Mein Titel\"}"
> ```
> *(Note: Since most endpoints use `multipart/form-data`, you must send these objects using `JSON.stringify()`).*
> 
> > [!NOTE]
> > **Exceptions:** The `Skills` and `Tags` entities are **NOT** localized. Their `name` fields only accept standard strings and their endpoints do not support the `?lang` query parameter.

---

## Authentication

> [!NOTE]
> The `POST /auth/register` endpoint is enabled for creating new administrative users.

### POST /auth/login
Login with **email or username**.

**Request Body (application/json):**
```json
{
  "identifier": "user@example.com",
  "password": "password123"
}
```
*Note: `identifier` can be either email or username*

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### GET /auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

---

## Health Check

### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Portfolio API is running"
}
```

---

## Public Portfolio Routes (Unauthenticated)

These endpoints are used to retrieve the public portfolio data for a specific user using either their `username` or `userId`.

### GET /api/user/:username
### GET /api/user/userId/:userId
Get public user profile details.

### GET /api/skills/user/:username
### GET /api/skills/userId/:userId
Get all public skills for the specified user.

### GET /api/experience/user/:username
### GET /api/experience/userId/:userId
Get all public experience for the specified user (includes related skills).

### GET /api/education/user/:username
### GET /api/education/userId/:userId
Get all public education for the specified user.

### GET /api/certifications/user/:username
### GET /api/certifications/userId/:userId
Get all public certifications for the specified user (includes related skills).

### GET /api/projects/user/:username
### GET /api/projects/userId/:userId
Get all public projects for the specified user (includes related skills and tags).

**Note:** This endpoint automatically forces `published=true` so drafts are never returned. Projects are sorted by `year` (descending) by default.

**Query Parameters (Optional):**
- `lang` (string): Target language (default: `en`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `highlighted` (boolean): Filter by highlight status (`true` / `false`)
- `search` (string): Case-insensitive search by project title
- `tag` (number): Filter projects by a specific `tagId`

**Response Format (Paginated):**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET /api/projects/user/:username/:slug
### GET /api/projects/userId/:userId/:slug
Get a specific public project by user and project slug.

**Query Parameters (Optional):**
- `lang` (string): Target language (default: `en`)

### GET /api/tags/user/:username
### GET /api/tags/userId/:userId
Get all public tags for the specified user.

---

## User Details (Authenticated)

### GET /api/user
Get current authenticated user's profile details. Requires Authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "role": "Full Stack Developer",
    "description": "Passionate developer...",
    "phone": "+6281234567890",
    "location": "Jakarta, Indonesia",
    "socialMedias": ["GithubLogo|https://github.com/johndoe", "LinkedinLogo|https://linkedin.com/in/johndoe"],
    "profilePhoto": "https://pub-...r2.dev/...",
    "resume": "https://pub-...r2.dev/resume_2026.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/user
Create user profile (only if doesn't exist). Requires Authentication.

**Request Body (multipart/form-data):**
- `name`: string (required)
- `role`: string (required)
- `description`: string (optional)
- `phone`: string (optional)
- `location`: string (optional)
- `socialMedias`: string array (JSON stringified) (optional)
- `profilePhoto` (File): image file for upload directly to R2 (optional)
- `resume` (File): PDF or image file for upload directly to R2 (optional)

### PUT /api/user
Update user profile. Requires Authentication.

**Request Body (multipart/form-data):** Same as POST. If `profilePhoto` or `resume` file is omitted, the existing file is retained.

---

## Skills

### GET /api/skills
Get all skills for the **currently authenticated user**. If not authenticated, returns an empty array.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TypeScript",
      "icon": "https://pub-...r2.dev/typescript-icon.png",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/skills/:id
Get skill by ID for the currently authenticated user.

### POST /api/skills
Create new skill. Requires Authentication.

**Request Body (multipart/form-data):**
- `name`: string (required)
- `icon` (File): image file upload (required)

### PUT /api/skills/:id
Update skill. Requires Authentication.

**Request Body (multipart/form-data):**
- `name`: string (required)
- `icon` (File): image file upload (optional)

### DELETE /api/skills/:id
Delete skill. Requires Authentication.

---

## Tags

### GET /api/tags
Get all tags for the **currently authenticated user**.

### GET /api/tags/:id
Get a tag by ID for the currently authenticated user.

### POST /api/tags
Create a new tag. Requires Authentication.

**Request Body (application/json):**
```json
{
  "name": "Web App",
  "slug": "web-app"
}
```

### PUT /api/tags/:id
Update tag. Requires Authentication.

**Request Body (application/json):**
- `name`: string (required)
- `slug`: string (required)

### DELETE /api/tags/:id
Delete a tag. Requires Authentication.

---

## Experience

### GET /api/experience
Get all work experience for the **currently authenticated user** with related skills.

### GET /api/experience/:id
Get experience by ID for the **currently authenticated user** with skills.

### POST /api/experience
Create new experience. Requires Authentication.

**Request Body (application/json):**
```json
// Fields
// startYear: number (required)
// endYear: number (optional) - null means current
// companyName: string (required)
// description: string (optional)
// location: string (required)
// skillIds: array of integers (optional, defaults to [])

{
  "startYear": 2020,
  "endYear": 2023,
  "companyName": "Tech Corp",
  "description": "Led development of microservices architecture...",
  "location": "San Francisco, CA",
  "skillIds": [1, 2]
}
```
**Note:** `endYear` can be `null` for current employment.

### PUT /api/experience/:id
Update experience. Requires Authentication.

### DELETE /api/experience/:id
Delete experience. Requires Authentication.

---

## Education

### GET /api/education
Get all education for the **currently authenticated user**.

### GET /api/education/:id
Get education by ID for the **currently authenticated user**.

### POST /api/education
Create new education. Requires Authentication.

**Request Body (application/json):**
```json
// Fields
// year: string (required)
// institutionName: string (required)
// degree: string (required)
// description: string (optional)

{
  "year": "2015-2019",
  "institutionName": "University of Technology",
  "degree": "{\"en\": \"Bachelor of Science in Computer Science\"}",
  "description": "{\"en\": \"Graduated with honors.\"}"
}
```

### PUT /api/education/:id
Update education. Requires Authentication.

### DELETE /api/education/:id
Delete education. Requires Authentication.

---

## Certifications

### GET /api/certifications
Get all certifications for the **currently authenticated user** with related skills.

### GET /api/certifications/:id
Get certification by ID for the **currently authenticated user** with skills.

### POST /api/certifications
Create new certification. Requires Authentication.

**Request Body (application/json):**
```json
// Fields
// name: string (required)
// issuingOrganization: string (required)
// year: number (required)
// description: string (optional)
// certificateLink: url string (optional)
// skillIds: array of integers (optional, defaults to [])

{
  "name": "AWS Certified Solutions Architect",
  "issuingOrganization": "Amazon Web Services",
  "year": 2023,
  "description": "Professional level certification for AWS architecture",
  "certificateLink": "https://aws.amazon.com/verify/...",
  "skillIds": [1, 2]
}
```

### PUT /api/certifications/:id
Update certification. Requires Authentication.

### DELETE /api/certifications/:id
Delete certification. Requires Authentication.

---

## Projects

### GET /api/projects
Get all projects for the **currently authenticated user.** (Admin endpoint).

**Query Parameters (Optional):**
- `lang` (string): Target language (default: `en`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `published` (boolean): Filter by publication status (`true` / `false`)
- `highlighted` (boolean): Filter by highlight status (`true` / `false`)
- `search` (string): Case-insensitive search by project title
- `tag` (number): Filter projects by a specific `tagId`

**Response Format (Paginated):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "E-Commerce App",
      // ... other project fields
      "projectSkills": [ ... ],
      "projectTags": [ ... ]
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET /api/projects/:slug
Get project by slug for the **currently authenticated user** with skills.

**Query Parameters (Optional):**
- `lang` (string): Target language (default: `en`)

### POST /api/projects
Create new project. Requires Authentication.

**Request Body (multipart/form-data):**
- `title`: string (required)
- `slug`: string - lowercase with hyphens only (required)
- `description`: string (required)
- `content`: string - markdown (required)
- `published`: boolean (optional, defaults to false)
- `highlighted`: boolean (optional, defaults to false)
- `publishedAt`: string - ISO datestring format (optional)
- `client`: string (optional)
- `services`: string (optional)
- `year`: number (required)
- `industry`: string (optional)
- `challenge`: string - markdown (optional)
- `myRole`: string - markdown (optional)
- `outcome`: string - markdown (optional)
- `skillIds`: array submitted as multiple fields or comma-separated depending on validation wrapper (optional)
- `tagIds`: array of tag integers (optional)
- `coverImage` (File): image file for the main cover, max count 1. (optional)
- `contentImages` (Files): array of image files associated with content, max count 20. (optional)

### PUT /api/projects/:id
Update project. Requires Authentication.

**Request Body (multipart/form-data):**
- Same fields as POST.
- `existingContentImages`: stringified JSON array of retained `contentImages` URLs.

### DELETE /api/projects/:id
Delete project. Requires Authentication.

---

## File Uploads (General)

### POST /api/upload
Upload a single ad-hoc file to Cloudflare R2 bucket.

**Request Body (multipart/form-data):**
- `image` (File): **Required** image file upload.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://pub-...r2.dev/...",
    "fileId": "uuid",
    "name": "file.jpg",
    "size": 102450,
    "width": 800,
    "height": 600
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Cloudflare R2 Integration

This API routes file uploads using the `@aws-sdk/client-s3` to a Cloudflare R2 bucket, replacing the old ImageKit implementation. File paths are automatically constructed inside the R2 bucket (`users`, `skills`, `projects`, `uploads` folders) tied to the `username` to prevent conflicts.

---

## Social Media Format

The `socialMedias` field in user details accepts a JSON stringified array of strings in this format:

```
"PhosphorIconName|URL"
```

Examples:
```json
[
  "GithubLogo|https://github.com/username",
  "LinkedinLogo|https://linkedin.com/in/username",
  "TwitterLogo|https://twitter.com/username",
  "Globe|https://yourwebsite.com"
]
```

Use Phosphor icon names from: https://phosphoricons.com
