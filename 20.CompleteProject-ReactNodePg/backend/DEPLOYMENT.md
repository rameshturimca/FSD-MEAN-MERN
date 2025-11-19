# Deployment Guide

This guide covers deploying the FSD App REST API to production environments.

## Environment Setup

### Database Schema Setup

Connect to PostgreSQL and run the following SQL to ensure tables exist:

```sql
-- Connect to fsd_app database
\c fsd_app

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    salary DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data if needed
INSERT INTO employees (name, position, email, salary) VALUES
    ('Alice Johnson', 'Developer', 'alice@example.com', 70000),
    ('Bob Smith', 'Manager', 'bob@example.com', 85000)
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (name, description, price, quantity) VALUES
    ('Widget A', 'A great widget', 19.99, 100),
    ('Gadget X', 'Top-notch gadget', 49.50, 25)
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password, name) VALUES
    ('admin@example.com', '$2b$10$e0NRZ8b6W9qz1jH3rfr0yO2gLEFhDgS4rQxjw6m6aUoQkW7zZbY3i', 'Administrator')
ON CONFLICT (email) DO NOTHING;
```

## Local Development

### Prerequisites
- Node.js v14+
- npm or yarn
- PostgreSQL 12+

### Setup Steps

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd REST-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## Production Deployment

### Using Node Process Manager (PM2)

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 ecosystem file** (`ecosystem.config.js`)
   ```javascript
   module.exports = {
     apps: [{
       name: 'fsd-api',
       script: './src/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       },
       error_file: './logs/error.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time_format: 'YYYY-MM-DD HH:mm:ss Z'
     }]
   };
   ```

3. **Start the application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Using Docker

1. **Create a Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY src ./src
   COPY .env .env

   EXPOSE 5000

   CMD ["node", "src/server.js"]
   ```

2. **Create a .dockerignore file**
   ```
   node_modules
   npm-debug.log
   .git
   .gitignore
   README.md
   ```

3. **Build and run**
   ```bash
   docker build -t fsd-api:1.0 .
   docker run -d -p 5000:5000 --name fsd-api fsd-api:1.0
   ```

### Using Docker Compose

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     db:
       image: postgres:15-alpine
       environment:
         POSTGRES_DB: fsd_app
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: your_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"

     api:
       build: .
       ports:
         - "5000:5000"
       environment:
         - DB_HOST=db
         - DB_USER=postgres
         - DB_PASSWORD=your_password
         - DB_NAME=fsd_app
         - NODE_ENV=production
       depends_on:
         - db
       volumes:
         - ./logs:/app/logs

   volumes:
     postgres_data:
   ```

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

### Using Nginx as Reverse Proxy

1. **Nginx configuration** (`/etc/nginx/sites-available/fsd-api`)
   ```nginx
   upstream fsd_api {
       server 127.0.0.1:5000;
       keepalive 64;
   }

   server {
       listen 80;
       server_name api.example.com;

       location / {
           proxy_pass http://fsd_api;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

2. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/fsd-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=fsd_app
DB_USER=postgres
DB_PASSWORD=strong_password_here
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

## Health Monitoring

### Using PM2 Monitoring
```bash
pm2 monit
```

### Using curl for health checks
```bash
curl -X GET http://localhost:5000/api/health
```

### Create a health check script
```bash
#!/bin/bash
HEALTH=$(curl -s http://localhost:5000/api/health | jq '.success')
if [ "$HEALTH" != "true" ]; then
    echo "API is down! Restarting..."
    pm2 restart fsd-api
fi
```

## Backup and Maintenance

### Database Backup
```bash
pg_dump -U postgres -d fsd_app > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
psql -U postgres -d fsd_app < backup_file.sql
```

### Log Rotation
Add to crontab for automatic log rotation:
```bash
0 0 * * * find /app/logs -name "*.log" -mtime +30 -delete
```

## Performance Optimization

### Database Connection Pooling
The application uses PostgreSQL connection pooling. Adjust pool size in `.env`:
```env
DB_POOL_MIN=2
DB_POOL_MAX=20
```

### Caching Strategy
Consider implementing Redis for caching frequently accessed data:
```javascript
const redis = require('redis');
const client = redis.createClient();
```

### Rate Limiting
Add rate limiting middleware to prevent abuse:
```bash
npm install express-rate-limit
```

## Security Best Practices

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Environment Variables** - Never commit `.env` files
3. **CORS Configuration** - Restrict to trusted domains
4. **Input Validation** - Validate all incoming data
5. **SQL Injection Prevention** - Always use parameterized queries (already implemented)
6. **Password Security** - Use bcrypt hashing (already implemented)
7. **API Keys** - Implement API authentication if needed

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000  # Find process using port 5000
kill -9 <PID>  # Kill the process
```

### Database Connection Issues
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Check network connectivity to database host
- Review PostgreSQL logs for errors

### Memory Leaks
```bash
pm2 logs fsd-api  # Check application logs
node --inspect src/server.js  # Debug with Node inspector
```

## Scaling

### Horizontal Scaling with Load Balancer
1. Run multiple instances of the API
2. Use a load balancer (HAProxy, Nginx, AWS ELB)
3. Use shared database for all instances
4. Implement session management if needed

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching layer
- Use CDN for static content

## Support

For issues or questions:
- Check the README.md
- Review API_TESTING.md for endpoint documentation
- Check application logs in `/logs` directory
- Review PostgreSQL logs for database issues
