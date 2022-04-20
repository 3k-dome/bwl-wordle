from pathlib import Path

from components.assetmanager.manager import AssetManager
from flask import Blueprint

debug_api = Blueprint("Debug", __name__, url_prefix="/debug")


@debug_api.route("/reset_dictionaries", methods=["GET"])
def reset_dictionaries():
    with AssetManager(Path("./backend/assets")) as manager:
        manager.reset_dictionaries()
    return "😊", 200
