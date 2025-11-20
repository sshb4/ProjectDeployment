from flask import Flask, request, jsonify, make_response #add jsonify
from db import DB 

from session_store import SessionStore
from flask import g

app = Flask(__name__)
session_store = SessionStore()

#added to make it work
@app.route("/")
def home():
    return {
        "message": "Authentication Flask API is running",
        "endpoints": [
            "/classes (GET, PUT)",
            "/schedule (POST, DELETE)",
            "/users (POST)",
            "/sessions/auth (POST)",
            "/sessions (GET, DELETE)"
        ]
    }, 200, {"Access-Control-Allow-Origin": "*"}

@app.route("/favicon.ico")
def favicon():
    return "", 204


"""
@app.route("/session/settings", methods=["OPTIONS"])
def setFavoriteColor():
    load_session_data()
    color = request.form["color"]
    g.session_data["fav_color"] = color
    return "Color Saved", 200, {"Access-Control-Allow-Origin" : "*"}
"""

@app.route("/classes", methods=["GET"])
def get_classes():
    # Check if user is authenticated
    if 'user_email' not in g.session_data:
        return "Unauthorized", 401, {"Access-Control-Allow-Origin":"*"}
    
    user_email = g.session_data['user_email']
    db = DB("classes.db")
    myclass = db.readUserRecords(user_email)
    db.close()
    return myclass, {"Access-Control-Allow-Origin":"*"}

@app.route("/classes/<class_id>", methods=["PUT"])
def update_class(class_id):
    # Check if user is authenticated
    if 'user_email' not in g.session_data:
        return "Unauthorized", 401, {"Access-Control-Allow-Origin" : "*"}
    
    user_email = g.session_data['user_email']
    db = DB("classes.db")
    
    # Check if the class belongs to the current user
    class_owner = db.getClassOwner(class_id)
    if class_owner != user_email:
        db.close()
        return "Forbidden - You can only edit your own classes", 403, {"Access-Control-Allow-Origin" : "*"}
    
    print(request.form)
    d = {
        "type": request.form.get("type"),
        "code": request.form.get("code"),
        "layman": request.form.get("layman"),
        "semester": request.form.get("semester")
    }
    db.editRecord(class_id, d)
    db.close()
    return "Class edited successfully", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/schedule", methods=["DELETE"])
def delete_schedule_item(class_id):
    print(f"Deleting from DB ", class_id)
    db = DB("classes.db")
    db.deleteRecord(class_id)
    return "Class deleted successfully", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/classes/<class_id>", methods=["DELETE"])
def delete_class_item(class_id):
    # Check if user is authenticated
    if 'user_email' not in g.session_data:
        return "Unauthorized", 401, {"Access-Control-Allow-Origin" : "*"}
    
    user_email = g.session_data['user_email']
    db = DB("classes.db")
    
    # Check if the class belongs to the current user
    class_owner = db.getClassOwner(class_id)
    if class_owner != user_email:
        db.close()
        return "Forbidden - You can only delete your own classes", 403, {"Access-Control-Allow-Origin" : "*"}
    
    print(f"Deleting class from DB with ID: ", class_id)
    db.deleteRecord(class_id)
    db.close()
    return "Class deleted successfully", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/schedule", methods=["POST"])
def create_schedule_item():
    # Check if user is authenticated
    if 'user_email' not in g.session_data:
        return "Unauthorized", 401, {"Access-Control-Allow-Origin" : "*"}
    
    user_email = g.session_data['user_email']
    db = DB("classes.db")
    print(request.form)
    d = {"type": request.form["type"],
            "code": request.form["code"],
            "layman": request.form["layman"],
            "semester": request.form["semester"],
            "user_email": user_email
         } 
    db.saveRecord(d)
    db.close()
    return "Class updated successfully", 201, {"Access-Control-Allow-Origin" : "*"}

@app.route("/users", methods=["POST"])
def create_user():
    db = DB("classes.db")
    print(request.form)
    d = {
        "first_name": request.form["first_name"],
        "last_name": request.form["last_name"],
        "email": request.form["email"],
        "password": request.form["password"]
    }
    if db.getUserPasswordByEmail(request.form['email']) is None:
        db.saveUser(d)
        return "User created successfully", 201, {"Access-Control-Allow-Origin" : "*"}
    else:    
        return "User already exists", 200, {"Access-Control-Allow-Origin" : "*"}

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
    if session_id == None or session_data == None:
        session_id = session_store.create_session()
        session_data = session_store.get_session_data(session_id)

    g.session_id = session_id
    g.session_data = session_data
    print(f"Loaded session data {g.session_id}")

#new preflight

@app.before_request
def before_request_function():
    if request.method == "OPTIONS":
        response = make_response("", 204)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    load_session_data()

@app.after_request
def after_request_func(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@app.route("/sessions/auth", methods=["POST"])
def validateUser():
    try:
        email = request.form["email"]
        password = request.form["password"]
        print(f"the email is {email} the password is {password}")

        t = DB('classes.db')
        valid = t.validatePassword(email, password)
        if valid:
            g.session_data["user_email"] = email
            print("I just set the g.sessiondata to ", g.session_data)
            return {
                "msg":"Valid email",
                "id": g.session_id
            }, 200, {
                "Access-Control-Allow-Origin" : "*"}
        else:
            return {
                "msg": f"Invalid login for {email}",
                "error": "authentication_failed"
            }, 401, {
                "Access-Control-Allow-Origin" : "*"}
    except Exception as e:
        print(f"Authentication error: {e}")
        return {
            "msg": "Authentication error",
            "error": str(e)
        }, 500, {
            "Access-Control-Allow-Origin" : "*"}
    
@app.route("/sessions", methods=["DELETE"])
def deleteSessionData():
    if "id" in g.session_data:
        del g.session_data["id"]
    return "Deleted", 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/sessions", methods=["GET"])
def retrieveSession():
    return { 
        "id": g.session_id,
        "data": g.session_data
    }, 200, {"Access-Control-Allow-Origin" : "*"}

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