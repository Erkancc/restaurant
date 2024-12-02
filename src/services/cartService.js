export class CartService {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.saveToStorage();
        return this.items;
    }

    removeItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity -= 1;
            if (existingItem.quantity <= 0) {
                this.items = this.items.filter(i => i.id !== item.id);
            }
        }
        this.saveToStorage();
        return this.items;
    }

    getItems() {
        return [...this.items];
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
    }

    saveToStorage() {
        try {
            localStorage.setItem('cart_items', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('cart_items');
            if (stored) {
                this.items = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    }
}