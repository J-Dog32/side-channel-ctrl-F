from flask import Flask
from board import routes

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')

    app.register_blueprint(routes.main_bp)

    app_measure = Flask(__name__)
    app_measure.config.from_pyfile('../config.py')

    app_measure.register_blueprint(routes.measure_bp)

    return app, app_measure