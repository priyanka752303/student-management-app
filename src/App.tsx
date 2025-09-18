import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import { StudentPlain } from "./types";

interface Props {
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

const AUTH_KEY = "task_auth_user";

type Page = "signup" | "login" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("signup");
  const [userId, setUserId] = useState<number | null>(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? Number(raw) : null;
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem(AUTH_KEY, String(userId));
      setPage("dashboard");
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [userId]);

  function handleSignupComplete() {
    alert("Signup successful! Please login.");
    setPage("login");
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Student Management App</h1>
        {userId && (
          <button
            onClick={() => {
              setUserId(null);
              setPage("login");
            }}
            className="btn-primary"
            style={{ background: "#ef4444" }}
          >
            Logout
          </button>
        )}
      </div>

      {page === "signup" && !userId && (
        <>
          <h2>Create Account</h2>
          <StudentForm onSuccess={handleSignupComplete} />
          <p>
            Already have an account?{" "}
            <button onClick={() => setPage("login")}>Login here</button>
          </p>
        </>
      )}

      {page === "login" && !userId && (
        <>
          <LoginForm onLogin={(id) => setUserId(id)} />
          <p>
            Don’t have an account?{" "}
            <button onClick={() => setPage("signup")}>Sign up</button>
          </p>
        </>
      )}

      {page === "dashboard" && userId && (
        <>
          <StudentForm />
          <StudentList />
        </>
      )}
    </div>
  );
}
