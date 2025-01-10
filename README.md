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

---

# Key Generation and Management Approach

## Introduction

In today's digital landscape, the security of sensitive data is paramount. This document outlines a robust Key Generation and Management mechanism designed to enhance data protection for our customers. By implementing a layered approach to encryption, we ensure that even if one key is compromised, the impact is limited.

## Overview of the Key Management System

Our system does not include traditional key management modules; instead, it employs a unique strategy for key generation and encryption. The core principles of our approach are:

- **Root Key Security**: The root key is encrypted and securely stored within a virtual machine (VM).
- **Daily Key Rotation**: Encryption keys are derived from the root key and rotated daily, minimizing the risk of data exposure.
- **Seed Phrase Recovery**: A seed phrase for the root key can be securely downloaded, printed, and stored in a vault.

## Key Generation Procedure

The following steps outline our encryption key generation procedure:

### Step 1: Seed Phrase Generation

1. Generate a 24-word seed phrase using random English words.
2. Instruct customers to securely store the seed phrase in a vault or split it into two parts (12-12 words) across two departments for added security.
3. The seed phrase serves primarily for recovery purposes.

### Step 2: Root Key Derivation

1. Hash the seed phrase using the SHA-256 algorithm.
2. Add a signature and salt to the hash.
3. Derive an AES-256 root key from the modified hash.
4. Securely store the root key in the `.keystone` folder, encrypting it with a machine-based key derived from hardware identifiers (e.g., hostname, CPU serial). We recommend using hostnames for this purpose.

### Step 3: Daily Encryption Key Generation

1. Once the root key is generated, derive an encryption/decryption key by concatenating the current date with the root key hash (SHA-256).
   - Example format: `YYYY-MM-DD.SALT.root_key_hash`
2. Use this derived AES-256 key to encrypt media files.
3. Rotate this encryption key daily at 23:59:59, ensuring that each day's files are encrypted with a unique key.

### Step 4: File Decryption Process

1. To decrypt files, retrieve the file generation date (available via file system commands or database entries).
2. Obtain the root key hash by decrypting it with the machine-based AES-256 key and hashing it with SHA-256.
3. Derive the corresponding daily encryption key using the file's generation date.
4. Use this derived key to decrypt the file.

## Implementation Considerations

### Security Benefits

Implementing this key generation and management approach provides several security benefits:

- **Limited Exposure**: By rotating encryption keys daily, even if one key is compromised, only files created on that specific day are at risk.
- **Recovery Mechanism**: The use of a seed phrase ensures that customers can recover their keys without relying on centralized storage solutions.
- **Hardware-Based Security**: Tying encryption to machine-specific identifiers enhances security against unauthorized access.

### Challenges and Recommendations

While this approach offers significant advantages, there are challenges to consider:

- **User Education**: Customers must understand how to securely store their seed phrases and manage their keys effectively.
- **Implementation Complexity**: The system requires careful implementation to ensure that all steps are followed accurately.

To mitigate these challenges, we recommend providing comprehensive documentation and support for users during the initial setup phase.

## Conclusion

The proposed Key Generation and Management approach offers a secure framework for protecting sensitive data through effective encryption practices. By leveraging daily key rotation, secure storage mechanisms, and user-friendly recovery options, we can enhance our customers' data security posture significantly.

We invite feedback on this proposal and look forward to discussing its implementation further.

---

*For more information or to contribute to this project, please contact me via GitHub.*
