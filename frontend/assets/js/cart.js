// Global Variables
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5;
let cart = [];

// Clear cart function
function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    }
    console.log('Cart cleared successfully');
}

// Helper Functions
function formatPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price.replace('$', '')) || 0;
    }
    return `$${price.toFixed(2)}`;
}

function initializeCart() {
    // Get cart from localStorage and ensure all items have quantity
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = storedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price
    }));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    // Đọc từ localStorage, đảm bảo là mảng
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    let totalItems = 0;
    if (Array.isArray(storedCart)) {
        totalItems = storedCart.reduce((total, item) => {
            const quantity = parseInt(item.quantity) || 1;
            return total + quantity;
        }, 0);
    }
    cartCount.textContent = totalItems;
}

// Cart Item Template
function createCartItemElement(item) {
    // Convert price from string "$XX.XX" to number if needed
    const price = typeof item.price === 'string' ?
        parseFloat(item.price.replace('$', '')) :
        item.price;

    // Set quantity to 1 if not defined
    const quantity = item.quantity || 1;

    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.img || item.image}" alt="${item.title}" style="width:100px;height:150px;object-fit:cover;">
            </div>
            <div class="item-details">
                <h4>${item.title}</h4>
                <div class="item-price">${formatPrice(price)}</div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${quantity}" min="1" max="99">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-total">
                ${formatPrice(price * quantity)}
            </div>
        </div>
    `;
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart
            .map(item => createCartItemElement(item))
            .join('');
    }

    updateCartSummary();
    updateCartCount();
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => {
        // Convert price from string "$XX.XX" to number if needed
        const price = typeof item.price === 'string' ?
            parseFloat(item.price.replace('$', '')) :
            item.price;

        // Use quantity or default to 1
        const quantity = item.quantity || 1;

        return sum + (price * quantity);
    }, 0);

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(total);

    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }

    // Update cart count
    updateCartCount();
}

// Cart Actions
function handleQuantityChange(event) {
    const button = event.target;
    const id = parseInt(button.dataset.id);
    const isIncrease = button.classList.contains('increase');

    const item = cart.find(item => item.id === id);
    if (item) {
        if (isIncrease) {
            item.quantity = Math.min(item.quantity + 1, 99);
        } else {
            item.quantity = Math.max(item.quantity - 1, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function handleRemoveItem(event) {
    const button = event.target.closest('.remove-item');
    if (!button) return;

    const id = parseInt(button.dataset.id);
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function handleQuantityInput(event) {
    const input = event.target;
    if (!input.matches('input[type="number"]')) return;

    const id = parseInt(input.closest('.cart-item').dataset.id);
    const quantity = Math.min(Math.max(parseInt(input.value) || 1, 1), 99);

    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    // Initialize cart first
    initializeCart();

    // Check if we're on cart page
    const isCartPage = window.location.pathname.includes('cart.html');

    if (isCartPage) {
        // Update cart display only on cart page
        updateCartDisplay();

        // Event Listeners for cart page
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', event => {
                if (event.target.matches('.quantity-btn')) {
                    handleQuantityChange(event);
                } else if (event.target.closest('.remove-item')) {
                    handleRemoveItem(event);
                }
            });

            cartItemsContainer.addEventListener('change', handleQuantityInput);
        }

        // Continue shopping button
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Checkout functionality will be implemented in the future.');
            });
        }
    }
});