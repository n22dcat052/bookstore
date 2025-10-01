-- Create database
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category_id INT,
    is_featured BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Best Sellers', 'best-seller', 'Our most popular books'),
('New Arrivals', 'new-arrival', 'Latest additions to our collection'),
("Editor's Pick", 'editors-pick', 'Handpicked by our editors');

-- Insert sample books
INSERT INTO books (title, author, description, price, image, category_id, is_featured) VALUES
('The Mists of Algorab', 'Elena Blackwood', 'A thrilling space adventure', 24.99, 'assets/images/mists-of-algorab.jpg', 1, 1),
('Cyber Angel', 'Marcus Chen', 'A cyberpunk mystery', 19.99, 'assets/images/cyber-angel.jpg', 1, 1),
('Into the Wild', 'Sarah Connor', 'A journey of self-discovery', 21.99, 'assets/images/into-the-wild.jpg', 2, 1),
('Game of Spades', 'James Mitchell', 'A high-stakes thriller', 22.99, 'assets/images/game-of-spades.jpg', 2, 1),
('2024 Sanctuary', 'Maria Rodriguez', 'A dystopian masterpiece', 23.99, 'assets/images/2024-sanctuary.jpg', 3, 1),
('Ark Forging', 'David Kim', 'Epic fantasy adventure', 25.99, 'assets/images/ark-forging.jpg', 3, 1),
('Liar of Dreams', 'Emily White', 'Psychological suspense', 20.99, 'assets/images/liar-of-dreams.jpg', 1, 1),
("I'll Catch You", 'Thomas Brown', 'Romance thriller', 18.99, 'assets/images/ill-catch-you.jpg', 2, 1),
('Now You See Me', 'Lisa Gray', 'Mystery thriller', 19.99, 'assets/images/now-you-see-me.jpg', 1, 0),
('The Born of Aplex', 'Robert Green', 'Sci-fi adventure', 24.99, 'assets/images/the-born-of-aplex.jpg', 2, 0),
('This Dark Road to Mercy', 'Grace Wilson', 'Family drama', 22.99, 'assets/images/this-dark-road-to-mercy.jpg', 3, 0);