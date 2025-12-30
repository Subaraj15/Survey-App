# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (400):**

```json
{
  "message": "Email already exists"
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (401):**

```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

**GET** `/auth/me`

Get current authenticated user details.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error (401):**

```json
{
  "message": "Invalid token"
}
```

---

## Survey Endpoints

### 1. Create Survey

**POST** `/surveys`

Create a new survey. **Protected**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Customer Satisfaction Survey",
  "description": "Please rate your experience with our service",
  "questions": [
    {
      "text": "How satisfied are you with our service?",
      "type": "rating",
      "required": true
    },
    {
      "text": "Which product do you prefer?",
      "type": "multiple-choice",
      "options": ["Product A", "Product B", "Product C"],
      "required": true
    },
    {
      "text": "Additional comments?",
      "type": "long-answer",
      "required": false
    }
  ]
}
```

**Response (201):**

```json
{
  "message": "Survey created successfully",
  "survey": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Customer Satisfaction Survey",
    "description": "Please rate your experience with our service",
    "creator": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "questions": [...],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Get All Surveys

**GET** `/surveys`

Get all active surveys (public endpoint).

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Customer Satisfaction Survey",
    "description": "Please rate your experience",
    "creator": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "text": "How satisfied are you?",
        "type": "rating",
        "required": true
      }
    ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 3. Get Survey by ID

**GET** `/surveys/:id`

Get a specific survey by ID.

**Parameters:**

- `id` - Survey ID

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Customer Satisfaction Survey",
  "description": "Please rate your experience",
  "creator": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe"
  },
  "questions": [...],
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Get User's Surveys

**GET** `/surveys/user/my-surveys`

Get all surveys created by the current user. **Protected**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Customer Satisfaction Survey",
    "questions": [...],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 5. Update Survey

**PUT** `/surveys/:id`

Update a survey. **Protected** (only creator can update)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Survey Title",
  "description": "Updated description",
  "questions": [...],
  "isActive": false
}
```

**Response (200):**

```json
{
  "message": "Survey updated successfully",
  "survey": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Survey Title",
    ...
  }
}
```

---

### 6. Delete Survey

**DELETE** `/surveys/:id`

Delete a survey. **Protected** (only creator can delete)

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Survey deleted successfully"
}
```

---

## Response Endpoints

### 1. Submit Survey Response

**POST** `/responses/submit`

Submit a response to a survey. **Protected**

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "surveyId": "507f1f77bcf86cd799439012",
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439013",
      "answer": 5
    },
    {
      "questionId": "507f1f77bcf86cd799439014",
      "answer": "Product A"
    },
    {
      "questionId": "507f1f77bcf86cd799439015",
      "answer": "Great service!"
    }
  ]
}
```

**Response (201):**

```json
{
  "message": "Response submitted successfully",
  "response": {
    "_id": "507f1f77bcf86cd799439016",
    "survey": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Customer Satisfaction Survey"
    },
    "respondent": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "answers": [...],
    "submittedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 2. Get Survey Responses

**GET** `/responses/survey/:surveyId`

Get all responses for a survey. **Protected** (only creator can view)

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `surveyId` - Survey ID

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "survey": "507f1f77bcf86cd799439012",
    "respondent": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "answers": [...],
    "submittedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

### 3. Get Survey Statistics

**GET** `/responses/survey/:surveyId/stats`

Get statistics for a survey responses.

**Parameters:**

- `surveyId` - Survey ID

**Response (200):**

```json
{
  "totalResponses": 42,
  "survey": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Customer Satisfaction Survey",
    "totalQuestions": 3
  },
  "questionStats": [
    {
      "questionId": "507f1f77bcf86cd799439013",
      "questionText": "How satisfied are you?",
      "questionType": "rating",
      "totalAnswers": 42,
      "answerBreakdown": {
        "1": 2,
        "2": 3,
        "3": 5,
        "4": 15,
        "5": 17
      }
    },
    {
      "questionId": "507f1f77bcf86cd799439014",
      "questionText": "Which product do you prefer?",
      "questionType": "multiple-choice",
      "totalAnswers": 40,
      "answerBreakdown": {
        "Product A": 15,
        "Product B": 12,
        "Product C": 13
      }
    }
  ]
}
```

---

### 4. Get User's Responses

**GET** `/responses/user/my-responses`

Get all responses submitted by current user. **Protected**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "survey": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Customer Satisfaction Survey",
      "description": "Please rate your experience"
    },
    "answers": [...],
    "submittedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

## Error Responses

### Validation Error (400)

```json
{
  "message": "All fields are required"
}
```

### Authentication Error (401)

```json
{
  "message": "Invalid token"
}
```

### Authorization Error (403)

```json
{
  "message": "Unauthorized to access this resource"
}
```

### Not Found Error (404)

```json
{
  "message": "Survey not found"
}
```

### Server Error (500)

```json
{
  "message": "Internal server error"
}
```

---

## Question Types

### 1. Multiple Choice

```json
{
  "text": "Which option do you prefer?",
  "type": "multiple-choice",
  "options": ["Option A", "Option B", "Option C"],
  "required": true
}
```

### 2. Short Answer

```json
{
  "text": "What is your name?",
  "type": "short-answer",
  "required": true
}
```

### 3. Long Answer

```json
{
  "text": "Please provide detailed feedback",
  "type": "long-answer",
  "required": false
}
```

### 4. Rating

```json
{
  "text": "How would you rate our service?",
  "type": "rating",
  "required": true
}
```

---

## Status Codes

| Code | Meaning                                |
| ---- | -------------------------------------- |
| 200  | OK - Request succeeded                 |
| 201  | Created - Resource created             |
| 400  | Bad Request - Invalid data             |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Access denied              |
| 404  | Not Found - Resource not found         |
| 500  | Server Error - Internal error          |

---

## Rate Limiting

Currently, there are no rate limits. In production, implement rate limiting for security.

---

## Pagination

Currently, all list endpoints return all results. For large datasets, pagination should be implemented.

---

## CORS

The API is configured to accept requests from the frontend running on `http://localhost:3000`.
