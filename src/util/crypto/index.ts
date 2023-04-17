// @ts-ignore
import CryptoJS from 'crypto-js'

const SECRET_KEY = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
const SECRET_IV = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');

export function encrypt(data: any): string {
    if (typeof data === "object") {
        try {
            data = JSON.stringify(data);
        } catch (error) {
            console.log("encrypt error:", error);
        }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

export function decrypt(cipherText: string) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(cipherText);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    if (decryptedStr) {
        return JSON.parse(decryptedStr);
    }
    return null;
}