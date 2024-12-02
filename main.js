let menuItems = [];
let cart = [];

// Menü öğelerini yükle
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Menü yüklenirken hata:', error);
        // Örnek verilerle devam et
        menuItems = [
            { id: 1, name: 'Karışık Pizza', description: 'Sucuk, sosis, mantar, yeşil biber', price: 180 },
            { id: 2, name: 'Hamburger', description: 'Dana eti, cheddar peyniri, turşu', price: 160 },
            { id: 3, name: 'Köfte', description: 'Izgara köfte, pilav, salata', price: 140 },
            { id: 4, name: 'Tavuk Şiş', description: 'Marine edilmiş tavuk, pilav, közlenmiş sebze', price: 120 }
        ];
        renderMenu();
    }
}

// Menüyü ekrana render et
function renderMenu() {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">₺${item.price}</div>
            <button onclick="addToCart(${item.id})">Sepete Ekle</button>
        </div>
    `).join('');
}

// Sepete ürün ekle
window.addToCart = function(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
};

// Sepeti güncelle
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₺${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `₺${total}`;
}

// Siparişi paylaş
document.getElementById('shareOrder').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }

    let message = '🍽️ Sipariş Özeti:\n\n';
    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - ₺${item.price * item.quantity}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nToplam: ₺${total}`;

    // WhatsApp paylaşım linki
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl);
});

// Admin panel işlemleri
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeModal = document.getElementById('closeModal');
const adminForm = document.getElementById('adminForm');

adminBtn.addEventListener('click', () => {
    adminModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
        id: menuItems.length + 1,
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        price: Number(document.getElementById('itemPrice').value)
    };
    
    menuItems.push(newItem);
    renderMenu();
    adminForm.reset();
    adminModal.style.display = 'none';
});

// Sayfa yüklendiğinde menüyü yükle
loadMenuItems();