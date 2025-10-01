<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../config/database.php';

// Get book by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && preg_match('/\/api\/books\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $bookId = $conn->real_escape_string($matches[1]);
    
    $sql = "SELECT b.*, c.name as category_name 
            FROM books b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = '$bookId'";
            
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $book = [
            'id' => $row['id'],
            'title' => $row['title'],
            'author' => $row['author'],
            'price' => (float)$row['price'],
            'image' => $row['image'],
            'description' => $row['description'],
            'category' => $row['category_name'],
            'isbn' => $row['isbn'],
            'pages' => (int)$row['pages'],
            'publisher' => $row['publisher'],
            'language' => $row['language'],
            'dimensions' => $row['dimensions']
        ];
        echo json_encode($book);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Book not found']);
    }
}

$conn->close();