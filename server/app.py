from flask import Flask, request, jsonify #add jsonify
from db import DB

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/classes", methods=["GET"])
def get_classes():
    db = DB("classes.db")
    trails = db.readAllRecords()
    return trails, {"Access-Control-Allow-Origin":"*"}

@app.route("/schedule/<int:class_id>", methods=["DELETE"])
def delete_schedule_item(class_id):
    print(f"Deleting from DB: id={class_id}")
    db = DB("classes.db")
    db.deletRecord(class_id)
    return {"message": "Class deleted successfully"}, 200



@app.route("/classes/<int:class_id>", methods=["PUT"])
def update_class(class_id):
    db = DB("classes.db")
    d = request.get_json()
    db.editRecord(class_id, d)
    return {"message": "Class updated successfully"}, 200

@app.route("/schedule", methods=["POST"])
def create_schedule_item():
    db = DB("classes.db")
    record = (
        request.form.get("type"),
        request.form.get("code"),
        request.form.get("layman"),
        request.form.get("semester")
    )
    db.saveRecord(record)
    return {"message": "Class added successfully"}, 201

@app.route("/schedule", methods=["GET"])
def get_schedule():
    # Replace with your actual DB logic
    db = DB("classes.db")
    schedule = db.readAllRecords()
    return jsonify(schedule)

@app.route("/schedule/<int:class_id>", methods=["PUT"])
def update_schedule_item(class_id):
    db = DB("classes.db")
    d = {
        "type": request.form.get("type"),
        "code": request.form.get("code"),
        "layman": request.form.get("layman"),
        "semester": request.form.get("semester")
    }
    db.editRecord(class_id, d)
    return {"message": "Class updated successfully"}, 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
