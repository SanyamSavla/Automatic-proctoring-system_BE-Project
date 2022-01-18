# Importing the Libraries
import flask
from flask import Flask, request, render_template
#from flask_cors import CORS
import os
import subprocess

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
    p=subprocess.Popen(
        ['python', 'main.py',userid],stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
    )
    (stdoutdata, stderrdata) = p.communicate()
    
    print("d"+stdoutdata.decode('utf-8'))
    
    return '1'


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=True, use_reloader=False)

