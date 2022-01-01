# Importing the Libraries
import flask
from flask import Flask, request, render_template
from flask_cors import CORS
import os
import subprocess
from flask_pymongo import PyMongo

# Loading Flask and assigning the model variable
app = Flask(__name__)
CORS(app)
app = flask.Flask(__name__, template_folder="templates")


@app.route("/")
def main():
    return render_template("main.html")

app.config['MONGO_URI'] = 'mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test'
mongo = PyMongo(app)
mongo_client = MongoClient('mongodb+srv://kjsce:kjsce@cluster0.oevtx.mongodb.net/test')
db = mongo_client['test']



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(port=port, debug=True, use_reloader=False)

