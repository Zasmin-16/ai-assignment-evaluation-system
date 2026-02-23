from flask import Blueprint, request, jsonify
from app.config.supabase import supabase

auth_bp = Blueprint("auth", __name__)


# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")
        role = data.get("role")

        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        if not response.user:
            return jsonify({"error": "Auth registration failed"}), 400

        # Professors require approval
        approved = True
        if role == "professor":
            approved = False

        # Insert profile row
        supabase.table("profiles").insert({
            "id": response.user.id,
            "full_name": full_name,
            "role": role,
            "approved": approved
        }).execute()

        return jsonify({
            "message": "Registration successful. Please wait for admin approval." 
            if role == "professor" 
            else "Registration successful"
        }), 201

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Get profile
        profile_response = supabase.table("profiles") \
            .select("*") \
            .eq("id", response.user.id) \
            .single() \
            .execute()

        profile = profile_response.data

        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        # 🚨 BLOCK unapproved professors
        if profile["role"] == "professor" and not profile.get("approved", False):
            return jsonify({
                "error": "Your account is pending admin approval."
            }), 403

        return jsonify({
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            },
            "profile": profile
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"error": str(e)}), 500

# ================= Forgot password =================

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    try:
        supabase.auth.reset_password_email(email)
        return jsonify({"message": "Password reset email sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400