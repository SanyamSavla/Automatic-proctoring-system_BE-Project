# Importing the Libraries
import flask
from flask import Flask, request, render_template,redirect,jsonify
#from flask_cors import CORS
import os
import subprocess

from faceRec import faceRec

# Loading Flask and assigning the model variable
app = Flask(__name__)
#CORS(app)
app = flask.Flask(__name__, template_folder="templates")


@app.route("/")
def main():
    return render_template("main.html")


# Receiving the input text from the user
@app.route("/camera/<userid>/", methods=['GET'])
def camera(userid):
    
    print("android path python app.py :"+ userid)
    print("Delat")
    p=subprocess.Popen(
        ['python', 'main.py',userid],stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
    )
    print("delay")
    (stdoutdata, stderrdata) = p.communicate()
    
    print("s"+stdoutdata.decode('utf-8'))
    return stdoutdata.decode('utf-8')

@app.route("/facerec/<userid>/<imgStr>/", methods=['GET'])
def camera(userID,imgStr):
    # print("android path python app.py :"+ userid)
    # print("Delat")
    # p=subprocess.Popen(
    #     ['python', 'faceRec.py',userid],stdout=subprocess.PIPE,
    # stderr=subprocess.PIPE
    # )
    # print("delay")
    # (stdoutdata, stderrdata) = p.communicate()
    
    # print("s"+stdoutdata.decode('utf-8'))
    # return stdoutdata.decode('utf-8')
    
    verified = faceRec(userID,imgStr)
    return jsonify(
                    verified=verified
                )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=True, use_reloader=False)

