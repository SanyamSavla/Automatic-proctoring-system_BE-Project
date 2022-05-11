import face_recognition
import cv2
import numpy as np
import os
import pandas as pd
import pymongo
import flask
from flask import Flask, request, render_template
from pymongo import MongoClient 
from mongo import store_db
import sys
import time
from bson.objectid import ObjectId
# app = Flask(__name__)
import base64
import re
from PIL import Image
#capture_duration = 10
#webcam #0
#video_capture = cv2.VideoCapture(0)

# Loading sample picture and encoding it. subject 1
#parshva_image = face_recognition.load_image_file("Parshva.jpg")
#parshva_face_encoding = face_recognition.face_encodings(parshva_image)[0]

# Loading sample picture and encoding it. subject 2
#raj_image = face_recognition.load_image_file("Raj.jpg")
#raj_face_encoding = face_recognition.face_encodings(raj_image)[0]

# Loading sample picture and encoding it. subject 3
#sanyam_image = face_recognition.load_image_file("Sanyam.jpg")
#sanyam_face_encoding = face_recognition.face_encodings(sanyam_image)[0]

# Creating arrays of known face encodings and their names
#known_face_encodings = [sanyam_face_encoding]
#known_face_names = ["Sanyam"]
#app.config['MONGO_URI'] = 'mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test'

#client = pymongo.MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
# Database Name
#db = client["test"]

#x=db['images'].find({},{'user':1,'imageUrl':1})

#y=db['users'].find()

def toImage(string): 
    #strOne=string
    #strOne = strOne.partition(",")[2]
    #strOne = strOne.encode("utf-8")
    #string = string[31:len(string)-1]
    #altchars=b'+/'
    #string = re.sub(rb'[^a-zA-Z0-9%s]+' % altchars, b'', string)
   # string = string[32:len(string)-2]
    #print(string[0:50])
    #print(string[len(string)-50:len(string)])
    string=string[9:len(string)-1]
    #print(string[0:50])
    #print(string[len(string)-50:len(string)])
    decodeit = open('unknown.png', 'wb')
    decodeit.write(base64.b64decode(string))
    #decodeit.write(base64.b64decode((string)))
    decodeit.close()    
    print("unknown.jpg created\n")
    
    return

def toDelete():
    if os.path.exists("unknown.png"):
        os.remove("unknown.png")
        print("unknown.jpg deleted")
    else:
        print("unknown.jpg does not exist")

    return
        
def toString(image):    
    with open(image, "rb") as image2string:
        converted_string = base64.b64encode(image2string.read())
    print("string converted")
    return converted_string

def faceRec(arg1,arg2):
    conn = MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
    db = conn.test.users 
    #result=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "rollnumber": 1})
    #print(result)

    r=db.find({"_id": ObjectId(arg1)}, {"_id":0, "rollnumber": 1}).distinct("rollnumber")
    #print(r[0])
    name=db.find({"_id": ObjectId(arg1)}, {"_id":0, "name": 1}).distinct("name")
    #print(name[0])

    sname=name[0]
    known_face_encodings = []
    known_face_roll_no = []
    #df = pd.read_excel("students" + os.sep + "students.xls")
    known_face_names=[]
    unknown_face_encodings=[]
 
    #for key, row in df.iterrows():
        #rollnumber = row["rollnumber"]
        #name = row["name"]
        #image_path = row["image"]
        #classid=row["classid"]
        #roll_record[rollnumber] = name
        #continue       
    toImage(arg2)
    try:
        #student_image = face_recognition.load_image_file("./uploads" + os.sep + r[0])
        student_image = face_recognition.load_image_file("./Python/uploads/"+r[0]+".png")
        # student_image = face_recognition.load_image_file("Sanyam.jpg")
        
        student_face_encoding = face_recognition.face_encodings(student_image)[0]
        known_face_encodings.append(student_face_encoding)
        known_face_names.append(name[0])
        # unknown_face_encodings.append(unknown_face_encoding)
        # results = face_recognition.compare_faces(known_face_encodings, unknown_face_encoding)
   

    except Exception as e:
        print(e)
        #print("../uploads" + os.sep +rollnumber+" Student has not uploaded an image")       

    #converting string to jpg image and storing it
    
    #r=0;
    
    
    #loading live image from test and creating encodings
    unknown_picture = face_recognition.load_image_file("unknown.png")  
    # Find all the faces in the image using the default HOG-based model.
    # This method is fairly accurate, but not as accurate as the CNN model and not GPU accelerated.
    # See also: find_faces_in_picture_cnn.py
    face_locations = face_recognition.face_locations(unknown_picture)

    print("I found {} face(s) in this photograph.".format(len(face_locations)))
 
    # print(len(face_recognition.face_encodings(unknown_picture)))

    # # KNOWN 
    # face = face_recognition.face_locations(student_image)

    # print("I found {} face(s) in this photograph.".format(len(face)))
 
    # print(len(face_recognition.face_encodings(student_image)))
    if(len(face_recognition.face_encodings(unknown_picture))==1):
        unknown_face_encoding = face_recognition.face_encodings(unknown_picture)[0]
        results = face_recognition.compare_faces(known_face_encodings, unknown_face_encoding)
        print(results[0])
    else:
        return '2'
    # except Exception as e:
    # r=0;


   #comparing encodings for both
     
    #print(results[0])
    #deleting live image from test after analysis
    toDelete()
    if(results[0]):
        return '1'
    else:
        
        return '0'



