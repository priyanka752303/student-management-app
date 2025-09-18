import CryptoJS from "crypto-js";
import { StudentPlain } from "../types";

const ENC_KEY = process.env.REACT_APP_ENC_KEY || "default_dev_key_change_me";

console.log(ENC_KEY);

export function encryptStudent(student: StudentPlain): string {
  const text = JSON.stringify(student);
  const ciphertext = CryptoJS.AES.encrypt(text, ENC_KEY).toString();
  console.log(ciphertext);
  return ciphertext;
}

export function decryptStudent(ciphertext: string): StudentPlain {
  console.log(ciphertext);
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENC_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedText);
  if (!decryptedText) {
    throw new Error("Failed to decrypt - invalid key or data.");
  }
  const obj = JSON.parse(decryptedText) as StudentPlain;
  return obj;
}
