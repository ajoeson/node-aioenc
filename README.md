# node-aioenc
All in one library focusing on the Key Management, Encryption, and Decryption.

## How to use

### Install dependency
```javascript
npm install aioenc
yarn add aioenc
```

### Use key manager to generate seed phrase in your deployment machine.
- Please download from the release section.
- Windows: manager.exe
- Linux: aioenc
- Mac OSX: aioenc-mac

### Generate seed phrase
```
Windows: manager.exe generateSeed
Linux: ./aioenc generateSeed
Mac: ./aioenc-mac generateSeed
```

### Or you can assign your own seed phrase
```
Write your seed phrase into the file ./seedphrase.dat

Execute the command to save the root key.
Windows: manager.exe saveRootKey
Linux: ./aioenc saveRootKey
Mac: ./aioenc-mac saveRootKey

The root key file will be stored inside .keystore/raesk.block, encrypted by machine-based host key.
```

### Apply encryption in your project
```javascript
const { KeyManager, TextAesUtil } = require('aioenc');
const moment = require('moment');

const keyManager = new KeyManager();
const rootKey = keyManager.loadRootKey();
const today = moment().local().format('YYYYMMDD');
const dateKey = keyManager.deriveDateKey(rootKey, today);
const ciphertext = TextAesUtil.encrypt('Testing plain text.', dateKey);
console.log('ciphertext: ', ciphertext);
```

### Apply decryption in your project
```javascript
const { KeyManager, TextAesUtil } = require('aioenc');
const moment = require('moment');

const keyManager = new KeyManager();
const rootKey = keyManager.loadRootKey();
const dateOfEncryption = '2025-01-01';
const dateKey = keyManager.deriveDateKey(rootKey, dateOfEncryption);
const plaintext = TextAesUtil.decrypt(ciphertext, dateKey);
console.log('plaintext: ', plaintext);
```
