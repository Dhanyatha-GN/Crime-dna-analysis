from flask import Flask
from backend.routes.crime_routes import crime_routes

def create_app():
    app = Flask(__name__)
    app.register_blueprint(crime_routes, url_prefix="/api")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
