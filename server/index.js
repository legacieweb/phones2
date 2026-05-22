import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import pg from 'pg';

const { Pool } = pg;

// Use override: true to ensure .env values take precedence over system env vars
dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize Database Tables
async function initDb() {
  try {
    const client = await pool.connect();
    try {
      console.log('Starting database initialization...');
      // Create Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          is_premium BOOLEAN DEFAULT FALSE,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table checked/created');

      // Ensure columns exist in users
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_premium') THEN
                ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
                ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
            END IF;
        END $$;
      `);
      console.log('Users columns migration checked');

      // Create Orders table
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
          customer_email VARCHAR(255),
          customer_name VARCHAR(255),
          shipping_address TEXT,
          city VARCHAR(255),
          country VARCHAR(255),
          items JSONB NOT NULL,
          total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
          total DECIMAL(10, 2) NOT NULL DEFAULT 0,
          status VARCHAR(50) DEFAULT 'processing',
          payment_status VARCHAR(50) DEFAULT 'paid',
          payment_reference VARCHAR(255),
          payment_type VARCHAR(50) DEFAULT 'paystack',
          deposit_amount DECIMAL(10, 2) DEFAULT 0,
          balance_amount DECIMAL(10, 2) DEFAULT 0,
          order_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Orders table checked/created');

      // Create Products table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          original_price DECIMAL(10, 2),
          description TEXT,
          short_description TEXT,
          category VARCHAR(100),
          images TEXT[],
          specifications JSONB,
          stock INTEGER DEFAULT 0,
          rating DECIMAL(3, 2) DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Products table checked/created');

      // Ensure columns exist (migration)
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_email') THEN
                ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
                ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'processing';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_status') THEN
                ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'paid';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_reference') THEN
                ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total') THEN
                ALTER TABLE orders ADD COLUMN total DECIMAL(10, 2) NOT NULL DEFAULT 0;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='order_data') THEN
                ALTER TABLE orders ADD COLUMN order_data JSONB;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='created_at') THEN
                ALTER TABLE orders ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='updated_at') THEN
                ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_name') THEN
                ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_address') THEN
                ALTER TABLE orders ADD COLUMN shipping_address TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='city') THEN
                ALTER TABLE orders ADD COLUMN city VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='country') THEN
                ALTER TABLE orders ADD COLUMN country VARCHAR(255);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='items') THEN
                ALTER TABLE orders ADD COLUMN items JSONB;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total_amount') THEN
                ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_type') THEN
                ALTER TABLE orders ADD COLUMN payment_type VARCHAR(50);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='deposit_amount') THEN
                ALTER TABLE orders ADD COLUMN deposit_amount DECIMAL(10, 2);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='balance_amount') THEN
                ALTER TABLE orders ADD COLUMN balance_amount DECIMAL(10, 2);
            END IF;
        END $$;
      `);
      console.log('Orders columns migration checked');
      
      console.log('Database initialization complete');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to database or initializing tables:', err);
  }
}
initDb();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo_key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@phones.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

console.log('--- Server Configuration ---');
console.log('PORT:', PORT);
console.log('ADMIN_EMAIL:', ADMIN_EMAIL);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'Not Defined');
console.log('PAYSTACK_SECRET_KEY:', PAYSTACK_SECRET_KEY ? `Defined (Length: ${PAYSTACK_SECRET_KEY.length}, Starts: ${PAYSTACK_SECRET_KEY.substring(0, 8)}, Ends: ${PAYSTACK_SECRET_KEY.substring(PAYSTACK_SECRET_KEY.length - 4)})` : 'Not Defined');
console.log('---------------------------');

// Health check and DB test
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      time: result.rows[0].now, 
      env: { 
        hasDbUrl: !!process.env.DATABASE_URL,
        paystackKeyLength: PAYSTACK_SECRET_KEY?.length,
        paystackKeyPrefix: PAYSTACK_SECRET_KEY?.substring(0, 8)
      } 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Customer Auth
app.post('/api/auth/signup', async (req, res) => {
  console.log('Signup attempt received:', req.body);
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ensure email is cleaned
    const cleanEmail = email.toLowerCase().trim();

    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name as "firstName", last_name as "lastName", is_premium as "isPremium"',
      [cleanEmail, password, firstName || null, lastName || null]
    );
    
    console.log('User created successfully:', cleanEmail);
    // Convert id to string to match existing frontend expectations
    const user = result.rows[0];
    user.id = user.id.toString();
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Signup error details:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Return the error message to the client for debugging
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login attempt received:', req.body.email);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT id, email, first_name as "firstName", last_name as "lastName", is_premium as "isPremium", status FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) AND password = $2',
      [email, password]
    );
    
    const user = result.rows[0];
    if (!user) {
      console.log('Invalid credentials for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      console.log('Suspended user attempted login:', email);
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    console.log('User logged in successfully:', email);
    user.id = user.id.toString();
    res.json(user);
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Initialize Paystack transaction
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    
    // Get key directly from process.env to ensure it's the latest
    const secretKey = process.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY;
    
    // Log key prefix for debugging
    console.log(`Using Paystack Secret Key starting with: ${secretKey?.substring(0, 12)}...`);

    if (!secretKey || secretKey === 'sk_test_replace_with_your_actual_secret_key' || secretKey === 'sk_test_demo_key') {
      console.error('Paystack error: Placeholder or missing secret key.');
      return res.status(500).json({ 
        error: 'Paystack configuration error', 
        details: 'The server is using a placeholder or missing secret key. Please update the PAYSTACK_SECRET_KEY in the .env file.' 
      });
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo/cents
        currency: 'USD',
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey.trim()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    const errorData = error.response?.data;
    console.error('Paystack initialization error:', errorData || error.message);
    res.status(500).json({ 
      error: 'Failed to initialize payment', 
      details: errorData?.message || error.message
    });
  }
});

// Verify Paystack transaction and save order
app.post('/api/orders', async (req, res) => {
  try {
    const { reference, orderData } = req.body;

    // Verify payment with Paystack
    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (verifyResponse.data.data.status === 'success') {
      const newOrder = {
        ...orderData,
        id: reference,
        status: 'processing',
        paymentStatus: 'paid',
        paymentReference: reference,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await pool.query(
        'INSERT INTO orders (id, customer_email, customer_name, shipping_address, city, country, items, total_amount, total, status, payment_status, payment_reference, payment_type, deposit_amount, balance_amount, order_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
        [
          reference, 
          orderData.customer.email, 
          `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          orderData.customer.address,
          orderData.customer.city,
          orderData.customer.country || 'USA', // Defaulting if not provided
          JSON.stringify(orderData.items),
          orderData.total,
          orderData.total,
          'processing', 
          'paid', 
          reference, 
          'paystack',
          orderData.total, // Full payment
          0, // Balance is 0
          JSON.stringify(newOrder)
        ]
      );
      
      res.status(201).json(newOrder);
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Order saving error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Get customer orders
app.get('/api/orders/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Fetching orders for:', email);
    const result = await pool.query(
      'SELECT order_data FROM orders WHERE customer_email = $1 ORDER BY created_at DESC',
      [email]
    );
    res.json(result.rows.map(row => row.order_data));
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders', 
      details: error.message,
      hint: 'Check if order_data column exists in orders table' 
    });
  }
});

// Admin: Get dashboard stats and analytics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT total, created_at, items FROM orders');
    const usersCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const productsStatsResult = await pool.query('SELECT category, stock FROM products');
    
    const ordersCount = ordersResult.rowCount;
    const totalRevenue = ordersResult.rows.reduce((sum, row) => sum + parseFloat(row.total), 0);
    
    // Group by month
    const monthlyData = {};
    ordersResult.rows.forEach(order => {
      const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(order.total);
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = months.map(m => ({
      name: m,
      revenue: monthlyData[m] || 0
    })).filter(m => m.revenue > 0 || months.indexOf(m.name) <= new Date().getMonth());

    // Category distribution
    const categoryData = {};
    productsStatsResult.rows.forEach(p => {
      categoryData[p.category] = (categoryData[p.category] || 0) + 1;
    });

    const formattedCategoryData = Object.keys(categoryData).map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: categoryData[cat]
    }));
    
    res.json({
      totalOrders: ordersCount,
      totalRevenue,
      totalUsers: parseInt(usersCountResult.rows[0].count),
      totalProducts: productsStatsResult.rowCount,
      lowStockItems: productsStatsResult.rows.filter(p => p.stock < 10).length,
      monthlyRevenue: formattedMonthlyData,
      categoryDistribution: formattedCategoryData
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Admin: Get all orders
app.get('/api/admin/orders', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT order_data FROM orders ORDER BY created_at DESC'
    );
    res.json(result.rows.map(row => row.order_data));
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
});

// Admin: Update order status
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // We store the full order object in order_data, so we need to update it there too
    const result = await pool.query(
      'SELECT order_data FROM orders WHERE id = $1',
      [id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const orderData = result.rows[0].order_data;
    orderData.status = status;
    orderData.updatedAt = new Date().toISOString();
    
    await pool.query(
      'UPDATE orders SET status = $1, order_data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, JSON.stringify(orderData), id]
    );
    
    res.json(orderData);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get user profile
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query(
      'SELECT id, email, first_name as "firstName", last_name as "lastName", is_premium as "isPremium" FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))',
      [email]
    );
    
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user premium status
app.post('/api/users/:email/premium', async (req, res) => {
  try {
    const { email } = req.params;
    const { isPremium } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET is_premium = $1 WHERE LOWER(TRIM(email)) = LOWER(TRIM($2)) RETURNING id, email, first_name as "firstName", last_name as "lastName", is_premium as "isPremium"',
      [isPremium, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update premium status error:', error);
    res.status(500).json({ error: 'Failed to update premium status' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Admin: Get all users
app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name as "firstName", last_name as "lastName", is_premium as "isPremium", status, created_at as "createdAt" FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Update user status (suspend/activate)
app.patch('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true, message: `User status updated to ${status}` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has orders
    const ordersCheck = await pool.query('SELECT 1 FROM users u JOIN orders o ON u.email = o.customer_email WHERE u.id = $1', [id]);
    
    if (ordersCheck.rowCount > 0) {
      return res.status(400).json({ error: 'Cannot delete user with existing orders. Suspend them instead.' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
