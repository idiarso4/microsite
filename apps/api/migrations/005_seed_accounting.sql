-- Seed data for Accounting Module
-- This creates a standard Chart of Accounts for Indonesian businesses

-- Note: This seed data will be applied per tenant
-- The actual seeding should be done through application code with proper tenant context

-- Standard Chart of Accounts for Indonesian Businesses
-- Format: Code - Name - Type - Subtype - Balance Type

-- ASSETS (1000-1999)
-- Current Assets (1000-1199)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
-- Cash and Bank Accounts
(current_setting('app.current_tenant_id', true)::UUID, '1001', 'Kas', 'asset', 'current_asset', 'debit', 'Kas di tangan'),
(current_setting('app.current_tenant_id', true)::UUID, '1002', 'Bank BCA', 'asset', 'current_asset', 'debit', 'Rekening Bank BCA'),
(current_setting('app.current_tenant_id', true)::UUID, '1003', 'Bank Mandiri', 'asset', 'current_asset', 'debit', 'Rekening Bank Mandiri'),
(current_setting('app.current_tenant_id', true)::UUID, '1004', 'Bank BNI', 'asset', 'current_asset', 'debit', 'Rekening Bank BNI'),

-- Receivables
(current_setting('app.current_tenant_id', true)::UUID, '1101', 'Piutang Usaha', 'asset', 'current_asset', 'debit', 'Piutang dari pelanggan'),
(current_setting('app.current_tenant_id', true)::UUID, '1102', 'Piutang Karyawan', 'asset', 'current_asset', 'debit', 'Piutang dari karyawan'),
(current_setting('app.current_tenant_id', true)::UUID, '1103', 'Piutang Lain-lain', 'asset', 'current_asset', 'debit', 'Piutang lainnya'),

-- Inventory
(current_setting('app.current_tenant_id', true)::UUID, '1201', 'Persediaan Barang Dagang', 'asset', 'current_asset', 'debit', 'Stok barang untuk dijual'),
(current_setting('app.current_tenant_id', true)::UUID, '1202', 'Persediaan Bahan Baku', 'asset', 'current_asset', 'debit', 'Bahan baku produksi'),
(current_setting('app.current_tenant_id', true)::UUID, '1203', 'Persediaan Barang Jadi', 'asset', 'current_asset', 'debit', 'Produk jadi siap jual'),

-- Prepaid Expenses
(current_setting('app.current_tenant_id', true)::UUID, '1301', 'Biaya Dibayar Dimuka', 'asset', 'current_asset', 'debit', 'Biaya yang sudah dibayar untuk periode mendatang'),
(current_setting('app.current_tenant_id', true)::UUID, '1302', 'Sewa Dibayar Dimuka', 'asset', 'current_asset', 'debit', 'Sewa yang dibayar dimuka'),
(current_setting('app.current_tenant_id', true)::UUID, '1303', 'Asuransi Dibayar Dimuka', 'asset', 'current_asset', 'debit', 'Premi asuransi dibayar dimuka');

-- Fixed Assets (1500-1999)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, '1501', 'Tanah', 'asset', 'fixed_asset', 'debit', 'Tanah milik perusahaan'),
(current_setting('app.current_tenant_id', true)::UUID, '1502', 'Bangunan', 'asset', 'fixed_asset', 'debit', 'Bangunan milik perusahaan'),
(current_setting('app.current_tenant_id', true)::UUID, '1503', 'Akumulasi Penyusutan Bangunan', 'asset', 'fixed_asset', 'credit', 'Akumulasi penyusutan bangunan'),
(current_setting('app.current_tenant_id', true)::UUID, '1504', 'Kendaraan', 'asset', 'fixed_asset', 'debit', 'Kendaraan perusahaan'),
(current_setting('app.current_tenant_id', true)::UUID, '1505', 'Akumulasi Penyusutan Kendaraan', 'asset', 'fixed_asset', 'credit', 'Akumulasi penyusutan kendaraan'),
(current_setting('app.current_tenant_id', true)::UUID, '1506', 'Peralatan Kantor', 'asset', 'fixed_asset', 'debit', 'Peralatan dan furniture kantor'),
(current_setting('app.current_tenant_id', true)::UUID, '1507', 'Akumulasi Penyusutan Peralatan', 'asset', 'fixed_asset', 'credit', 'Akumulasi penyusutan peralatan');

-- LIABILITIES (2000-2999)
-- Current Liabilities (2000-2199)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, '2001', 'Hutang Usaha', 'liability', 'current_liability', 'credit', 'Hutang kepada supplier'),
(current_setting('app.current_tenant_id', true)::UUID, '2002', 'Hutang Gaji', 'liability', 'current_liability', 'credit', 'Hutang gaji karyawan'),
(current_setting('app.current_tenant_id', true)::UUID, '2003', 'Hutang Pajak', 'liability', 'current_liability', 'credit', 'Hutang pajak'),
(current_setting('app.current_tenant_id', true)::UUID, '2004', 'Hutang Bank Jangka Pendek', 'liability', 'current_liability', 'credit', 'Pinjaman bank jangka pendek'),

-- Long-term Liabilities (2200-2999)
(current_setting('app.current_tenant_id', true)::UUID, '2201', 'Hutang Bank Jangka Panjang', 'liability', 'long_term_liability', 'credit', 'Pinjaman bank jangka panjang'),
(current_setting('app.current_tenant_id', true)::UUID, '2202', 'Hutang Obligasi', 'liability', 'long_term_liability', 'credit', 'Hutang obligasi');

-- EQUITY (3000-3999)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, '3001', 'Modal Saham', 'equity', 'capital', 'credit', 'Modal disetor pemegang saham'),
(current_setting('app.current_tenant_id', true)::UUID, '3002', 'Laba Ditahan', 'equity', 'retained_earnings', 'credit', 'Laba yang tidak dibagikan'),
(current_setting('app.current_tenant_id', true)::UUID, '3003', 'Laba Tahun Berjalan', 'equity', 'current_earnings', 'credit', 'Laba rugi tahun berjalan');

-- REVENUE (4000-4999)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, '4001', 'Penjualan', 'revenue', 'sales_revenue', 'credit', 'Pendapatan dari penjualan'),
(current_setting('app.current_tenant_id', true)::UUID, '4002', 'Pendapatan Jasa', 'revenue', 'service_revenue', 'credit', 'Pendapatan dari jasa'),
(current_setting('app.current_tenant_id', true)::UUID, '4003', 'Pendapatan Lain-lain', 'revenue', 'other_revenue', 'credit', 'Pendapatan di luar usaha utama');

-- EXPENSES (5000-5999)
-- Cost of Goods Sold (5000-5199)
INSERT INTO accounts (tenant_id, code, name, account_type, account_subtype, balance_type, description) VALUES
(current_setting('app.current_tenant_id', true)::UUID, '5001', 'Harga Pokok Penjualan', 'expense', 'cogs', 'debit', 'Biaya langsung produksi'),
(current_setting('app.current_tenant_id', true)::UUID, '5002', 'Pembelian', 'expense', 'cogs', 'debit', 'Pembelian barang dagang'),

-- Operating Expenses (5200-5999)
(current_setting('app.current_tenant_id', true)::UUID, '5201', 'Biaya Gaji', 'expense', 'operating_expense', 'debit', 'Gaji dan tunjangan karyawan'),
(current_setting('app.current_tenant_id', true)::UUID, '5202', 'Biaya Sewa', 'expense', 'operating_expense', 'debit', 'Biaya sewa kantor/toko'),
(current_setting('app.current_tenant_id', true)::UUID, '5203', 'Biaya Listrik', 'expense', 'operating_expense', 'debit', 'Biaya listrik'),
(current_setting('app.current_tenant_id', true)::UUID, '5204', 'Biaya Telepon', 'expense', 'operating_expense', 'debit', 'Biaya telepon dan internet'),
(current_setting('app.current_tenant_id', true)::UUID, '5205', 'Biaya Transportasi', 'expense', 'operating_expense', 'debit', 'Biaya transportasi dan BBM'),
(current_setting('app.current_tenant_id', true)::UUID, '5206', 'Biaya Penyusutan', 'expense', 'operating_expense', 'debit', 'Biaya penyusutan aset tetap'),
(current_setting('app.current_tenant_id', true)::UUID, '5207', 'Biaya Pemasaran', 'expense', 'operating_expense', 'debit', 'Biaya iklan dan promosi'),
(current_setting('app.current_tenant_id', true)::UUID, '5208', 'Biaya Administrasi', 'expense', 'operating_expense', 'debit', 'Biaya administrasi umum'),
(current_setting('app.current_tenant_id', true)::UUID, '5209', 'Biaya Lain-lain', 'expense', 'operating_expense', 'debit', 'Biaya operasional lainnya');

-- Create a default financial period for current year
INSERT INTO financial_periods (tenant_id, name, start_date, end_date, is_current) VALUES
(current_setting('app.current_tenant_id', true)::UUID, 
 'Tahun Buku ' || EXTRACT(YEAR FROM CURRENT_DATE), 
 DATE_TRUNC('year', CURRENT_DATE)::DATE,
 (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')::DATE,
 true);
