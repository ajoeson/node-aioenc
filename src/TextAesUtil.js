const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

class TextAesUtil {
  encrypt(plainText, dateKey) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(dateKey, 'hex'), Buffer.alloc(16));
    let ciphertext = cipher.update(plainText);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    return ciphertext.toString('hex');
  }
  
  decrypt(ciphertext, dateKey) {
    const ciphertextHex = Buffer.from(ciphertext, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(dateKey, 'hex'), Buffer.alloc(16));
    let plainText = decipher.update(ciphertextHex);
    plainText = Buffer.concat([plainText, decipher.final()]);
    return plainText.toString();
  }
}

module.exports = new TextAesUtil();
