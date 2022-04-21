from dataclasses import asdict
from pathlib import Path

from components.gamelogic.wordl import Wordl
from flask import Blueprint, request

wordl = Wordl(Path("./backend/assets"))
game_api_router = Blueprint("Game", __name__, url_prefix="/game")


@game_api_router.route("/new_game", methods=["GET"])
def new_game():
    return asdict(wordl.new_game())


@game_api_router.route("/validate_input", methods=["POST"])
def validate_input():
    try:
        input_: str = request.json["input"]  # type: ignore
        return asdict(wordl.validate_input(input_.lower()))
    except KeyError as ex:
        return "😒", 400


game_debug_router = Blueprint("Debug-Game", __name__, url_prefix="/game")


@game_debug_router.route("/new_game", methods=["GET"])
def get_word():
    return asdict(wordl._word_cache), 200


@game_debug_router.route("/new_game", methods=["GET"])
def set_word():
    wordl._select_word()
    return "😊", 200
