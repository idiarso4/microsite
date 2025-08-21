-- Procurement Module Schema
-- This migration creates tables for vendor management and procurement process

-- Vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address JSONB,
    tax_number VARCHAR(100),
    payment_terms VARCHAR(50), -- NET30, NET60, etc.
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, inactive, blocked, pending
    credit_limit DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, code)
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    po_number VARCHAR(50) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    delivery_address JSONB,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, pending, approved, sent, partially_received, received, cancelled, closed
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    exchange_rate DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    terms_conditions TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, po_number)
);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    description TEXT,
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Purchase Receipts (Goods Receipt)
CREATE TABLE purchase_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL,
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    receipt_date DATE NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, received, cancelled
    notes TEXT,
    received_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, receipt_number)
);

-- Purchase Receipt Items
CREATE TABLE purchase_receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    purchase_receipt_id UUID NOT NULL REFERENCES purchase_receipts(id) ON DELETE CASCADE,
    purchase_order_item_id UUID NOT NULL REFERENCES purchase_order_items(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_received INTEGER NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    quality_status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- accepted, rejected, pending
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Vendor Invoices (Bills)
CREATE TABLE vendor_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    vendor_invoice_number VARCHAR(100) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    exchange_rate DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    outstanding_amount DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, pending, approved, paid, overdue, cancelled
    payment_terms VARCHAR(50),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, invoice_number)
);

-- Enable Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_vendors ON vendors
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_purchase_orders ON purchase_orders
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_purchase_order_items ON purchase_order_items
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_purchase_receipts ON purchase_receipts
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_purchase_receipt_items ON purchase_receipt_items
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_vendor_invoices ON vendor_invoices
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Create indexes for performance
CREATE INDEX idx_vendors_tenant_id ON vendors(tenant_id);
CREATE INDEX idx_vendors_code ON vendors(tenant_id, code);
CREATE INDEX idx_vendors_status ON vendors(tenant_id, status);

CREATE INDEX idx_purchase_orders_tenant_id ON purchase_orders(tenant_id);
CREATE INDEX idx_purchase_orders_po_number ON purchase_orders(tenant_id, po_number);
CREATE INDEX idx_purchase_orders_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(tenant_id, status);
CREATE INDEX idx_purchase_orders_date ON purchase_orders(tenant_id, order_date);

CREATE INDEX idx_purchase_order_items_tenant_id ON purchase_order_items(tenant_id);
CREATE INDEX idx_purchase_order_items_po ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product ON purchase_order_items(product_id);

CREATE INDEX idx_purchase_receipts_tenant_id ON purchase_receipts(tenant_id);
CREATE INDEX idx_purchase_receipts_number ON purchase_receipts(tenant_id, receipt_number);
CREATE INDEX idx_purchase_receipts_po ON purchase_receipts(purchase_order_id);
CREATE INDEX idx_purchase_receipts_vendor ON purchase_receipts(vendor_id);
CREATE INDEX idx_purchase_receipts_warehouse ON purchase_receipts(warehouse_id);

CREATE INDEX idx_purchase_receipt_items_tenant_id ON purchase_receipt_items(tenant_id);
CREATE INDEX idx_purchase_receipt_items_receipt ON purchase_receipt_items(purchase_receipt_id);
CREATE INDEX idx_purchase_receipt_items_po_item ON purchase_receipt_items(purchase_order_item_id);

CREATE INDEX idx_vendor_invoices_tenant_id ON vendor_invoices(tenant_id);
CREATE INDEX idx_vendor_invoices_number ON vendor_invoices(tenant_id, invoice_number);
CREATE INDEX idx_vendor_invoices_vendor ON vendor_invoices(vendor_id);
CREATE INDEX idx_vendor_invoices_status ON vendor_invoices(tenant_id, status);
CREATE INDEX idx_vendor_invoices_due_date ON vendor_invoices(tenant_id, due_date);

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_receipts_updated_at BEFORE UPDATE ON purchase_receipts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_invoices_updated_at BEFORE UPDATE ON vendor_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate purchase order totals
CREATE OR REPLACE FUNCTION calculate_purchase_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update purchase order totals when items change
    UPDATE purchase_orders SET
        subtotal = (
            SELECT COALESCE(SUM(line_total - tax_amount), 0)
            FROM purchase_order_items 
            WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
        ),
        tax_amount = (
            SELECT COALESCE(SUM(tax_amount), 0)
            FROM purchase_order_items 
            WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
        ),
        total_amount = (
            SELECT COALESCE(SUM(line_total), 0)
            FROM purchase_order_items 
            WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for purchase order totals calculation
CREATE TRIGGER trigger_calculate_purchase_order_totals 
    AFTER INSERT OR UPDATE OR DELETE ON purchase_order_items
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_purchase_order_totals();

-- Function to update stock when goods are received
CREATE OR REPLACE FUNCTION update_stock_on_receipt()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quality_status = 'accepted' THEN
        -- Create stock movement for received goods
        INSERT INTO stock_movements (
            tenant_id, product_id, warehouse_id, movement_type, quantity, 
            unit_cost, reference_type, reference_id, notes, created_by
        ) VALUES (
            NEW.tenant_id, NEW.product_id, 
            (SELECT warehouse_id FROM purchase_receipts WHERE id = NEW.purchase_receipt_id),
            'in', NEW.quantity_received, NEW.unit_cost, 
            'purchase_receipt', NEW.purchase_receipt_id, 
            'Goods received from purchase order', 
            (SELECT received_by FROM purchase_receipts WHERE id = NEW.purchase_receipt_id)
        );
        
        -- Update quantity received in purchase order item
        UPDATE purchase_order_items SET
            quantity_received = quantity_received + NEW.quantity_received
        WHERE id = NEW.purchase_order_item_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock updates on receipt
CREATE TRIGGER trigger_update_stock_on_receipt 
    AFTER INSERT ON purchase_receipt_items
    FOR EACH ROW 
    EXECUTE FUNCTION update_stock_on_receipt();
