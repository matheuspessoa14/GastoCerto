# Inicialização e configuração da aplicação - Application Factory

from flask import Flask
from flask_cors import CORS
from .extensions import db, login_manager

def create_app():
    app = Flask(__name__)

    # Configurações básicas
    app.config["SECRET_KEY"] = "gastocerto-secret"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gastocerto.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializa extensões
    db.init_app(app)
    login_manager.init_app(app)

    # CORS (conexão entre React + Flask-Login)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # Importa e registra Blueprints
    from .routes.auth import auth_bp
    from .routes.gastos import gastos_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(gastos_bp)

    return app
