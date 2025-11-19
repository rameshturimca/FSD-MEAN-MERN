# API Testing Guide

This document provides curl commands and examples to test all endpoints of the FSD App REST API.

## Prerequisites

- API server running on `http://localhost:5000`
- curl installed (or use any HTTP client like Postman)

## Testing Commands

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Employees Endpoints

#### Get all employees
```bash
curl http://localhost:5000/api/employees
```

#### Get employee by ID
```bash
curl http://localhost:5000/api/employees/1
```

#### Create new employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "position": "Senior Developer",
    "email": "john@example.com",
    "salary": 95000
  }'
```

#### Update employee
```bash
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson Updated",
    "position": "Senior Developer",
    "email": "alice.updated@example.com",
    "salary": 80000
  }'
```

#### Delete employee
```bash
curl -X DELETE http://localhost:5000/api/employees/2
```

---

### Products Endpoints

#### Get all products
```bash
curl http://localhost:5000/api/products
```

#### Get product by ID
```bash
curl http://localhost:5000/api/products/1
```

#### Create new product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Widget",
    "description": "Premium quality widget",
    "price": 29.99,
    "quantity": 150
  }'
```

#### Update product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Widget A Updated",
    "description": "An amazing widget",
    "price": 24.99,
    "quantity": 120
  }'
```

#### Delete product
```bash
curl -X DELETE http://localhost:5000/api/products/2
```

---

### Users Endpoints

#### Get all users (passwords not included)
```bash
curl http://localhost:5000/api/users
```

#### Get user by ID
```bash
curl http://localhost:5000/api/users/1
```

#### Create new user
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "name": "New User"
  }'
```

#### Update user
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin.updated@example.com",
    "name": "Administrator Updated"
  }'
```

#### Delete user
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

---

## Using Postman

1. Open Postman
2. Create a new collection called "FSD API"
3. Add requests for each endpoint
4. Set the base URL variable to `http://localhost:5000`
5. Test each endpoint with appropriate request bodies

### Example Postman Collection

You can import the following collection JSON into Postman:

```json
{
  "info": {
    "name": "FSD App API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Employees",
      "item": [
        {
          "name": "Get All",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/employees"
          }
        },
        {
          "name": "Get By ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/employees/1"
          }
        },
        {
          "name": "Create",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/employees",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"John Doe\", \"position\": \"Developer\", \"email\": \"john@example.com\", \"salary\": 75000}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

---

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* object or array */ },
  "count": 1,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

---

## Troubleshooting

### Connection Refused
- Ensure the API server is running: `npm run dev`
- Check if the port 5000 is available
- Verify `.env` configuration

### Database Connection Error
- Ensure PostgreSQL is running
- Verify `.env` credentials match your database
- Check if the database `fsd_app` exists

### 404 Not Found
- Verify the endpoint URL is correct
- Check for typos in the route
- Ensure the resource ID exists

---

## Performance Testing

To load test the API:

```bash
# Using Apache Bench (ab)
ab -n 1000 -c 10 http://localhost:5000/api/employees

# Using wrk (if installed)
wrk -t4 -c100 -d30s http://localhost:5000/api/employees
```

---

## Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed with bcrypt and never returned
- IDs are auto-incremented integers
- All monetary values are in decimal format with 2 decimal places
