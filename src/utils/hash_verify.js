import crypto from "crypto";

import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const hashedpassword = await bcrypt.hash(password, 12);
  return hashedpassword;
};

export const verifyPassword = async (hashedpassword, password) => {
  const isCorrect = await bcrypt.compare(password, hashedpassword);
  return isCorrect;
};

export const hashResetCode = (resetCode) => {
  const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");
  return hashedCode;
};

export const verifyResetCode = (resetCode, hashedCode ) => {
  const hashedResetCode  = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  const isCorrect = hashedCode  === hashedResetCode ;
  return isCorrect;
};
