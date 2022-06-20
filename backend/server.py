from flask import Flask
from flask_jwt_extended import JWTManager

from routes.routes import api_router, debug_router
from routes.login import auth_router

from flask_cors import CORS

server = Flask(__name__)
CORS(server)

server.config["JWT_SECRET_KEY"] = "Hallo Welt!"
jwt = JWTManager(server)

server.register_blueprint(api_router)
server.register_blueprint(debug_router)
server.register_blueprint(auth_router)
server.run(host="0.0.0.0", port=8000)
