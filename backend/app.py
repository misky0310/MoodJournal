from flask import Flask, request, jsonify
from flask_cors import CORS
from llm import generate_mood_insight

app = Flask(__name__)
CORS(app)

@app.route("/generate-insight", methods=["POST"])
def insight():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = generate_mood_insight(text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=8001, debug=True)
