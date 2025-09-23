import CryptoJS from "crypto-js";
import { StudentPlain } from "../types";

const ENC_KEY = process.env.REACT_APP_ENC_KEY || "default_dev_key_change_me";

export function encryptStudent(student: StudentPlain): string {
  // Ensure this function converts a StudentPlain object to a string
  try {
    return JSON.stringify(student);
  } catch (error) {
    throw new Error("Failed to encrypt student data");
  }
}

export function decryptStudent(data: string): StudentPlain {
  // Ensure this function parses the string and returns a StudentPlain object
  try {
    return JSON.parse(data) as StudentPlain;
  } catch (error) {
    throw new Error("Failed to decrypt student data");
  }
}
