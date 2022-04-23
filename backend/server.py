from flask import Flask

from routes.routes import api_router, debug_router
from flask_cors import CORS

server = Flask(__name__)
CORS(server)
server.register_blueprint(api_router)
server.register_blueprint(debug_router)
server.run(host="0.0.0.0", port=8000)
