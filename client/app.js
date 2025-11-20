console.log("connected")
let button = documents.querySelector("#save");
button.onclick = process_color
let inputPicker = document.querySelector("#colorPicker");

let delbutton = document.querySelector("#del");
delbutton.onclick = delete_session

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
    .catch(function (error) {
        console.log("Error during login:", error);
    });
}

createSessionID();


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





console.log("Loading schedule"); //make sure its even running

const API_BASE_URL = 'http://localhost:5000';

// from in class to be updated for my own use
function do_edit(classData) {
    console.log("Editing class:", classData)
    document.querySelector('#courseType').value = classData.type
    document.querySelector('#courseCode').value = classData.code
    document.querySelector('#courseName').value = classData.layman
    document.querySelector('#semester').value = classData.semester
    document.querySelector('#submitBtn').innerHTML = 'SAVE';
    editID = classData.id;
}

// Delete class
async function do_delete(class_id) {
    console.log("Deleting class with ID:", class_id)
    try {
        const response = await fetch(`${API_BASE_URL}/schedule/${class_id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            load_schedule();
            reset_form();
        } else {
            // Remove false error alert, just reload
            load_schedule();
            reset_form();
        }
    } catch (err) {
        console.error('Error deleting class:', err);
    }
}


function reset_form() {   
    document.querySelector('#courseType').value = '';
    document.querySelector('#courseCode').value = '';
    document.querySelector('#courseName').value = '';
    document.querySelector('#semester').value = '';
    document.querySelector('#submitBtn').innerHTML = 'Submit';
}

let editID = null;

// Fetch and display all classes
function load_schedule() {
    fetch(`${API_BASE_URL}/schedule`)
        .then(response => response.json())
        .then(data => {
            const coursesList = document.getElementById('coursesList');
            coursesList.innerHTML = '';
            data.forEach(classData => {
                const card = document.createElement('div');
                card.className = 'course-card';
                card.innerHTML = `
                    <div class="course-header">
                        <div class="course-title">${classData.layman}</div>
                        <div class="course-code">${classData.type} ${classData.code}</div>
                    </div>
                    <div class="course-details">
                        <div class="course-detail"><strong>Semester:</strong> ${classData.semester}</div>
                        <div class="course-detail"><strong>ID:</strong> ${classData.id}</div>
                    </div>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
                // Edit button
                card.querySelector('.edit-btn').addEventListener('click', function() {
                    do_edit(classData);
                });
                // Delete button
                card.querySelector('.delete-btn').addEventListener('click', function() {
                    if (confirm('Delete this class?')) {
                        do_delete(classData.id);
                    }
                });
                coursesList.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading schedule:', err);
        });
}



function addNewClass(classData) {
    console.log("CAN YOU SEE ME?");
    // Build data string for x-www-form-urlencoded
    let data = "type=" + encodeURIComponent(classData.type) + //encodeURIcomponent replaces chars that cause issues
        "&code=" + encodeURIComponent(classData.code) +
        "&layman=" + encodeURIComponent(classData.layman) +
        "&semester=" + encodeURIComponent(classData.semester);

    console.log("The name is ", classData.layman);
    console.log("The data is ", data);

    const button_text = document.querySelector('#submitBtn').innerHTML;
    let submit_method = 'POST';
    let url = `${API_BASE_URL}/schedule`;
    if (button_text === 'SAVE' && editID) {
        submit_method = 'PUT';
        url = `${API_BASE_URL}/schedule/${editID}`;
    }

    fetch(url, {
        method: submit_method,
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(function(response) {
        if (response.ok) {
            console.log("Saved new class:", response);
            load_schedule();
            reset_form();
        } else {
            alert('Failed to save class');
        }
    })
    .catch(function(err) {
        console.error('Error saving class:', err);
    });
}



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