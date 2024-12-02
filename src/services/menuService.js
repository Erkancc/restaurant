export class MenuService {
    constructor() {
        this.storageKey = 'restaurant_menu_items';
        this.initializeDefaultItems();
    }

    initializeDefaultItems() {
        try {
            let stored = localStorage.getItem(this.storageKey);
            if (!stored || JSON.parse(stored).length === 0) {
                const defaultItems = [
                    {
                        id: 1,
                        name: 'Karışık Pizza',
                        description: 'Sucuk, sosis, mantar, yeşil biber',
                        price: 180,
                        imageUrl: 'https://placehold.co/300x300/333/FFD700/png?text=Pizza',
                        active: true
                    }
                ];
                this.saveToStorage(defaultItems);
                return defaultItems;
            }
            return JSON.parse(stored);
        } catch (error) {
            console.error('localStorage error:', error);
            return [];
        }
    }

    saveToStorage(items) {
        try {
            // Clean and validate items before saving
            const cleanItems = items.map(item => ({
                id: Number(item.id),
                name: String(item.name),
                description: String(item.description),
                price: Number(item.price),
                imageUrl: String(item.imageUrl),
                active: Boolean(item.active)
            }));
            
            localStorage.setItem(this.storageKey, JSON.stringify(cleanItems));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            this.cleanupStorage();
            return false;
        }
    }

    cleanupStorage() {
        try {
            const essentialKeys = [this.storageKey, 'isAuthenticated'];
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!essentialKeys.includes(key)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error cleaning storage:', error);
        }
    }

    getMenuItems() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting menu items:', error);
            return [];
        }
    }

    getActiveItems() {
        return this.getMenuItems().filter(item => item.active);
    }

    addMenuItem(item) {
        try {
            const items = this.getMenuItems();
            const newItem = {
                ...item,
                id: Date.now(),
                active: true
            };
            
            items.push(newItem);
            this.saveToStorage(items);
            return newItem;
        } catch (error) {
            console.error('Error adding menu item:', error);
            return null;
        }
    }

    updateMenuItem(id, updatedData) {
        try {
            const items = this.getMenuItems();
            const index = items.findIndex(item => item.id === Number(id));
            
            if (index !== -1) {
                items[index] = {
                    ...items[index],
                    ...updatedData,
                    id: Number(id)
                };
                this.saveToStorage(items);
                return items[index];
            }
            return null;
        } catch (error) {
            console.error('Error updating menu item:', error);
            return null;
        }
    }

    toggleItemStatus(id) {
        try {
            const items = this.getMenuItems();
            const item = items.find(item => item.id === Number(id));
            if (item) {
                item.active = !item.active;
                this.saveToStorage(items);
                return item;
            }
            return null;
        } catch (error) {
            console.error('Error toggling item status:', error);
            return null;
        }
    }

    deleteItem(id) {
        try {
            const items = this.getMenuItems();
            const filteredItems = items.filter(item => item.id !== Number(id));
            return this.saveToStorage(filteredItems);
        } catch (error) {
            console.error('Error deleting item:', error);
            return false;
        }
    }
}