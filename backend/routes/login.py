from pathlib import Path
from typing import Dict

from components.userdb.userdb import UserDb
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    unset_jwt_cookies,
)

auth_router = Blueprint("Login", __name__, url_prefix="/auth")


@auth_router.route("/register", methods=["POST"])
def register_user():
    content: Dict | None = request.json
    if content:
        with UserDb(Path("./backend/assets")) as user_db:
            username = content.get("username", None)
            password = content.get("password", None)
            status, exception = user_db.add_user(username, password)
        if status:
            return "😊", 200
    return "😒", 400


@auth_router.route("/login", methods=["POST"])
def create_token():
    content: Dict | None = request.json
    if content:
        username = content.get("username", None)
        password = content.get("password", None)
        with UserDb(Path("./backend/assets")) as user_db:
            status = user_db.retrieve_user(username, password)
        if status:
            return create_access_token(identity=username), 200
    return "😒", 400


@auth_router.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"logout": "😊"})
    unset_jwt_cookies(response)
    return response
