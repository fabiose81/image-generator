import os, requests
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../chatgpt/'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../aws/'))

from flask import Flask, request, jsonify
from flask_cors import CORS 
from audio import Audio
from image import Image
from s3 import S3

app = Flask(__name__)

UPLOAD_FOLDER = '../uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)
port = int(os.environ.get('PORT', 5000))

@app.route("/image", methods=['POST'])
def image():
    prompt = request.get_json()['data']
    try:
        img = Image(prompt)
        imgUrl = img.generate()
        print('Generating image...')
    except Exception as e:
        return str(e), 400
        
    return jsonify({
        "image_url": imgUrl
    })
    
@app.route("/audio", methods=['POST'])
def audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    try:        
        file = request.files['file']
        if file:
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            print('Saving audio file...')

            audio_file = open(filename, "rb")
            aud = Audio(audio_file)
            transcription =  aud.transcription()
            print('Transcribing audio file...')
            
            img = Image(transcription)
            imgUrl = img.generate()
            print('Generating image...')
            
            os.remove(filename)
            print('Image Url generated')
            print('Deleting audio file...')
    except Exception as e:
        return str(e), 400
            
    return jsonify({
        "image_url": imgUrl,
        "transcription": transcription
    })
       
@app.route("/s3", methods=['POST'])
def publish():
    image_name = request.get_json()["name"]
    image_url = request.get_json()["data"]
       
    response = requests.get(image_url)

    if response.status_code == 200:
        file = os.path.join(app.config['UPLOAD_FOLDER'], image_name)
        
        with open(file, 'wb') as f:
            f.write(response.content)
                   
        s3 = S3(app.config['UPLOAD_FOLDER'], image_name)
        result_upload, error_upload = s3.upload()
        if not error_upload:
            os.remove(file)
            return result_upload
        else:
            return str(error_upload), 400
    else:
            print(f"Failed to download image. Status code: {response.status_code}")
            return "Failed uploading image to S3", 400

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=port)