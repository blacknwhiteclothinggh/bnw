document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded:', window.location.pathname);
    updateCartCount();

    // Handle Quick Add buttons
    const quickAddBtns = document.querySelectorAll('.quick-add-btn');
    if (quickAddBtns.length > 0) {
        quickAddBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get product info from data attributes
                const productInfo = {
                    name: this.dataset.name,
                    price: this.dataset.price,
                    image: this.dataset.image,
                    quantity: 1
                };
                
                console.log('Adding product to cart:', productInfo);
                
                // Add to cart
                addToCart(productInfo);
                
                // Show success message
                showAddToCartMessage();
            });
        });
    }

    // Initialize cart display if on cart page
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
        // Attach cart-items event listener once after display is initialized
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', function(e) {
                const target = e.target;
                // Handle remove button
                if (target.classList.contains('remove-item')) {
                    const cartItem = target.closest('.cart-item');
                    const index = parseInt(cartItem.dataset.index);
                    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    cartItems.splice(index, 1);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartCount();
                    updateCartDisplay();
                    // Show removal message
                    const message = document.createElement('div');
                    message.className = 'remove-message';
                    message.textContent = 'Item removed from cart';
                    document.body.appendChild(message);
                    setTimeout(() => message.remove(), 2000);
                }
                // Handle quantity buttons
                if (target.classList.contains('quantity-btn')) {
                    const cartItem = target.closest('.cart-item');
                    const index = parseInt(cartItem.dataset.index);
                    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                    if (!cartItems[index].quantity) {
                        cartItems[index].quantity = 1;
                    }
                    let changed = false;
                    if (target.classList.contains('plus')) {
                        cartItems[index].quantity++;
                        changed = true;
                    } else if (target.classList.contains('minus') && cartItems[index].quantity > 1) {
                        cartItems[index].quantity--;
                        changed = true;
                    }
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    updateCartDisplay();
                    // Add flash animation
                    if (changed) {
                        setTimeout(() => {
                            const updatedCartItem = document.querySelector(`.cart-item[data-index='${index}'] .quantity`);
                            if (updatedCartItem) {
                                updatedCartItem.classList.add('flash-quantity');
                                setTimeout(() => updatedCartItem.classList.remove('flash-quantity'), 300);
                            }
                        }, 50);
                    }
                }
            });
        }
    }

    // Initialize cart count on every page
    updateCartCount();

    // Add debug logging for cart items
    console.log('Current cart items:', localStorage.getItem('cartItems'));
    
    // Test localStorage
    const testStorage = () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    };
    
    console.log('localStorage available:', testStorage());
    
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    const products = document.querySelectorAll('.product');
    const dots = document.querySelectorAll('.dot');
    const popup = document.getElementById('productPopup');
    const popupImage = document.querySelector('.popup-right img');
    const popupTitle = document.querySelector('.popup-left h1');
    const popupDescription = document.querySelector('.popup-left .description');
    let currentIndex = 1; // Start with center image

    const productDetails = {
        'tshirt1.png': {
            title: 'ELITE HOODIE',
            description: 'Our Elite Hoodie offers warmth and style. Made from a soft, durable cotton blend, it features a spacious hood and a convenient front pocket. Ideal for any casual setting.',
            price: 'GHS180.00'
        },
        'tshirt2.png': {
            title: 'ELITE T-SHIRT',
            description: 'Discover the perfect blend of style and comfort with our Elite T-shirt. Crafted from premium cotton, it offers a timeless fit and exceptional breathability, making it ideal for daily wear.',
            price: 'GHS90.00'
        },
        'tshirt3.png': {
            title: 'ELITE SWEATSHIRT',
            description: 'Stay cozy in our Elite Sweatshirt. Crafted with premium fleece material, ribbed cuffs and hem for perfect fit. Features a contemporary design that brings both warmth and style to your wardrobe.',
            price: 'GHS170.00'
        },
        'tshirt4.png': {
            title: 'NEW CROSS NECK T-SHIRT',
            description: 'A comfortable and versatile basic hoodie for everyday wear. Made from soft cotton blend with a relaxed fit.',
            price: 'GHS90.00'
        },
        'tshirt5.png': {
            title: 'NEW HOODIE',
            description: 'Simple and stylish casual t-shirt, perfect for any occasion. Made from breathable fabric for maximum comfort.',
            price: 'GHS180.00'
        },
        'tshirt6.png': {
            title: 'CAP',
            description: 'Complete your look with our classic Cap. Designed for comfort and versatility, this cap is perfect for any outdoor activity or casual outing.',
            price: 'GHS45.00'
        }
    };

    function rotateImages(direction) {
        // Get current positions
        const leftImage = document.querySelector('.product.left');
        const centerImage = document.querySelector('.product.center');
        const rightImage = document.querySelector('.product.right');

        // Remove current positions
        leftImage.classList.remove('left');
        centerImage.classList.remove('center');
        rightImage.classList.remove('right');

        if (direction === 'next') {
            // Rotate right
        leftImage.classList.add('right');
        centerImage.classList.add('left');
        rightImage.classList.add('center');
        } else {
            // Rotate left
            leftImage.classList.add('center');
            centerImage.classList.add('right');
            rightImage.classList.add('left');
        }

        // Update dots
        currentIndex = (currentIndex + (direction === 'next' ? 1 : -1)) % dots.length;
        if (currentIndex < 0) currentIndex = dots.length - 1;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Add click events for control buttons
    prevBtn.addEventListener('click', () => rotateImages('prev'));
    nextBtn.addEventListener('click', () => rotateImages('next'));

    // Add click event to all product images
        products.forEach(product => {
        product.addEventListener('click', function() {
            // Open popup for the clicked product
            openPopup(this);

            // If clicked image is not in center, rotate it to center
            if (this.classList.contains('left')) {
                rotateImages('prev');
            } else if (this.classList.contains('right')) {
                rotateImages('next');
            }
        });
    });

    // Popup functionality
    function openPopup(product) {
        const clickedImageSrc = product.getAttribute('src');
        const imageName = clickedImageSrc.split('/').pop();
        
        popupImage.setAttribute('src', clickedImageSrc);
        popupTitle.textContent = productDetails[imageName].title;
        popupDescription.textContent = productDetails[imageName].description;
        document.querySelector('.popup-left .price').textContent = productDetails[imageName].price;
        
        // Reset active states
        document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.color-dot.black').classList.add('active');
        
        popup.classList.add('active');
    }

    // Color selection
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            // Here you can add logic to change product image based on color
        });
    });

    // Size selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Handle Buy Now button in popup
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const popupContent = this.closest('.popup-content');
            const selectedColor = popupContent.querySelector('.color-dot.active')?.classList[1] || 'black';
            const selectedSize = popupContent.querySelector('.size-btn.active')?.textContent || 'M';
            const imageName = popupContent.querySelector('.popup-right img').src.split('/').pop();
            
            const productInfo = {
                name: productDetails[imageName].title,
                price: productDetails[imageName].price,
                image: popupContent.querySelector('.popup-right img').src,
                quantity: 1,
                color: selectedColor,
                size: selectedSize
            };

            // Add to cart
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(productInfo);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Update cart count
            updateCartCount();

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'add-to-cart-message';
            successMessage.textContent = 'Added to cart!';
            document.body.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 2000);

            // Redirect to cart page
            window.location.href = 'cart.html';
        });
    }

    // Popup slider dots
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sliderDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            // Here you can add logic to change product view angle
        });
    });

    // Close popup when clicking anywhere outside content
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Add click event to popup image to close popup
    popupImage.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Add at the beginning of your DOMContentLoaded event
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });

    // Close search when clicking outside
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // Update the popup content
    function updatePopupContent(imageSrc) {
        const imageName = imageSrc.split('/').pop();
        const details = productDetails[imageName];
        
        const popupContent = document.querySelector('.popup-content');
        if (popupContent) {
            const title = popupContent.querySelector('h1');
            const description = popupContent.querySelector('.description');
            const price = popupContent.querySelector('.price');
            const image = popupContent.querySelector('.popup-right img');
            
            title.textContent = details.title;
            description.textContent = details.description;
            price.textContent = details.price;
            image.src = imageSrc;
            image.alt = details.title;
        }
    }

    // Initialize the popup with the first product
    const firstImage = document.querySelector('.carousel-item img');
    if (firstImage) {
        updatePopupContent(firstImage.src);
    }

    // Add click handlers for carousel items
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.querySelector('img').src;
            updatePopupContent(imageSrc);
        });
    });
});

// Function to add item to cart
function addToCart(productInfo) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push(productInfo);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    console.log('Updated cart items:', cartItems);
}

// Function to update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartItems.length;
    });
}

// Function to show add to cart message
function showAddToCartMessage() {
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = 'Added to cart!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

// Function to update cart display
function updateCartDisplay() {
    let cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    // Replace cartItemsContainer with a clone to remove old listeners
    const newCartItemsContainer = cartItemsContainer.cloneNode(false);
    cartItemsContainer.parentNode.replaceChild(newCartItemsContainer, cartItemsContainer);
    cartItemsContainer = newCartItemsContainer;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Displaying cart items:', cartItems);

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <h1>Shopping Cart</h1>
            <p>Your cart is empty</p>
        `;
        updateCartTotals(0);
        return;
    }

    let itemsHTML = '<h1>Shopping Cart</h1>';
    let subtotal = 0;

    cartItems.forEach((item, index) => {
        const price = parseFloat(item.price.replace('GHS', ''));
        const quantity = item.quantity || 1;
        subtotal += price * quantity;

        itemsHTML += `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">${item.price}</p>
                    ${item.color ? `<p class="item-color">Color: ${item.color}</p>` : ''}
                    ${item.size ? `<p class="item-size">Size: ${item.size}</p>` : ''}
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-index="${index}"${quantity === 1 ? ' disabled' : ''}>-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <p class="item-total">GHS${(price * quantity).toFixed(2)}</p>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    updateCartTotals(subtotal);

    // Attach cart-items event listener after rendering
    cartItemsContainer.addEventListener('click', function(e) {
        const target = e.target;
        // Handle remove button
        if (target.classList.contains('remove-item')) {
            const cartItem = target.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            updateCartDisplay();
            // Show removal message
            const message = document.createElement('div');
            message.className = 'remove-message';
            message.textContent = 'Item removed from cart';
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 2000);
        }
        // Handle quantity buttons
        if (target.classList.contains('quantity-btn')) {
            const cartItem = target.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (!cartItems[index].quantity) {
                cartItems[index].quantity = 1;
            }
            let changed = false;
            if (target.classList.contains('plus')) {
                cartItems[index].quantity++;
                changed = true;
            } else if (target.classList.contains('minus') && cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                changed = true;
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartDisplay();
            // Add flash animation
            if (changed) {
                setTimeout(() => {
                    const updatedCartItem = document.querySelector(`.cart-item[data-index='${index}'] .quantity`);
                    if (updatedCartItem) {
                        updatedCartItem.classList.add('flash-quantity');
                        setTimeout(() => updatedCartItem.classList.remove('flash-quantity'), 300);
                    }
                }, 50);
            }
        }
    });
}

// Function to update cart totals
function updateCartTotals(subtotal) {
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    if (subtotalElement && totalElement) {
        const formattedSubtotal = `GHS${subtotal.toFixed(2)}`;
        subtotalElement.textContent = formattedSubtotal;
        totalElement.textContent = formattedSubtotal;
    }
}

function showCheckoutForm() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const subtotal = calculateSubtotal(cartItems);

    const formHTML = `
        <div class="checkout-overlay">
            <div class="checkout-form">
                <h2>Checkout Details</h2>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Delivery Address</label>
                        <textarea id="address" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="notes">Additional Notes (Optional)</label>
                        <textarea id="notes"></textarea>
                    </div>
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <p>Total Amount: GHS${subtotal.toFixed(2)}</p>
                    </div>
                    <button type="submit" class="submit-btn">Complete Order</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', formHTML);

    // Add form event listeners
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    const checkoutForm = document.getElementById('checkoutForm');
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
        checkoutOverlay.remove();
    });

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const notes = document.getElementById('notes').value;

        // Create order message
        let orderMessage = `*New Order*\n\n`;
        orderMessage += `*Customer Details*\n`;
        orderMessage += `Name: ${name}\n`;
        orderMessage += `Phone: ${phone}\n`;
        orderMessage += `Address: ${address}\n`;
        if (notes) orderMessage += `Notes: ${notes}\n\n`;

        orderMessage += `*Order Items*\n`;
        cartItems.forEach(item => {
            orderMessage += `- ${item.name} (${item.quantity}x) @ ${item.price}\n`;
        });
        orderMessage += `\n*Total Amount: GHS${subtotal.toFixed(2)}*`;

        // Create WhatsApp link
        const whatsappLink = `https://wa.me/233594906859?text=${encodeURIComponent(orderMessage)}`;

        // Clear cart
        localStorage.setItem('cartItems', '[]');

        // Redirect to WhatsApp
        window.location.href = whatsappLink;
    });
}

function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace('GHS', ''));
        const quantity = item.quantity || 1;
        return total + (price * quantity);
    }, 0);
}

// Place this at the very end of the file, outside any DOMContentLoaded block:
document.body.addEventListener('click', function(e) {
    const btn = e.target.closest('.checkout-btn');
    if (btn) {
        console.log('Checkout button clicked!');
        showCheckoutForm();
    }
}); 