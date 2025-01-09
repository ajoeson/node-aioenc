const assert = require('assert');
const moment = require('moment');
const fs = require('fs');
const { KeyManager, TextAesUtil, FileAesUtil } = require('..');

const keyManager = new KeyManager();
let _seedPhrase = 'the across mark industry brother sitting pot western see gift ever full shot flag stick grain born teach view history excellent recent managed bowl';
let _rootKey = null;

describe("1. Key Manager", function() {
  it("1.1 Generate seed phrase", async function() {
    const seedPhrase = await keyManager.generateSeedPhrase();
    assert(typeof seedPhrase == 'string');
    assert(seedPhrase.length > 100);
  });

  it('1.2 Test sha256 function', function () {
    const hash = keyManager.sha256('Testing')
    assert(hash === 'e806a291cfc3e61f83b98d344ee57e3e8933cccece4fb45e1481f1f560e70eb1');
  });

  it('1.3 Generate root key', function () {
    const rootKey = keyManager.generateRootKey(_seedPhrase);
    _rootKey = rootKey;
    assert(rootKey.length > 0);
  });

  it('1.4 Derive date key from root key', function () {
    const dateKey = keyManager.deriveDateKey(_rootKey, moment().local().format('YYYYMMDD'));
    assert(dateKey.length > 0);
    const dateKey2 = keyManager.deriveDateKey(_rootKey, moment().add(1, 'day').local().format('YYYYMMDD'));
    assert(dateKey !== dateKey2);
  });

  it('1.5 Get machine hostname based AES key', function () {
    const machineAesk = keyManager.getMachineBasedAesKey();
    assert(machineAesk.length > 0);
  });

  it('1.6 Save root key', function () {
    keyManager.saveRootKey(_rootKey);
  });

  it('1.7 Load root key', function () {
    const rootKey = keyManager.loadRootKey();
    assert(_rootKey === rootKey);
  });
});

describe("2. Text encryption / decryption", function() {
  const todayDate = moment().local().format('YYYYMMDD');
  const tomorrowDate = moment().add(1, 'day').local().format('YYYYMMDD');
  const yesterdayDate = moment().subtract(1, 'day').local().format('YYYYMMDD');
  const sampleTextToBeEncrypted = 'This is a sample text which is going to be encrypted.';

  it("2.1 Generate date key", async function() {
    const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
    const dateKeyTmr = keyManager.deriveDateKey(_rootKey, tomorrowDate);
    const dateKeyYesterday = keyManager.deriveDateKey(_rootKey, yesterdayDate);
    assert(dateKey !== dateKeyTmr);
    assert(dateKey !== dateKeyYesterday);
  });

  it("2.2 Encrypt / Decrypt plain text with date key", async function() {
    const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
    const ciphertext = TextAesUtil.encrypt(sampleTextToBeEncrypted, dateKey);
    const plainText = TextAesUtil.decrypt(ciphertext, dateKey);
    assert(plainText === sampleTextToBeEncrypted);
  });

  it("2.3 Ciphertext should not be decrypted with date key for tomorrow", async function() {
    try {
      const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
      const dateKeyTmr = keyManager.deriveDateKey(_rootKey, tomorrowDate);
      const ciphertext = TextAesUtil.encrypt(sampleTextToBeEncrypted, dateKey);
      TextAesUtil.decrypt(ciphertext, dateKeyTmr);
      assert(false, 'Should not happen.');
    } catch (ex) { }
  });

  it("2.4 Ciphertext should not be decrypted with date key for yesterday", async function() {
    try {
      const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
      const dateKeyPd = keyManager.deriveDateKey(_rootKey, yesterdayDate);
      const ciphertext = TextAesUtil.encrypt(sampleTextToBeEncrypted, dateKey);
      TextAesUtil.decrypt(ciphertext, dateKeyPd);
      assert(false, 'Should not happen.');
    } catch (ex) { }
  });

});

describe("3. File encryption / decryption", function() {
  const todayDate = moment().local().format('YYYYMMDD');
  const tomorrowDate = moment().add(1, 'day').local().format('YYYYMMDD');
  const yesterdayDate = moment().subtract(1, 'day').local().format('YYYYMMDD');
  if (!fs.existsSync('./.filestorage')) {
    fs.mkdirSync('./.filestorage');
  }
  fs.writeFileSync('./.filestorage/plain.txt', 'This is a sample text which is going to be stored into a file.', 'utf8');
  const plainTextBuffer = fs.readFileSync('./.filestorage/plain.txt', 'utf8');

  it("3.1 Encrypt file with date key", async function() {
    const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
    FileAesUtil.encrypt(plainTextBuffer, './.filestorage/file.enc', dateKey);
  });

  it("3.2 File can be decrypted with date key", async function() {
    const dateKey = keyManager.deriveDateKey(_rootKey, todayDate);
    const buffer = FileAesUtil.decrypt('./.filestorage/file.enc', dateKey);
    const plainText = buffer.toString('utf8');
    assert(plainText === 'This is a sample text which is going to be stored into a file.');
  });

  it("3.3 File should not be decrypted with date key for tomorrow", async function() {
    try {
      const dateKeyTmr = keyManager.deriveDateKey(_rootKey, tomorrowDate);
      FileAesUtil.decrypt('./.filestorage/file.enc', dateKeyTmr);
      assert(false, 'Should not happen.');
    } catch (ex) { }
  });

  it("3.4 File should not be decrypted with date key for yesterday", async function() {
    try {
      const dateKeyPd = keyManager.deriveDateKey(_rootKey, yesterdayDate);
      FileAesUtil.decrypt('./.filestorage/file.enc', dateKeyPd);
      assert(false, 'Should not happen.');
    } catch (ex) { }
  });

});
