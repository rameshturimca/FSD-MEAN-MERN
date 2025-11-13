let’s do the same thing, but this time using **TypeORM** — still in **one single file**, no folders or complex setup.

We’ll connect to PostgreSQL and perform:

```sql
SELECT * FROM customers;
```

---

## 🧩 Step-by-Step: One-File PostgreSQL Test Using TypeORM

### 1️⃣ Install Required Packages

In your project folder (e.g., `hello-typeorm`):

```bash
npm init -y
npm install typeorm reflect-metadata pg
```

> ⚠️ TypeORM requires `"experimentalDecorators"` and `"emitDecoratorMetadata"` if you use TypeScript — but we’ll use plain JavaScript for simplicity.

---

### 2️⃣ Create a Single File — `test.js`

Create a file named **`test.js`** with this content:

```js
// test.js
require('reflect-metadata');
const { DataSource, EntitySchema } = require('typeorm');

// Define the Customer entity (matches your PostgreSQL table)
const CustomerSchema = new EntitySchema({
  name: 'Customer',
  tableName: 'customers',
  columns: {
    customer_id: {
      type: Number,
      primary: true,
      generated: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    join_date: {
      type: Date,
    },
    total_spent: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
  },
});

// Create TypeORM Data Source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',        // 👈 update with your username
  password: 'your_password',   // 👈 update with your password
  database: 'your_database',   // 👈 update with your DB name
  synchronize: false,          // don't modify schema automatically
  logging: false,
  entities: [CustomerSchema],
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to PostgreSQL successfully.');

    const customerRepo = AppDataSource.getRepository('Customer');
    const customers = await customerRepo.find();

    console.table(customers);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await AppDataSource.destroy();
  }
})();
```

---

### 3️⃣ Run It

In Command Prompt:

```bash
node test.js
```

If everything’s correct, you’ll see:

```
✅ Connected to PostgreSQL successfully.
┌─────────┬───────────────┬────────────┬─────────────────────┬──────────┬────────────┬────────────┬────────────┐
│ (index) │ customer_id   │ first_name │ last_name           │ email    │ city       │ country    │ total_spent│
├─────────┼───────────────┼────────────┼─────────────────────┼──────────┼────────────┼────────────┼────────────┤
│    0    │ 1             │ John       │ Doe                 │ john@x.com │ New York  │ USA        │ 500.00     │
└─────────┴───────────────┴────────────┴─────────────────────┴──────────┴────────────┴────────────┴────────────┘
```

---

## ✅ Summary

| Tool          | Command to Install                        | Highlights                           |
| ------------- | ----------------------------------------- | ------------------------------------ |
| **Sequelize** | `npm install sequelize pg pg-hstore`      | Simpler, JS-first ORM                |
| **TypeORM**   | `npm install typeorm reflect-metadata pg` | Decorator-based, supports both JS/TS |

---

Would you like me to show the **TypeScript** version next (so you can use TypeORM the “proper” way with decorators and entities)?
