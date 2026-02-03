# Inicialização das extensões

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# DATABASE
db = SQLAlchemy()

# Login & Autenticação
login_manager = LoginManager()
login_manager.login_view = "auth.login"
