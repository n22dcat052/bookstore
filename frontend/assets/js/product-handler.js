// Book data store
const books = {
    'cyber-angel': {
        id: 'cyber-angel',
        title: 'Cyber Angel',
        author: 'John Roberts',
        price: 18.50,
        rating: 4,
        image: 'assets/images/books/cyber-angel.jpg',
        category: 'Science Fiction',
        description: 'A thrilling cyberpunk adventure that explores the boundaries between human consciousness and artificial intelligence.',
        reviews: []
    },
    'tales-of-castle-black': {
        id: 'tales-of-castle-black',
        title: 'Tales of Castle Black',
        author: 'Mark Brownn',
        price: 19.99,
        rating: 4,
        image: 'assets/images/books/tales-of-castle-black.jpg',
        category: 'Fantasy',
        description: 'An epic tale of mystery and magic within the walls of the ancient Castle Black.',
        reviews: []
    }
    // Add more books as needed
};

// Product routing and display handler
const productHandler = {
    init() {
        this.setupEventListeners();
        this.handleCurrentPath();
    },

    setupEventListeners() {
        // Handle book link clicks
        document.addEventListener('click', (e) => {
            const bookLink = e.target.closest('a[href*="/product/"]');
            if (bookLink) {
                e.preventDefault();
                const bookId = bookLink.getAttribute('href').split('/').pop().replace('.html', '');
                this.navigateToProduct(bookId);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleCurrentPath();
        });
    },

    handleCurrentPath() {
        const pathMatch = window.location.pathname.match(/\/product\/(.+?)(?:\.html)?$/);
        if (pathMatch) {
            this.showProduct(pathMatch[1]);
        }
    },

    navigateToProduct(bookId) {
        const url = `/product/${bookId}.html`;
        history.pushState({ bookId }, '', url);
        this.showProduct(bookId);
    },

    showProduct(bookId) {
        const book = books[bookId];
        if (!book) {
            window.location.href = '/all-books.html';
            return;
        }

        // Get or create product container
        let productContainer = document.getElementById('product-container');
        if (!productContainer) {
            productContainer = document.createElement('div');
            productContainer.id = 'product-container';
            document.querySelector('main').appendChild(productContainer);
        }

        // Update content
        productContainer.innerHTML = this.generateProductHTML(book);

        // Update page title
        document.title = `${book.title} - Book Store`;

        // Setup event handlers
        this.setupProductHandlers(book);
    },

    generateProductHTML(book) {
        return `
            <div class="product-details">
                <nav class="breadcrumb">
                    <a href="/">Home</a> /
                    <a href="/all-books.html">All Books</a> /
                    <span>${book.title}</span>
                </nav>
                
                <div class="product-content">
                    <div class="product-gallery">
                        <img src="/${book.image}" alt="${book.title}" class="main-image">
                    </div>
                    
                    <div class="product-info">
                        <h1>${book.title}</h1>
                        <p class="author">by ${book.author}</p>
                        
                        <div class="rating">
                            ${this.generateStars(book.rating)}
                            <span class="review-count">(${book.reviews.length} reviews)</span>
                        </div>
                        
                        <div class="price">$${book.price.toFixed(2)}</div>
                        
                        <div class="description">
                            ${book.description}
                        </div>
                        
                        <div class="actions">
                            <div class="quantity">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" value="1" min="1" class="quantity-input">
                                <button class="quantity-btn plus">+</button>
                            </div>
                            <button class="add-to-cart">Add to Cart</button>
                        </div>
                        
                        <div class="meta">
                            <p>Category: <span>${book.category}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    generateStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('<i class="fas fa-star"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }
        return stars.join('');
    },

    setupProductHandlers(book) {
        const container = document.getElementById('product-container');

        // Quantity handlers
        const quantityInput = container.querySelector('.quantity-input');
        container.querySelector('.minus').addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            if (current > 1) quantityInput.value = current - 1;
        });
        container.querySelector('.plus').addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            quantityInput.value = current + 1;
        });

        // Add to cart handler
        container.querySelector('.add-to-cart').addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            this.addToCart(book, quantity);
        });
    },

    addToCart(book, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');

        const existingItem = cart.find(item => item.id === book.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: book.id,
                title: book.title,
                price: book.price,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Added to cart successfully!');
    },

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = count;
        }
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Initialize the product handler when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    productHandler.init();
});