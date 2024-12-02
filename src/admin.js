import { AuthService } from './services/authService.js';
import { MenuService } from './services/menuService.js';
import { formatPrice } from './utils/formatters.js';

class AdminPanel {
    constructor() {
        this.authService = new AuthService();
        this.menuService = new MenuService();
        
        this.setupEventListeners();
        this.checkAuth();
        this.setupModal();
    }

    setupEventListeners() {
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                try {
                    this.authService.login(username, password);
                    this.showAdminPanel();
                } catch (error) {
                    alert(error.message);
                }
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authService.logout();
            });
        }

        // Image preview handler
        const itemImage = document.getElementById('itemImage');
        const imagePreview = document.getElementById('imagePreview');

        if (itemImage) {
            itemImage.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Form submit handler
        const addItemForm = document.getElementById('addItemForm');
        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('itemName').value,
                    description: document.getElementById('itemDescription').value,
                    price: Number(document.getElementById('itemPrice').value),
                    imageUrl: document.getElementById('imagePreview').src
                };

                const editItemId = addItemForm.dataset.editId;
                if (editItemId) {
                    this.menuService.updateMenuItem(Number(editItemId), formData);
                    delete addItemForm.dataset.editId;
                    document.querySelector('#addItemModal h2').textContent = 'Yeni Ürün Ekle';
                } else {
                    this.menuService.addMenuItem(formData);
                }
                
                this.loadMenuItems();
                addItemForm.reset();
                imagePreview.src = "https://placehold.co/300x300/374151/FFD700/png?text=Ürün+Fotoğrafı";
                this.closeModal();
            });
        }
    }

    setupModal() {
        const addNewItemBtn = document.getElementById('addNewItemBtn');
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('addItemModal');

        if (addNewItemBtn) {
            addNewItemBtn.addEventListener('click', () => {
                document.querySelector('#addItemModal h2').textContent = 'Yeni Ürün Ekle';
                document.getElementById('addItemForm').reset();
                document.getElementById('imagePreview').src = "https://placehold.co/300x300/374151/FFD700/png?text=Ürün+Fotoğrafı";
                delete document.getElementById('addItemForm').dataset.editId;
                modal.classList.remove('hidden');
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    editItem(id) {
        const item = this.menuService.getMenuItem(id);
        if (item) {
            const form = document.getElementById('addItemForm');
            const modal = document.getElementById('addItemModal');
            const imagePreview = document.getElementById('imagePreview');
            
            document.querySelector('#addItemModal h2').textContent = 'Ürün Düzenle';
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemDescription').value = item.description;
            document.getElementById('itemPrice').value = item.price;
            
            // Reset file input
            const fileInput = document.getElementById('itemImage');
            fileInput.value = '';
            
            // Set image preview
            imagePreview.src = item.imageUrl;
            
            form.dataset.editId = id;
            modal.classList.remove('hidden');
        }
    }

    closeModal() {
        const modal = document.getElementById('addItemModal');
        modal.classList.add('hidden');
    }

    checkAuth() {
        if (this.authService.isAuthenticated()) {
            this.showAdminPanel();
        } else {
            this.hideAdminPanel();
        }
    }

    showAdminPanel() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        this.loadMenuItems();
    }

    hideAdminPanel() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
    }

    loadMenuItems() {
        const items = this.menuService.getMenuItems();
        const container = document.getElementById('menuItems');
        
        if (container) {
            container.innerHTML = items.map(item => `
                <div class="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
                    <img src="${item.imageUrl}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-yellow-500">${item.name}</h3>
                        <p class="text-gray-400">${item.description}</p>
                        <div class="text-yellow-500 font-bold">${formatPrice(item.price)}</div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="adminPanel.editItem(${item.id})"
                                class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <i class="fas fa-edit"></i>
                            Düzenle
                        </button>
                        <button onclick="adminPanel.toggleItemStatus(${item.id})"
                                class="px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
                                    item.active 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-gray-500 hover:bg-gray-600'
                                }">
                            <i class="fas ${item.active ? 'fa-check' : 'fa-times'}"></i>
                            ${item.active ? 'Aktif' : 'Pasif'}
                        </button>
                        <button onclick="adminPanel.deleteItem(${item.id})"
                                class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                            <i class="fas fa-trash"></i>
                            Sil
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    toggleItemStatus(id) {
        this.menuService.toggleItemStatus(id);
        this.loadMenuItems();
    }

    deleteItem(id) {
        if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            this.menuService.deleteItem(id);
            this.loadMenuItems();
        }
    }
}

window.adminPanel = new AdminPanel();