const CryptoJS = require("crypto-js");


const KEY = CryptoJS.enc.Utf8.parse("aesEncryptionKey");
const IV  = CryptoJS.enc.Utf8.parse("encryptionIntVec");


export function encrypt(text: string){
    return CryptoJS.AES.encrypt(text, KEY, {iv: IV, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC}).toString();
}

export function decrypt(encryptedText: string | null){
    return CryptoJS.AES.decrypt(encryptedText, KEY, {iv: IV, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC}).toString(CryptoJS.enc.Utf8);
}



