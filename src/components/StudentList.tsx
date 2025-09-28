import React, { useEffect, useState } from "react";
import API from "../api";
import { StudentRecord, StudentPlain } from "../types";
import { decryptStudent, encryptStudent } from "../utils/crypto";

export default function StudentList() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [decrypted, setDecrypted] = useState<Record<number, StudentPlain>>({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<StudentPlain | null>(null);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await API.get("/students");
      const data: StudentRecord[] = res.data;
      setRecords(data);
      console.log(data)

      const map: { [id: number]: StudentPlain } = {};
      for (const r of data) {
        try {
          map[r.id] = decryptStudent(r.data); 
        } catch {
          // Skip malformed entries
        }
      }
      setDecrypted(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/students/${id}`);
      fetchList();
    } catch {
      alert("Delete failed.");
    }
  }

  function startEdit(id: number) {
    setEditingId(id);
    setEditForm(decrypted[id] || null);
  }

  async function saveEdit() {
    if (!editingId || !editForm) return;
    try {
      const payload = encryptStudent(editForm); 
      await API.put(`/students/${editingId}`, {
        data: payload,
        createdAt: new Date().toISOString(),
      });
      setEditingId(null);
      setEditForm(null);
      fetchList(); 
    } catch (error: any) {
      if (error.message.includes("Network Error")) {
        alert("Failed to connect to server. Please check your network connection.");
      } else {
        alert("Update failed.");
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Student List</h2>
      {records.length === 0 ? (
        <div>No students yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, idx) => {
              const s = decrypted[r.id];
              return (
                <tr key={r.id}>
                  <td>{idx + 1}</td>
                  <td>{s?.fullName ?? "(encrypted)"}</td>
                  <td>{s?.email ?? "(encrypted)"}</td>
                  <td>{s?.phone ?? "(encrypted)"}</td>
                  <td>{s?.course ?? "(encrypted)"}</td>
                  <td>{s?.dob ? new Date(s.dob).toLocaleDateString() : "-"}</td>
                  <td>
                    <div className="controls">
                      <button onClick={() => startEdit(r.id)} className="btn-primary">Edit</button>
                      <button onClick={() => handleDelete(r.id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editingId && editForm && (
        <div style={{ marginTop: 16 }}>
          <h3>Editing Student #{editingId}</h3>
          <div style={{ display: "grid", gap: 8 }}>
            <label>Full Name</label>
            <input value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
            <label>Email</label>
            <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <label>Phone</label>
            <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            <label>DOB</label>
            <input type="date" value={editForm.dob} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} />
            <label>Gender</label>
            <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
            <label>Course</label>
            <input value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} />
            <label>Address</label>
            <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
            <label>Password</label>
            <input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            <div style={{ marginTop: 8 }}>
              <button className="btn-primary" onClick={saveEdit}>Save</button>
              <button style={{ marginLeft: 8 }} onClick={() => { setEditingId(null); setEditForm(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
