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
    location.reload();
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

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  
  function generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }

function getOrders(){
    var response;
    var tokenCookieValue = getTokenCookieValue();

    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/api/orders', false);
    //xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Authorization', 'Bearer ' + tokenCookieValue);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            response = xhr.responseText;
        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            alert("Login to access all orders");
        } 
    };
    xhr.send();

    return response;
}


function getProducts(){
    var allProductsData = {};
    
    getXmlDoc('/api/products', function(responseText){
        allProductsData = responseText;
    });
    
    return allProductsData;
}

function getXmlDoc(myurl, cb){
    var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));

    xhr.open('GET', myurl, false); ; 
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {    //readystate === 4 (done) 
            if(typeof cb === 'function') cb(xhr.responseText);
        }
    };
    xhr.send();
}