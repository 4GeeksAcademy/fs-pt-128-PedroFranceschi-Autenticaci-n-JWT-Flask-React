from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import Bcrypt, generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False) # Por que no dejar solo password? PREGUNTA

    #para hashear la contrasena --|| Agarra el pasword de nuestro mappeado arriba ^
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    #para comparar pasword encriptado Vs no encriptado
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    #Una vez hecho set/check_password.. ahora necesitamos crear un usuario y contrasena (Testing purposes)
    # se realiza en routes.py BACKEND mediante una peticion. 

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        } 