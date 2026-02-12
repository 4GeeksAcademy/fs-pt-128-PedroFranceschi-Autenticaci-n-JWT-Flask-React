"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register_user():
    #estamos recibiendo informacion del usuario desde el front end, por eso es DATA
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"Error": "Email and Password required"}), 400
    
    #checkeamos is el user existe, por email, ya que si no existe.. no tiene ID
    existing_user = db.session.execute(select(User).where(User.email == data.get("email"))).scalar_one_or_none()
    if existing_user: # si ya existe, no se puede crear de nuevo.
        return jsonify({"Error": "User already exist."}), 400
    
    #si NO existe, entonces lo creamos  --|| new_user busca a mi modelo USER, y en nuestra nueva variable email, ponemos la data que nos arroja el fetch?
    new_user = User(email = data.get("email"))
    new_user.set_password(data.get("password")) #seteamos el password ORIGINAL a el user. con nuestro metodo del modelo USER. 
    #( javier dice que esto solo GENERA el password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msje": "User created succesfully."}), 201

# ahora toca hacer la ruta para login
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"Error": "Email and Password required"}), 400
    
    user = db.session.execute(select(User).where(User.email == data.get("email"))).scalar_one_or_none()
    
    # check si user existe
    if user is None:
        return jsonify({"msg": "Inavlid username or password"}), 400
    
    if user.check_password(data.get("password")):
        access_token = create_access_token(identity=str(user.id)) # despues de haber configurado mi .env y Flask-JWT-Extended en app.py
        return jsonify({"msg": "Login successful", "token": access_token}), 200 # aqui agrego |"token": access_token|
    else:
        return jsonify({"msg": "Inavlid username or password"}), 400 
    
@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity() #se encarga de desencriptar la identidad del usuario |access_token|
    user = db.session.get(User, int(user_id)) #proviene de modern method to get UNIQUE ID
    if not user:
        return jsonify({"msg": "User not found"}), 400
    return jsonify(user.serialize()), 200