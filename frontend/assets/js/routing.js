// Handle product routing
function handleProductRouting() {
    const productLinks = document.querySelectorAll('.product-link');
    productLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = link.getAttribute('data-product');
            window.location.href = `/product/${productName}`;
        });
    });
}

// Handle category routing
function handleCategoryRouting() {
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            window.location.href = `/all-books.html?category=${category}`;
        });
    });
}

// Product page template
function loadProductPage(productName) {
    // Fetch product data
    const productData = getProductData(productName);
    
    // Update page content
    document.title = productData.name;
    document.querySelector('.product-title').textContent = productData.name;
    document.querySelector('.product-price').textContent = productData.price;
    document.querySelector('.product-description').textContent = productData.description;
    document.querySelector('.product-image').src = productData.image;
}

// Initialize routing
document.addEventListener('DOMContentLoaded', () => {
    handleProductRouting();
    handleCategoryRouting();
    
    // Check if we're on a product page
    const path = window.location.pathname;
    if (path.startsWith('/product/')) {
        const productName = path.split('/product/')[1];
        loadProductPage(productName);
    }
});