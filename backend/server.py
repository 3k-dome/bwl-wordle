import logging

from flask import Blueprint, Flask

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(module)s : %(message)s",
)

from api.debug import debug_api
from api.game import game_api

api = Blueprint("API", __name__, url_prefix=("/api"))
api.register_blueprint(game_api)
api.register_blueprint(debug_api)

server = Flask(__name__)
server.register_blueprint(api)
server.run(port=8000, debug=True)
