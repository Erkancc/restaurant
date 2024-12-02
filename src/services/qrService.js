import QRCode from 'qrcode';
import { formatPrice } from '../utils/formatters.js';

export class QRService {
    async generateQR(items, total) {
        if (items.length === 0) {
            throw new Error('Sepet boş');
        }

        let orderText = '🍽️ Sipariş Özeti:\n\n';
        items.forEach(item => {
            orderText += `${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
        });
        orderText += `\nToplam: ${formatPrice(total)}`;

        try {
            const qrDataUrl = await QRCode.toDataURL(orderText, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            
            // Create WhatsApp share URL
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(orderText)}`;
            return { qrDataUrl, whatsappUrl };
        } catch (error) {
            throw new Error('QR kod oluşturulamadı');
        }
    }
}