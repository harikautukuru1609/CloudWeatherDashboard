import os
import requests

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("WEATHER_API_KEY")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city name"}), 400

    if not API_KEY:
        return jsonify({
            "error": "Configure your weather API key in the .env file"
        }), 500

    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": city,
                "appid": API_KEY,
                "units": "metric"
            },
            timeout=10
        )

        if response.status_code == 404:
            return jsonify({"error": "City not found"}), 404

        if response.status_code != 200:
            return jsonify({
                "error": "Weather service request failed"
            }), 502

        data = response.json()

        return jsonify({
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "wind_speed": data["wind"]["speed"],
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"]
        })

    except requests.RequestException:
        return jsonify({
            "error": "Could not connect to the weather service"
        }), 502


if __name__ == "__main__":
    app.run(debug=True)