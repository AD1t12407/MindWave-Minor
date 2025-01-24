from flask import Flask, request, jsonify
import openai
import os

app = Flask(__name__)

# Set OpenAI API key
openai.api_key = "your_openai_api_key"

# Generate prompt based on inputs
def generate_prompt(mood, location, weather, preferences):
    input_description = f"""
    Mood: {mood}
    Location: {location}
    Weather: {weather}
    Preferences: {preferences}
    """
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Create a descriptive music prompt based on the following input:\n{input_description}",
        max_tokens=50
    )
    return response.choices[0].text.strip()

# Generate music (placeholder function)
def generate_music_from_prompt(prompt):
    # Replace this with your MuseNet integration
    return "https://example.com/generated_music.wav"

@app.route('/generate_music', methods=['POST'])
def generate_music():
    data = request.json
    mood = data.get("mood")
    location = data.get("location")
    weather = data.get("weather")
    preferences = data.get("preferences")

    # Step 1: Generate descriptive prompt
    prompt = generate_prompt(mood, location, weather, preferences)

    # Step 2: Generate music from MuseNet
    music_url = generate_music_from_prompt(prompt)

    # Return the generated music URL
    return jsonify({
        "prompt": prompt,
        "music": music_url
    })

if __name__ == '__main__':
    app.run(debug=True)
