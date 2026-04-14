import crypto from "node:crypto";
import fs from "node:fs";

if (fs.existsSync("publicKey.pem") && fs.existsSync("privateKey.pem")) {
    console.log("keys already generated");
} else {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });
    fs.writeFileSync("publicKey.pem", publicKey);
    fs.writeFileSync("privateKey.pem", privateKey);
}

export const asymmEncryption = (plainText) => {
    const publicKey = fs.readFileSync('publicKey.pem','utf-8');
    const bufferedPlainText = Buffer.from(plainText);
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        bufferedPlainText,
    );
    return encrypted.toString("hex");
};
export const asymmDecryption = (cipherText) => {
    const privateKey = fs.readFileSync("privateKey.pem", "utf-8");
    const bufferedCipherText= Buffer.from(cipherText,'hex');
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        bufferedCipherText,
    );
    return decrypted.toString("utf-8");
};