from flask import Blueprint, request, jsonify
from app.auth.guards import role_required, get_current_user
from app.config.supabase import supabase
from app.services.cloudinary_service import upload_file
from datetime import datetime
from PyPDF2 import PdfReader

professor_bp = Blueprint("professor", __name__)


# ================= CREATE SUBJECT =================
@professor_bp.route("/subjects", methods=["POST"])
@role_required("professor")
def create_subject():
    user = get_current_user()
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Subject name required"}), 400

    response = supabase.table("subjects").insert({
        "name": data["name"],
        "professor_id": user.id
    }).execute()

    return jsonify(response.data), 201


# ================= GET MY SUBJECTS =================
@professor_bp.route("/subjects", methods=["GET"])
@role_required("professor")
def get_subjects():
    user = get_current_user()

    response = supabase.table("subjects") \
        .select("*") \
        .eq("professor_id", user.id) \
        .execute()

    return jsonify(response.data or []), 200


# ================= CREATE ASSIGNMENT =================
@professor_bp.route("/assignments", methods=["POST"])
@role_required("professor")
def create_assignment():
    user = get_current_user()

    title = request.form.get("title")
    subject_id = request.form.get("subject_id")
    max_marks = request.form.get("max_marks")
    deadline = request.form.get("deadline")
    file = request.files.get("question_file")

    if not title or not subject_id or not file:
        return jsonify({"error": "Title, subject and question file required"}), 400

    # Verify subject belongs to professor
    subject_check = supabase.table("subjects") \
        .select("*") \
        .eq("id", subject_id) \
        .eq("professor_id", user.id) \
        .single() \
        .execute()

    if not subject_check.data:
        return jsonify({"error": "Invalid subject"}), 403

    # -------- Extract question text BEFORE upload --------
    try:
        reader = PdfReader(file)
        question_text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                question_text += extracted

        question_text = question_text.strip()

    except Exception as e:
        print("QUESTION PDF EXTRACTION ERROR:", e)
        question_text = ""

    # Reset file pointer
    file.seek(0)

    # Upload to Cloudinary
    question_url = upload_file(file)

    # Insert assignment with question_text stored
    response = supabase.table("assignments").insert({
        "title": title,
        "subject_id": subject_id,
        "max_marks": max_marks,
        "deadline": deadline,
        "question_file_url": question_url,
        "question_text": question_text
    }).execute()

    return jsonify(response.data), 201


# ================= GET ASSIGNMENTS BY SUBJECT =================
@professor_bp.route("/assignments/by-subject/<subject_id>", methods=["GET"])
@role_required("professor")
def get_assignments_by_subject(subject_id):
    user = get_current_user()

    subject_check = supabase.table("subjects") \
        .select("*") \
        .eq("id", subject_id) \
        .eq("professor_id", user.id) \
        .single() \
        .execute()

    if not subject_check.data:
        return jsonify({"error": "Unauthorized"}), 403

    assignments = supabase.table("assignments") \
        .select("*") \
        .eq("subject_id", subject_id) \
        .execute()

    result = []

    for assignment in assignments.data or []:
        submissions = supabase.table("submissions") \
            .select("id") \
            .eq("assignment_id", assignment["id"]) \
            .execute()

        submission_count = len(submissions.data or [])

        deadline_raw = assignment.get("deadline")
        status = "Unknown"

        if deadline_raw:
            try:
                deadline_date = datetime.fromisoformat(deadline_raw.replace("Z", ""))
                status = "Active" if deadline_date >= datetime.now() else "Expired"
            except Exception:
                status = "Unknown"

        assignment["submission_count"] = submission_count
        assignment["status"] = status

        result.append(assignment)

    return jsonify(result), 200


# ================= DELETE ASSIGNMENT =================
@professor_bp.route("/assignments/<assignment_id>", methods=["DELETE"])
@role_required("professor")
def delete_assignment(assignment_id):
    user = get_current_user()

    assignment_check = supabase.table("assignments") \
        .select("subject_id") \
        .eq("id", assignment_id) \
        .single() \
        .execute()

    if not assignment_check.data:
        return jsonify({"error": "Assignment not found"}), 404

    subject_id = assignment_check.data["subject_id"]

    subject_check = supabase.table("subjects") \
        .select("*") \
        .eq("id", subject_id) \
        .eq("professor_id", user.id) \
        .single() \
        .execute()

    if not subject_check.data:
        return jsonify({"error": "Unauthorized"}), 403

    supabase.table("assignments") \
        .delete() \
        .eq("id", assignment_id) \
        .execute()

    return jsonify({"message": "Assignment deleted"}), 200