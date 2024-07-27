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
    filenames = request.get_json()  # Get the list of filenames from the request
    
    for filename in filenames:
        file_path = os.path.join(RECOGNIZED_FOLDER, filename)
        
        if not os.path.exists(file_path):
            print(f"File {filename} does not exist in the recognized folder.")
            continue
        
        try:
            image = face_recognition.load_image_file(file_path)
            locs = face_recognition.face_locations(image)
            encs = face_recognition.face_encodings(image, known_face_locations=locs)

            if encs:
                name = os.path.splitext(filename)[0]
                database['encs'].extend(encs)
                database['names'].extend([name] * len(encs))
                print(f"Added {name} with {len(encs)} encodings.")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    save_database(database)
    return jsonify({'message': 'Training completed'})

@app.route('/recognize', methods=['POST'])
def recognize():
    database = load_database()
    filenames = request.get_json()  # Get the list of filenames from the request
    results = []

    for filename in filenames:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            print(f"File {filename} does not exist in the upload folder.")
            results.append({
                'filename': filename,
                'names': []  # No names found due to missing file
            })
            continue
        
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

                image_results.append(name)

            results.append({
                'filename': filename,
                'names': image_results
            })
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            results.append({
                'filename': filename,
                'names': []  # No names found due to processing error
            })

    return jsonify(results)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/files/<folder>', methods=['GET'])
def list_files(folder):
    directory = os.path.join('../faces', folder)
    if os.path.exists(directory):
        files = os.listdir(directory)
        files = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg'))]
        return jsonify(files)
    else:
        return jsonify([]), 404

@app.route('/files/<folder>/<filename>', methods=['GET'])
def get_file(folder, filename):
    return send_from_directory(os.path.join('../faces', folder), filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
