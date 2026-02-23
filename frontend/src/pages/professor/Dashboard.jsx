import { useState, useEffect } from "react";

export default function ProfessorDashboard() {
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questionFile, setQuestionFile] = useState(null);

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  // ================= LOAD SUBJECTS =================
  const loadSubjects = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/professor/subjects",
      { headers }
    );
    const data = await res.json();
    setSubjects(data || []);
  };

  // ================= CREATE SUBJECT =================
  const createSubject = async () => {
    if (!subjectName) return;

    await fetch(
      "http://127.0.0.1:5000/api/professor/subjects",
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: subjectName }),
      }
    );

    setSubjectName("");
    loadSubjects();
  };

  // ================= LOAD ASSIGNMENTS =================
  const loadAssignments = async (subjectId) => {
    const res = await fetch(
      `http://127.0.0.1:5000/api/professor/assignments/by-subject/${subjectId}`,
      { headers }
    );
    setAssignments(await res.json());
    setSelectedSubject(subjectId);
  };

  // ================= CREATE ASSIGNMENT =================
  const createAssignment = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject_id", selectedSubject);
    formData.append("max_marks", maxMarks);
    formData.append("deadline", deadline);
    formData.append("question_file", questionFile);

    await fetch(
      "http://127.0.0.1:5000/api/professor/assignments",
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    setShowModal(false);
    setTitle("");
    setMaxMarks("");
    setDeadline("");
    setQuestionFile(null);

    loadAssignments(selectedSubject);
  };

  // ================= DELETE ASSIGNMENT =================
  const deleteAssignment = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/api/professor/assignments/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );

    loadAssignments(selectedSubject);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        Professor Dashboard
      </h2>

      {/* CREATE SUBJECT */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Create Subject
        </h3>

        <div className="flex gap-4">
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject Name"
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <button
            onClick={createSubject}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>

      {/* SUBJECT LIST */}
      {subjects.map((sub) => (
        <div
          key={sub.id}
          className="bg-white p-6 rounded-xl shadow mb-8"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {sub.name}
            </h3>

            <div className="flex gap-3">
              <button
                onClick={() => loadAssignments(sub.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                View Assignments
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(sub.id);
                  setShowModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + Create Assignment
              </button>
            </div>
          </div>

          {selectedSubject === sub.id && (
            <div className="mt-6">
              {assignments.length === 0 ? (
                <p>No assignments yet.</p>
              ) : (
                assignments.map((a) => (
                  <div
                    key={a.id}
                    className="border p-4 rounded mb-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {a.title}
                      </p>
                      <p className="text-sm">
                        Deadline: {a.deadline}
                      </p>
                      <p className="text-sm">
                        Submissions: {a.submission_count}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteAssignment(a.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold mb-4">
              Create Assignment
            </h3>

            <input
              placeholder="Title"
              className="border w-full p-2 mb-3 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Max Marks"
              className="border w-full p-2 mb-3 rounded"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
            />

            <input
              type="date"
              className="border w-full p-2 mb-3 rounded"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <input
              type="file"
              className="border w-full p-2 mb-3 rounded"
              onChange={(e) =>
                setQuestionFile(e.target.files[0])
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={createAssignment}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}