console.log("connected")

const classes_div = document.querySelector("#coursesList");
let editID = null;

let button = documents.querySelector("#save");
button.onclick = process_color
let inputPicker = document.querySelector("#colorPicker");

let delbutton = document.querySelector("#del");
delbutton.onclick = delete_session

function load() {
    if (!isLoggedIn()) {
        alert("You must be logged in to access this page.");
        return
    }
    classes_div.innerHTML = "";
    reset_form()
    fetch("http://localhost:5000/classes")
        .then(function (response) {
            response.json()
            .then(function (data) {
                console.log(data);
                data.forEach(trail => load_trails(trail))
            })
        })
}

function load_classes(classData) {
    let article = document.createElement("article");
    let lhs = document.createElement("div");
    lhs.classList.add("article-lhs");
    let rhs = document.createElement("div");
    rhs.classList.add("article-rhs");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    p.classList.add("audiowide-regular");
    let p2 = document.createElement("p");
    let delButton = document.createElement("i");
    delButton.classList.add("fa-solid, fa-trash");
    let editButton = document.createElement("i");
    editButton.classList.add("fa-solid, fa-edit");

    delButton.onclick = function () {
        doDelete(classData.id);
    }
    
    editButton.onclick = function () {
        doEdit(classData);
    }

    classes_div.append(article);
    article.append(lhs);
    article.append(rhs);
    lhs.append(h3);
    lhs.append(p);
    rhs.append(p2);
    rhs.append(editButton);
    rhs.append(delButton);

    h3.innerText = "Class: " + classData.layman;
    p.innerText = "Code: " + classData.type + " " + classData.code;
    p2.innerText = "Semester: " + classData.semester;
}

function showSuccess(message = "Success!") {
    const successmodal = document.querySelector("#success-modal");
    successmodal.querySelector(".success-conent").textContent = message;
    successmodal.style.display = "flex";

    successmodal.classList.add("show");

    setTimeout(() => {
        successmodal.classList.remove("show");

        setTimeout(() => successmodal.style.display = "none", 400);
    }, 2000);
}

function do_edit(classData) {
    console.log("You're editing:", class_id)
    modal.style.display = "flex";
    document.querySelector('#class_input_layman').value = classData.layman;
    document.querySelector('#class_input_type').value = classData.type;
    document.querySelector('#class_input_code').value = classData.code;
    document.querySelector('#class_input_semester').value = classData.semester;
    document.querySelector('#submitBtn').innerHTML = 'SAVE';
    editID = classData.id;

}

function do_delete(class_id) {
    if (!isLoggedIn()) {
        alert("You must be logged in to access this page.");
        return
    }
    console.log("Deleting class:", class_id);
    fetch(`http://localhost:5000/classes/${class_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }

    })
    .then(function (response) {
            console.log("Deleted")
            load();
    })
}

function addNewClass(classData) {
    if (!isLoggedIn()) {
        alert("You must be logged in to access this page.");
        return
    }
    let name = classData.layman;
    let type = classData.type;
    let code = classData.code;
    let semester = classData.semester;
    console.log("Adding new class:", name, type, code, semester);
    let data = "layman=" + encodeURIComponent(name);
    data += "&type=" + encodeURIComponent(type);
    data += "&code=" + encodeURIComponent(code);
    data += "&semester=" + encodeURIComponent(semester);

    //

    let endpoint = "http://localhost:5000/classes";
    let method = "POST";
    if (editID) {
        endpoint += `/${editID}`;
        method = "PUT";
    }

    fetch(endpoint, {
        method: method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data
    })
    .then(function (response) {
        console.log("Added new class");
        reset_form();
        load();
        editID = null;
        document.querySelector('#submitBtn').innerHTML = 'Submit';
        showSuccess("Class added successfully!");
    })
}


function delete_session () {
    fetch("http://localhost:8000/sessions", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            //add something
            "Authorization": authorizationHeader()
        },
        method: "DELETE"
    })
    .then(function (response) {
        //dont set this until we get results from the fetch request

        document.body.style.backgroundColor = "#FFFFFF";
    })
}

function process_color() {
    console.log("Clicked the button")

    let data = "color=" + encodeURIComponent(inputPicker.value);
    fetch("http://localhost:8000/sessions/settings", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            //add something
            "Authorization": authorizationHeader()
        },
        method: "PUT",
        body: data
    })
    .then(function (response) {
        console.log("The response is ", response.text());
        //dont set this until we get results from the fetch request
        console.log(inputPicker.value);
        document.body.style.backgroundColor = inputPicker.value;
    })
}

function authorizationHeader() {
    let sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
        console.log("Found session ID in the auth header");
        //return 'Bearer ${sessionID}';
        return "Bearer " + sessionID;
    } else {
        return null
    }
}

function createSessionID() {
    fetch("http://localhost:8000/sessions", {
        headers: {
            "Authorization": authorizationHeader()
        },
    })
    .then(function (response) {
        if (response.status == 200) {
            response.json().then(function (session) {
                localStorage.setItem("sessionID", session_id);
        if (session.data.fav_color) {
            inputPicker.value = session.data.fav_color;
            document.body.style.backgroundColor = session.data.fav_color;
        }
        })
    }
    })
}

{/*}
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
} */} 

//authentication
function loginUser() {
    console.log("Log in here");
    //form elements, convert to values
    let login_email = document.querySelector("#login-email").value;
    let login_password = document.querySelector("#login-password").value;
    console.log("Your email is " + login_email + " your password is " + login_password);

    //convert form values to data string
    var data = "email=" + encodeURIComponent(login_email);
    data += "&password=" + encodeURIComponent(login_password);

    //endpoint
    fetch("http://localhost:5000/sessions/auth", {
        body: data,
        method: "POST",
        headers: {
            "Authorization": authorizationHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
    .then(function (response) {
        return response.json().then(function (data) {
            console.log("The data is ", data);
            if (response.status == 200) {
                localStorage.setItem("sessionID", data.session_id);
                showSuccess("Logged in");
                loginModal.style.display = "none";
                load();
            } else {
                loginModal.style.display = "none";
                alert("Unable to sign in")
            }
        });
    })

    //catch error
    .catch(function (error) {
        alert("Error: " + error.message);
    });
}

createSessionID();

closeUserBtn.addEventListener("click", () => {
    userModal.style.display = "none";
});


{/* Additional Code in app.js 

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




function load() {
    if (!isloggedIn()) {
        alert("You must be logged in to access this page.");

    }
}


function isLoggedIn() {
    var session = localStorage.getItem('sessionID');
    return session !== null && session !== '';
}





console.log("Loading schedule"); //make sure its even running

const API_BASE_URL = 'http://localhost:5000';



function reset_form() {   
    document.querySelector('#courseType').value = '';
    document.querySelector('#courseCode').value = '';
    document.querySelector('#courseName').value = '';
    document.querySelector('#semester').value = '';
    document.querySelector('#submitBtn').innerHTML = 'Submit';
}

let editID = null;





// try fix
window.addEventListener('DOMContentLoaded', function() {
    console.log("Test new eventListener")
    load_schedule();
    document.querySelector('#courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Collect form data
        const classData = {
            type: document.querySelector('#courseType').value,
            code: document.querySelector('#courseCode').value,
            layman: document.querySelector('#courseName').value,
            semester: document.querySelector('#semester').value,
            notes: document.querySelector('#courseNotes') ? document.querySelector('#courseNotes').value : ''
        };
        addNewClass(classData);
    });
    document.querySelector('#reset-button')?.addEventListener('click', reset_form);
});

*/}