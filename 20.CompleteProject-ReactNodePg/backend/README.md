# FSD App REST API

A comprehensive Node.js REST API built with Express and PostgreSQL for managing employees, products, and users.

## Features

- ✅ Full CRUD operations for Employees, Products, and Users
- ✅ PostgreSQL database integration
- ✅ Password hashing with bcrypt
- ✅ CORS support
- ✅ Environment configuration with dotenv
- ✅ Error handling and validation
- ✅ RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database running
- npm or yarn package manager

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Update `.env` file with your PostgreSQL credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fsd_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   NODE_ENV=development
   ```

3. **Ensure PostgreSQL has the required tables**
   
   The database should have these three tables:
   - `employees` (id, name, position, email, salary)
   - `products` (id, name, description, price, quantity)
   - `users` (id, email, password, name)

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Utilities
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation

## Request/Response Examples

### Get All Employees
```bash
curl http://localhost:5000/api/employees
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "position": "Developer",
      "email": "alice@example.com",
      "salary": 70000
    }
  ],
  "count": 1
}
```

### Create New Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "position": "Senior Developer",
    "email": "john@example.com",
    "salary": 90000
  }'
```

### Create New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "Test User"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

## Project Structure

```
src/
├── config/
│   └── database.js       # Database connection setup
├── controllers/
│   ├── employeeController.js
│   ├── productController.js
│   └── userController.js
├── routes/
│   ├── employees.js
│   ├── products.js
│   └── users.js
└── server.js             # Main Express server

.env                       # Environment variables (create this file)
package.json              # Dependencies and scripts
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Security Considerations

- User passwords are hashed using bcrypt
- Passwords are never returned in API responses
- Use environment variables for sensitive data
- Enable CORS only for trusted domains in production

## Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **express-validator** - Input validation
- **bcrypt** - Password hashing
- **nodemon** - Development auto-reload

## License

ISC
