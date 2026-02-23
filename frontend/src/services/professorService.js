export const createSubject = async (token, data) => {
  const response = await fetch("http://127.0.0.1:5000/api/professor/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};


export const getSubjects = async (token, professorId) => {
  const response = await fetch(
    `http://127.0.0.1:5000/api/professor/subjects?professor_id=${professorId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const createAssignment = async (token, data) => {
  const response = await fetch(
    "http://127.0.0.1:5000/api/professor/assignments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};
