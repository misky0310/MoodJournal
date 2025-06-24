from flask import Flask, request, jsonify
from flask_cors import CORS  # 👈 Add this
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import nltk
from nltk.tokenize import sent_tokenize

app = Flask(__name__)
CORS(app) 

# RoBERTa model setup
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Chunking & scoring...
    sentences = sent_tokenize(text)
    chunk_size = 3
    chunks = [" ".join(sentences[i:i+chunk_size]) for i in range(0, len(sentences), chunk_size)]

    results = []
    avg = {"negative": 0.0, "neutral": 0.0, "positive": 0.0}

    for chunk in chunks:
        encoded = tokenizer(chunk, return_tensors="pt")
        output = model(**encoded)
        scores = softmax(output.logits[0].detach().numpy())

        result = {
            "text": chunk,
            "scores": {
                "negative": float(scores[0]),
                "neutral": float(scores[1]),
                "positive": float(scores[2]),
            },
            "label": ["negative", "neutral", "positive"][scores.argmax()],
        }

        for k in avg:
            avg[k] += result["scores"][k]

        results.append(result)

    for k in avg:
        avg[k] /= len(results)

    final_label = max(avg, key=avg.get)

    return jsonify({
        "chunks": results,
        "overall": {
            "average_scores": avg,
            "label": final_label
        }
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)
