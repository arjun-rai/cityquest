import json
from openai import OpenAI
import instructor
import os 
from pydantic import BaseModel, Field, ValidationError
from typing import List  # Corrected import
import base64
import json


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  

def handler(event, context):

    eventBody = event['queryStringParameters']
    clientOA = instructor.patch(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))
    print(json.loads(event['body'])['base64_image'])
    base64_image = json.loads(event['body'])['base64_image']
    LOCATION = eventBody['location']

    # print(base64_image)
    # print(type(base64_image))

    class Query(BaseModel):
        is_location: bool = Field(description="Is the picture at the location")
        photo_score: int = Field(description='rate the overall quality of this image based on creativity, composition, silliness from 0-10') 


    try:

        responseOA = clientOA.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": 'is this picture at {LOCATION}? rate the overall quality of this image based on creativity, composition, silliness from 0-10'.format(LOCATION=LOCATION)},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            response_model=Query
        )


    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

    response = {
        "statusCode": 200,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
            'Access-Control-Allow-Private-Network': True
        },
        "body": json.dumps(responseOA.model_dump())
    }
    print(responseOA.model_dump())
    return response
