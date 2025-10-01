<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

// GET all books
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    
    $sql = "SELECT b.*, c.name as category_name 
            FROM books b 
            LEFT JOIN categories c ON b.category_id = c.id";
    
    if ($category) {
        $category = $conn->real_escape_string($category);
        $sql .= " WHERE c.slug = '$category'";
    }
    
    $result = $conn->query($sql);
    $books = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'author' => $row['author'],
                'price' => (float)$row['price'],
                'image' => $row['image'],
                'description' => $row['description'],
                'category' => $row['category_name']
            ];
        }
    }
    
    echo json_encode($books);
}

// GET featured books
else if ($_SERVER['REQUEST_URI'] === '/api/books/featured') {
    $sql = "SELECT b.*, c.name as category_name 
            FROM books b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.is_featured = 1 
            LIMIT 8";
            
    $result = $conn->query($sql);
    $books = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'author' => $row['author'],
                'price' => (float)$row['price'],
                'image' => $row['image'],
                'description' => $row['description'],
                'category' => $row['category_name']
            ];
        }
    }
    
    echo json_encode($books);
}

$conn->close();