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
  password: '123',             // 👈 update with your password
  database: 'dbcustomer',      // 👈 update with your DB name
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
