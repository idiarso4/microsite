-- Seed data for Procurement Module
-- This creates sample vendors and purchase orders

-- Note: This seed data will be applied per tenant
-- The actual seeding should be done through application code with proper tenant context

-- Sample Vendors
INSERT INTO vendors (tenant_id, code, name, contact_person, email, phone, address, tax_number, payment_terms, currency, status) VALUES
-- Technology Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-001', 'PT Samsung Electronics Indonesia', 'Budi Santoso', 'procurement@samsung.co.id', '021-5551234', 
 '{"street": "Jl. Jenderal Sudirman Kav. 25", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "12920", "country": "Indonesia"}', 
 '01.234.567.8-901.000', 'NET30', 'IDR', 'active'),

(current_setting('app.current_tenant_id', true)::UUID, 'VND-002', 'PT Apple Indonesia', 'Sari Dewi', 'vendor@apple.co.id', '021-5552345', 
 '{"street": "Jl. MH Thamrin No. 1", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "10310", "country": "Indonesia"}', 
 '01.234.567.8-902.000', 'NET45', 'IDR', 'active'),

(current_setting('app.current_tenant_id', true)::UUID, 'VND-003', 'PT Xiaomi Technology Indonesia', 'Ahmad Rahman', 'supply@xiaomi.co.id', '021-5553456', 
 '{"street": "Jl. Gatot Subroto Kav. 18", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "12930", "country": "Indonesia"}', 
 '01.234.567.8-903.000', 'NET30', 'IDR', 'active'),

-- Computer & Laptop Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-004', 'PT Asus Technology Indonesia', 'Linda Wijaya', 'procurement@asus.co.id', '021-5554567', 
 '{"street": "Jl. Rasuna Said Kav. C-5", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "12940", "country": "Indonesia"}', 
 '01.234.567.8-904.000', 'NET30', 'IDR', 'active'),

(current_setting('app.current_tenant_id', true)::UUID, 'VND-005', 'PT Lenovo Indonesia', 'Rudi Hartono', 'vendor@lenovo.co.id', '021-5555678', 
 '{"street": "Jl. HR Rasuna Said Blok X-5 Kav. 1-2", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "12950", "country": "Indonesia"}', 
 '01.234.567.8-905.000', 'NET45', 'IDR', 'active'),

-- Textile & Fashion Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-006', 'CV Batik Nusantara', 'Ibu Siti Nurhaliza', 'order@batiknusantara.co.id', '0274-123456', 
 '{"street": "Jl. Malioboro No. 123", "city": "Yogyakarta", "province": "DI Yogyakarta", "postal_code": "55271", "country": "Indonesia"}', 
 '02.345.678.9-012.000', 'NET30', 'IDR', 'active'),

(current_setting('app.current_tenant_id', true)::UUID, 'VND-007', 'PT Tekstil Jaya Abadi', 'Pak Bambang Sutrisno', 'sales@tekstiljaya.co.id', '031-7654321', 
 '{"street": "Jl. Raya Industri No. 45", "city": "Surabaya", "province": "Jawa Timur", "postal_code": "60155", "country": "Indonesia"}', 
 '03.456.789.0-123.000', 'NET30', 'IDR', 'active'),

-- Food & Beverage Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-008', 'PT Kopi Luwak Indonesia', 'Pak Agus Setiawan', 'wholesale@kopiluwak.co.id', '0361-234567', 
 '{"street": "Jl. Raya Ubud No. 88", "city": "Gianyar", "province": "Bali", "postal_code": "80571", "country": "Indonesia"}', 
 '04.567.890.1-234.000', 'NET15', 'IDR', 'active'),

(current_setting('app.current_tenant_id', true)::UUID, 'VND-009', 'CV Teh Hijau Nusantara', 'Ibu Ratna Sari', 'order@tehhijau.co.id', '022-8765432', 
 '{"street": "Jl. Dago No. 234", "city": "Bandung", "province": "Jawa Barat", "postal_code": "40135", "country": "Indonesia"}', 
 '05.678.901.2-345.000', 'NET30', 'IDR', 'active'),

-- Home Appliances Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-010', 'PT Peralatan Rumah Tangga Sejahtera', 'Pak Dedi Kurniawan', 'procurement@prtsejahtara.co.id', '021-9876543', 
 '{"street": "Jl. Pramuka Raya No. 156", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "13560", "country": "Indonesia"}', 
 '06.789.012.3-456.000', 'NET30', 'IDR', 'active'),

-- Stationery Vendors
(current_setting('app.current_tenant_id', true)::UUID, 'VND-011', 'PT Alat Tulis Kantor Prima', 'Ibu Erna Susanti', 'sales@atkprima.co.id', '021-1357924', 
 '{"street": "Jl. Cempaka Putih Tengah No. 78", "city": "Jakarta", "province": "DKI Jakarta", "postal_code": "10520", "country": "Indonesia"}', 
 '07.890.123.4-567.000', 'NET30', 'IDR', 'active');

-- Sample Purchase Orders
-- PO for Electronics from Samsung
INSERT INTO purchase_orders (tenant_id, po_number, vendor_id, order_date, expected_delivery_date, status, currency, exchange_rate, created_by) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'PO-2024-001', 
 (SELECT id FROM vendors WHERE code = 'VND-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 'approved', 'IDR', 1.0000,
 (SELECT id FROM users WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID LIMIT 1));

-- PO Items for Samsung order
INSERT INTO purchase_order_items (tenant_id, purchase_order_id, product_id, description, quantity_ordered, unit_price, line_number) VALUES
(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'SPH-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Samsung Galaxy A54 5G 128GB - Bulk Order', 20, 4500000.00, 1),

(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'SPH-003' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Xiaomi Redmi Note 12 4GB/128GB - Bulk Order', 30, 2200000.00, 2);

-- PO for Laptops from Asus
INSERT INTO purchase_orders (tenant_id, po_number, vendor_id, order_date, expected_delivery_date, status, currency, exchange_rate, created_by) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'PO-2024-002', 
 (SELECT id FROM vendors WHERE code = 'VND-004' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '7 days', 'sent', 'IDR', 1.0000,
 (SELECT id FROM users WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID LIMIT 1));

-- PO Items for Asus order
INSERT INTO purchase_order_items (tenant_id, purchase_order_id, product_id, description, quantity_ordered, unit_price, line_number) VALUES
(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-002' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'LPT-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'ASUS VivoBook 14 A416MA Intel Celeron N4020', 15, 4200000.00, 1);

-- PO for Clothing from Batik Nusantara
INSERT INTO purchase_orders (tenant_id, po_number, vendor_id, order_date, expected_delivery_date, status, currency, exchange_rate, created_by) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'PO-2024-003', 
 (SELECT id FROM vendors WHERE code = 'VND-006' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '14 days', 'received', 'IDR', 1.0000,
 (SELECT id FROM users WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID LIMIT 1));

-- PO Items for Batik order
INSERT INTO purchase_order_items (tenant_id, purchase_order_id, product_id, description, quantity_ordered, unit_price, line_number) VALUES
(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-003' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'CLT-M-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Kemeja Batik Pria Lengan Panjang Motif Parang', 50, 85000.00, 1),

(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-003' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'CLT-W-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Blouse Wanita Lengan Panjang Warna Putih', 40, 75000.00, 2);

-- PO for Food & Beverage
INSERT INTO purchase_orders (tenant_id, po_number, vendor_id, order_date, expected_delivery_date, status, currency, exchange_rate, created_by) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'PO-2024-004', 
 (SELECT id FROM vendors WHERE code = 'VND-008' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'pending', 'IDR', 1.0000,
 (SELECT id FROM users WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID LIMIT 1));

-- PO Items for Coffee order
INSERT INTO purchase_order_items (tenant_id, purchase_order_id, product_id, description, quantity_ordered, unit_price, line_number) VALUES
(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-004' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'FNB-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Kopi Arabica Premium 250g - Wholesale', 100, 45000.00, 1),

(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-004' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'FNB-002' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'Teh Hijau Premium 100g - Wholesale', 80, 35000.00, 2);

-- Update line totals for purchase order items
UPDATE purchase_order_items SET 
    line_total = quantity_ordered * unit_price,
    discount_amount = 0,
    tax_amount = 0;

-- Sample Purchase Receipt for completed order
INSERT INTO purchase_receipts (tenant_id, receipt_number, purchase_order_id, vendor_id, receipt_date, warehouse_id, status, received_by) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 'GR-2024-001',
 (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-003' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM vendors WHERE code = 'VND-006' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 CURRENT_DATE - INTERVAL '1 day',
 (SELECT id FROM warehouses WHERE code = 'WH-JKT-01' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 'received',
 (SELECT id FROM users WHERE tenant_id = current_setting('app.current_tenant_id', true)::UUID LIMIT 1));

-- Purchase Receipt Items
INSERT INTO purchase_receipt_items (tenant_id, purchase_receipt_id, purchase_order_item_id, product_id, quantity_received, unit_cost, line_total, quality_status) VALUES
(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_receipts WHERE receipt_number = 'GR-2024-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT poi.id FROM purchase_order_items poi 
  JOIN purchase_orders po ON poi.purchase_order_id = po.id 
  JOIN products p ON poi.product_id = p.id
  WHERE po.po_number = 'PO-2024-003' AND p.sku = 'CLT-M-001' AND po.tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'CLT-M-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 50, 85000.00, 4250000.00, 'accepted'),

(current_setting('app.current_tenant_id', true)::UUID,
 (SELECT id FROM purchase_receipts WHERE receipt_number = 'GR-2024-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT poi.id FROM purchase_order_items poi 
  JOIN purchase_orders po ON poi.purchase_order_id = po.id 
  JOIN products p ON poi.product_id = p.id
  WHERE po.po_number = 'PO-2024-003' AND p.sku = 'CLT-W-001' AND po.tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 (SELECT id FROM products WHERE sku = 'CLT-W-001' AND tenant_id = current_setting('app.current_tenant_id', true)::UUID),
 40, 75000.00, 3000000.00, 'accepted');
