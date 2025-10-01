-- Add new columns to books table
ALTER TABLE books
ADD COLUMN isbn VARCHAR(13) AFTER description,
ADD COLUMN pages INT AFTER isbn,
ADD COLUMN publisher VARCHAR(255) AFTER pages,
ADD COLUMN language VARCHAR(50) AFTER publisher,
ADD COLUMN dimensions VARCHAR(100) AFTER language,
ADD COLUMN weight VARCHAR(50) AFTER dimensions,
ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00 AFTER weight,
ADD COLUMN rating_count INT DEFAULT 0 AFTER rating;

-- Update existing books with sample data
UPDATE books SET
isbn = CONCAT('978', LPAD(FLOOR(RAND() * 1000000000), 10, '0')),
pages = FLOOR(200 + RAND() * 600),
publisher = 'Bookstore Publishing House',
language = 'English',
dimensions = '6 x 9 inches',
weight = '1.2 pounds',
rating = 4 + RAND(),
rating_count = FLOOR(10 + RAND() * 990)
WHERE isbn IS NULL;