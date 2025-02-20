import config from 'config';
// @ts-ignore
import AesEncryption from 'aes-encryption';

class AES {
    aes;

    constructor() {
        const key = config.get('AES_SECRET_KEY');
        this.aes = new AesEncryption();
        this.aes.setSecretKey(key);
    }

    async encrypt(payload: string) {
        const encrypted = await this.aes.encrypt(payload);
        return encrypted;

    }

    async decrypt(encryptedToken: string) {
        const decryptedToken = await this.aes.decrypt(encryptedToken);
        return decryptedToken;
    }
}

export const aes = new AES()