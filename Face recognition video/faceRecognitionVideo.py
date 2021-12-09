import face_recognition
import cv2
import numpy as np


#webcam #0
video_capture = cv2.VideoCapture(0)

# Loading sample picture and encoding it. subject 1
parshva_image = face_recognition.load_image_file("Parshva.jpg")
parshva_face_encoding = face_recognition.face_encodings(parshva_image)[0]

# Loading sample picture and encoding it. subject 2
raj_image = face_recognition.load_image_file("Raj.jpg")
raj_face_encoding = face_recognition.face_encodings(raj_image)[0]

# Loading sample picture and encoding it. subject 3
sanyam_image = face_recognition.load_image_file("Sanyam.jpg")
sanyam_face_encoding = face_recognition.face_encodings(sanyam_image)[0]

# Creating arrays of known face encodings and their names
known_face_encodings = [parshva_face_encoding,raj_face_encoding,sanyam_face_encoding]
known_face_names = ["Parshva","Raj","Sanyam"]

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

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Video Output
    cv2.imshow('Video', frame)

    # press 'q' on the keyboard to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()
