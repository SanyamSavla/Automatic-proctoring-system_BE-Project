# Importing the Libraries
from urllib import response
import flask
from flask import Flask, request, render_template,redirect,jsonify,make_response
from flask_cors import CORS, cross_origin
import os
import subprocess
from pymongo import MongoClient 
import requests
from bson.objectid import ObjectId
from faceRec import faceRec
import urllib.request
from PIL import Image
from io import BytesIO

# Loading Flask and assigning the model variable
app = Flask(__name__)
#cors=CORS(app) 
cors = CORS(app , resources={r"*": {"origins": ""}})
app = flask.Flask(__name__, template_folder="templates")
app.config['CORS_HEADERS'] = 'Content-Type'



# Receiving the input text from the user
@app.route("/camera/<userid>/", methods=['POST'])
@cross_origin()
def camera(userid):    
    verified = faceRec(userid,request.data)
    print(verified)
    
    # return jsonify(
    #                 verified=verified
    #             )
    response = jsonify(verified=verified)
    # response.headers.add('Access-Control-Allow-Origin', 'https://prs-portal.herokuapp.com/')
    return response

@app.route("/", methods=['POST'])
@cross_origin()
def download():    
    conn = MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
    db = conn.test.images
    url=request.data
    print(url[13:-2])
    url=url[13:-2].decode("utf-8") 
    print(url)
    id=db.find({"imageUrl": url}, {"user":1}).distinct("user")
    print(id[0])
    d = conn.test.users
    r=d.find({"_id": ObjectId(id[0])}, {"_id":0, "rollnumber": 1}).distinct("rollnumber")
    print("URL")
    
    print(r)
    name=r[0]
    print(isinstance(name,str))
    print(isinstance(url,str))
    print('name: ',name)
    # get image from url
    response = requests.get(url)

    img = Image.open(BytesIO(response.content))

    #save image in uploads folder along with its dynamic name
    img.save("./Python/uploads/%s.png"% name)
    print('image created')
    resp = jsonify(verified="true")
    return resp


    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0',port=port, debug=True, use_reloader=False)
    # app.run(port=port, debug=True, use_reloader=False)

