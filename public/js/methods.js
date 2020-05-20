function sendLoginForm(){
    const userEmail = document.querySelector('#form-login-email').value;
    const userPassword = document.querySelector('#form-login-password').value;
    const loginParams = {
        email: userEmail,
        password: userPassword
    }

    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/api/users/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(loginParams));
    console.log(xhr.response);
    console.log(xhr.responseText);
    alert("You will be logged by the next 1 hour");
}

function sendSignupForm(){
    const userEmail = document.querySelector('#form-signup-email').value;
    const userPassword = document.querySelector('#form-signup-password').value;
    const signUpParams = {
        email: userEmail,
        password: userPassword
    }

    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/api/users/signup', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(signUpParams));

    alert("Successfull signup");
}