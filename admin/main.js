import { AuthService } from '../src/services/authService.js';
import { MenuService } from '../src/services/menuService.js';

class AdminPanel {
  constructor() {
    this.authService = new AuthService();
    this.menuService = new MenuService();
    
    this.setupEventListeners();
    this.checkAuth();
  }

  setupEventListeners() {
    // Auth form
    document.getElementById('authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const success = this.authService.login(username, password);
      if (success) {
        this.showAdminPanel();
      } else {
        alert('Hatalı kullanıcı adı veya şifre!');
      }
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      this.authService.logout();
      this.hideAdminPanel();
    });

    // Add item form
    const addItemForm = document.getElementById('addItemForm');
    const imagePreview = document.getElementById('imagePreview');

    document.getElementById('itemImage')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });

    addItemForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newItem = {
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        price: Number(document.getElementById('itemPrice').value),
        imageUrl: imagePreview.src || null
      };
      
      this.menuService.addMenuItem(newItem);
      this.loadMenuItems();
      addItemForm.reset();
      imagePreview.style.display = 'none';
    });
  }

  checkAuth() {
    if (this.authService.isAuthenticated()) {
      this.showAdminPanel();
    } else {
      this.hideAdminPanel();
    }
  }

  showAdminPanel() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    this.loadMenuItems();
  }

  hideAdminPanel() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
  }

  loadMenuItems() {
    const items = this.menuService.getMenuItems();
    const container = document.getElementById('menuItems');
    
    if (container) {
      container.innerHTML = items.map(item => `
        <div class="menu-item-admin">
          <img src="${item.imageUrl}" alt="${item.name}">
          <div class="content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">₺${item.price}</div>
          </div>
          <div class="actions">
            <button 
              onclick="adminPanel.toggleItemStatus(${item.id})"
              class="status-toggle ${item.active ? 'status-active' : 'status-inactive'}"
            >
              ${item.active ? 'Aktif' : 'Pasif'}
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
}

// Initialize admin panel and make it globally available
window.adminPanel = new AdminPanel();