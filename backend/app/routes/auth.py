# Rotas de autenticação de usuários

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.extensions import db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    dados = request.json

    if not dados or "username" not in dados or "password" not in dados:
        return jsonify({"erro": "Dados inválidos"}), 400

    if User.query.filter_by(username=dados["username"]).first():
        return jsonify({"erro": "Usuário já existe"}), 409

    user = User(
        username=dados["username"],
        password=generate_password_hash(dados["password"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuário criado com sucesso"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    dados = request.json

    user = User.query.filter_by(username=dados.get("username")).first()

    if not user or not check_password_hash(user.password, dados.get("password")):
        return jsonify({"erro": "Credenciais inválidas"}), 401

    login_user(user)
    return jsonify({"msg": "Login realizado com sucesso"})


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"msg": "Logout realizado com sucesso"})

@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({
        "id": current_user.id,
        "username": current_user.username
    }), 200