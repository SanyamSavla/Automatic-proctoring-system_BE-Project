# Importing the Libraries
import flask
from flask import Flask, request, render_template,redirect,jsonify
from flask_cors import CORS, cross_origin
import os
import subprocess


from faceRec import faceRec

# Loading Flask and assigning the model variable
app = Flask(__name__)
#cors=CORS(app)
cors = CORS(app, resources={r"/": {"origins": ""}})
app = flask.Flask(__name__, template_folder="templates")
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def main():
    return render_template("main.html")


# Receiving the input text from the user
@app.route("/camera/<userid>/", methods=['POST'])
@cross_origin()
def camera(userid):

   # print(request.data);
   # print("android path python app.py :"+ userid)
   # print("Delat")
   # p=subprocess.Popen(
   #     ['python', 'main.py',userid,request.data],stdout=subprocess.PIPE,
   ## stderr=subprocess.PIPE
    #)
    #print("delay")
   # (stdoutdata, stderrdata) = p.communicate()
    
    #print("s"+stdoutdata.decode('utf-8'))
    
    verified = faceRec(userid,request.data)
    print(verified)
    return jsonify(
                    verified=verified
                )
    #return stdoutdata.decode('utf-8')


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=True, use_reloader=False)

