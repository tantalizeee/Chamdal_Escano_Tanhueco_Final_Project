// --- NEW GLOBAL STATE ---
const productListPage = document.getElementById('product-list-page'); 
const productDetailsPage = document.getElementById('product-details-page');
const cartPage = document.getElementById('cart-page');

// Cart State (Array to hold items)
let cart = [];

// Current Product being viewed on the details page
let currentProduct = null;

// --- DOM ELEMENTS FOR HAMBURGER ---
const hamburger = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-nav');


// --- UTILITY FUNCTIONS ---

function formatPrice(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// --- PAGE SWITCHING ---

function showMainPage(pageToShow) {
    // Hide all pages
    if (productListPage) productListPage.classList.add('hidden');
    if (productDetailsPage) productDetailsPage.classList.add('hidden');
    if (cartPage) cartPage.classList.add('hidden');

    // Show the requested page
    if (pageToShow) pageToShow.classList.remove('hidden');
}

// --- DETAILS PAGE UPDATE ---

function updateDetailsPage(product) {
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-price').textContent = formatPrice(product.price);
    
    // FIX: Prepend the correct path to the filename to display the image.
    const imagePath = 'Images/Parts Shop Images/' + product.image; 

    // Set the image source dynamically
    document.getElementById('detail-image').src = imagePath; 
    document.getElementById('detail-image').alt = product.name; 
}


// --- CART FUNCTIONS ---

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        // Sum up the quantity of all items in the cart
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function calculateTotal() {
    let subtotal = 0;
    
    // Sum the price * quantity for all items
    subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update the HTML display
    document.getElementById('subtotal-amount').textContent = formatPrice(subtotal);
    document.getElementById('grand-total-amount').textContent = formatPrice(subtotal);
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    // 1. Clear existing items
    container.innerHTML = '';

    // 2. Loop through the cart and build HTML
    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 20px; color: #ccc;">Your cart is empty. Start shopping!</div>`;
    }

    cart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        
        // Calculate item total for display
        const itemTotal = item.price * item.quantity;
        
        // The image path must also be prefixed here since item.image is only the filename
        const cartImagePath = 'Images/Parts Shop Images/' + item.image;

        // Build the HTML row structure
        itemRow.innerHTML = `
            <div class="col-item">
                <img src="${cartImagePath}" alt="Bodykit Thumbnail" class="cart-thumb">
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
        
        container.appendChild(itemRow);
    });

    // 3. Re-attach event listeners for dynamic elements
    attachCartEventListeners();

    // 4. Update the total bill
    calculateTotal();
}

function attachCartEventListeners() {
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity < 1) {
                e.target.value = 1; 
                return;
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


// --- EVENT LISTENERS ---

// 0. Hamburger Menu Toggle
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('show');
    });
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('show');
        });
    });
}


// 1. ALL Product Link Clicks (List -> Details)
const productLinks = document.querySelectorAll('.product-item');
productLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        currentProduct = {
            name: link.dataset.name,
            price: parseFloat(link.dataset.price),
            image: link.dataset.image,
            quantity: 1 
        };

        updateDetailsPage(currentProduct);
        showMainPage(productDetailsPage);
    });
});

// 2. Add to Cart Click (Details -> Cart)
const addToCartBtn = document.getElementById('add-to-cart-btn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        if (!currentProduct) return; 

        const existingItem = cart.find(item => item.name === currentProduct.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...currentProduct, quantity: 1}); 
        }

        updateCartBadge();
        renderCart(); 
        showMainPage(cartPage);
    });
}

// 3. View Cart Icon Click (Any Page -> Cart)
const viewCartBtn = document.getElementById('view-cart-btn');
if (viewCartBtn) {
    viewCartBtn.addEventListener('click', () => {
        renderCart(); // Render cart every time before showing
        showMainPage(cartPage);
    });
}

// 4. Continue Shopping Click (Cart -> List)
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
        showMainPage(productListPage);
    });
}

// 5. Pagination Logic

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const btnPrev = document.getElementById('btnPrev');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btnNext = document.getElementById('btnNext');

// Function to handle the state of the pagination buttons
function updatePaginationState(activePage) {
    [btn1, btn2].forEach(btn => btn.classList.remove('active'));

    if (activePage === 1) {
        if (page1) page1.classList.remove('hidden');
        if (page2) page2.classList.add('hidden');
        if (btn1) btn1.classList.add('active');
        if (btnPrev) btnPrev.classList.add('hidden');
        if (btnNext) btnNext.classList.remove('hidden');
    } else if (activePage === 2) {
        if (page1) page1.classList.add('hidden');
        if (page2) page2.classList.remove('hidden');
        if (btn2) btn2.classList.add('active');
        if (btnPrev) btnPrev.classList.remove('hidden');
        if (btnNext) btnNext.classList.add('hidden');
    }
}

// Event listener for Previous button
if (btnPrev) {
    btnPrev.addEventListener('click', () => {
        updatePaginationState(1);
    });
}

// Event listener for Next button
if (btnNext) {
    btnNext.addEventListener('click', () => {
        updatePaginationState(2);
    });
}

// Event listener for Page 1 button
if (btn1) {
    btn1.addEventListener('click', () => {
        updatePaginationState(1);
    });
}

// Event listener for Page 2 button
if (btn2) {
    btn2.addEventListener('click', () => {
        updatePaginationState(2);
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    showMainPage(productListPage);
    updatePaginationState(1);
    updateCartBadge();
});