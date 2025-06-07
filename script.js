// Menu functionality
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Cart functionality
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.getElementById('total-amount');
const checkoutButton = document.getElementById('checkout-button');

// Open cart modal when clicking cart icon
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

// Close cart modal
document.querySelector('.close').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
            quantity: 1
        };

        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        updateCartCount();
        showAddedToCartAnimation(e.target);
    });
});

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    totalAmount.textContent = total.toFixed(2);
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    updateCartDisplay();
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

// Show added to cart animation
function showAddedToCartAnimation(button) {
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '#000';
    }, 1000);
}

// Checkout functionality
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Prepare order message
    const orderItems = cart.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `New Order:\n\n${orderItems}\n\nTotal: $${total.toFixed(2)}`;

    // Try to open WhatsApp
    const whatsappUrl = `https://wa.me/233500693175?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    // If WhatsApp doesn't open, send email
    if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
        const emailSubject = 'New Order from BlacknWhite';
        const emailBody = message;
        const emailUrl = `mailto:blacknwhiteghana01@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = emailUrl;
    }
}); 