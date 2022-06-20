from pathlib import Path
from typing import Dict
from datetime import datetime
from components.userdb.scoring import ScoreDB
from flask import Blueprint, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

score_api_router = Blueprint("Score", __name__, url_prefix="/score")


@score_api_router.route("/add", methods=["POST"])
@jwt_required()
def add_score():
    content: Dict | None = request.json
    if content:
        score = content.get("score", 0)
        username = get_jwt_identity()
        with ScoreDB(
            Path("./backend/assets/user.db"), int(datetime.today().strftime("%d"))
        ) as score_db:
            if score_db.add_score(username, score):
                return "😊", 200
            # return str(exception), 400
    return "😒", 400
