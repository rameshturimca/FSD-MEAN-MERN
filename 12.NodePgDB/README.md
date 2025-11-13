Let’s build a **Node.js project** that connects to **PostgreSQL** and reads data from the `customers` table — with a clean folder structure.

Below are **step-by-step instructions** for setting it up on **Windows** using **Command Prompt**.

---

## 🧩 Step 1: Create the Project Folder

In Command Prompt:

```bash
mkdir 12.NodePgDB
cd 12.NodePgDB
```

---

## ⚙️ Step 2: Initialize Node.js Project

```bash
npm init -y
```

This creates a `package.json` file.

---

## 📦 Step 3: Install Required Dependencies

Install PostgreSQL client (`pg`) and dotenv for environment variables:

```bash
npm install pg dotenv
```

---

## 📁 Step 4: Create Folder Structure

Create this structure:

```
12.NodePgDB/
│
├── .env
├── package.json
├── app.js
│
├── config/
│   └── db.js
│
└── models/
    └── customerModel.js
```

Create folders:

```bash
mkdir config
mkdir models
```

---

## 🧷 Step 5: Set Up `.env` File

Create a `.env` file in the project root:

```env
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=your_database
PGPORT=5432
```

*(Replace values with your PostgreSQL credentials.)*

---

## ⚙️ Step 6: Configure Database Connection (`config/db.js`)

```js
// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

module.exports = pool;
```

---

## 📘 Step 7: Create Model to Fetch Customers (`models/customerModel.js`)

```js
// models/customerModel.js
const pool = require('../config/db');

async function getAllCustomers() {
  const result = await pool.query('SELECT * FROM customers');
  return result.rows;
}

module.exports = { getAllCustomers };
```

---

## 🚀 Step 8: Create Main App File (`app.js`)

```js
// app.js
const { getAllCustomers } = require('./models/customerModel');

(async () => {
  try {
    const customers = await getAllCustomers();
    console.log('Customer Data:');
    console.table(customers);
  } catch (err) {
    console.error('Error fetching customers:', err.message);
  } finally {
    process.exit();
  }
})();
```

---

## ▶️ Step 9: Run the Application

In Command Prompt:

```bash
node app.js
```

If your database connection is correct, you’ll see output like:

```
Customer Data:
┌─────────┬───────────────┬──────────────┬─────────────────────┬─────────────┬─────────────┬────────────┬────────────┐
│ (index) │ customer_id   │ first_name   │ last_name           │ email       │ city        │ country    │ total_spent│
├─────────┼───────────────┼──────────────┼─────────────────────┼─────────────┼─────────────┼────────────┼────────────┤
│    0    │ 1             │ John         │ Doe                 │ john@x.com  │ New York    │ USA        │ 500.00     │
└─────────┴───────────────┴──────────────┴─────────────────────┴─────────────┴─────────────┴────────────┴────────────┘
```

---

## ✅ Summary

You now have a structured Node.js app that:

* Loads config from `.env`
* Connects to PostgreSQL
* Reads and prints data from the `customers` table

---
