---

## 🧩 Step-by-Step: One-File Example Using Sequelize

### 1️⃣ Install Dependencies

In your project folder (e.g., `hello-sequelize`):

```bash
npm init -y
npm install sequelize pg pg-hstore
```

---

### 2️⃣ Create a Single Test File

Create a file named **`test.js`** with this content:

```js
// test.js
const { Sequelize, DataTypes } = require('sequelize');

// Create Sequelize instance (update credentials as needed)
const sequelize = new Sequelize('your_database', 'postgres', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

// Define the Customer model
const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  city: DataTypes.STRING,
  country: DataTypes.STRING,
  join_date: DataTypes.DATE,
  total_spent: DataTypes.DECIMAL(10, 2),
}, {
  tableName: 'customers',
  timestamps: false, // if your table doesn’t have createdAt/updatedAt
});

// Run SELECT query
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL successfully.');

    const customers = await Customer.findAll();
    console.table(customers.map(c => c.toJSON()));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
})();
```

---

### 3️⃣ Run the Script

In Command Prompt:

```bash
node test.js
```

✅ If your database and credentials are correct, you’ll see:

```
✅ Connected to PostgreSQL successfully.
┌─────────┬───────────────┬────────────┬─────────────────────┬──────────┬────────────┬────────────┬────────────┐
│ (index) │ customer_id   │ first_name │ last_name           │ email    │ city       │ country    │ total_spent│
├─────────┼───────────────┼────────────┼─────────────────────┼──────────┼────────────┼────────────┼────────────┤
│    0    │ 1             │ John       │ Doe                 │ john@x.com │ New York  │ USA        │ 500.00     │
└─────────┴───────────────┴────────────┴─────────────────────┴──────────┴────────────┴────────────┴────────────┘
```

---

