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
import base64
from bson.objectid import ObjectId

def toImage(string): 
    decodeit = open('unknown.jpg', 'wb')
    decodeit.write(base64.b64decode((string)))
    decodeit.close()    
    print("unknown.jpg created\n")
    return

def toDelete():
    if os.path.exists("unknown.jpg"):
        os.remove("unknown.jpg")
        print("unknown.jpg deleted")
    else:
        print("unknown.jpg does not exist")
    return
        
def toString(image):    
    with open(image, "rb") as image2string:
        converted_string = base64.b64encode(image2string.read())
    print("string converted")
    return converted_string


def faceRec(userID,userImgStr):
    # Creating arrays of known face encodings and their names
    #known_face_encodings = [sanyam_face_encoding]
    #known_face_names = ["Sanyam"]
    #app.config['MONGO_URI'] = 'mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test'

    #client = pymongo.MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
    # Database Name
    #db = client["test"]

    #x=db['images'].find({},{'user':1,'imageUrl':1})

    #y=db['users'].find()
    conn = MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
    db = conn.test.users 
    #result=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "rollnumber": 1})
    #print(result)

    r=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "rollnumber": 1}).distinct("rollnumber")
    #print(r[0])
    name=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "name": 1}).distinct("name")
    #print(name[0])

    sname=name[0]
    known_face_encodings = []
    known_face_roll_no = []
    df = pd.read_excel("students" + os.sep + "students.xls")
    known_face_names=[]

    #for key, row in df.iterrows():
        #rollnumber = row["rollnumber"]
        #name = row["name"]
        #image_path = row["image"]
        #classid=row["classid"]
        #roll_record[rollnumber] = name
        #continue         
    try:
        student_image = face_recognition.load_image_file("./uploads" + os.sep + r[0])
        student_face_encoding = face_recognition.face_encodings(student_image)[0]
        known_face_encodings.append(student_face_encoding)
        known_face_names.append(name[0])
    except Exception as e:
        print(e)
        #print("../uploads" + os.sep +rollnumber+" Student has not uploaded an image")       

    #converting string to jpg image and storing it
    toImage(userImgStr)

    #loading live image from test and creating encodings
    unknown_picture = face_recognition.load_image_file("unknown.jpg")
    unknown_face_encoding = face_recognition.face_encodings(unknown_picture)[0]

    #comparing encodings for both
    results = face_recognition.compare_faces(known_face_encodings, unknown_face_encoding)

    #deleting live image from test after analysis
    toDelete()
    return userID,results[0]



conn = MongoClient("mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test") 
db = conn.test.users 
#result=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "rollnumber": 1})
#print(result)

r=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "rollnumber": 1}).distinct("rollnumber")
#print(r[0])
name=db.find({"_id": ObjectId(sys.argv[1])}, {"_id":0, "name": 1}).distinct("name")
#print(name[0])

sname=name[0]
known_face_encodings = []
known_face_roll_no = []
df = pd.read_excel("students" + os.sep + "students.xls")
known_face_names=[]

#for key, row in df.iterrows():
    #rollnumber = row["rollnumber"]
    #name = row["name"]
    #image_path = row["image"]
    #classid=row["classid"]
    #roll_record[rollnumber] = name
    #continue         
try:
    student_image = face_recognition.load_image_file("./uploads" + os.sep + r[0])
    student_face_encoding = face_recognition.face_encodings(student_image)[0]
    known_face_encodings.append(student_face_encoding)
    known_face_names.append(name[0])
except Exception as e:
        print(e)
        #print("../uploads" + os.sep +rollnumber+" Student has not uploaded an image")       

k=0

start_time = time.time()
while True:
    # Taking a single frame of video
    ret, frame = video_capture.read()
    
    

    # Convert the image from BGR color to RGB color for face_recognition
    rgb_frame = frame[:, :, ::-1]

    # Detect all the faces and face enqcodings in the frame of video
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # Loop through each face in this frame of video
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # Check if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

        name = "Unknown"

        # Or instead, use the known face with the smallest distance to the new face
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
                    # add this to the log
            #name = roll_record[rollnumber]

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Video Output
    cv2.imshow('Video', frame)

    # press 'q' on the keyboard to quit
    if (cv2.waitKey(1) & 0xFF == ord('q')) or int(time.time() - start_time) > capture_duration:
        if(name==sname):
            print(sname)
        else:
            print("Not known")
        break

# Release handle to the webcam
video_capture.release()

cv2.destroyAllWindows()



