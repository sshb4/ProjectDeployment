function showSuccess(messgae = "Success!") {
    var successDiv = document.getElementById("success-message");
    successDiv.innerText = messgae;
    successDiv.style.display = "block";
    setTimeout(function() {
        successDiv.style.display = "none";
    }, 3000);
}

function doDelete(id) {
    if (!isloggedIn)
}

function registerUser() {
    let fname = document.querySelector("#first-name").value;
    let lname = document.querySelector("#last-name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let data = {

    fetch(url, {
        method: submit_method,
        body: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })

openBtn.addEventListener('click', () => ) {
    modal.style.display = 'block';
}


function load() {
    if (!isloggedIn()) {
        alert("You must be logged in to access this page.");

    }
}


function isLoggedIn() {
    var session = localStorage.getItem('sessionID');
    return session !== null && session !== '';
}


//authentication
function loginUser() {
    console.log("Log in here");
    let login_email = document.querySelector("#login-email").value;
    let login_password = document.querySelector("#login-password").value;
    console.log(login_email, login_password);

    

    fetch

    //set a cookie

    //call load func

    //catch error
}