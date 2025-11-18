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

