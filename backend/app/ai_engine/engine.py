from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load model once globally
model = SentenceTransformer("all-MiniLM-L6-v2")


def clean_text(text):
    if not text:
        return ""
    return text.strip().replace("\n", " ")


def calculate_score(student_text, reference_text):
    try:
        student_text = clean_text(student_text)
        reference_text = clean_text(reference_text)

        if len(student_text) < 20 or len(reference_text) < 20:
            return 0

        embeddings = model.encode([student_text, reference_text])

        similarity = cosine_similarity(
            [embeddings[0]],
            [embeddings[1]]
        )[0][0]

        score = round(float(similarity) * 100, 2)

        # Clamp between 0–100
        if score < 0:
            score = 0
        if score > 100:
            score = 100

        return score

    except Exception as e:
        print("AI ENGINE ERROR:", e)
        return 0