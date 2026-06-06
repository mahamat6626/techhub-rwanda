const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'techhub.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

db.serialize(() => {
  // Categories Table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )`);

  // Products Table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    stock INTEGER DEFAULT 0,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`);

  // Customers Table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL
  )`);

  // Orders Table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    tx_ref TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`);

  // Add tx_ref to existing orders table if missing (migration)
  db.run(`ALTER TABLE orders ADD COLUMN tx_ref TEXT`, () => {});

  // Order Items Table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Seed Categories
  db.run(`INSERT OR IGNORE INTO categories (id, name, description) VALUES
    (1, 'Phones & Tablets', 'Smartphones and tablets'),
    (2, 'Computers & Laptops', 'Laptops and accessories'),
    (3, 'Audio', 'Headphones, speakers and earbuds'),
    (4, 'TVs & Displays', 'Smart TVs and monitors'),
    (5, 'Accessories & Gadgets', 'Chargers, bags and gadgets')`);

  // Seed Products
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, image, stock, category_id) VALUES
    (1, 'Samsung Galaxy A15', 'Latest Samsung budget smartphone with great camera', 185000, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 15, 1),
    (2, 'iPhone 14 128GB', 'Apple iPhone 14 with A15 Bionic chip', 850000, 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400', 8, 1),
    (3, 'Tecno Spark 20', 'Affordable smartphone with long battery life', 120000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 20, 1),
    (4, 'Samsung Galaxy Tab A8', '10.5 inch Android tablet for work and play', 320000, 'https://images.unsplash.com/photo-1632634574034-c2d8e9b82680?w=400', 10, 1),
    (5, 'HP Laptop 15 Intel i5', '15.6 inch laptop with 8GB RAM and 256GB SSD', 650000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 7, 2),
    (6, 'Lenovo ThinkPad E14', 'Business laptop with excellent keyboard', 780000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', 5, 2),
    (7, 'Dell Inspiron 15', 'Reliable everyday laptop for students', 720000, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 6, 2),
    (8, 'Acer Aspire 5', 'Budget-friendly laptop with Full HD display', 580000, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400', 9, 2),
    (9, 'Samsung Galaxy Buds2', 'True wireless earbuds with noise cancellation', 100, 'https://images.unsplash.com/photo-1632634574034-c2d8e9b82680?w=400', 25, 3),
    (10, 'JBL Bluetooth Speaker', 'Portable waterproof speaker with deep bass', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 18, 3),
    (11, 'Sony WH-1000XM4', 'Premium noise cancelling headphones', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 12, 3),
    (12, 'Apple AirPods Pro', 'Active noise cancellation with spatial audio', 100, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 10, 3),
    (13, 'Samsung 43 Smart TV', '43 inch 4K Smart TV with built-in apps', 420000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 6, 4),
    (14, 'LG 32 LED TV', '32 inch Full HD LED TV', 280000, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400', 8, 4),
    (15, 'TCL 55 4K Android TV', '55 inch 4K Android Smart TV', 550000, 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400', 4, 4),
    (16, 'Anker Power Bank 20000mAh', 'Fast charging power bank with dual USB', 35000, 'https://images.unsplash.com/photo-1609592806596-b8d4b96a3fdb?w=400', 30, 5),
    (17, 'USB-C Fast Charger', '65W fast charger compatible with all devices', 12000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 40, 5),
    (18, 'Laptop Bag', 'Water resistant 15.6 inch laptop backpack', 18000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 22, 5),
    (19, 'Wireless Mouse and Keyboard', 'Ergonomic wireless combo set', 28000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 15, 5),
    (20, 'Xiaomi Smart Band 8', 'Fitness tracker with heart rate monitor', 45000, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400', 20, 5),
    (21, 'iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max with titanium design and A17 Pro chip', 1200000, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 6, 1),
    (22, 'Samsung Galaxy S24', 'Samsung flagship with Galaxy AI features', 950000, 'https://images.unsplash.com/photo-1610945264803-c22b62831454?w=400', 8, 1),
    (23, 'Xiaomi Redmi Note 13', 'High performance mid-range smartphone', 95000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 18, 1),
    (24, 'Infinix Hot 40', 'Budget smartphone with 5000mAh battery', 75000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 22, 1),
    (25, 'iPad Air 5th Gen', '10.9 inch iPad with M1 chip and USB-C', 680000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 7, 1),
    (26, 'MacBook Air M2', '13 inch MacBook Air with Apple M2 chip and 8GB RAM', 1350000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4, 2),
    (27, 'ASUS VivoBook 15', '15.6 inch laptop AMD Ryzen 5 with 512GB SSD', 620000, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 8, 2),
    (28, 'MSI Gaming Laptop GF63', '15.6 inch gaming laptop GTX 1650 16GB RAM', 980000, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 3, 2),
    (29, 'HP EliteBook 840', 'Business ultrabook 14 inch Intel i7 lightweight', 890000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 5, 2),
    (30, 'Beats Studio Pro', 'Wireless headphones with lossless audio and ANC', 100, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', 14, 3),
    (31, 'Bose QuietComfort 45', 'World-class noise cancellation headphones', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 9, 3),
    (32, 'JBL Flip 6', 'Portable waterproof Bluetooth speaker bold sound', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 20, 3),
    (33, 'Sony WF-1000XM5', 'Industry leading noise cancelling earbuds', 100, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 11, 3),
    (34, 'Marshall Stanmore III', 'Iconic Bluetooth home speaker rich warm sound', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 6, 3),
    (35, 'Hisense 50 QLED TV', '50 inch QLED 4K Smart TV Dolby Vision', 480000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 5, 4),
    (36, 'Samsung 65 QLED 4K', '65 inch QLED Smart TV with Neo Quantum HDR', 980000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 3, 4),
    (37, 'LG OLED 55 C3', '55 inch OLED evo 4K Smart TV α9 AI Processor', 1100000, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400', 2, 4),
    (38, 'ViewSonic 27 Monitor', '27 inch IPS 144Hz gaming monitor QHD', 320000, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 7, 4),
    (39, 'Baseus 65W GaN Charger', 'Compact 65W GaN charger 3 ports USB-C and USB-A', 15000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 35, 5),
    (40, 'Sandisk 1TB SSD', 'Portable SSD ultra fast USB 3.2 read 1050MBs', 85000, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 12, 5),
    (41, 'Logitech MX Master 3', 'Advanced wireless mouse for professionals', 55000, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 10, 5),
    (42, 'Ring Light 18 inch', 'Professional LED ring light with tripod stand', 22000, 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400', 16, 5),
    (43, 'USB Hub 7 Port', 'USB 3.0 hub 7 ports with individual switches', 8500, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', 28, 5),
    (44, 'Webcam Logitech C920', 'Full HD 1080p webcam for video calls streaming', 48000, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', 13, 5),
    (45, 'Nintendo Switch OLED', 'Hybrid gaming console with 7 inch OLED screen', 420000, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', 5, 5)`);

  // Extra 10 per category (IDs 46–95)
  db.run(`INSERT OR IGNORE INTO products (id, name, description, price, image, stock, category_id) VALUES
    (46, 'Samsung Galaxy A55', 'Mid-range Samsung with 50MP camera and AMOLED display', 320000, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 12, 1),
    (47, 'Xiaomi 14 Pro', 'Flagship Xiaomi with Leica camera and Snapdragon 8 Gen 3', 780000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 6, 1),
    (48, 'Tecno Camon 30', 'Portrait photography smartphone with 50MP front camera', 145000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 18, 1),
    (49, 'OnePlus 12', 'Flagship killer with Hasselblad camera and 100W charging', 720000, 'https://images.unsplash.com/photo-1610945264803-c22b62831454?w=400', 7, 1),
    (50, 'Nokia G42', 'Repairability focused smartphone with long software support', 98000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 14, 1),
    (51, 'Huawei Nova 12', 'Stylish mid-range with 60MP selfie camera', 195000, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 10, 1),
    (52, 'Google Pixel 8a', 'Pure Android experience with Google Tensor G3 chip', 650000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 5, 1),
    (53, 'Realme 12 Pro+', 'Slim design with periscope telephoto camera', 280000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 11, 1),
    (54, 'Samsung Galaxy A35', 'Reliable mid-range with IP67 water resistance', 245000, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 16, 1),
    (55, 'Motorola Edge 50', 'Vegan leather design 144Hz display 68W charging', 310000, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 9, 1),
    (56, 'Lenovo IdeaPad 5', '15 inch laptop AMD Ryzen 7 16GB RAM 512GB SSD', 720000, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 7, 2),
    (57, 'Dell XPS 15', '15.6 inch OLED laptop Intel i7 32GB premium design', 1450000, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 3, 2),
    (58, 'ASUS ROG Zephyrus G14', '14 inch gaming laptop AMD Ryzen 9 RTX 4060', 1280000, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 4, 2),
    (59, 'HP Pavilion 14', '14 inch everyday laptop Intel i5 8GB 256GB SSD', 580000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 9, 2),
    (60, 'Microsoft Surface Pro 9', '13 inch 2-in-1 tablet laptop Intel i5 touchscreen', 1100000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 4, 2),
    (61, 'Acer Nitro 5', '15.6 inch gaming laptop Intel i5 RTX 3050 144Hz', 880000, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 6, 2),
    (62, 'Samsung Galaxy Book4', '15 inch laptop Intel Core Ultra 7 AMOLED display', 950000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', 5, 2),
    (63, 'MacBook Pro 14 M3', '14 inch MacBook Pro Apple M3 chip 18GB RAM', 1850000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 3, 2),
    (64, 'Huawei MateBook D15', '15 inch laptop Intel i5 16GB slim lightweight', 620000, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400', 7, 2),
    (65, 'Lenovo Legion 5 Pro', '16 inch gaming laptop Ryzen 7 RTX 4070 165Hz', 1380000, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 3, 2),
    (66, 'Anker Soundcore Q45', 'Wireless headphones 60h battery LDAC hi-res audio', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 20, 3),
    (67, 'Jabra Evolve2 55', 'Professional wireless headset for calls and meetings', 100, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', 8, 3),
    (68, 'Samsung Galaxy Buds3 Pro', 'Intelligent ANC earbuds with hi-fi sound blade design', 100, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 15, 3),
    (69, 'JBL Xtreme 4', 'Powerful portable speaker bold pro sound IP67', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 10, 3),
    (70, 'Harman Kardon Onyx 8', 'Premium home Bluetooth speaker stunning design', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 6, 3),
    (71, 'Nothing Ear 2', 'Transparent design earbuds with LHDC and ANC', 100, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 12, 3),
    (72, 'Bose SoundLink Max', 'Portable premium speaker outdoor ready rich sound', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 8, 3),
    (73, 'Sennheiser Momentum 4', 'Premium headphones 60h battery adaptive ANC', 100, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 7, 3),
    (74, 'OnePlus Buds Pro 2', 'Spatial audio earbuds 48dB ANC 39h total battery', 100, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 14, 3),
    (75, 'Sonos Era 100', 'Smart home speaker stereo sound Trueplay tuning', 100, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 5, 3),
    (76, 'Sony Bravia 55 X90L', '55 inch Full Array LED 4K Google TV XR processor', 680000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 4, 4),
    (77, 'TCL 65 QLED C745', '65 inch QLED 4K Google TV 144Hz VRR gaming ready', 720000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 3, 4),
    (78, 'Hisense 43 A6K', '43 inch 4K VIDAA Smart TV Dolby Audio', 320000, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400', 7, 4),
    (79, 'Samsung 75 Crystal 4K', '75 inch Crystal UHD 4K Smart TV PurColor', 1200000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 2, 4),
    (80, 'LG 27 UltraGear Monitor', '27 inch QHD 180Hz IPS gaming monitor G-Sync', 380000, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 6, 4),
    (81, 'BenQ 32 PD3205U', '32 inch 4K USB-C designer monitor Thunderbolt 4', 650000, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 4, 4),
    (82, 'Xiaomi TV A Pro 55', '55 inch 4K Dolby Vision HDMI 2.1 Android TV', 520000, 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400', 5, 4),
    (83, 'AOC 24 Gaming Monitor', '24 inch FHD 165Hz curved VA panel FreeSync', 195000, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 9, 4),
    (84, 'Phillips 50 PUS8808', '50 inch 4K Ambilight Smart TV P5 AI processor', 560000, 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=400', 4, 4),
    (85, 'Hisense Laser TV 100L9', '100 inch Laser 4K Smart TV ultra short throw', 2800000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', 1, 4),
    (86, 'Belkin MagSafe Charger', '15W MagSafe wireless charger for iPhone', 18000, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 25, 5),
    (87, 'Anker USB-C Hub 9in1', '9-in-1 USB-C hub 4K HDMI SD card Ethernet', 32000, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', 18, 5),
    (88, 'SanDisk 128GB Flash Drive', 'Ultra USB 3.0 flash drive 130MBs read speed', 6500, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', 40, 5),
    (89, 'Keychron K2 Keyboard', 'Wireless mechanical keyboard RGB hot-swappable', 85000, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 8, 5),
    (90, 'Xiaomi Mi Band 9', 'Smart fitness band AMOLED 21 day battery SpO2', 28000, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400', 22, 5),
    (91, 'Apple Watch SE Gen 2', 'Smartwatch crash detection heart rate GPS', 280000, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400', 6, 5),
    (92, 'Tripod Phone Stand', 'Flexible tripod with Bluetooth remote for phone', 9500, 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400', 30, 5),
    (93, 'Anker PowerCore 26800', 'High capacity power bank 26800mAh triple output', 52000, 'https://images.unsplash.com/photo-1609592806596-b8d4b96a3fdb?w=400', 15, 5),
    (94, 'Cable Management Kit', 'Premium desk cable organiser clips and sleeves set', 4500, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', 35, 5),
    (95, 'GoPro Hero 12 Black', 'Action camera 5.3K60 HyperSmooth 6.0 waterproof', 480000, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', 5, 5)`);

  console.log('✅ Database tables and seed data ready');
});

module.exports = db;