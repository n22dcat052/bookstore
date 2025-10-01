document.addEventListener('DOMContentLoaded', function () {
    const sortingSelect = document.querySelector('.sorting-select');
    const booksContainer = document.querySelector('.books-container');
    const books = Array.from(document.querySelectorAll('.book-item'));

    // Check for category in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // Update sorting select if category is specified
    if (category) {
        sortingSelect.value = category;
    }

    // Lưu trữ dữ liệu sách gốc
    const originalBooks = [...books];

    // Hàm lấy giá từ chuỗi "$xx.xx"
    function getPriceValue(priceString) {
        return parseFloat(priceString.replace('$', ''));
    }

    // Hàm lấy số sao đánh giá
    function getRatingValue(bookElement) {
        const fullStars = bookElement.querySelectorAll('.stars .fas.fa-star').length;
        return fullStars;
    }

    // Setup book hover effects and click handlers
    setupBookActions();

    // Hàm lấy thể loại sách
    function getCategoryValue(bookElement) {
        // Giả lập lấy category từ data-category (cần thêm thuộc tính data-category cho từng book-item)
        return bookElement.getAttribute('data-category') || '';
    }

    // Hàm sắp xếp sách
    function sortBooks(criterion) {
        let sortedBooks = [...originalBooks];

        switch (criterion) {
            case 'price-low':
                sortedBooks.sort((a, b) => {
                    const priceA = getPriceValue(a.querySelector('.book-price').textContent);
                    const priceB = getPriceValue(b.querySelector('.book-price').textContent);
                    return priceA - priceB;
                });
                break;

            case 'price-high':
                sortedBooks.sort((a, b) => {
                    const priceA = getPriceValue(a.querySelector('.book-price').textContent);
                    const priceB = getPriceValue(b.querySelector('.book-price').textContent);
                    return priceB - priceA;
                });
                break;

            case 'rating':
                sortedBooks.sort((a, b) => {
                    const ratingA = getRatingValue(a);
                    const ratingB = getRatingValue(b);
                    return ratingB - ratingA;
                });
                break;

            case 'latest':
                // Giả lập sắp xếp theo mới nhất (đảo ngược thứ tự hiện tại)
                sortedBooks.reverse();
                break;

            case 'fiction':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'fiction');
                break;
            case 'non-fiction':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'non-fiction');
                break;
            case 'children':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'children');
                break;
            case 'biographies':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'biographies');
                break;
            case 'crime':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'crime');
                break;
            case 'mystery':
                sortedBooks = originalBooks.filter(b => getCategoryValue(b) === 'mystery');
                break;

            default:
                // Mặc định trở về thứ tự ban đầu
                sortedBooks = [...originalBooks];
        }

        // Cập nhật DOM
        booksContainer.innerHTML = '';
        sortedBooks.forEach(book => {
            booksContainer.appendChild(book);
        });
    }

    // Handle sorting and category changes
    sortingSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value.startsWith('price-') || value === 'rating' || value === 'popularity' || value === 'latest') {
            sortBooks(value);
        } else {
            // It's a category filter
            filterByCategory(value);
        }
    });

    function filterByCategory(category) {
        if (category === 'default') {
            // Show all books
            originalBooks.forEach(book => book.style.display = '');
            updateShowingResults(originalBooks.length);
        } else {
            // Filter books by category
            const filteredBooks = originalBooks.filter(book => {
                const bookCategory = book.getAttribute('data-category');
                return bookCategory === category;
            });

            originalBooks.forEach(book => {
                if (book.getAttribute('data-category') === category) {
                    book.style.display = '';
                } else {
                    book.style.display = 'none';
                }
            });

            updateShowingResults(filteredBooks.length);
        }

        // Update URL to maintain state
        const url = new URL(window.location.href);
        if (category === 'default') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }

    function updateShowingResults(count) {
        const showingResults = document.querySelector('.showing-results');
        showingResults.textContent = `Showing ${count} results`;
    }

    function setupBookActions() {
        // Handle hovering over books
        document.querySelectorAll('.book-item').forEach(book => {
            const actions = book.querySelector('.book-actions');
            if (actions) {
                book.addEventListener('mouseenter', () => {
                    actions.style.opacity = '1';
                });
                book.addEventListener('mouseleave', () => {
                    actions.style.opacity = '0';
                });
            }
        });

        // Handle book clicks
        document.querySelectorAll('.book-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const bookItem = this.closest('.book-item');
                const bookSlug = bookItem.dataset.slug;
                productHandler.navigateToProduct(bookSlug);
            });
        });

        // Handle Add to Cart clicks
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const bookItem = this.closest('.book-item');
                const bookTitle = bookItem.querySelector('.book-title').textContent;
                const bookPrice = bookItem.querySelector('.book-price').textContent;

                // Add to cart logic
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.title === bookTitle);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        title: bookTitle,
                        price: getPriceValue(bookPrice),
                        quantity: 1
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;

                // Show notification
                showNotification('Added to cart: ' + bookTitle);
            });
        });
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

    // Initialize book actions
    setupBookActions();

    // Apply initial category filter if present in URL
    if (category) {
        filterByCategory(category);
    }
});