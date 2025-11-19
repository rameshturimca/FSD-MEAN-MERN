# Quick Start Guide

Get the FSD App REST API up and running in 5 minutes!

## Step 1: Prerequisites Check ✓

- **Node.js**: Check with `node --version` (need v14+)
- **npm**: Check with `npm --version`
- **PostgreSQL**: Must be running with `fsd_app` database

## Step 2: Configure Database Connection

Edit `.env` file in the project root:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fsd_app
DB_USER=postgres
DB_PASSWORD=your_actual_password
NODE_ENV=development
```

⚠️ **Replace `your_actual_password` with your PostgreSQL password**

## Step 3: Verify Database Tables

Ensure your PostgreSQL database has these tables. Connect to psql:

```bash
psql -U postgres
\c fsd_app
\dt
```

You should see:
- `employees`
- `products`
- `users`

If tables don't exist, create them using the SQL in `DEPLOYMENT.md`.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

You should see:
```
✓ Server running on port 5000
✓ API documentation: http://localhost:5000
✓ Health check: http://localhost:5000/api/health
```

## Step 6: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all employees
curl http://localhost:5000/api/employees

# Get all products
curl http://localhost:5000/api/products

# Get all users (without passwords)
curl http://localhost:5000/api/users
```

## Common Tasks

### Create a New Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "position": "Designer",
    "email": "jane@example.com",
    "salary": 72000
  }'
```

### Create a New Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Widget",
    "description": "High quality widget",
    "price": 59.99,
    "quantity": 200
  }'
```

### Create a New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123",
    "name": "New User"
  }'
```

### Get Specific Employee
```bash
curl http://localhost:5000/api/employees/1
```

### Update Employee
```bash
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson Updated",
    "position": "Senior Developer",
    "email": "alice.updated@example.com",
    "salary": 85000
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:5000/api/employees/1
```

## Project Structure

```
REST-API/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── controllers/
│   │   ├── employeeController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── employees.js
│   │   ├── products.js
│   │   └── users.js
│   └── server.js                # Main Express app
├── .env                         # Configuration (UPDATE THIS!)
├── package.json                 # Dependencies
├── README.md                    # Full documentation
├── API_TESTING.md               # Detailed testing guide
└── DEPLOYMENT.md                # Deployment instructions
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/health` | Health check |

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### "Port 5000 already in use"
Change the port in `.env`:
```env
PORT=5001
```

### "Database connection refused"
Check:
1. PostgreSQL is running
2. Credentials in `.env` are correct
3. Database `fsd_app` exists
4. User has proper permissions

### "Module 'pg' not found"
Run: `npm install`

### API not responding
1. Check if server is running: `npm run dev`
2. Try health check: `curl http://localhost:5000/api/health`
3. Check console for error messages

## VS Code Tasks

In VS Code, you can run tasks from the Command Palette (`Ctrl+Shift+P`):

1. **Start API Server (Dev)** - Runs with auto-reload
2. **Start API Server (Production)** - Production mode
3. **Install Dependencies** - Runs npm install

Or press `Ctrl+Shift+B` to run the default task.

## Next Steps

1. Read full documentation in `README.md`
2. Check `API_TESTING.md` for comprehensive testing guide
3. Review `DEPLOYMENT.md` for production deployment
4. Use VS Code debugger for advanced debugging
5. Set up version control with Git

## Support Resources

- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **npm**: https://docs.npmjs.com/

---

**Happy coding! 🚀**
