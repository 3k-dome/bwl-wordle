from typing import Dict
from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)

mock_users = {
    "elias@hallo.de": "baum",
    "dome@baum.de": "hallo",
}

auth_router = Blueprint("Login", __name__, url_prefix="/auth")


@auth_router.route("/login", methods=["POST"])
def create_token():
    content: Dict | None = request.json
    if content:
        email = content.get("email", None)
        password = content.get("password", None)
        if email not in mock_users and mock_users.get(email, None) != password:
            return {"msg": "Wrong email or password"}, 401

        access_token = create_access_token(identity=email)
        response = {"access_token": access_token}
        return response


@auth_router.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    identity = get_jwt_identity()
    response = jsonify({"msg": f"machs gut {identity}!"})
    unset_jwt_cookies(response)
    return response
