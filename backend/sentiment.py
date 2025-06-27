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
- Sentiment **scores** (negative, neutral, positive) as floats between 0 and 1
- A sentiment **label** based on the highest score

Also compute an **overall score** as the average of all chunks, and label it based on the highest average.

Output JSON must follow this structure:
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
        response = client.chat.completions.create(
            model="llama-3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis engine."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )

        output = response.choices[0].message.content
        return json.loads(output)

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
