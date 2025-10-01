// Product Page Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get product ID from URL
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1].replace('.html', '');

    // Load product details
    const book = getBookById(productId);
    if (!book) {
        // Redirect to 404 or books page if product not found
        window.location.href = '../all-books.html';
        return;
    }

    // Update page content
    document.title = `${book.title} - Book Store`;
    document.getElementById('product-image').src = `../${book.image}`;
    document.getElementById('product-image').alt = book.title;
    document.querySelector('.product-breadcrumb span').textContent = book.title;
    document.querySelector('.product-info h1').textContent = book.title;
    document.querySelector('.product-price').textContent = `$${book.price.toFixed(2)}`;
    document.querySelector('.product-description').innerHTML = `<p>${book.description}</p>`;
    document.querySelector('#description .full-description').innerHTML = book.fullDescription;
    document.querySelector('.product-meta-info .category span').textContent = book.category.charAt(0).toUpperCase() + book.category.slice(1);
    document.querySelector('.product-meta-info .author span').textContent = book.author;

    // Update reviews
    updateReviews(book.reviews);

    // Load related books
    loadRelatedBooks(book.id);

    // Quantity selector
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Tab functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetTab = header.dataset.tab;

            // Update active states
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            header.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Rating functionality
    const ratingStars = document.querySelectorAll('.rating-input i');
    let selectedRating = 0;

    ratingStars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            updateStarDisplay(rating);
        });

        star.addEventListener('mouseout', () => {
            updateStarDisplay(selectedRating);
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStarDisplay(selectedRating);
        });
    });

    function updateStarDisplay(rating) {
        ratingStars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // Review form submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const reviewData = {
            rating: selectedRating,
            text: document.getElementById('review-text').value,
            name: document.getElementById('review-name').value,
            email: document.getElementById('review-email').value,
            saveInfo: document.getElementById('save-info').checked
        };

        // Submit review (implement API call here)
        console.log('Review submitted:', reviewData);

        // Reset form
        reviewForm.reset();
        selectedRating = 0;
        updateStarDisplay(0);
    });

    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
    });
});

async function loadProductDetails(productId) {
    // This function should fetch product details from your backend
    // For now, let's use sample data
    const sampleProduct = {
        name: "Sample Book Title",
        price: "$19.99",
        description: "This is a sample book description. Replace this with actual product data from your backend.",
        category: "Fiction",
        author: "John Doe"
    };

    // Update DOM with product details
    document.getElementById('product-title').textContent = sampleProduct.name;
    document.getElementById('product-name').textContent = sampleProduct.name;
    document.getElementById('product-price').textContent = sampleProduct.price;
    document.getElementById('product-description').textContent = sampleProduct.description;
    document.getElementById('product-category').textContent = sampleProduct.category;
    document.getElementById('product-author').textContent = sampleProduct.author;
}

function addToCart(productId, quantity) {
    // Implement cart functionality
    console.log(`Adding ${quantity} of product ${productId} to cart`);
    // You should implement the actual cart functionality here
    alert('Product added to cart!');
}