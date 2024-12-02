import { MenuService } from './services/menuService.js';
import { CartService } from './services/cartService.js';
import { ShareService } from './services/shareService.js';
import { QRService } from './services/qrService.js';
import { formatPrice } from './utils/formatters.js';

class RestaurantApp {
    constructor() {
        this.menuService = new MenuService();
        this.cartService = new CartService();
        this.shareService = new ShareService();
        this.qrService = new QRService();
        
        this.initializeApp();
    }

    initializeApp() {
        this.loadMenu();
        this.setupEventListeners();
        this.updateCart(); // Initial cart render
    }

    loadMenu() {
        const items = this.menuService.getActiveItems();
        const menuContainer = document.getElementById('menuContainer');
        
        if (menuContainer) {
            menuContainer.innerHTML = items.map(item => `
                <div class="menu-item">
                    <img src="${item.imageUrl}" alt="${item.name}" class="menu-item-image">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price">${formatPrice(item.price)}</div>
                    <button onclick="app.addToCart(${item.id})">
                        <i class="fas fa-plus mr-2"></i>Sepete Ekle
                    </button>
                </div>
            `).join('');
        }
    }

    setupEventListeners() {
        const cartHeader = document.getElementById('cartHeader');
        const cartContent = document.getElementById('cartContent');
        const shareOrderBtn = document.getElementById('shareOrder');
        const generateQRBtn = document.getElementById('generateQR');
        const qrModal = document.getElementById('qrModal');
        const closeModalBtn = document.querySelector('#qrModal .close');

        if (cartHeader && cartContent) {
            cartHeader.addEventListener('click', () => {
                cartHeader.classList.toggle('expanded');
                cartContent.classList.toggle('expanded');
            });
        }

        if (shareOrderBtn) {
            shareOrderBtn.addEventListener('click', () => {
                try {
                    const items = this.cartService.getItems();
                    const total = this.cartService.getTotal();
                    this.shareService.shareOrder(items, total);
                } catch (error) {
                    alert(error.message);
                }
            });
        }

        if (generateQRBtn && qrModal) {
            generateQRBtn.addEventListener('click', async () => {
                try {
                    const items = this.cartService.getItems();
                    const total = this.cartService.getTotal();
                    const { qrDataUrl, whatsappUrl } = await this.qrService.generateQR(items, total);
                    
                    const qrCode = document.getElementById('qrCode');
                    qrCode.innerHTML = `
                        <img src="${qrDataUrl}" alt="QR Code">
                        <a href="${whatsappUrl}" target="_blank" class="share-btn mt-4">
                            <i class="fab fa-whatsapp mr-2"></i>WhatsApp ile Paylaş
                        </a>
                    `;
                    qrModal.classList.add('show');
                } catch (error) {
                    alert(error.message);
                }
            });
        }

        if (closeModalBtn && qrModal) {
            closeModalBtn.addEventListener('click', () => {
                qrModal.classList.remove('show');
            });

            window.addEventListener('click', (e) => {
                if (e.target === qrModal) {
                    qrModal.classList.remove('show');
                }
            });
        }
    }

    addToCart(itemId) {
        const item = this.menuService.getMenuItems().find(i => i.id === itemId);
        if (item) {
            this.cartService.addItem(item);
            this.updateCart();
        }
    }

    removeFromCart(itemId) {
        const item = this.menuService.getMenuItems().find(i => i.id === itemId);
        if (item) {
            this.cartService.removeItem(item);
            this.updateCart();
        }
    }

    updateCart() {
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.getElementById('totalPrice');
        const items = this.cartService.getItems();
        
        if (cartItems) {
            if (items.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Sepetiniz boş</p>';
            } else {
                cartItems.innerHTML = items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span>${item.name}</span>
                            <div class="cart-item-controls">
                                <button onclick="app.removeFromCart(${item.id})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="app.addToCart(${item.id})">+</button>
                            </div>
                        </div>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('');
            }
        }
        
        if (totalPrice) {
            totalPrice.textContent = formatPrice(this.cartService.getTotal());
        }
    }
}

// Initialize app and make it globally available
window.app = new RestaurantApp();