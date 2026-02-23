from flask import Blueprint, jsonify, request
from app.auth.guards import role_required, get_current_user
from app.config.supabase import supabase
from app.services.cloudinary_service import upload_file
from app.ai_engine.engine import calculate_score
from PyPDF2 import PdfReader

student_bp = Blueprint("student", __name__)


# ================= GET ALL SUBJECTS =================
@student_bp.route("/subjects", methods=["GET"])
@role_required("student")
def get_subjects():
    response = supabase.table("subjects").select("*").execute()
    return jsonify(response.data or []), 200


# ================= GET ASSIGNMENTS BY SUBJECT =================
@student_bp.route("/assignments/<subject_id>", methods=["GET"])
@role_required("student")
def get_assignments(subject_id):
    response = supabase.table("assignments") \
        .select("*") \
        .eq("subject_id", subject_id) \
        .execute()

    return jsonify(response.data or []), 200


# ================= SAFE PDF TEXT EXTRACTION =================
def extract_text_from_file(file):
    try:
        reader = PdfReader(file)
        text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        return text.strip()

    except Exception as e:
        print("PDF EXTRACTION ERROR:", e)
        return ""


# ================= SUBMIT ASSIGNMENT =================
@student_bp.route("/submit", methods=["POST"])
@role_required("student")
def submit_assignment():
    user = get_current_user()

    assignment_id = request.form.get("assignment_id")
    file = request.files.get("file")

    if not assignment_id or not file:
        return jsonify({"error": "Assignment and file required"}), 400

    # -------- Extract student text --------
    student_text = extract_text_from_file(file)
    print("STUDENT TEXT LENGTH:", len(student_text))

    file.seek(0)
    file_url = upload_file(file)

    # -------- Get stored question text --------
    assignment = supabase.table("assignments") \
        .select("question_text") \
        .eq("id", assignment_id) \
        .single() \
        .execute()

    if not assignment.data:
        return jsonify({"error": "Assignment not found"}), 404

    question_text = assignment.data.get("question_text", "")
    print("QUESTION TEXT LENGTH:", len(question_text))

    # -------- AI SCORING --------
    ai_score = calculate_score(student_text, question_text)
    print("AI SCORE:", ai_score)

    # -------- Insert submission --------
    submission = supabase.table("submissions").insert({
        "assignment_id": assignment_id,
        "student_id": user.id,
        "file_url": file_url,
        "ai_score": ai_score,
        "status": "Submitted",
        "reviewed": False
    }).execute()

    return jsonify(submission.data), 201


# ================= GET MY SUBMISSIONS =================
@student_bp.route("/my-submissions", methods=["GET"])
@role_required("student")
def get_my_submissions():
    user = get_current_user()

    response = supabase.table("submissions") \
        .select("*, assignments(title)") \
        .eq("student_id", user.id) \
        .execute()

    return jsonify(response.data or []), 200