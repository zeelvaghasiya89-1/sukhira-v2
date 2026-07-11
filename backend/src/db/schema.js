function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'herbal-tea',
      base_price REAL NOT NULL,
      compare_at_price REAL,
      image_url TEXT,
      images TEXT,              -- JSON array of image URLs
      benefits TEXT,            -- JSON array of benefits
      brewing_instructions TEXT,-- JSON object of brewing instructions
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,       -- e.g. "30g Pack", "50g Pack"
      sku TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      compare_at_price REAL,
      stock INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 10,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      total_orders INTEGER DEFAULT 0,
      total_spent REAL DEFAULT 0.0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      status TEXT DEFAULT 'pending',          -- pending, confirmed, processing, shipped, delivered, cancelled
      payment_status TEXT DEFAULT 'pending',   -- pending, paid, failed, refunded
      razorpay_order_id TEXT UNIQUE,
      razorpay_payment_id TEXT UNIQUE,
      subtotal REAL NOT NULL,
      shipping_cost REAL DEFAULT 0.0,
      discount_amount REAL DEFAULT 0.0,
      total REAL NOT NULL,
      coupon_code TEXT,
      shipping_name TEXT,
      shipping_email TEXT,
      shipping_phone TEXT,
      shipping_address TEXT,
      shipping_city TEXT,
      shipping_state TEXT,
      shipping_pincode TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      variant_id INTEGER,
      product_name TEXT NOT NULL,
      variant_name TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      discount_type TEXT NOT NULL, -- percentage, fixed
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0.0,
      usage_limit INTEGER,         -- NULL = unlimited
      times_used INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      expires_at TEXT,             -- YYYY-MM-DD
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
      total_orders INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0.0,
      new_customers INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread', -- unread, read, replied
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Add Delhivery shipping columns to orders table if they don't exist
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN tracking_id TEXT`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN shipping_label_url TEXT`);
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN courier_name TEXT DEFAULT 'Delhivery'`);
  } catch (e) {}
}

module.exports = { initSchema };
