from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import face_recognition
import pickle
import csv

app = Flask(__name__)
CORS(app)

RECOGNIZING_FOLDER = '../faces/recognizing'
TRAINING_FOLDER = '../faces/training'
DATABASE_PATH = '../faces/database.pkl'
RECOGNITION_RESULTS_CSV = '../faces/recognition_results.csv'

# Ensure directories exist
os.makedirs(RECOGNIZING_FOLDER, exist_ok=True)
os.makedirs(TRAINING_FOLDER, exist_ok=True)

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
        file_path = os.path.join(TRAINING_FOLDER, filename)

        if not os.path.exists(file_path):
            print(f"File {filename} does not exist in the recognized folder.")
            continue
        
        try:
            image = face_recognition.load_image_file(file_path)
            locs = face_recognition.face_locations(image)
            encs = face_recognition.face_encodings(image, known_face_locations=locs)

            if encs:
                name = os.path.splitext(filename)[0].split('-')[0]
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
    filenames = request.get_json()
    results = []
    existing_results = {}

    if os.path.exists(RECOGNITION_RESULTS_CSV):
        with open(RECOGNITION_RESULTS_CSV, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                filename = row['filename']
                name = row['name']
                if filename in existing_results:
                    existing_results[filename].append(name)
                else:
                    existing_results[filename] = [name]
    else:
        with open(RECOGNITION_RESULTS_CSV, mode='w', newline='') as csvfile:
            fieldnames = ['filename', 'name']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

    for filename in filenames:
        if filename in existing_results:
            results.append({
                'filename': filename,
                'names': existing_results[filename]
            })
            continue

        file_path = os.path.join('../faces', filename)

        if not os.path.exists(file_path):
            print(f"File {filename} does not exist in the upload folder.")
            results.append({
                'filename': filename,
                'names': []
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
                'names': []
            })

    with open(RECOGNITION_RESULTS_CSV, 'a', newline='') as csvfile:
        fieldnames = ['filename', 'name']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        for result in results:
            if result['filename'] not in existing_results:
                if not result['names']:
                    writer.writerow({'filename': result['filename'], 'name': ''})
                else:
                    writer.writerow({'filename': result['filename'], 'name': result['names']})


    return jsonify(results)

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

@app.route('/files/<folder1>/<folder2>/<filename>', methods=['GET'])
def get_folder_file(folder1, folder2, filename):
    return send_from_directory(os.path.join('../faces', folder1, folder2), filename)

@app.route('/files/<folder1>/<folder2>/<folder3>/<filename>', methods=['GET'])
def get_double_folder_file(folder1, folder2, folder3, filename):
    return send_from_directory(os.path.join('../faces', folder1, folder2, folder3), filename)

@app.route('/files/<folder1>/<folder2>/<folder3>/<folder4>/<filename>', methods=['GET'])
def get_third_folder_file(folder1, folder2, folder3, folder4, filename):
    return send_from_directory(os.path.join('../faces', folder1, folder2, folder3, folder4), filename)

@app.route('/files/<folder1>/<folder2>/<folder3>/<folder4>/<folder5>/<filename>', methods=['GET'])
def get_fourth_folder_file(folder1, folder2, folder3, folder4, folder5, filename):
    return send_from_directory(os.path.join('../faces', folder1, folder2, folder3, folder4, folder5), filename)

BASE_DIR = os.path.abspath('../faces')

@app.route('/recognition_results/files', methods=['POST'])
def post_file():
    data = request.json
    folder = data.get('folder')
    filename = data.get('filename')
    
    if not folder or not filename:
        return jsonify({"error": "Folder and filename are required"}), 400

    file_path = os.path.join(BASE_DIR, folder, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        return send_from_directory(os.path.join(BASE_DIR, folder), filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@app.route('/recognition_results', methods=['GET'])
def get_recognition_results():
    results = []
    if os.path.exists(RECOGNITION_RESULTS_CSV):
        with open(RECOGNITION_RESULTS_CSV, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            results = list(reader)
    
    file_path = os.path.join(BASE_DIR)
    valid_files = []

    for result in results:
        file_name = result.get('filename')
        full_path = os.path.join(file_path, file_name)
        if os.path.exists(full_path):
            valid_files.append(result)


    return jsonify(valid_files)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
