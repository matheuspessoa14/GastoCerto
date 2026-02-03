# Modelos e estrutura do Banco de Dados

from flask_login import UserMixin
from .extensions import db, login_manager
from datetime import date

# Tabela de Usuários
class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

# Tabela de Gastos
class Gasto(db.Model):
    __tablename__ = "gastos"

    id = db.Column(db.Integer, primary_key=True)
    valor = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    descricao = db.Column(db.String(200))
    data = db.Column(db.Date, default=date.today)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = db.relationship("User", backref="gastos")

    def __repr__(self):
        return f"<Gasto {self.categoria} - R${self.valor}>"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
