// Handle registration
require('dotenv').config();  // This should be at the very top of your main file
const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;
// const keyBytes = Buffer.from(ENCRYPTION_KEY, 'hex');


if (!process.env.ENCRYPTION_KEY) {
    console.log("Generated Key (set this in your environment variables):", ENCRYPTION_KEY);
}

exports.encrypt = (text)  => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}


exports.decrypt = (encryptedText) => {
    let textParts = encryptedText.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encrypted = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("Decrypt: ", decrypted)
    return decrypted;
}

