import json
from openai import OpenAI
import instructor
import os 
from pydantic import BaseModel, Field, ValidationError
from typing_extensions import List
import base64


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  

def handler(event, context):

    eventBody = event['queryStringParameters']
    clientOA = instructor.patch(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))

    
    base64_image = eventBody['base64_image']

    LOCATION = eventBody['location']


    class query(BaseModel):
        is_location: bool = Field(description="is the picture at the location")

    response = clientOA.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Is this the {LOCATION}".format(LOCATION)},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    },
                ],
            }
        ],
        max_tokens=300,
        response_model=query  # Use the query class here
    )
    

    response = {"statusCode": 200, "body": json.dumps(response.model_dump())}

    return response
