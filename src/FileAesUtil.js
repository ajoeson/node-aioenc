const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-cbc';

class FileAesUtil {
  encrypt(buffer, outputPath, dateKey) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(dateKey, 'hex'), Buffer.alloc(16));
    let ciphertext = cipher.update(buffer);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    fs.writeFileSync(outputPath, ciphertext);
  }
  
  decrypt(inputPath, dateKey) {
    const buf = fs.readFileSync(inputPath);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(dateKey, 'hex'), Buffer.alloc(16));
    let plainFileBuffer = decipher.update(buf);
    plainFileBuffer = Buffer.concat([plainFileBuffer, decipher.final()]);
    return plainFileBuffer;
  }
}

module.exports = new FileAesUtil();
