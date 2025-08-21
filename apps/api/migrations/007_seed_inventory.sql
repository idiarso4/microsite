-- Seed data for Inventory Module
-- This creates sample categories, warehouses, and products

-- Note: This seed data will be applied per tenant
-- The actual seeding should be done through application code with proper tenant context

-- Sample Product Categories
INSERT INTO product_categories (tenant_id, name, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'Elektronik', 'Produk elektronik dan gadget'),
(current_setting('app.current_tenant_id', true)::UUID, 'Pakaian', 'Pakaian dan aksesoris fashion'),
(current_setting('app.current_tenant_id', true)::UUID, 'Makanan & Minuman', 'Produk makanan dan minuman'),
(current_setting('app.current_tenant_id', true)::UUID, 'Peralatan Rumah Tangga', 'Peralatan untuk rumah tangga'),
(current_setting('app.current_tenant_id', true)::UUID, 'Buku & Alat Tulis', 'Buku, majalah, dan alat tulis kantor');

-- Sub-categories for Elektronik
INSERT INTO product_categories (tenant_id, name, description, parent_id) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'Smartphone', 'Telepon pintar dan aksesoris', 
 (SELECT id FROM product_categories WHERE name = 'Elektronik' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID)),
(current_setting('app.current_tenant_id', true)::UUID, 'Laptop & Komputer', 'Laptop, PC, dan aksesoris komputer', 
 (SELECT id FROM product_categories WHERE name = 'Elektronik' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID)),
(current_setting('app.current_tenant_id', true)::UUID, 'Audio & Video', 'Peralatan audio dan video', 
 (SELECT id FROM product_categories WHERE name = 'Elektronik' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID));

-- Sub-categories for Pakaian
INSERT INTO product_categories (tenant_id, name, description, parent_id) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'Pakaian Pria', 'Pakaian untuk pria', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID)),
(current_setting('app.current_tenant_id', true)::UUID, 'Pakaian Wanita', 'Pakaian untuk wanita', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID)),
(current_setting('app.current_tenant_id', true)::UUID, 'Sepatu & Sandal', 'Alas kaki untuk pria dan wanita', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID));

-- Sample Warehouses
INSERT INTO warehouses (tenant_id, code, name, description, address) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'WH-JKT-01', 'Gudang Utama Jakarta', 'Gudang pusat distribusi Jakarta', 
 '{"street": "Jl. Industri Raya No. 123", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "12345"}'),
(current_setting('app.current_tenant_id', true)::UUID, 'WH-SBY-01', 'Gudang Surabaya', 'Gudang cabang Surabaya', 
 '{"street": "Jl. Raya Industri No. 456", "city": "Surabaya", "province": "Jawa Timur", "postal_code": "60123"}'),
(current_setting('app.current_tenant_id', true)::UUID, 'WH-BDG-01', 'Gudang Bandung', 'Gudang cabang Bandung', 
 '{"street": "Jl. Soekarno Hatta No. 789", "city": "Bandung", "province": "Jawa Barat", "postal_code": "40123"}');

-- Sample Products
INSERT INTO products (tenant_id, sku, name, description, category_id, unit_of_measure, cost_price, selling_price, minimum_stock, barcode) VALUES
-- Elektronik - Smartphone
(current_setting('app.current_tenant_id', true)::UUID, 'SPH-001', 'Samsung Galaxy A54', 'Smartphone Samsung Galaxy A54 5G 128GB', 
 (SELECT id FROM product_categories WHERE name = 'Smartphone' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 4500000.00, 5500000.00, 10, '8801643880446'),
(current_setting('app.current_tenant_id', true)::UUID, 'SPH-002', 'iPhone 14', 'Apple iPhone 14 128GB', 
 (SELECT id FROM product_categories WHERE name = 'Smartphone' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 12000000.00, 14500000.00, 5, '194253404057'),
(current_setting('app.current_tenant_id', true)::UUID, 'SPH-003', 'Xiaomi Redmi Note 12', 'Xiaomi Redmi Note 12 4GB/128GB', 
 (SELECT id FROM product_categories WHERE name = 'Smartphone' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 2200000.00, 2800000.00, 15, '6934177774411'),

-- Elektronik - Laptop
(current_setting('app.current_tenant_id', true)::UUID, 'LPT-001', 'ASUS VivoBook 14', 'ASUS VivoBook 14 A416MA Intel Celeron N4020', 
 (SELECT id FROM product_categories WHERE name = 'Laptop & Komputer' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 4200000.00, 5200000.00, 8, '4711081082057'),
(current_setting('app.current_tenant_id', true)::UUID, 'LPT-002', 'Lenovo ThinkPad E14', 'Lenovo ThinkPad E14 Gen 4 AMD Ryzen 5', 
 (SELECT id FROM product_categories WHERE name = 'Laptop & Komputer' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 8500000.00, 10500000.00, 5, '196801049567'),

-- Pakaian - Pria
(current_setting('app.current_tenant_id', true)::UUID, 'CLT-M-001', 'Kemeja Batik Pria', 'Kemeja batik lengan panjang motif parang', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian Pria' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 85000.00, 150000.00, 20, '8991234567890'),
(current_setting('app.current_tenant_id', true)::UUID, 'CLT-M-002', 'Celana Jeans Pria', 'Celana jeans slim fit warna biru dongker', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian Pria' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 120000.00, 200000.00, 25, '8991234567891'),

-- Pakaian - Wanita
(current_setting('app.current_tenant_id', true)::UUID, 'CLT-W-001', 'Blouse Wanita', 'Blouse wanita lengan panjang warna putih', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian Wanita' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 75000.00, 135000.00, 30, '8991234567892'),
(current_setting('app.current_tenant_id', true)::UUID, 'CLT-W-002', 'Rok Midi Wanita', 'Rok midi A-line warna navy', 
 (SELECT id FROM product_categories WHERE name = 'Pakaian Wanita' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 95000.00, 165000.00, 20, '8991234567893'),

-- Sepatu
(current_setting('app.current_tenant_id', true)::UUID, 'SHO-001', 'Sepatu Sneakers Unisex', 'Sepatu sneakers casual unisex warna putih', 
 (SELECT id FROM product_categories WHERE name = 'Sepatu & Sandal' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 180000.00, 280000.00, 15, '8991234567894'),
(current_setting('app.current_tenant_id', true)::UUID, 'SHO-002', 'Sandal Jepit', 'Sandal jepit karet anti slip', 
 (SELECT id FROM product_categories WHERE name = 'Sepatu & Sandal' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 25000.00, 45000.00, 50, '8991234567895'),

-- Makanan & Minuman
(current_setting('app.current_tenant_id', true)::UUID, 'FNB-001', 'Kopi Arabica 250g', 'Kopi arabica premium kemasan 250 gram', 
 (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 45000.00, 75000.00, 40, '8991234567896'),
(current_setting('app.current_tenant_id', true)::UUID, 'FNB-002', 'Teh Hijau Premium', 'Teh hijau premium kemasan 100 gram', 
 (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 35000.00, 55000.00, 35, '8991234567897'),

-- Peralatan Rumah Tangga
(current_setting('app.current_tenant_id', true)::UUID, 'HOM-001', 'Panci Set Stainless', 'Set panci stainless steel 5 pieces', 
 (SELECT id FROM product_categories WHERE name = 'Peralatan Rumah Tangga' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'set', 250000.00, 400000.00, 12, '8991234567898'),
(current_setting('app.current_tenant_id', true)::UUID, 'HOM-002', 'Blender 2 Liter', 'Blender kapasitas 2 liter dengan 3 kecepatan', 
 (SELECT id FROM product_categories WHERE name = 'Peralatan Rumah Tangga' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 180000.00, 280000.00, 10, '8991234567899'),

-- Buku & Alat Tulis
(current_setting('app.current_tenant_id', true)::UUID, 'BOK-001', 'Buku Tulis A5', 'Buku tulis A5 100 halaman garis', 
 (SELECT id FROM product_categories WHERE name = 'Buku & Alat Tulis' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'pcs', 8000.00, 15000.00, 100, '8991234567900'),
(current_setting('app.current_tenant_id', true)::UUID, 'BOK-002', 'Pulpen Gel Set', 'Set pulpen gel 12 warna', 
 (SELECT id FROM product_categories WHERE name = 'Buku & Alat Tulis' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID), 
 'set', 25000.00, 45000.00, 50, '8991234567901');

-- Initialize stock levels for all products in main warehouse (Jakarta)
INSERT INTO stock_levels (tenant_id, product_id, warehouse_id, quantity_on_hand, minimum_stock)
SELECT 
    p.tenant_id,
    p.id as product_id,
    w.id as warehouse_id,
    CASE 
        WHEN p.sku LIKE 'SPH-%' THEN 25  -- Smartphones
        WHEN p.sku LIKE 'LPT-%' THEN 15  -- Laptops
        WHEN p.sku LIKE 'CLT-%' THEN 50  -- Clothing
        WHEN p.sku LIKE 'SHO-%' THEN 30  -- Shoes
        WHEN p.sku LIKE 'FNB-%' THEN 100 -- Food & Beverage
        WHEN p.sku LIKE 'HOM-%' THEN 20  -- Home appliances
        WHEN p.sku LIKE 'BOK-%' THEN 200 -- Books & Stationery
        ELSE 10
    END as quantity_on_hand,
    p.minimum_stock
FROM products p
CROSS JOIN warehouses w
WHERE w.code = 'WH-JKT-01'
  AND p.tenant_id = current_setting('app.current_tenant_id', true)::UUID
  AND w.tenant_id = current_setting('app.current_tenant_id', true)::UUID;
