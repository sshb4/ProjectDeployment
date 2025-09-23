from flask import Flask
from flash import request
from dummydb import DummyDB

app = Flask(__name__)


@app.route("/trails", methods=["GET"])
def get_trails():
    db = DummyDB("sampledb.txt")
    trails = db.readAllRecords()
    return trails, {"Access-Control-Allow-Origin":"*"}

@app.route("/trails", methods=["POST"])
def 


