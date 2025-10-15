// --- PAGE VIEW ELEMENTS ---
const productListPage = document.getElementById('product-list-page'); 
const cartPage = document.getElementById('cart-page');

// --- GLOBAL STATE ---
let cart = []; 

// --- DOM ELEMENTS FOR HEADER & UI ---
const hamburger = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-nav');
const cartBadge = document.getElementById('cart-badge'); 
const viewCartBtn = document.getElementById('view-cart-btn'); 

// --- CART PAGE ELEMENTS (Copied from partshop.js) ---
const cartItemsContainer = document.getElementById('cart-items-container');
const subtotalAmount = document.getElementById('subtotal-amount');
const grandTotalAmount = document.getElementById('grand-total-amount');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');


// --- UTILITY FUNCTIONS ---

/** Formats a number to a currency string ($XX.XX) */
function formatPrice(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || !isFinite(num)) {
        return '$0.00';
    }
    return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Updates the number displayed on the cart icon */
function updateCartBadge() {
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

// --- PAGE SWITCHING (Copied from partshop.js logic) ---

/** Shows only the requested page view, hiding others */
function showMainPage(pageToShow) {
    if (productListPage) productListPage.classList.add('hidden');
    if (cartPage) cartPage.classList.add('hidden');
    if (pageToShow) pageToShow.classList.remove('hidden');
}


// --- CART FUNCTIONS (Adapted from partshop.js) ---

function calculateTotal() {
    let subtotal = 0;
    
    subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotalAmount) subtotalAmount.textContent = formatPrice(subtotal);
    if (grandTotalAmount) grandTotalAmount.textContent = formatPrice(subtotal);
}

function renderCart() {
    if (!cartItemsContainer) return;

    // 1. Clear existing items
    cartItemsContainer.innerHTML = '';

    // 2. Loop through the cart and build HTML
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #ccc;">Your cart is empty. Start shopping!</div>`;
    }

    cart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        
        const itemTotal = item.price * item.quantity;
        const cartImagePath = 'Images/Merch Shop Images/' + item.image;

        itemRow.innerHTML = `
            <div class="col-item">
                <img src="${cartImagePath}" alt="Merch Thumbnail" class="cart-thumb">
                <span>${item.name}</span>
            </div>
            <span class="col-price">${formatPrice(item.price)}</span>
            <div class="col-qty">
                <input type="number" 
                       value="${item.quantity}" 
                       min="1" 
                       data-index="${index}"
                       class="qty-input">
            </div>
            <span class="col-total">${formatPrice(itemTotal)}</span>
            <button class="remove-item" data-index="${index}">X</button>
        `;
        
        cartItemsContainer.appendChild(itemRow);
    });

    // 3. Re-attach event listeners for dynamic elements
    attachCartEventListeners();

    // 4. Update the total bill
    calculateTotal();
}

function attachCartEventListeners() {
    // Listener for Quantity Change
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            let newQuantity = parseInt(e.target.value);
            
            if (newQuantity < 1 || isNaN(newQuantity)) {
                newQuantity = 1;
                e.target.value = 1; 
            }

            cart[index].quantity = newQuantity;
            renderCart(); 
            updateCartBadge();
        });
    });

    // Listener for Remove Button
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1); 
            renderCart(); 
            updateCartBadge();
        });
    });
}


// --- PRODUCT LOGIC ---

/** Adds a product to the global cart array */
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 }); 
    }
    
    console.log(`Added ${product.name} to cart.`);
    updateCartBadge();
}

// --- INITIALIZATION ---

function initMerchPage() {
    // 1. Setup Hamburger Menu Listener
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('show');
            hamburger.classList.toggle('open');
        });
    }

    // 2. Setup "BUY NOW" buttons listeners
    const buyButtons = document.querySelectorAll('.merch-buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            // Extract product data from the data attributes on the BUY NOW link
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            
            if (name && price && image) {
                const product = {
                    name: name,
                    price: price,
                    image: image,
                };
                
                addToCart(product);
            }
        });
    });

    // 3. Setup Cart View Listeners 
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
             renderCart();
             showMainPage(cartPage);
        });
    }
    
    // 4. Setup Continue Shopping Button
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            showMainPage(productListPage);
        });
    }
    
    // 5. Initialize the cart badge display and default view
    showMainPage(productListPage);
    updateCartBadge();
}

// Start the application after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initMerchPage);