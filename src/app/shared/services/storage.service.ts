import { Injectable } from '@angular/core';
const SecureStorage = require('secure-web-storage');
const SECRET_KEY = 'secret_key';
const CryptoJS = require('crypto-js');
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() { }
    public secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key: any): any {
            key = CryptoJS.SHA256(key, SECRET_KEY);
            return key.toString();
        },
        // Encrypt the localstorage data
        encrypt: function encrypt(data: any) {
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);
            data = data.toString();
            return data;
        },
        // Decrypt the encrypted data
        decrypt: function decrypt(data: any) {
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
            data = data.toString(CryptoJS.enc.Utf8);
            return data;
        }
    });
}