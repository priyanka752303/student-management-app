import CryptoJS from "crypto-js";
import { StudentPlain } from "../types";

const ENC_KEY = process.env.REACT_APP_ENC_KEY || "default_dev_key_change_me";

export function encryptStudent(student: StudentPlain): string {
  try {
    const jsonString = JSON.stringify(student);
    return CryptoJS.AES.encrypt(jsonString, ENC_KEY).toString();
  } catch (error) {
    throw new Error("Failed to encrypt student data");
  }
}

export function decryptStudent(data: string): StudentPlain {
  try {
    const bytes = CryptoJS.AES.decrypt(data, ENC_KEY);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString) as StudentPlain; 
  } catch (error) {
    throw new Error("Failed to decrypt student data");
  }
}
