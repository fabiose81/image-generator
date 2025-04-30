from openai import OpenAI
from dotenv import load_dotenv

class Audio:
    
    def __init__(self, audioFile):
        self.audioFile = audioFile
        load_dotenv()

    def transcription(self): 
        try:
            client = OpenAI() 
            transcription = client.audio.transcriptions.create(
                            model = "gpt-4o-transcribe", 
                            file = self.audioFile)
        except Exception as e:
            raise Exception(e)
        
        return transcription.text