import { formatPrice } from '../utils/formatters.js';

export class ShareService {
    shareOrder(items, total) {
        if (items.length === 0) {
            throw new Error('Sepet boş');
        }

        let message = '🍽️ Sipariş Özeti:\n\n';
        items.forEach(item => {
            message += `${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
        });
        message += `\nToplam: ${formatPrice(total)}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl);
    }
}