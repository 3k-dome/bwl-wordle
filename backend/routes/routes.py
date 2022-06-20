from flask import Blueprint

from routes.assets import assets_debug_router
from routes.game import game_api_router, game_debug_router
from routes.score import score_api_router

api_router = Blueprint("API", __name__, url_prefix="/api")
api_router.register_blueprint(game_api_router)
api_router.register_blueprint(score_api_router)

debug_router = Blueprint("Debug", __name__, url_prefix="/debug")
debug_router.register_blueprint(assets_debug_router)
debug_router.register_blueprint(game_debug_router)
