from functools import wraps
from flask import request, jsonify
from app.config.supabase import supabase


# ================= GET CURRENT USER =================
def get_current_user():
    token = request.headers.get("Authorization")

    if not token:
        return None

    token = token.replace("Bearer ", "")

    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception:
        return None


# ================= ROLE REQUIRED DECORATOR =================
def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = get_current_user()

            if not user:
                return jsonify({"error": "Unauthorized"}), 401

            profile = supabase.table("profiles") \
                .select("*") \
                .eq("id", user.id) \
                .single() \
                .execute()

            if not profile.data:
                return jsonify({"error": "Profile not found"}), 404

            if profile.data["role"] != required_role:
                return jsonify({"error": "Access denied"}), 403

            return f(*args, **kwargs)

        return wrapper
    return decorator
