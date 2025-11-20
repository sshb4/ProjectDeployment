from flask import Flask, request, jsonify #add jsonify
from db import DB 

from passlib.hash import bcrypt
from session_store import SessionStore
from flask import g

app = Flask(__name__)
session_store = SessionStore()

def load_session_data():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        session_id = auth_header.removeprefix('Bearer ')
    else:
        session_id = None
    
    if session_id:
        session_data = session_store.get_session_data(session_id)
        print("the session data is", session_data)
    if session_id == None or session_data = None:
        session_id = session_store.create_session()
        session_data = session_store.get_session_data(session_id)

    g.session_id = session_id
    g.session_data = session_data


#new preflight

@app.before_request
def before_request_function():
    if request.method == "OPTIONS":
        response.app.response_class("", status=204)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    load_session_data()

@app.after_request
def after_request_func(response):
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    load_session_data()

@app.route("/session/settings", methods=["OPTIONS"])
def setFavoriteColor():
    load_session_data()
    color = request.form["color"]
    g.session_data["fav_color"] = color
    return "Color Saved", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/classes", methods=["GET"])
def get_classes():
    db = DB("classes.db")
    myclass = db.readAllRecords()
    return myclass, {"Access-Control-Allow-Origin":"*"}

@app.route("/schedule/<int:class_id>", methods=["DELETE"])
def delete_schedule_item(class_id):
    print(f"Deleting from DB: id={class_id}")
    db = DB("classes.db")
    db.deletRecord(class_id)
    return "Class deleted successfully", 200, {"Access-Control-Allow-Origin" : "*"}



@app.route("/classes/<int:class_id>", methods=["PUT"])
def update_class(class_id):
    db = DB("classes.db")
    d = request.get_json()
    db.editRecord(class_id, d)
    return "Class updated successfully", 200, {"Access-Control-Allow-Origin" : "*"}

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
    return "Class updated successfully", 201, {"Access-Control-Allow-Origin" : "*"}

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


def run():
    app.run(port=8080, host="0.0.0.0")

if __name__ == "__main__":
    run()





""""video:

@app.route("/session/settings", methods=["PUT"])
def setFavoriteColor():
    load_session_data()
    color = request.form["color"]
    g.session_data["favorite_color"] = color
    return "Color Saved", 200, {"Access-Control-Allow-Origin" : "*"}  


in class:
from flask import Flask, request


#add from previous

def create_user

def load_session_data(): #in video
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        session_token = auth_header.removeprefix('Bearer ')
    else:
        session_id = None
    
    if session_id:
        
        

def validate_user()
    email = request.form["email"]
    password = request.form["password"]
    print(f"the email is email the password is password")

    if 

    if 
        return {
            "msg": "Login successful",
            "email": email
        }

    else:
        return "Invalid login {email}", 401, {"Access-Control-Allow-Origin" : "*"}

}

@app.route("/delete_session_data", methods=["POST"])  
def deleteSessionData():
    if "user_id" in g.session_data:
        del g.session_data["user_id"]
        return "Deleted", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/sessions", methods=["POST"])  
def deleteSessionData():
    if "user_id" in g.session_data:
        del g.session_data["user_id"]
        return "Deleted", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route()
"""