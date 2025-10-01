// Global Variables
const API_URL = 'http://localhost:8000/api';
let cart = [];

// Helper Functions
function formatPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price.replace('$', '')) || 0;
    }
    return `$${price.toFixed(2)}`;
}

function initializeCart() {
    // Get cart from localStorage and normalize data
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = storedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price
    }));
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
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

// Load Featured Books
async function loadFeaturedBooks() {
    try {
        const response = await fetch(`${API_URL}/books/featured`);
        const books = await response.json();

        const featuredBooksContainer = document.getElementById('featured-books');
        if (featuredBooksContainer) {
            featuredBooksContainer.innerHTML = books
                .map(book => createBookCard(book))
                .join('');

            // Add event listeners to add-to-cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', handleAddToCart);
            });
        }
    } catch (error) {
        console.error('Error loading featured books:', error);
    }
}

// Cart Functions
function handleAddToCart(event) {
    const bookId = parseInt(event.target.dataset.id);
    const bookCard = event.target.closest('.book-card');
    const book = {
        id: bookId,
        title: bookCard.querySelector('h4').textContent,
        price: parseFloat(bookCard.querySelector('.book-price').textContent.replace('$', '')),
        img: bookCard.querySelector('img').src, // Changed from image to img to be consistent
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

// Initialize cart on page load
function initializeCart() {
    // Get cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Always initialize cart on any page
    initializeCart();

    // Only load featured books if we're on the home page
    if (document.getElementById('featured-books')) {
        loadFeaturedBooks();
    }

    // Add scroll behavior for header
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
});