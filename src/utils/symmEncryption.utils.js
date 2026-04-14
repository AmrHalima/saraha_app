import crypto from "node:crypto";
import envConfig from "../config/env.config.js";

const encEnv = envConfig.encryption;
const encKey = Buffer.from(encEnv.ENC_KEY, "hex");

//symetric
export const encrypt = (plainText) => {
    const iv = crypto.randomBytes(encEnv.ENC_IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", encKey, iv);
    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};
export const decrypt = (cipherText) => {
    const [stringIV, cipher] = cipherText.split(":");
    const iv = Buffer.from(stringIV, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", encKey, iv);
    let decrypted = decipher.update(cipher, "hex", "utf-8");
    decrypted +=decipher.final("utf-8");    
    return decrypted;
};
