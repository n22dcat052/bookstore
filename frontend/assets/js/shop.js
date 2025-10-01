// Global Variables
const API_URL = 'http://localhost:8000/api';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let books = [];

// Helper Functions
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Book Card Template
function createBookCard(book) {
    return `
        <div class="book-card" data-id="${book.id}">
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <div class="book-price">${formatPrice(book.price)}</div>
                <button class="btn btn-primary add-to-cart" data-id="${book.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Load Books
async function loadBooks(category = '') {
    try {
        const url = category
            ? `${API_URL}/books?category=${category}`
            : `${API_URL}/books`;

        const response = await fetch(url);
        books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Display Books
function displayBooks(booksToDisplay) {
    const booksContainer = document.getElementById('books-container');
    if (booksContainer) {
        booksContainer.innerHTML = booksToDisplay
            .map(book => createBookCard(book))
            .join('');

        // Add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }
}

// Filter and Sort Functions
function handleCategoryChange(event) {
    loadBooks(event.target.value);
}

function handleSortChange(event) {
    const sortValue = event.target.value;
    let sortedBooks = [...books];

    switch (sortValue) {
        case 'price-low':
            sortedBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedBooks.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            // Default sorting (by id or featured status)
            sortedBooks.sort((a, b) => a.id - b.id);
    }

    displayBooks(sortedBooks);
}

// Cart Functions
function handleAddToCart(event) {
    const bookId = parseInt(event.target.dataset.id);
    const bookCard = event.target.closest('.book-card');
    const book = {
        id: bookId,
        title: bookCard.querySelector('h4').textContent,
        price: parseFloat(bookCard.querySelector('.book-price').textContent.replace('$', '')),
        image: bookCard.querySelector('img').src,
        quantity: 1
    };

    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(book);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Book added to cart!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadBooks();

    // Add event listeners for filters
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryChange);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', handleSortChange);
    }

    // Check for category in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category && categoryFilter) {
        categoryFilter.value = category;
        loadBooks(category);
    }
});