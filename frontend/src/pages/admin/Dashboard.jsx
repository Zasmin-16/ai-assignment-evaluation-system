import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [pending, setPending] = useState([]);

  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadPending = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/admin/pending-professors",
      { headers }
    );
    setPending(await res.json());
  };

  const loadUsers = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/admin/users",
      { headers }
    );
    setUsers(await res.json());
  };

  const loadSubjects = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/admin/subjects",
      { headers }
    );
    setSubjects(await res.json());
  };

  const loadAssignments = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/admin/assignments",
      { headers }
    );
    setAssignments(await res.json());
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approveProfessor = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/api/admin/approve-professor/${id}`,
      { method: "PUT", headers }
    );
    loadPending();
  };

  const rejectProfessor = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/api/admin/reject-professor/${id}`,
      { method: "DELETE", headers }
    );
    loadPending();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);

    if (tab === "pending") loadPending();
    if (tab === "users") loadUsers();
    if (tab === "subjects") loadSubjects();
    if (tab === "assignments") loadAssignments();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h2>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["pending", "users", "subjects", "assignments"].map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-white p-6 rounded-xl shadow">

        {/* PENDING */}
        {activeTab === "pending" &&
          (pending.length === 0 ? (
            <p>No pending professors.</p>
          ) : (
            pending.map((prof) => (
              <div
                key={prof.id}
                className="border p-4 rounded mb-3 flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {prof.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {prof.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => approveProfessor(prof.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectProfessor(prof.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ))}

        {/* USERS */}
        {activeTab === "users" &&
          users.map((u) => (
            <div
              key={u.id}
              className="border p-3 rounded mb-2"
            >
              {u.full_name} — {u.role}
            </div>
          ))}

        {/* SUBJECTS */}
        {activeTab === "subjects" &&
          subjects.map((s) => (
            <div
              key={s.id}
              className="border p-3 rounded mb-2"
            >
              {s.name}
            </div>
          ))}

        {/* ASSIGNMENTS */}
        {activeTab === "assignments" &&
          assignments.map((a) => (
            <div
              key={a.id}
              className="border p-3 rounded mb-2"
            >
              {a.title}
            </div>
          ))}

      </div>
    </div>
  );
}