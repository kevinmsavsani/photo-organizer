from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import face_recognition
import pickle

app = Flask(__name__)
CORS(app) 
UPLOAD_FOLDER = '../faces/uploads'
RECOGNIZED_FOLDER = '../faces/recognized'
DATABASE_PATH = '../faces/database.pkl'

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RECOGNIZED_FOLDER, exist_ok=True)

def load_database():
    if os.path.exists(DATABASE_PATH):
        with open(DATABASE_PATH, 'rb') as f:
            return pickle.load(f)
    return {'encs': [], 'names': []}

def save_database(database):
    with open(DATABASE_PATH, 'wb') as f:
        pickle.dump(database, f)

@app.route('/train', methods=['POST'])
def train():
    database = load_database()
    files = request.files.getlist('images')
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        try:
            image = face_recognition.load_image_file(file_path)
            locs = face_recognition.face_locations(image)
            encs = face_recognition.face_encodings(image, known_face_locations=locs)

            if encs:
                name = os.path.splitext(file.filename)[0]
                database['encs'].extend(encs)
                database['names'].extend([name] * len(encs))
                print(f"Added {name} with {len(encs)} encodings.")
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")

    save_database(database)
    return jsonify({'message': 'Training completed'})

@app.route('/recognize', methods=['POST'])
def recognize():
    database = load_database()
    files = request.files.getlist('images')
    results = []
    
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        try:
            image = face_recognition.load_image_file(file_path)
            locs = face_recognition.face_locations(image)
            encs = face_recognition.face_encodings(image, known_face_locations=locs)

            image_results = []
            for enc in encs:
                matches = face_recognition.compare_faces(database['encs'], enc)
                name = "unknown"
                if True in matches:
                    first_match_index = matches.index(True)
                    name = database['names'][first_match_index]

                image_results.append({'filename': file.filename, 'name': name})

            results.append(image_results)
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")

    return jsonify(results[0])

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
