-- Inventory Module Schema
-- This migration creates tables for inventory management system

-- Product Categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, name)
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES product_categories(id),
    unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'pcs',
    cost_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 0,
    current_stock INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, inactive, discontinued, out_of_stock
    barcode VARCHAR(255),
    weight DECIMAL(10,3),
    dimensions JSONB,
    supplier_id UUID, -- Will reference suppliers table when implemented
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, sku)
);

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address JSONB,
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, code)
);

-- Stock Levels (current stock per product per warehouse)
CREATE TABLE stock_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    minimum_stock INTEGER NOT NULL DEFAULT 0,
    maximum_stock INTEGER,
    reorder_point INTEGER,
    last_movement_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, product_id, warehouse_id)
);

-- Stock Movements (transaction log for all stock changes)
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    movement_type VARCHAR(20) NOT NULL, -- in, out, transfer, adjustment
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(15,2),
    reference_type VARCHAR(50), -- purchase_order, sales_order, adjustment, transfer, etc.
    reference_id UUID,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Stock Transfers (for warehouse-to-warehouse transfers)
CREATE TABLE stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    transfer_number VARCHAR(50) NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    from_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    to_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, in_transit, completed, cancelled
    requested_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    completed_by UUID REFERENCES users(id),
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(tenant_id, transfer_number)
);

-- Enable Row Level Security
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY tenant_isolation_product_categories ON product_categories
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_products ON products
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_warehouses ON warehouses
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_stock_levels ON stock_levels
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_stock_movements ON stock_movements
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_stock_transfers ON stock_transfers
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Create indexes for performance
CREATE INDEX idx_product_categories_tenant_id ON product_categories(tenant_id);
CREATE INDEX idx_product_categories_parent ON product_categories(parent_id);

CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_sku ON products(tenant_id, sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(tenant_id, status);
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;

CREATE INDEX idx_warehouses_tenant_id ON warehouses(tenant_id);
CREATE INDEX idx_warehouses_code ON warehouses(tenant_id, code);

CREATE INDEX idx_stock_levels_tenant_id ON stock_levels(tenant_id);
CREATE INDEX idx_stock_levels_product ON stock_levels(product_id);
CREATE INDEX idx_stock_levels_warehouse ON stock_levels(warehouse_id);
CREATE INDEX idx_stock_levels_low_stock ON stock_levels(tenant_id) WHERE quantity_on_hand <= minimum_stock;

CREATE INDEX idx_stock_movements_tenant_id ON stock_movements(tenant_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_warehouse ON stock_movements(warehouse_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(tenant_id, created_at);
CREATE INDEX idx_stock_movements_reference ON stock_movements(reference_type, reference_id);

CREATE INDEX idx_stock_transfers_tenant_id ON stock_transfers(tenant_id);
CREATE INDEX idx_stock_transfers_number ON stock_transfers(tenant_id, transfer_number);
CREATE INDEX idx_stock_transfers_status ON stock_transfers(tenant_id, status);

-- Create triggers for updated_at
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_levels_updated_at BEFORE UPDATE ON stock_levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_transfers_updated_at BEFORE UPDATE ON stock_transfers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update stock levels when stock movements occur
CREATE OR REPLACE FUNCTION update_stock_levels_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stock levels based on movement type
    IF NEW.movement_type = 'in' THEN
        INSERT INTO stock_levels (tenant_id, product_id, warehouse_id, quantity_on_hand, last_movement_at)
        VALUES (NEW.tenant_id, NEW.product_id, NEW.warehouse_id, NEW.quantity, NEW.created_at)
        ON CONFLICT (tenant_id, product_id, warehouse_id)
        DO UPDATE SET 
            quantity_on_hand = stock_levels.quantity_on_hand + NEW.quantity,
            last_movement_at = NEW.created_at,
            updated_at = NOW();
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE stock_levels 
        SET 
            quantity_on_hand = quantity_on_hand - NEW.quantity,
            last_movement_at = NEW.created_at,
            updated_at = NOW()
        WHERE tenant_id = NEW.tenant_id 
          AND product_id = NEW.product_id 
          AND warehouse_id = NEW.warehouse_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
        -- For adjustments, the quantity represents the new total, not the change
        UPDATE stock_levels 
        SET 
            quantity_on_hand = NEW.quantity,
            last_movement_at = NEW.created_at,
            updated_at = NOW()
        WHERE tenant_id = NEW.tenant_id 
          AND product_id = NEW.product_id 
          AND warehouse_id = NEW.warehouse_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock level updates
CREATE TRIGGER trigger_update_stock_levels 
    AFTER INSERT ON stock_movements
    FOR EACH ROW 
    EXECUTE FUNCTION update_stock_levels_on_movement();
