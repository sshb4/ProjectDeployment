console.log("connected")

function delete_session () {
    fetch("localhost:5000/sessions", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            //add something
            "Authorization": authorizationHeader()
        },
        method: "DELETE"
    })
    .then(function (response) {
        //dont set this until we get results from the fetch request
        console.log("Session deleted")
    })
}

function authorizationHeader() {
    let session_token = localStorage.getItem("sessionID");
    if (sessionID) {
        console.log
        //return 'Bearer ${sessionID}';
        return "Bearer " + session_token;
    }
    else {
        return null
    }
}

function createSessionID() {
    fetch("localhost:5000/sessions", {
        headers: {
            "Authorization": authorizationHeader()
        },
    })
    .then(function (response) {
        if (response.status == 200) {
            response.json().then(function(session) {
                localStorage.setItem("sessionID", session.session_id);
                if (session.data.fav_color) {
                    inputPicker.value = session.data.fav_color;
                    document.body.style.backgroundColor = session.data.fav_color;
                }
            })
           }
    })
}


//createSessionID();