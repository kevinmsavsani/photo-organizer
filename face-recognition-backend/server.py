from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import pickle
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATABASE_FILE = 'face_encodings.pkl'

def load_database():
    if os.path.exists(DATABASE_FILE):
        with open(DATABASE_FILE, 'rb') as f:
            return pickle.load(f)
    else:
        return {'encs': [], 'names': []}

def save_database(faces):
    with open(DATABASE_FILE, 'wb') as f:
        pickle.dump(faces, f)

@app.route('/train', methods=['POST'])
def train():
    data = request.files.getlist('images')
    faces = load_database()
    for file in data:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)
        image = face_recognition.load_image_file(filepath)
        encodings = face_recognition.face_encodings(image)
        if encodings:
            faces['encs'].append(encodings[0])
            faces['names'].append(os.path.splitext(filename)[0])
    save_database(faces)
    return jsonify({'message': 'Training complete'}), 200

@app.route('/recognize', methods=['POST'])
def recognize():
    data = request.files.getlist('images')
    faces = load_database()
    results = []
    for file in data:
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)
        image = face_recognition.load_image_file(filepath)
        locs = face_recognition.face_locations(image)
        encs = face_recognition.face_encodings(image, known_face_locations=locs)
        result = []
        for enc in encs:
            matches = face_recognition.compare_faces(faces['encs'], enc)
            name = faces['names'][matches.index(True)] if True in matches else 'unknown'
            result.append({'filename': filename, 'name': name})
        results.extend(result)
    return jsonify(results), 200

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
