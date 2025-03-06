/*-- insert_dev_data.sql
-- Script per inserire dati di esempio nel database per testare l'applicazione Ecommerce

-- Assicurati di eseguire questo script su un database PostgreSQL configurato correttamente.

-- Pulizia delle tabelle esistenti per evitare duplicati o conflitti
TRUNCATE TABLE payment CASCADE;
TRUNCATE TABLE web_order_quantities CASCADE;
TRUNCATE TABLE web_order CASCADE;
TRUNCATE TABLE cart_item CASCADE;
TRUNCATE TABLE cart CASCADE;
TRUNCATE TABLE coupon CASCADE;
TRUNCATE TABLE inventory CASCADE;
TRUNCATE TABLE product CASCADE;
TRUNCATE TABLE address CASCADE;
TRUNCATE TABLE local_user CASCADE;

-- Inserimento di utenti (local_user)
INSERT INTO local_user (username, password, email, first_name, last_name, created_at, updated_at)
VALUES
    ('mario.rossi', 'password1', 'mario.rossi@example.com', 'Mario', 'Rossi', NOW(), NOW()),
    ('luigi.bianchi', 'password2', 'luigi.bianchi@example.com', 'Luigi', 'Bianchi', NOW(), NOW());

-- Inserimento di indirizzi (address)
INSERT INTO address (address_line_1, address_line_2, city, country, user_id, created_at, updated_at)
VALUES
    ('Via Roma 1', NULL, 'Roma', 'Italia', (SELECT id FROM local_user WHERE username = 'mario.rossi'), NOW(), NOW()),
    ('Corso Milano 20', 'Interno 5', 'Milano', 'Italia', (SELECT id FROM local_user WHERE username = 'luigi.bianchi'), NOW(), NOW());

-- Inserimento di prodotti (product)
INSERT INTO product (name, short_description, long_description, price, created_at, updated_at)
VALUES
    ('Smartphone X', 'Ultimo modello di Smartphone', 'Smartphone X con caratteristiche avanzate...', 799.99, NOW(), NOW()),
    ('Laptop Pro', 'Laptop ad alte prestazioni', 'Laptop Pro ideale per professionisti...', 1299.49, NOW(), NOW()),
    ('Auricolari Wireless', 'Auricolari senza fili', 'Auricolari con cancellazione del rumore...', 199.99, NOW(), NOW());

-- Inserimento di inventario (inventory)
INSERT INTO inventory (product_id, quantity, version, created_at, updated_at)
VALUES
    ((SELECT id FROM product WHERE name = 'Smartphone X'), 50, 1, NOW(), NOW()),
    ((SELECT id FROM product WHERE name = 'Laptop Pro'), 30, 1, NOW(), NOW()),
    ((SELECT id FROM product WHERE name = 'Auricolari Wireless'), 100, 1, NOW(), NOW());

-- Inserimento di carrelli (cart)
INSERT INTO cart (user_id, is_active)
VALUES
    ((SELECT id FROM local_user WHERE username = 'mario.rossi'), TRUE),
    ((SELECT id FROM local_user WHERE username = 'luigi.bianchi'), TRUE);

-- Inserimento di elementi nel carrello (cart_item)
INSERT INTO cart_item (cart_id, product_id, quantity, created_at)
VALUES
    (
        (SELECT id FROM cart WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') AND is_active = TRUE),
        (SELECT id FROM product WHERE name = 'Smartphone X'),
        1,
        NOW()
    ),
    (
        (SELECT id FROM cart WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') AND is_active = TRUE),
        (SELECT id FROM product WHERE name = 'Auricolari Wireless'),
        2,
        NOW()
    ),
    (
        (SELECT id FROM cart WHERE user_id = (SELECT id FROM local_user WHERE username = 'luigi.bianchi') AND is_active = TRUE),
        (SELECT id FROM product WHERE name = 'Laptop Pro'),
        1,
        NOW()
    );

-- Inserimento di ordini (web_order)
INSERT INTO web_order (user_id, address_id, status, created_at, updated_at)
VALUES
    (
        (SELECT id FROM local_user WHERE username = 'mario.rossi'),
        (SELECT id FROM address WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') LIMIT 1),
        'pending',
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM local_user WHERE username = 'luigi.bianchi'),
        (SELECT id FROM address WHERE user_id = (SELECT id FROM local_user WHERE username = 'luigi.bianchi') LIMIT 1),
        'pending',
        NOW(),
        NOW()
    );

-- Inserimento di quantità per gli ordini (web_order_quantities)
INSERT INTO web_order_quantities (order_id, product_id, quantity, created_at, updated_at)
VALUES
    (
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') LIMIT 1),
        (SELECT id FROM product WHERE name = 'Smartphone X'),
        1,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') LIMIT 1),
        (SELECT id FROM product WHERE name = 'Auricolari Wireless'),
        2,
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'luigi.bianchi') LIMIT 1),
        (SELECT id FROM product WHERE name = 'Laptop Pro'),
        1,
        NOW(),
        NOW()
    );

-- Inserimento di pagamenti (payment)
INSERT INTO payment (order_id, payment_method, amount_paid, payment_status, created_at, updated_at)
VALUES
    (
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') LIMIT 1),
        'credit_card',
        1199.97,
        'completed',
        NOW(),
        NOW()
    ),
    (
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'luigi.bianchi') LIMIT 1),
        'paypal',
        1299.49,
        'pending',
        NOW(),
        NOW()
    );

-- Inserimento di coupon (coupon)
INSERT INTO coupon (code, discount_percentage, is_active, order_id, created_at, updated_at)
VALUES
    (
        'WELCOME10',
        10.0,
        TRUE,
        (SELECT id FROM web_order WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') LIMIT 1),
        NOW(),
        NOW()
    ),
    (
        'SPRING20',
        20.0,
        TRUE,
        NULL,
        NOW(),
        NOW()
    );

-- Inserimento di un altro indirizzo per un utente
INSERT INTO address (address_line_1, address_line_2, city, country, user_id, created_at, updated_at)
VALUES
    (
        'Via Napoli 45',
        NULL,
        'Napoli',
        'Italia',
        (SELECT id FROM local_user WHERE username = 'mario.rossi'),
        NOW(),
        NOW()
    );

-- Inserimento di un altro carrello per testare carrelli multipli
INSERT INTO cart (user_id, is_active)
VALUES
    ((SELECT id FROM local_user WHERE username = 'mario.rossi'), FALSE);

-- Inserimento di elementi nel nuovo carrello
INSERT INTO cart_item (cart_id, product_id, quantity, created_at)
VALUES
    (
        (SELECT id FROM cart WHERE user_id = (SELECT id FROM local_user WHERE username = 'mario.rossi') AND is_active = FALSE),
        (SELECT id FROM product WHERE name = 'Laptop Pro'),
        1,
        NOW()
    );

-- Fine dello script
*/