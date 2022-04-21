from flask import Flask

from routes.routes import api_router, debug_router

server = Flask(__name__)
server.register_blueprint(api_router)
server.register_blueprint(debug_router)
server.run(host="0.0.0.0", port=8000)
