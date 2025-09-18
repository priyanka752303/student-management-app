export interface StudentPlain {
    fullName: string;
    email: string;
    phone: string;
    dob: string; // ISO date
    gender: string;
    address: string;
    course: string;
    password: string;
  }
  export interface StudentRecord {
    id: number;
    data: string; // encrypted ciphertext string (AES)
    createdAt?: string;
  }
  