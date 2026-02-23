from flask import Blueprint, jsonify
from app.config.supabase import supabase
from app.auth.guards import role_required

admin_bp = Blueprint("admin", __name__)


# ================= GET ALL USERS =================
@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def get_all_users():
    response = supabase.table("profiles") \
        .select("*") \
        .execute()

    return jsonify(response.data), 200


# ================= GET ALL SUBJECTS =================
@admin_bp.route("/subjects", methods=["GET"])
@role_required("admin")
def get_all_subjects():
    response = supabase.table("subjects") \
        .select("*") \
        .execute()

    return jsonify(response.data), 200


# ================= GET ALL ASSIGNMENTS =================
@admin_bp.route("/assignments", methods=["GET"])
@role_required("admin")
def get_all_assignments():
    response = supabase.table("assignments") \
        .select("*") \
        .execute()

    return jsonify(response.data), 200


# ================= GET PENDING PROFESSORS =================
@admin_bp.route("/pending-professors", methods=["GET"])
@role_required("admin")
def get_pending_professors():
    response = supabase.table("profiles") \
        .select("*") \
        .eq("role", "professor") \
        .eq("approved", False) \
        .execute()

    return jsonify(response.data), 200


# ================= APPROVE PROFESSOR =================
@admin_bp.route("/approve-professor/<professor_id>", methods=["PUT"])
@role_required("admin")
def approve_professor(professor_id):
    supabase.table("profiles") \
        .update({"approved": True}) \
        .eq("id", professor_id) \
        .execute()

    return jsonify({"message": "Professor approved"}), 200


# ================= REJECT PROFESSOR =================
@admin_bp.route("/reject-professor/<professor_id>", methods=["DELETE"])
@role_required("admin")
def reject_professor(professor_id):

    supabase.table("profiles") \
        .delete() \
        .eq("id", professor_id) \
        .execute()

    return jsonify({"message": "Professor rejected"}), 200