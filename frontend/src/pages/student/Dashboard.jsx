import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const loadSubjects = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/student/subjects",
      { headers }
    );
    setSubjects(await res.json());
  };

  const loadAssignments = async (subjectId) => {
    const res = await fetch(
      `http://127.0.0.1:5000/api/student/assignments/${subjectId}`,
      { headers }
    );
    setAssignments(await res.json());
    setSelectedSubject(subjectId);
  };

  const loadSubmissions = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/student/my-submissions",
      { headers }
    );
    setSubmissions(await res.json());
  };

  const submitAssignment = async (assignmentId) => {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append("file", file);

    await fetch("http://127.0.0.1:5000/api/student/submit", {
      method: "POST",
      headers,
      body: formData,
    });

    loadSubmissions();
  };

  useEffect(() => {
    loadSubjects();
    loadSubmissions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        Student Dashboard
      </h2>

      <h3 className="text-xl font-semibold mb-4">
        Subjects
      </h3>

      {subjects.map((sub) => (
        <div key={sub.id} className="mb-3">
          <button
            onClick={() => loadAssignments(sub.id)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {sub.name}
          </button>
        </div>
      ))}

      {selectedSubject && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Assignments
          </h3>

          {assignments.map((a) => (
            <div
              key={a.id}
              className="border p-4 rounded mb-3"
            >
              <p className="font-semibold">{a.title}</p>
              <p>Deadline: {a.deadline}</p>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2"
              />

              <button
                onClick={() => submitAssignment(a.id)}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-4">
        My Submissions
      </h3>

      {submissions.map((s) => (
        <div key={s.id} className="border p-4 rounded mb-3">
          <p className="font-semibold">{s.assignments?.title}</p>
          <p>AI Score: {s.ai_score ?? "Pending"}</p>
          <p>Final Score: {s.final_score ?? "Not Reviewed"}</p>
          <p>Feedback: {s.professor_feedback ?? "None"}</p>
        </div>
      ))}
    </div>
  );
}