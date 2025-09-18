import React, { useState } from "react";
import API from "../api";
import { decryptStudent } from "../utils/crypto";
import { StudentPlain } from "../types";

interface Props {
  onLogin: (userId: number) => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!email || !password) {
      setErr("Please provide email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.get("/students");
      const students: any[] = res.data;
      let foundId: number | null = null;

      for (const s of students) {
        try {
          const plain = decryptStudent(s.data) as StudentPlain;
          // Ensure password comparison is case-sensitive and matches backend logic
          if (
            plain.email.toLowerCase() === email.toLowerCase() &&
            plain.password === password
          ) {
            foundId = s.id;
            break;
          }
        } catch (error) {
          console.error("Decryption error for student ID:", s.id, error);
          // Skip malformed entries
        }
      }

      if (foundId) {
        onLogin(foundId);
      } else {
        setErr("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      setErr("Failed to connect to server. Is json-server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}
      <div style={{ marginBottom: 8 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Checking..." : "Login"}
      </button>
    </form>
  );
}
