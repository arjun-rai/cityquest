import json
from openai import OpenAI
import instructor
import os 
from pydantic import BaseModel, Field, ValidationError
from typing import List  # Corrected import
import base64


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  

def handler(event, context):

    eventBody = event['queryStringParameters']
    clientOA = instructor.patch(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))

    base64_image = eventBody['base64_image']
    LOCATION = eventBody['location']

    class Query(BaseModel):
        is_location: bool = Field(description="Is the picture at the location")

    try:
        responseOA = clientOA.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": "Is this the {LOCATION}".format(LOCATION=LOCATION)
                },
                {
                    "role": "user",
                    "content": {
                        "type": "image_url",
                        "image_url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ],
            max_tokens=300,
            response_model=Query  # Use the Query class here
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

    return response
