import crypto from "crypto";

export const generateOtp = (length = 6) => {
    let otp = "";

    for (let index = 0; index < length; index += 1) {
        otp += crypto.randomInt(0, 10).toString();
    }

    return otp;
};
