from flask import Blueprint
from app.admin.routes import admin_bp
from app.professor.routes import professor_bp
from app.student.routes import student_bp
from app.auth.routes import auth_bp




api = Blueprint("api", __name__)
api.register_blueprint(admin_bp, url_prefix="/admin")
api.register_blueprint(professor_bp, url_prefix="/professor")
api.register_blueprint(student_bp, url_prefix="/student")
api.register_blueprint(auth_bp, url_prefix="/auth")
