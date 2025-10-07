from flask import Flask
from flash import request
from db import DB

app = Flask(__name__)


@app.route("/classes", methods=["GET"])
def get_classes():
    db = DB("classes.db")
    trails = db.readAllRecords()
    return trails, {"Access-Control-Allow-Origin":"*"}

@app.route("/classes", methods=["POST"])
def create_class():
    db = DB("classes.db")
    print(request.form)
    d = {"name": request.form["name"], 
        "type": request.form["type"], 
        "code": request.form["code"], 
        "layman": request.form["layman"], 
        "semester": request.form["semester"]}
