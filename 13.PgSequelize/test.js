// test.js
const { Sequelize, DataTypes } = require('sequelize');

// Create Sequelize instance (update credentials as needed)
const sequelize = new Sequelize('dbcustomer', 'postgres', '123', {
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
