document.addEventListener("DOMContentLoaded",() =>{
    fetch('./data.json').then(response => response.json()).then(data =>{
        data.forEach(element => {
            const dessert = document.createElement('div');
            dessert.classList.add('dessert');
            dessert.innerHTML = `
                <img src="${element.image.desktop}" alt="${element.name}" class="desserts-image">
                <button class="btn" onclick="addToCart('${element.name}', ${element.price})">Add to Cart<img src="./assets/images/icon-add-to-cart.svg" alt="cart" class="cart-icon"></button>
                <div class="dessert-details">
                    <p class="dessert-category">${element.category}</p>
                    <h3 class="dessert-name">${element.name}</h3>
                    <p class="dessert-price">${element.price}$</p>
                </div>
            `;
            document.querySelector('.desserts').appendChild(dessert);
        });
    })
})

let cart = [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    const dessertImages = document.querySelectorAll('.desserts-image');
    dessertImages.forEach(img => {
        if (img.alt === name) {
            img.classList.add('selected');
        }
    });
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.querySelector('.items');
    const emptyCartDiv = document.querySelector('.img-box');
    const selectedItemsDiv = document.querySelector('.selected-items');
    
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'flex';
        selectedItemsDiv.innerHTML = '';
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    selectedItemsDiv.style.visibility = 'visible';
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p><strong>${item.quantity}x</strong>   $${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        <div class="cart-total">
            <p>Order Total</p>
            <h3>$${total.toFixed(2)}</h3>
        </div>
        <div class="img-box1"><img src="./assets/images/icon-carbon-neutral.svg" alt="carbon neutral" class="carbon-icon"><p id="p1">This delivery is a <strong>carbon-neutral</strong> delivery</p></div>
        <div class="cart-actions">
            <button onclick="confirmOrder()">Confirm Order</button>
        </div>
    `;
    
    selectedItemsDiv.innerHTML = cartHTML;
}

function updateQuantity(name, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(name);
        const dessertImages = document.querySelectorAll('.desserts-image');
        dessertImages.forEach(img => {
            if (img.alt === name) {
                img.classList.remove('selected');
            }
        });
        return;
    }
    
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
}

function confirmOrder() {
    const confirmationPanel = document.createElement('div');
    confirmationPanel.classList.add('confirmation-panel');
    confirmationPanel.innerHTML = `
        <div class="confirmation-content">
            <img src="./assets/images/icon-order-confirmed.svg" alt="confirmation" class="confirmation-icon"><h2 id="h2">Order Confirmed</h2>
            <p id="p3">Your order has been confirmed. We hope you enjoy your food!</p>
            <div class="order-summary">
                ${cart.map(item => `
                    <div class="summary-item">
                        <span>${item.name}</span>
                        <span>${item.quantity}x</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="summary-total">
                    <span id="p4">Order Total</span>
                    <span>$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
            </div>
            <div class="confirmation-actions">
                <button onclick="processOrder()" class="btn-confirm">Start New Order</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmationPanel);
}

function processOrder() {
    const confirmationPanel = document.querySelector('.confirmation-panel');
    if (confirmationPanel) {
        confirmationPanel.remove();
        const dessertImages = document.querySelectorAll('.desserts-image');
        dessertImages.forEach(img => {
            img.classList.remove('selected');
        });
    }
    startNewOrder();
}

document.addEventListener('click', (e) => {
    const confirmationPanel = document.querySelector('.confirmation-panel');
    if (confirmationPanel && e.target === confirmationPanel) {
        confirmationPanel.remove();
    }
});

function startNewOrder() {
    cart = [];
    updateCartDisplay();
}

