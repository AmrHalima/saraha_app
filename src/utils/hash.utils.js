import bcrypt from "bcrypt";
import envConfig from "../config/env.config.js";
import argon2 from "argon2";
const envHash = envConfig.hash;

export const hash = (plainText) => {
    return bcrypt.hash(plainText, envHash.HASH_SALT_ROUNDS);
};
export const compare = (plainText, hash) => {
    return bcrypt.compare(plainText, hash);
};
export const ArgonHash = (plainText) => {
    return argon2.hash(plainText);
};
export const ArgonCompare = (plainText, hash) => {
    return argon2.verify(hash, plainText);
};