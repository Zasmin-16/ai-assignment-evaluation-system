from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # IMPORTANT: allow frontend origin
    CORS(app, supports_credentials=True)

    from app.routes import api
    app.register_blueprint(api, url_prefix="/api")

    return app
