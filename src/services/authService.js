export class AuthService {
    constructor() {
        this.credentials = {
            username: 'Erkancc',
            password: '4735500Ec..1-'
        };
    }

    login(username, password) {
        if (!username || !password) {
            throw new Error('Kullanıcı adı ve şifre gereklidir');
        }

        const isValid = username === this.credentials.username && 
                       password === this.credentials.password;
        
        if (!isValid) {
            throw new Error('Hatalı kullanıcı adı veya şifre');
        }

        localStorage.setItem('isAuthenticated', 'true');
        return true;
    }

    logout() {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/';
    }

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
}