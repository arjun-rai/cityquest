import json
from openai import OpenAI
import instructor
import os 
from pydantic import BaseModel, Field, ValidationError
from typing_extensions import List

def handler(event, context):

    eventBody = event['queryStringParameters']
    LOCATION = eventBody['location']
    NUMBER_OF_PLACES = eventBody['num_places']
    TRANSPORTATION = eventBody['transportation']


    clientOA = instructor.patch(OpenAI(api_key=os.environ["OPENAI_API_KEY"]))

    class place(BaseModel):
        location: str = Field(description='place in city to visit')
        overview: str = Field(description='one sentence summary of the location')
        facts: List[str] = Field(description='3 fun facts about the location')
        lat: float = Field(description='latitude of location')
        lng: float = Field(description='longitude of location')

    class locations(BaseModel):
        locations: List[place]=Field(description="locations to visit in the city")

    locations_to_visit = clientOA.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": 'create a list of {NUM} locations to visit in the city {CITY} for a scavenger hunt. These locations should all be able to be visited by using the {TRAN} form of transportation in under 3 hours'.format(CITY=LOCATION, NUM=NUMBER_OF_PLACES, TRAN = TRANSPORTATION)}], max_tokens=4096, response_model=locations
                )
    body = locations_to_visit.model_dump()
    

    response = {"statusCode": 200, "headers": {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Credentials": True, 
    }, "body": json.dumps(body)}

    return response
