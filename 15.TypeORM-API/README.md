Let’s take your **TypeORM + PostgreSQL** setup and turn it into a small but structured **Node.js “Customers Management API”**.

We’ll use **Express.js** and **TypeORM** to build REST endpoints (CRUD) backed by your existing `customers` table.

---

## 🧩 Overview

You’ll get:

* `/customers` → Get all customers
* `/customers/:id` → Get one customer
* `/customers` (POST) → Add a new customer
* `/customers/:id` (PUT) → Update a customer
* `/customers/:id` (DELETE) → Delete a customer

---

## 🏗 Step 1: Install Dependencies

In your project folder:

```bash
npm init -y
npm install express typeorm reflect-metadata pg body-parser
```

---

## 📁 Step 2: Project Structure

Simple layout:

```
node-typeorm-api/
│
├── app.js
└── package.json
```

Everything in one file (`app.js`) for clarity.

---

## ⚙️ Step 3: Create `app.js`

```js
// app.js
require('reflect-metadata');
const express = require('express');
const bodyParser = require('body-parser');
const { DataSource, EntitySchema } = require('typeorm');

// ✅ Define Customer Entity
const CustomerSchema = new EntitySchema({
  name: 'Customer',
  tableName: 'customers',
  columns: {
    customer_id: {
      primary: true,
      type: Number,
      generated: true,
    },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    city: { type: String },
    country: { type: String },
    join_date: { type: Date },
    total_spent: { type: 'decimal', precision: 10, scale: 2, nullable: true },
  },
});

// ✅ Setup TypeORM Data Source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',        // 👈 your PostgreSQL username
  password: 'your_password',   // 👈 your PostgreSQL password
  database: 'your_database',   // 👈 your PostgreSQL database
  synchronize: false,          // don’t auto-create tables
  logging: false,
  entities: [CustomerSchema],
});

// ✅ Express App Setup
const app = express();
app.use(bodyParser.json());

let customerRepo;

// Connect DB first, then start API
AppDataSource.initialize()
  .then(() => {
    console.log('✅ PostgreSQL connected via TypeORM');
    customerRepo = AppDataSource.getRepository('Customer');

    // --- API Routes ---

    // Get all customers
    app.get('/customers', async (req, res) => {
      const customers = await customerRepo.find();
      res.json(customers);
    });

    // Get one customer
    app.get('/customers/:id', async (req, res) => {
      const customer = await customerRepo.findOneBy({ customer_id: parseInt(req.params.id) });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      res.json(customer);
    });

    // Add a new customer
    app.post('/customers', async (req, res) => {
      const newCustomer = customerRepo.create(req.body);
      const saved = await customerRepo.save(newCustomer);
      res.status(201).json(saved);
    });

    // Update a customer
    app.put('/customers/:id', async (req, res) => {
      const id = parseInt(req.params.id);
      const customer = await customerRepo.findOneBy({ customer_id: id });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      customerRepo.merge(customer, req.body);
      const updated = await customerRepo.save(customer);
      res.json(updated);
    });

    // Delete a customer
    app.delete('/customers/:id', async (req, res) => {
      const result = await customerRepo.delete({ customer_id: parseInt(req.params.id) });
      if (result.affected === 0) return res.status(404).json({ message: 'Customer not found' });
      res.json({ message: 'Customer deleted' });
    });

    // --- Start Server ---
    const PORT = 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ DB Connection Error:', err.message));
```

---

## ▶️ Step 4: Run It

In Command Prompt (from your project folder):

```bash
node app.js
```

If successful, you’ll see:

```
✅ PostgreSQL connected via TypeORM
🚀 Server running on http://localhost:3000
```

---

## 🧪 Step 5: Test the API

Use a tool like **Postman** or **curl**.

### Get all customers:

```bash
curl http://localhost:3000/customers
```

### Get one customer:

```bash
curl http://localhost:3000/customers/1
```

### Add a customer:

```bash
curl -X POST http://localhost:3000/customers ^
  -H "Content-Type: application/json" ^
  -d "{\"first_name\":\"Alice\",\"last_name\":\"Brown\",\"email\":\"alice@example.com\",\"city\":\"Boston\",\"country\":\"USA\",\"join_date\":\"2024-01-01\",\"total_spent\":250.50}"
```

### Update:

```bash
curl -X PUT http://localhost:3000/customers/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"city\":\"Chicago\"}"
```

### Delete:

```bash
curl -X DELETE http://localhost:3000/customers/1
```

---

## ✅ Summary

You now have a **Node.js + Express + TypeORM** REST API that fully manages your `customers` table with **PostgreSQL persistence** — all in a single `app.js` file.

---

