CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the category column for faster queries
CREATE INDEX idx_menu_items_category ON menu_items(category);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_menu_items_modtime
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insert some sample data
INSERT INTO menu_items (name, description, price, category) VALUES
('Cheeseburger', 'Classic beef patty with cheese', 5.99, 'Main'),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 4.99, 'Salad'),
('French Fries', 'Crispy golden fries', 2.99, 'Side'),
('Soda', 'Assorted flavors', 1.99, 'Drink');
