# REAL ESTATE LISTING APP
#### This app is designed to allow both tenants and landlords to find and list suitable properties and also to communicate safely 

### By Nimrod Njau, Cynthia Rukwaro, Simon Mwaura and Sandie Mwangi 

## Features
Display property details such as title, image, description, price, and address.
View comments related to the property.
Add new comments with a rating and review.
Rate the property.
Delete comments.

## Setup/Installation Requirements
For the backend:
* cd into the backend folder
* In your terminal, perform 'pipenv install' to install the dependencies.
* Perform 'pipenv shell' to run the virtual environment and then cd into the 'server' directory
* From there, run 'export FLASK_APP=app.py' .......then 'python app.py' to start the backend
* If an error shows that flask-cors is not found, you will have to install it by running pip install flask-cors, then run python app.py

For the frontend:
* cd into the frontend folder.
* In your terminal, run 'npm install' to install the dependencies.
* After installation, run 'npm run dev' to start up the frontend.


## Live server
* You can view the web live 
* {frontend link}


## Contexts Used:
ReviewContext: For managing comments and comment-related actions.
UserContext: For managing current user details and authentication tokens.

## Some of the API Endpoints:
* GET /real_estate/:id: Fetches details of the property based on id.
* GET /reviews: Fetches comments related to the property.
* POST /reviews: Adds a new comment to the property.
* PATCH /reviews/:commentid: Edits an existing comment.
* DELETE /reviews/:commentid: Deletes an existing comment.
* DELETE /real_estate/:propertyid: Deletes the property itself

## LICENCE
Real Estate Listing App is licensed under the MIT License.
  
