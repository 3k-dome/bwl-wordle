from pathlib import Path

from components.assetmanager.manager import AssetManager
from flask import Blueprint

assets_debug_router = Blueprint("Debug-Assets", __name__, url_prefix="/assets")


@assets_debug_router.route("/reset_dictionaries", methods=["GET"])
def reset_dictionaries():
    with AssetManager(Path("./backend/assets")) as manager:
        manager.reset_dictionaries()
    return "😊", 200
