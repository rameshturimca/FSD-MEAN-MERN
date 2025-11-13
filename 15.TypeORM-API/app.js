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
  password: '123',   // 👈 your PostgreSQL password
  database: 'dbcustomer',   // 👈 your PostgreSQL database
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
