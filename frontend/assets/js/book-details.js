// Book Details Handler
class BookRouter {
    constructor() {
        this.setupRouting();
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    setupRouting() {
        // Handle back/forward navigation
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });

        // Handle initial load
        this.handleRoute(window.location.pathname);

        // Intercept book link clicks
        document.addEventListener('click', (e) => {
            const bookLink = e.target.closest('a[href^="/product/"]');
            if (bookLink) {
                e.preventDefault();
                const href = bookLink.getAttribute('href');
                this.navigateToBook(href);
            }
        });
    }

    handleRoute(pathname) {
        const match = pathname.match(/^\/product\/(.+?)(?:\.html)?$/);
        if (match) {
            const bookId = match[1];
            this.loadBookDetails(bookId);
        }
    }

    navigateToBook(href) {
        window.history.pushState({}, '', href);
        this.handleRoute(href);
    }

    async loadBookDetails(bookId) {
    async loadBookDetails(bookId) {
            try {
                const book = await this.fetchBookData(bookId);
                if (!book) {
                    window.location.href = '/all-books.html';
                    return;
                }

                // Create or get the product container
                let productContainer = document.querySelector('.product-container');
                if (!productContainer) {
                    productContainer = this.createProductContainer();
                    document.querySelector('main').appendChild(productContainer);
                }

                // Update content
                productContainer.innerHTML = this.generateBookHTML(book);

                // Update page title and meta
                document.title = `${book.title} - Book Store`;

                // Setup event listeners
                this.setupEventListeners(productContainer, book);

                // Load related books
                this.loadRelatedBooks(book.category, bookId);
            } catch (error) {
                console.error('Error loading book details:', error);
                window.location.href = '/all-books.html';
            }
        }

    async fetchBookData(bookId) {
            // In a real app, this would fetch from an API
            // For now, we'll use mock data
            const books = {
                'cyber-angel': {
                    id: 'cyber-angel',
                    title: 'Cyber Angel',
                    author: 'John Roberts',
                    price: 18.50,
                    image: '/assets/images/books/cyber-angel.jpg',
                    category: 'Science Fiction',
                    description: 'A thrilling cyberpunk adventure...',
                    rating: 4.5,
                    reviews: []
                },
                // Add more books
            };

            return books[bookId];
        }

        generateBookHTML(book) {
            return `
            <div class="product-details">
                <div class="product-gallery">
                    <img src="${book.image}" alt="${book.title}" class="main-image">
                </div>
                <div class="product-info">
                    <nav class="breadcrumb">
                        <a href="/">Home</a> / 
                        <a href="/all-books.html">All Books</a> / 
                        <span>${book.title}</span>
                    </nav>
                    <h1>${book.title}</h1>
                    <div class="author">by ${book.author}</div>
                    <div class="rating">
                        ${this.generateRatingStars(book.rating)}
                        <span class="rating-count">(${book.reviews.length} reviews)</span>
                    </div>
                    <div class="price">$${book.price.toFixed(2)}</div>
                    <div class="description">${book.description}</div>
                    <div class="add-to-cart-section">
                        <div class="quantity-selector">
                            <button class="decrease">-</button>
                            <input type="number" value="1" min="1" class="quantity">
                            <button class="increase">+</button>
                        </div>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                    <div class="meta">
                        <div class="category">Category: ${book.category}</div>
                    </div>
                </div>
            </div>
            <div class="product-tabs">
                <div class="tab-headers">
                    <button class="tab-header active" data-tab="description">Description</button>
                    <button class="tab-header" data-tab="reviews">Reviews (${book.reviews.length})</button>
                </div>
                <div class="tab-content">
                    <div id="description" class="tab-panel active">
                        ${book.description}
                    </div>
                    <div id="reviews" class="tab-panel">
                        ${this.generateReviewsSection(book.reviews)}
                    </div>
                </div>
            </div>
        `;
        }

        generateRatingStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            let stars = '';

            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i === Math.ceil(rating) && hasHalfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }

            return `<div class="stars">${stars}</div>`;
        }

        generateReviewsSection(reviews) {
            if (reviews.length === 0) {
                return `
                <div class="no-reviews">
                    <p>No reviews yet. Be the first to review this book!</p>
                    <button class="write-review-btn">Write a Review</button>
                </div>
            `;
            }

            return `
            <div class="reviews-list">
                ${reviews.map(review => this.generateReviewHTML(review)).join('')}
                <button class="write-review-btn">Write a Review</button>
            </div>
        `;
        }

        generateReviewHTML(review) {
            return `
            <div class="review">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <div class="rating">${this.generateRatingStars(review.rating)}</div>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-content">${review.content}</div>
            </div>
        `;
        }

        setupEventListeners(container, book) {
            // Quantity selector
            const quantityInput = container.querySelector('.quantity');
            container.querySelector('.decrease').addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) quantityInput.value = currentValue - 1;
            });
            container.querySelector('.increase').addEventListener('click', () => {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            });

            // Add to cart
            container.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                this.addToCart(book, quantity);
            });

            // Tab switching
            container.querySelectorAll('.tab-header').forEach(header => {
                header.addEventListener('click', () => {
                    const tabId = header.dataset.tab;
                    container.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                    container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                    header.classList.add('active');
                    container.querySelector(`#${tabId}`).classList.add('active');
                });
            });

            // Write review button
            const writeReviewBtn = container.querySelector('.write-review-btn');
            if (writeReviewBtn) {
                writeReviewBtn.addEventListener('click', () => {
                    this.showReviewForm(container);
                });
            }
        }

        addToCart(book, quantity) {
            this.cart.push({
                id: book.id,
                title: book.title,
                price: book.price,
                quantity: quantity
            });
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
            this.showNotification('Added to cart successfully!');
        }

        updateCartCount() {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
            }
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        createProductContainer() {
            const container = document.createElement('div');
            container.className = 'product-container';
            return container;
        }
        document.getElementById('book-category').textContent = book.category;
        document.getElementById('book-isbn').textContent = book.isbn;
        document.getElementById('book-pages').textContent = book.pages;
        document.getElementById('book-publisher').textContent = book.publisher;
        document.getElementById('book-language').textContent = book.language;
        document.getElementById('book-dimensions').textContent = book.dimensions;

        // Load related books
        loadRelatedBooks(book.category, bookId);
    } catch(error) {
        console.error('Error loading book details:', error);
        window.location.href = 'shop.html';
    }
}

// Load Related Books
async function loadRelatedBooks(category, currentBookId) {
    try {
        const response = await fetch(`${API_URL}/books?category=${category}`);
        const books = await response.json();

        const relatedBooks = books
            .filter(book => book.id !== currentBookId)
            .slice(0, 4);

        const relatedBooksContainer = document.getElementById('related-books');
        if (relatedBooksContainer) {
            relatedBooksContainer.innerHTML = relatedBooks
                .map(book => createBookCard(book))
                .join('');

            // Add event listeners to add-to-cart buttons
            document.querySelectorAll('#related-books .add-to-cart').forEach(button => {
                button.addEventListener('click', handleAddToCart);
            });
        }
    } catch (error) {
        console.error('Error loading related books:', error);
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

// Handle Add to Cart
function handleAddToCart(event) {
    event.preventDefault();
    const bookId = getBookIdFromUrl();
    const quantity = parseInt(document.getElementById('quantity').value);

    const book = {
        id: bookId,
        title: document.getElementById('book-title').textContent,
        price: parseFloat(document.getElementById('book-price').textContent.replace('$', '')),
        image: document.getElementById('book-image').src,
        quantity: quantity
    };

    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(book);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Book added to cart!');
}

// Quantity Selector
function handleQuantityChange(event) {
    const input = document.getElementById('quantity');
    const value = parseInt(input.value);

    if (event.target.classList.contains('increase')) {
        input.value = Math.min(value + 1, 99);
    } else if (event.target.classList.contains('decrease')) {
        input.value = Math.max(value - 1, 1);
    }
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
    loadBookDetails();

    // Add event listeners
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    document.getElementById('add-to-cart').addEventListener('click', handleAddToCart);

    // Handle quantity input validation
    const quantityInput = document.getElementById('quantity');
    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        quantityInput.value = Math.min(Math.max(value, 1), 99);
    });
});