from flask import Flask
from backend.routes.crime_routes import crime_routes
from backend.routes.summary_routes import summary_bp

app.register_blueprint(summary_bp)

def create_app():
    app = Flask(__name__)
    app.register_blueprint(crime_routes, url_prefix="/api")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
