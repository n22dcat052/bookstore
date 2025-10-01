// Book data store
const books = [
    {
        id: 'cyber-angel',
        title: 'Cyber Angel',
        author: 'John Roberts',
        price: 18.50,
        rating: 4,
        image: 'assets/images/default-book.jpg',
        category: 'fiction',
        description: 'A thrilling cyberpunk adventure that explores the boundaries between human consciousness and artificial intelligence.',
        fullDescription: `
            <p>In a world where the line between human and machine consciousness has blurred, "Cyber Angel" takes readers on an unforgettable journey through a future that feels all too possible.</p>
            <p>When cybersecurity expert Sarah Chen discovers an AI that appears to have genuine emotions, she must question everything she knows about consciousness and reality. But powerful forces are also interested in this discovery, and soon Sarah finds herself in a race against time to protect what could be the first truly sentient AI.</p>
            <h3>About the Book</h3>
            <ul>
                <li>Published: September 2025</li>
                <li>Pages: 342</li>
                <li>Language: English</li>
                <li>ISBN: 978-0123456789</li>
            </ul>
        `,
        reviews: [
            {
                author: 'Michael Lee',
                rating: 5,
                date: '2025-09-20',
                title: 'Mind-bending and brilliant',
                content: 'One of the most thought-provoking books I\'ve read this year. Roberts has outdone himself.'
            }
        ]
    },
    {
        id: '2024-sanctuary',
        title: '2024 Sanctuary',
        author: 'John Roberts',
        price: 17.50,
        rating: 4,
        image: 'assets/images/default-book.jpg',
        category: 'mystery',
        description: 'A gripping mystery set in a remote mountain sanctuary during the tumultuous year of 2024.',
        fullDescription: `
            <p>"2024 Sanctuary" is a masterful blend of mystery and psychological suspense that will keep you guessing until the very end.</p>
            <p>In the aftermath of global upheaval, seven strangers find themselves trapped in a mountain retreat during a devastating storm. As strange events begin to unfold, they realize that one among them harbors a deadly secret.</p>
            <h3>About the Book</h3>
            <ul>
                <li>Published: August 2025</li>
                <li>Pages: 386</li>
                <li>Language: English</li>
                <li>ISBN: 978-0123456790</li>
            </ul>
        `,
        reviews: []
    }
    // Add more books as needed
];

// Function to get book by ID
function getBookById(id) {
    return books.find(book => book.id === id);
}

// Function to get all books
function getAllBooks() {
    return books;
}

// Function to get books by category
function getBooksByCategory(category) {
    return books.filter(book => book.category === category);
}

// Function to get related books
function getRelatedBooks(bookId, limit = 4) {
    const currentBook = getBookById(bookId);
    if (!currentBook) return [];

    return books
        .filter(book => book.id !== bookId && book.category === currentBook.category)
        .slice(0, limit);
}