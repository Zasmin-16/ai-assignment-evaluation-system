import { useEffect, useState } from "react";

export default function Review() {
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem("access_token");

  const loadSubmissions = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/api/professor/submissions/YOUR_ASSIGNMENT_ID",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setSubmissions(data);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleReview = async (submissionId, finalScore, feedback) => {
    await fetch(
      `http://127.0.0.1:5000/api/professor/review/${submissionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          final_score: finalScore,
          feedback: feedback,
        }),
      }
    );

    alert("Review saved ✅");
    loadSubmissions();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Review Submissions</h2>

      {submissions.map((s) => (
        <div
          key={s.id}
          style={{
            marginBottom: "25px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p><strong>Student:</strong> {s.profiles?.full_name}</p>
          <p><strong>AI Score:</strong> {s.ai_score}</p>

          <input
            type="number"
            placeholder="Final Score"
            defaultValue={s.final_score || ""}
            onChange={(e) => (s.tempScore = e.target.value)}
          />

          <br /><br />

          <textarea
            placeholder="Feedback"
            defaultValue={s.professor_feedback || ""}
            onChange={(e) => (s.tempFeedback = e.target.value)}
          />

          <br /><br />

          <button
            onClick={() =>
              handleReview(
                s.id,
                s.tempScore || s.ai_score,
                s.tempFeedback || ""
              )
            }
          >
            Save Review
          </button>

          {s.reviewed && (
            <p style={{ color: "green" }}>Reviewed ✅</p>
          )}
        </div>
      ))}
    </div>
  );
}
