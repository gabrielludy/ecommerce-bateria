function createLoginUserToken(responseWithToken){
console.log("entrou pra criar cokie");
    try {
        var textToken = JSON.parse(responseWithToken); console.log(textToken);
        var token = textToken['token'];                 console.log(token);
    
        var now = new Date();
        var time = now.getTime();

        time += 3600 * 1000;    //1 hour
        now.setTime(time);
        window.document.cookie = 
            'jwtoken=' + token + 
            '; expires=' + now.toUTCString() + 
            '; path=/';
    }
    catch {
        console.log("Error creating token cookie");
    }
}

function sendLoginForm(){
    const userEmail = document.querySelector('#form-login-email').value;
    const userPassword = document.querySelector('#form-login-password').value;
    const loginParams = {
        email: userEmail,
        password: userPassword
    }
    var responseWithToken = "";

    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/api/users/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            responseWithToken = xhr.responseText;
console.log(responseWithToken)
            createLoginUserToken(responseWithToken);
            alert("You will be logged by the next 1 hour");
        }
    };
    xhr.send(JSON.stringify(loginParams));
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