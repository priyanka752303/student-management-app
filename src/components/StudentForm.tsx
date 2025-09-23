import React, { useState } from "react";
import API from "../api";
import { encryptStudent } from "../utils/crypto";
import { StudentPlain } from "../types";

interface StudentFormProps {
  onSuccess?: () => void;
}

const empty: StudentPlain = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "Other",
  address: "",
  course: "",
  password: ""
};

const StudentForm: React.FC<StudentFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<StudentPlain>(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update<K extends keyof StudentPlain>(key: K, value: StudentPlain[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!form.fullName || !form.email || !form.password) {
      setMessage("Please fill full name, email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload = encryptStudent(form); // Ensure form is passed as StudentPlain
      await API.post("/students", {
        data: payload,
        createdAt: new Date().toISOString()
      });
      setMessage("Student added!");
      setForm(empty);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage("Failed to add student. Is server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Register Student</h2>
      {message && <div style={{ marginBottom: 8 }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label>Full Name</label>
            <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label>Phone Number</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
          </div>
          <div>
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Course Enrolled</label>
            <input value={form.course} onChange={(e) => update("course", e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Address</label>
            <textarea value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
