import os
import boto3
from dotenv import load_dotenv

class S3:
    
    def __init__(self, upload_folder, image_name):
        self.upload_folder = upload_folder
        self.image_name = image_name
        load_dotenv()
        
    def upload(self):
        try:
            key_id = os.environ['AWS_ACCESS_KEY_ID']
            access_key = os.environ['AWS_SECRET_ACCESS_KEY']
            region = os.environ['REGIO_NAME']
            bucket_name = os.environ['BUCKET_NAME']
            
            s3 = boto3.client('s3',
                        aws_access_key_id = key_id,
                        aws_secret_access_key = access_key,
                        region_name = region)         
            
            file = os.path.join(self.upload_folder, self.image_name)
            with open(file, "rb") as f:
                s3.upload_fileobj(
                    f, bucket_name, self.image_name
                )
                
            return 'ok', None
        except Exception as e:
            return None, e