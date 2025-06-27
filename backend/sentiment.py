from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_sentiment_analysis(text):
    prompt = f"""
You are emulating a sentiment analysis model like twitter-roberta-base-sentiment. Break the journal entry into logical chunks of 1–3 sentences each. For each chunk, return a JSON object with:

- The original chunk of text
- Sentiment **scores** (negative, neutral, positive) as floats between 0 and 1 with approx 15 or more decimal places , as required, for precision . **Avoid rounding**. Maintain full decimal precision (e.g., 0.5835431615511576).
- A sentiment **label** based on the highest score

Also compute an **overall score** as the average of all chunks, and label it based on the highest average.

Respond strictly in this format:
{{
  "chunks": [
    {{
      "text": "...",
      "scores": {{
        "negative": float,
        "neutral": float,
        "positive": float
      }},
      "label": "neutral"
    }}
  ],
  "overall": {{
    "average_scores": {{
      "negative": float,
      "neutral": float,
      "positive": float
    }},
    "label": "neutral"
  }}
}}

Text to analyze:
\"\"\"{text}\"\"\"
"""

    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis engine."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )

        raw_response = chat_completion.choices[0].message.content
        print("Sentiment Raw Output:", raw_response)
        
        data = json.loads(raw_response)
        return data

    except Exception as e:
        print("Groq Sentiment Error:", e)
        return {
            "chunks": [],
            "overall": {
                "average_scores": {
                    "negative": 0.0,
                    "neutral": 1.0,
                    "positive": 0.0
                },
                "label": "neutral"
            }
        }
