function createLoginUserToken(responseWithToken){
    try {
        var textToken = JSON.parse(responseWithToken); 
        var token = textToken['token'];
    
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

function getTokenCookieValue(){
    var c_name = 'jwtoken'; //cookie name
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return undefined;
}

function userLogout(){
    document.cookie = "jwtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
    xhr.onreadystatechange = async function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            responseWithToken = xhr.responseText;

            await createLoginUserToken(responseWithToken);
            await alert("You will be logged by the next 1 hour");
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

function getOrders(){
    var tokenCookieValue = getTokenCookieValue();

    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/api/orders', true);
    //xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + tokenCookieValue);
    xhr.onreadystatechange = async function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            var response = xhr.responseText;
            var divWithOrders = document.createElement('p');
            divWithOrders.innerText = JSON.stringify(response);
            document.body.appendChild(divWithOrders)
            alert("Successfully requested all orders");
        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            alert("Login to access all orders");
        } 
    };
    xhr.send();
}

function getProducts(){

    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/api/products', true);
    xhr.onreadystatechange = async function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            var response = xhr.responseText;
            var divWithProducts = document.createElement('p');
            divWithProducts.innerText = JSON.stringify(response);
            document.body.appendChild(divWithProducts);
        }
    };
    xhr.send();
}