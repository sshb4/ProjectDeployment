
function authorizationHeader() {
    let session_token = localStorage.getItem("sessionID");


}


function delete_session () {
    fetch("localhost:5000/sessions", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authorizationHeader()
        },
        method: "DELETE"
    })
    .then(function (response)) {
        console.log("Session deleted")
}