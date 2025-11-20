console.log("connected")

const classes_div = document.querySelector("#coursesList");
let editID = null;

let button = document.querySelector("#save");
function delete_session () {
    fetch("http://localhost:8080/sessions", {
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

// Removed unused color picker code



function load() {
    if (!isLoggedIn()) {
        alert("You must be logged in to access this page.");
        return
    }
    classes_div.innerHTML = "";
    reset_form()
    fetch("http://localhost:8080/classes", {
        headers: {
            "Authorization": authorizationHeader()
        }
    })
        .then(function (response) {
            response.json()
            .then(function (data) {
                console.log("Loaded classes:", data);
                // Clear existing classes and load fresh
                data.forEach(classData => load_classes(classData));
            })
        })
}

function load_classes(classData) {
    let article = document.createElement("article");
    article.setAttribute("data-class-id", classData.id); // Add unique identifier
    let lhs = document.createElement("div");
    lhs.classList.add("article-lhs");
    let rhs = document.createElement("div");
    rhs.classList.add("article-rhs");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    p.classList.add("audiowide-regular");
    let p2 = document.createElement("p");
    let delButton = document.createElement("button");
    delButton.classList.add("delete-btn");
    delButton.textContent = "Delete";

    delButton.onclick = function () {
        do_delete(classData.id);
    }

    classes_div.append(article);
    article.append(lhs);
    article.append(rhs);
    lhs.append(h3);
    lhs.append(p);
    rhs.append(p2);
    rhs.append(delButton);

    h3.innerText = "Class: " + classData.layman;
    p.innerText = "Code: " + classData.type + " " + classData.code;
    p2.innerText = "Semester: " + classData.semester;
}

function showSuccess(message = "Success!") {
    const successmodal = document.querySelector("#success-modal");
    if (successmodal) {
        const contentElement = successmodal.querySelector(".success-content");
        if (contentElement) {
            contentElement.textContent = message;
            successmodal.style.display = "flex";

            successmodal.classList.add("show");

            setTimeout(() => {
                successmodal.classList.remove("show");

                setTimeout(() => successmodal.style.display = "none", 400);
            }, 2000);
        }
    }
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
    
    // Add confirmation to prevent accidental deletes
    if (!confirm(`Are you sure you want to delete this class?`)) {
        return;
    }
    
    fetch(`http://localhost:8080/classes/${class_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authorizationHeader()
        }

    })
    .then(function (response) {
        console.log("Delete response:", response.status);
        if (response.status === 200) {
            console.log("Class deleted successfully");
            load(); // Reload the list
        } else {
            alert("Error deleting class");
        }
    })
    .catch(function (error) {
        console.error("Delete error:", error);
        alert("Error deleting class: " + error.message);
    });
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

    let endpoint = "http://localhost:8080/schedule";
    let method = "POST";
    if (editID) {
        endpoint = `http://localhost:8080/classes/${editID}`;
        method = "PUT";
    }

    fetch(endpoint, {
        method: method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authorizationHeader()
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
    fetch("http://localhost:5000/sessions", {
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
    fetch("http://localhost:8080/sessions", {
        headers: {
            "Authorization": authorizationHeader()
        },
    })
    .then(function (response) {
        if (response.status == 200) {
            response.json().then(function (session) {
                localStorage.setItem("sessionID", session.id);
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
    fetch("http://localhost:8080/sessions/auth", {
        body: data,
        method: "POST",
        headers: {
            "Authorization": authorizationHeader(),
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
    .then(function (response) {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers.get('content-type'));
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json().then(function (data) {
                console.log("The data is ", data);
                if (response.status == 200) {
                    localStorage.setItem("sessionID", data.id);
                    showSuccess("Logged in successfully");
                    document.querySelector('#loginModal').style.display = "none";
                    // Clear login form
                    document.querySelector("#login-email").value = '';
                    document.querySelector("#login-password").value = '';
                    updateAuthUI();
                    // load() is called by updateAuthUI(), so don't call it again here
                } else {
                    document.querySelector('#loginModal').style.display = "none";
                    // Clear login form on failed login
                    document.querySelector("#login-email").value = '';
                    document.querySelector("#login-password").value = '';
                    alert("Unable to sign in: " + (data.message || 'Invalid credentials'));
                }
            });
        } else {
            // Handle non-JSON response (likely an error page)
            return response.text().then(function (text) {
                console.log("Non-JSON response:", text);
                document.querySelector('#loginModal').style.display = "none";
                // Clear login form on error
                document.querySelector("#login-email").value = '';
                document.querySelector("#login-password").value = '';
                if (response.status === 401) {
                    alert("Invalid email or password");
                } else {
                    alert("Server error: " + response.status);
                }
            });
        }
    })

    //catch error
    .catch(function (error) {
        alert("Error: " + error.message);
    });
}

// Sign up user function
function signUpUser() {
    console.log("Sign up here");
    
    // Get form values
    let firstName = document.querySelector("#signup-first-name").value;
    let lastName = document.querySelector("#signup-last-name").value;
    let email = document.querySelector("#signup-email").value;
    let password = document.querySelector("#signup-password").value;
    
    console.log(`Creating user: ${firstName} ${lastName} - ${email}`);

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // Convert form values to data string
    var data = "first_name=" + encodeURIComponent(firstName);
    data += "&last_name=" + encodeURIComponent(lastName);
    data += "&email=" + encodeURIComponent(email);
    data += "&password=" + encodeURIComponent(password);

    // Submit to API
    fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(function (response) {
        console.log("Sign up response status:", response.status);
        
        return response.text().then(function (text) {
            console.log("Sign up response text:", text);
            
            if (response.status === 201) {
                // Success - user created
                showSuccess("Account created successfully! You can now log in.");
                document.querySelector('#signUpModal').style.display = "none";
                
                // Clear the form
                document.querySelector("#signup-first-name").value = '';
                document.querySelector("#signup-last-name").value = '';
                document.querySelector("#signup-email").value = '';
                document.querySelector("#signup-password").value = '';
                
            } else if (response.status === 200 && text.includes("already exists")) {
                // Email already exists
                alert("An account with this email already exists. Please use a different email or try logging in.");
            } else {
                // Other error
                alert("Error creating account: " + text);
            }
        });
    })
    .catch(function (error) {
        console.error("Sign up error:", error);
        alert("Error creating account: " + error.message);
    });
}

//
window.addEventListener('DOMContentLoaded', function() {
    console.log("Test new eventListener")
    
    // Only try to create session if user is not already logged in
    if (!isLoggedIn()) {
        createSessionID();
    }
    
    // Auto-uppercase course type field
    const courseTypeInput = document.querySelector('#courseType');
    if (courseTypeInput) {
        courseTypeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
    
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
    
    // Connect login/logout buttons to existing functionality
    const signUpBtn = document.querySelector('#signUpBtn');
    const loginBtn = document.querySelector('#loginBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    const loginModal = document.querySelector('#loginModal');
    const signUpModal = document.querySelector('#signUpModal');
    const closeLoginBtn = document.querySelector('#closeLoginBtn');
    const loginSubmitBtn = document.querySelector('#loginSubmitBtn');
    const signUpSubmitBtn = document.querySelector('#signUpSubmitBtn');
    
    console.log('Debug: signUpBtn found:', signUpBtn);
    console.log('Debug: loginBtn found:', loginBtn);
    console.log('Debug: logoutBtn found:', logoutBtn);
    console.log('Debug: sessionID in localStorage:', localStorage.getItem('sessionID'));
    console.log('Debug: isLoggedIn():', isLoggedIn());
    
    // Clear any existing session data to start fresh
    localStorage.removeItem('sessionID');
    console.log('Debug: Cleared localStorage, isLoggedIn() now:', isLoggedIn());
    
    // Show/hide buttons based on login status
    updateAuthUI();
    
    // Login button - show modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }

    // Sign up button - show modal
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            signUpModal.style.display = 'block';
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('sessionID');
            updateAuthUI();
            alert('You have been logged out');
            location.reload();
        });
    }
    
    // Close modal
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    // Login form submit - use existing loginUser function
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function() {
            loginUser();
        });
    }

    // Sign up form submit
    if (signUpSubmitBtn) {
        signUpSubmitBtn.addEventListener('click', function() {
            signUpUser();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signUpModal) {
            signUpModal.style.display = 'none';
        }
    });
});


function isLoggedIn() {
    var session = localStorage.getItem('sessionID');
    return session !== null && session !== '';
}

function updateAuthUI() {
    const signUpBtn = document.querySelector('#signUpBtn');
    const loginBtn = document.querySelector('#loginBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    const mainContent = document.querySelector('.main-content');
    
    if (isLoggedIn()) {
        if (signUpBtn) signUpBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (mainContent) mainContent.style.display = 'block';
        load(); // Load classes when logged in
    } else {
        if (signUpBtn) signUpBtn.style.display = 'inline-block';
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
    }
}


function reset_form() {   
    document.querySelector('#courseType').value = '';
    document.querySelector('#courseCode').value = '';
    document.querySelector('#courseName').value = '';
    document.querySelector('#semester').value = '';
    document.querySelector('#submitBtn').innerHTML = 'Submit';
}
