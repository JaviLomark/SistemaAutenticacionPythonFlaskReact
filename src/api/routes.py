"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_bcrypt import Bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()

    email = body.get('email')
    passwordNew = body.get('passwordNew')
    passwordRepeat = body.get('passwordRepeat')
    if email is None or passwordNew is None or passwordRepeat is None:
        return jsonify({"msg": "Rellena todos los campos", "data": None}), 400

    if len(passwordNew) < 6:
        return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres", "data": None}), 400

    if passwordNew != passwordRepeat:
        return jsonify({"msg": "Las contraseñas no coinciden", "data": None}), 400

    hash = bcrypt.generate_password_hash(passwordNew)
    print(hash)
    
    user = User(
        email = email,
        password = hash.decode('utf-8'),
        is_active = True,
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": None, "data": user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    email = body.get('email')
    password = body.get('password')
    # Validar

    users = User.query.filter_by(email = email).all()
    if (len(users) == 0):
        return jsonify({"msg": "El usuario con email: " + email + " no existe.", "data": None})

    user = users[0]
    hash = user.password
    isValid = bcrypt.check_password_hash(hash, password)
    if not isValid:
        return jsonify({"msg":"Contraseña incorrecta.", "data": None})

    token = create_access_token(identity = {"rol": "usuario", "data": user.serialize()})
    return jsonify({"msg": None, "data": token})


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    data = get_jwt_identity()
    if data["rol"] == "usuario":
        print(data)
    return jsonify(data)