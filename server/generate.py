from flask import Flask, request, jsonify, send_file
import openai
import os
import random
import urllib.request
from pydub import AudioSegment
from magenta.models.music_vae.trained_model import TrainedModel
from magenta.music import sequences_lib
import note_seq

app = Flask(__name__)

# Set OpenAI API key (Optional, if used for generating descriptive music prompts)
openai.api_key = "your_openai_api_key"  # Replace with your OpenAI API key

# Load the Magenta MusicVAE model
def load_model():
    model = TrainedModel(
        model_name='hierdec-mel_16bar',
        batch_size=1,
        checkpoint_dir_or_path='checkpoints/mel_16bar',
        config='hierdec-mel_16bar'
    )
    return model

# Generate a descriptive music prompt using OpenAI
def generate_prompt(mood, location, weather, preferences):
    input_description = f"""
    Mood: {mood}
    Location: {location}
    Weather: {weather}
    Preferences: {preferences}
    """
    response = openai.Completion.create(
        engine="text-davinci-003",  # OpenAI engine
        prompt=f"Create a descriptive music prompt based on the following input:\n{input_description}",
        max_tokens=50
    )
    return response.choices[0].text.strip()

# Generate music with Magenta MusicVAE
def generate_music(model, preferences):
    # Generate a melody sequence
    sequence = model.sample(
        n=1, # Generate one music sample
        length=32, # 32-bar melody
        temperature=0.8 # Controls randomness
    )[0]
    
    # Adjust tempo based on user preferences
    sequence = sequences_lib.adjust_sequence_tempo(sequence, 60 if preferences["tempo"] == "slow" else 120)
    
    # Set the instrument (e.g., piano)
    sequence.notes[0].instrument = 0  # Piano
    
    return sequence

# Add ambient rain sounds to the generated music
def add_rain_ambient(music_file, rain_sound_file):
    music = AudioSegment.from_file(music_file, format="wav")
    rain = AudioSegment.from_file(rain_sound_file, format="wav")
    
    # Combine both sounds (adjusting rain volume)
    combined = music.overlay(rain - 10)  # Reduce rain volume
    combined.export("final_output.wav", format="wav")
    return "final_output.wav"

@app.route('/generate_music', methods=['POST'])
def generate_music_api():
    data = request.json
    mood = data["mood"]
    location = data["location"]
    weather = data["weather"]
    preferences = data["preferences"]
    
    # Generate descriptive music prompt
    prompt = generate_prompt(mood, location, weather, preferences)
    
    # Load Magenta model and generate music
    model = load_model()
    sequence = generate_music(model, preferences)
    
    # Save melody as a MIDI file
    midi_file = "generated_music.mid"
    note_seq.note_sequence_to_midi_file(sequence, midi_file)
    
    # Convert MIDI to WAV and add ambient sound (rain)
    wav_file = "generated_music.wav"  # This is a placeholder; you'd use a synthesizer like FluidSynth to convert MIDI to WAV
    final_output = add_rain_ambient(wav_file, "sounds/rain.wav")
    
    # Return the generated file
    return send_file(final_output, mimetype="audio/wav")

if __name__ == '__main__':
    app.run(debug=True)
