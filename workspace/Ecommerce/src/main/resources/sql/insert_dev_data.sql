-- Inserimento utenti (ignora se già esistono)
INSERT INTO local_user (id, email, first_name, last_name, created_at, updated_at)
VALUES
    ('mario_rossi_id', 'mario.rossi@example.com', 'Mario', 'Rossi', NOW(), NOW()),
    ('luigi_bianchi_id', 'luigi.bianchi@example.com', 'Luigi', 'Bianchi', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserimento indirizzi (ignora se già esistono)
INSERT INTO address (address_line_1, city, country, user_id, created_at, updated_at)
VALUES
    ('Via Roma 1', 'Roma', 'Italia', 'mario_rossi_id', NOW(), NOW()),
    ('Corso Milano 20', 'Milano', 'Italia', 'luigi_bianchi_id', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserimento prodotti (ignora se già esistono)
INSERT INTO product (name, short_description, long_description, price, created_at, updated_at)
VALUES
    ('Smartphone X', 'Ultimo modello', 'Caratteristiche avanzate...', 799.99, NOW(), NOW()),
    ('Laptop Pro', 'Ad alte prestazioni', 'Ideale per professionisti...', 1299.49, NOW(), NOW()),
    ('Auricolari Wireless', 'Cancellazione rumore', 'Qualità audio premium...', 199.99, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserimento inventario (ignora se già esistono)
INSERT INTO inventory (product_id, quantity, version, created_at, updated_at)
VALUES
    ((SELECT id FROM product WHERE name = 'Smartphone X'), 50, 1, NOW(), NOW()),
    ((SELECT id FROM product WHERE name = 'Laptop Pro'), 30, 1, NOW(), NOW()),
    ((SELECT id FROM product WHERE name = 'Auricolari Wireless'), 100, 1, NOW(), NOW())
ON CONFLICT (product_id) DO NOTHING;

-- Inserimento carrelli (ignora se già esistono)
INSERT INTO cart (user_id, is_active)
VALUES
    ('mario_rossi_id', TRUE),
    ('luigi_bianchi_id', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Inserimento elementi nel carrello (ignora se già esistono)
INSERT INTO cart_item (cart_id, product_id, quantity, created_at)
VALUES
    ((SELECT id FROM cart WHERE user_id = 'mario_rossi_id'),
     (SELECT id FROM product WHERE name = 'Smartphone X'),
     1,
     NOW()),

    ((SELECT id FROM cart WHERE user_id = 'mario_rossi_id'),
     (SELECT id FROM product WHERE name = 'Auricolari Wireless'),
     2,
     NOW()),

    ((SELECT id FROM cart WHERE user_id = 'luigi_bianchi_id'),
     (SELECT id FROM product WHERE name = 'Laptop Pro'),
     1,
     NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserimento ordini (ignora se già esistono)
INSERT INTO orders (user_id, total, status, created_at, updated_at)
VALUES
    ('mario_rossi_id', 799.99 + (199.99 * 2), 'PENDING', NOW(), NOW()),
    ('luigi_bianchi_id', 1299.49, 'PENDING', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserimento elementi negli ordini (ignora se già esistono)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
VALUES
    ((SELECT id FROM orders WHERE user_id = 'mario_rossi_id'),
     (SELECT id FROM product WHERE name = 'Smartphone X'),
     1,
     799.99,
     799.99),

    ((SELECT id FROM orders WHERE user_id = 'mario_rossi_id'),
     (SELECT id FROM product WHERE name = 'Auricolari Wireless'),
     2,
     199.99,
     399.98)
ON CONFLICT (id) DO NOTHING;