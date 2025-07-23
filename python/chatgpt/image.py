from openai import OpenAI
from dotenv import load_dotenv

class Image:

    def __init__(self, prompt):
        self.prompt = prompt
        load_dotenv()        
    
    def generate(self):
        try:
            client = OpenAI()
            response = client.images.generate(
                model = "dall-e-3",
                prompt = self.prompt,
                size = "1024x1024",
                quality = "standard",
                n = 1,
            )
        except Exception as e:
            raise Exception(e)
        return response.data[0].url