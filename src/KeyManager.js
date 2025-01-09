const os = require('os');
const fs = require('fs');
const { scryptSync, createHash } = require("crypto");
const textAesUtil = require('./TextAesUtil.js');

// This is a class to manage the key, from generation to applying to encrypt utility.
class KeyManager {
  // Generate random string with a length default to 24 words
  async generateSeedPhrase(length = 24) {
    const randomWord = await import("random-words");
    const words = randomWord.generate(length);
    return words.join(' ');
  }

  // Calculate sha256 hash
  sha256(input) {
    return createHash('sha256').update(input).digest('hex');
  }

  // Generate machine based aes key with hostname and salt to store the keystore file
  getMachineBasedAesKey() {
    return scryptSync(os.hostname(), "0x0088:" + os.hostname() + ":0x8800", 32).toString('hex');
  }

  // Generate root key of the system
  generateRootKey(seedPhrase) {
    return scryptSync("lcSeed:" + seedPhrase.toLowerCase(), "0x0088:RAESK:0x8800", 32).toString('hex');
  }

  // Derive the date key with the root key
  deriveDateKey(rootKey, dateStr) {
    return scryptSync("dk:" + rootKey.toLowerCase() + ':' + String(dateStr).split('-').join(''), "0x0088:DAESK:0x8800", 32).toString('hex');
  }

  // Save the root key to file
  saveRootKey(rootKey) {
    if (!fs.existsSync('./.keystore')) {
      fs.mkdirSync('./.keystore');
    }
    const encryptedRootKey = textAesUtil.encrypt(rootKey, this.getMachineBasedAesKey());
    fs.writeFileSync('./.keystore/raesk.block', Buffer.from(encryptedRootKey, 'hex').toString('base64'), 'utf8');
  }

  // Load the root key from file
  loadRootKey() {
    if (!fs.existsSync('./.keystore')) {
      fs.mkdirSync('./.keystore');
    }
    if (!fs.existsSync('./.keystore/raesk.block')) {
      return null;
    }
    const buf = fs.readFileSync('./.keystore/raesk.block', 'utf8');
    const hexCiphertext = Buffer.from(buf, 'base64').toString('hex');
    const rootKey = textAesUtil.decrypt(hexCiphertext, this.getMachineBasedAesKey());
    return rootKey;
  }
}

module.exports = KeyManager;
