from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

def generate_mood_insight(journal_text):
    prompt = f"""
You are a kind and supportive mental health assistant. Answer as if you are speaking to me directly. Analyze the following journal entry and provide insights into the emotional tone, suggestions for reflection, and a positive affirmation based on the user's feelings.
Analyze the following journal entry and respond with a JSON object that includes:

- A short summary of the emotional tone
- A suggestion or reflection for the user
- A positive affirmation based on their feelings

Respond strictly in this format:
{{
  "summary": "...",
  "suggestion": "...",
  "affirmation": "..."
}}

Journal Entry:
\"\"\"{journal_text}\"\"\"
"""

    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7
        )

        raw_response = chat_completion.choices[0].message.content
        print("LLM Raw Output:", raw_response)

        # Try parsing JSON from response
        data = json.loads(raw_response)
        return data

    except Exception as e:
        print("Parse Error:", e)
        return {
            "summary": "Could not generate summary.",
            "suggestion": "Try reflecting on what felt good today.",
            "affirmation": "You are growing every day."
        }
