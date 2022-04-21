from dataclasses import asdict
from pathlib import Path

from components.gamelogic.wordl import Wordl
from flask import Blueprint, request


def init_wordl() -> None:
    global wordl
    wordl = Wordl(Path("./backend/assets"))


game_api = Blueprint("Game", __name__, url_prefix="/game")
game_api.before_app_first_request(init_wordl)


@game_api.route("/new_game", methods=["GET"])
def new_game():
    return asdict(wordl.new_game())


@game_api.route("/validate_input", methods=["POST"])
def validate_input():
    try:
        input_: str = request.json["input"]  # type: ignore
        return asdict(wordl.validate_input(input_.lower()))
    except KeyError as ex:
        return "😒", 400
