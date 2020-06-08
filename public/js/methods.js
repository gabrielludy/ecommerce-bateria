function loadFile(fileName){
    var fileUrl = "";
    var response;
    var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    
    //pages that can be loaded
    if(fileName.indexOf('menu.html') == 0){
        var fileUrl = '/public/assets/menu.html';
    }
    if(fileName.indexOf('footer.html') == 0){
        var fileUrl = '/public/assets/footer.html';
    }

    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {    //readystate === 4 (done) 
            response = xhr.responseText;
        }
    };
    xhr.open('GET', fileUrl, false);
    xhr.send();

    return response;
}

function loadMenuTopo(){
    var menu = loadFile('menu.html');
    var divMenuTopo = document.querySelector('.menu-topo');
    menu = menu.replace(/(\r\n|\n|\r|\t)/gm, "");  //remove break lines and tabs
    divMenuTopo.insertAdjacentHTML('afterbegin', menu); 
}

function showLoginMenu() {

    function addListenerOrRunFunction(){
        var logarButton = window.document.querySelectorAll('.menu-login > a')[0];
        var deslogarButton = window.document.querySelectorAll('.menu-login > a')[1];
    
        if(getCookieValue('jwtoken')){
            logarButton.style.display = "none";
            
            //push userid in datalayer
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'userId',
                userId: ''
            });

        } else {
            deslogarButton.style.display = "none";
        }
    }
    

    if(window.document.readyState === "complete"){
        addListenerOrRunFunction();
    } else {
        window.document.addEventListener('DOMContentLoaded', addListenerOrRunFunction());
    }
}

function loadFooter(){
    var footer = loadFile('footer.html');
    var divFooter = document.querySelector('.page-footer');
    footer = footer.replace(/(\r\n|\n|\r|\t)/gm, "");  //remove break lines and tabs
    divFooter.insertAdjacentHTML('afterbegin', footer); 
}


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

function getCookieValue(cookieName){
    var c_name = cookieName; //cookie name
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

    var instance = M.Modal.init(document.querySelector('#modal-logged'));   //use modal


    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/api/users/login', false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            responseWithToken = xhr.responseText;

            createLoginUserToken(responseWithToken);

            instance.options.onCloseEnd = function(){
                window.location.replace('/');
            };
            instance.open();
        }
        if(xhr.readyState === 4 && xhr.status !== 200) {    //readystate === 4 (done)
            console.log('cant open modal');
            window.location.reload();
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
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 201) {    //readystate === 4 (done)
            alert("Successfull signup");
        }
        if(xhr.readyState === 4 && xhr.status !== 200) {    //readystate === 4 (done)
            alert('error on signup');
        }
    };
    xhr.send(JSON.stringify(signUpParams));
}


function generateTableHead(table, data) {
    var thead = document.createElement('tr');//let thead = table.createTHead();
    table.appendChild(thead);//let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      thead.appendChild(th);
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
    var tokenCookieValue = getCookieValue('jwtoken');

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

function getProduct(productID){
    var productData = {};
    
    getXmlDoc('/api/products/' + productID, function(responseText){
        productData = responseText;
    });
    
    return productData;
}

function createProductsPage(data){
    //generate table body
    function createProductDiv(prod){
        
        let productDiv = document.createElement('tr');
        productDiv.setAttribute('class', "product-div");
        let thisDiv;

        Object.keys(prod).forEach((item)=>{
            if(item.indexOf('_id') >=0) return;     //dont show id

            thisDiv = document.createElement('td');

            //show image
            if(item.indexOf("productImage") >= 0){
                
                try{
                    var imageLink = document.createElement('a');
                    imageLink.setAttribute('href', '/product/'+prod.link.split('/')[prod.link.split('/').length-1]);

                    let image = new Image();
                    image.src = '/' + prod.productImage;
                    image.height = 100;
                    image.width = 100;

                    imageLink.appendChild(image);
                    thisDiv.appendChild(imageLink);
                } catch {
                    err => {console.log(err)}
                };
            }

            //show name (with link)
            if(item.indexOf("name") >= 0){
                try{
                    var nameLink = document.createElement('a');
                    nameLink.setAttribute('href', '/product/'+prod.link.split('/')[prod.link.split('/').length-1]);
                    nameLink.setAttribute('onclick','pushDatalayerProductClick()');
                    nameLink.innerHTML = prod.name;

                    thisDiv.appendChild(nameLink);
                } catch {
                    err => {console.log(err)}
                };
            }

            //show price
            if(item.indexOf("price") >= 0){
                try{
                    thisDiv.innerHTML = prod.price;
                } catch {
                    err => {console.log(err)}
                };
            }

            //setting class name
            thisDiv.setAttribute('class', item);
            
            //adding node to page
            productDiv.appendChild(thisDiv);
        });
        return productDiv;
    }

    var products = JSON.parse(data)["products"];

    var productsDiv = document.querySelector('.all-products-table > tbody');
    
    products.forEach(element => {
        let node = createProductDiv(element);
        productsDiv.appendChild(node);
    });
}

function createOrdersPage(data){
    //generate table body
    function createOrderDiv(ord){

        let orderDiv = document.createElement('tr');
        orderDiv.setAttribute('class', "order-div");
        let thisDiv;

        Object.keys(ord).forEach((item)=>{
            thisDiv = document.createElement('td');

            //show _id
            if(item.indexOf("_id") >= 0){
                try{
                    thisDiv.innerHTML = ord["_id"];
                } catch {
                    err => {console.log(err)}
                };
            }

            //show products
            if(item.indexOf("products") >= 0){
                let prods = ord["products"][0];
                let productsIds = Object.keys(prods);

                try{
                    productsIds.forEach(id => {
                        let str = "<br>" + prods[id]["name"]
                        thisDiv.innerHTML +=  str;
                    });
                } catch {
                    err => {console.log(err)}
                };
            }

            //show payment
            if(item.indexOf("payment") >= 0){
                try{
                    thisDiv.innerHTML = ord.payment;
                } catch {
                    err => {console.log(err)}
                };
            }

            //show shipping
            if(item.indexOf("shipping") >= 0){
                try{
                    thisDiv.innerHTML = ord.shipping;
                } catch {
                    err => {console.log(err)}
                };
            }

            //show price
            if(item.indexOf("totalPrice") >= 0){
                try{
                    thisDiv.innerHTML = ord.totalPrice;
                } catch {
                    err => {console.log(err)}
                };
            }

            //show user
            if(item.indexOf("user") >= 0){
                try{
                    thisDiv.innerHTML = ord.user["email"];
                } catch {
                    err => {console.log(err)}
                };
            }

            //setting class name
            thisDiv.setAttribute('class', item);
            
            //adding node to page
            orderDiv.appendChild(thisDiv);
        });
        return orderDiv;
    }

    var orders = JSON.parse(data)["orders"];
    var ordersDiv = document.querySelector('.all-orders-table > tbody');
    
    orders.forEach(element => {
        let node = createOrderDiv(element);
        ordersDiv.appendChild(node);
    });
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


function pushDatalayerProductClick(){
    var datalayer = window.dataLayer || [];

    datalayer.push({
        event: 'click-product-click'
    });
}

function pushDatalayerAddToCart(){
    var datalayer = window.dataLayer || [];

    datalayer.push({
        event: 'click-add-to-cart'
    });
}


function addToCart(productInfo){
    var cartProducts = docCookies.getItem('cartProducts');
    let expires = 30*24*60*60;//30 dias
    let path = '/';

    if(cartProducts == null){
        //crio o cookie com produto e quantidade
        docCookies.setItem('cartProducts', JSON.stringify( {_id: productInfo._id, quantity: 1}) + '|', expires, path );
    } else {
        //verify if product is already on cart
        if (cartProducts.indexOf(productInfo._id) >= 0){
            //modify quantity
            let cartProds = cartProducts.split('|'); 
            for (i = 0; i <  cartProds.length-1; i++ ) {
                let prod = JSON.parse(cartProds[i]);
                //search item to change the quantity
                if(prod["_id"].indexOf(productInfo._id) >= 0){
                    prod["quantity"] += 1;
                }

                //replace product
                cartProds[i] = prod;
            }

            //replace cookie value
            let newCookieContent = '';
            for (let i = 0; i < cartProds.length-1; i++) {
                newCookieContent += JSON.stringify(cartProds[i])  + '|';
            }
            docCookies.setItem('cartProducts', newCookieContent, expires, path);

        } else {
            //append
            docCookies.setItem('cartProducts', cartProducts + JSON.stringify( {_id: productInfo._id, quantity: 1} ) + '|', expires, path)
        }


    }

    var instance = M.Modal.init(document.querySelector('#modal-add-to-cart'));   //use modal

    instance.options.onCloseEnd = function(){
        //window.location.replace('/');
    };
    instance.open();

    pushDatalayerAddToCart();
}

function getCartProducts () {
    let cartProducts = docCookies.getItem('cartProducts');
    let prodsToShow = [];
    var response;
    var xhr = new window.XMLHttpRequest();


    if(cartProducts == null){
        window.alert('Empty cart');
    } else {
        let cartProds = cartProducts.split('|'); 
        for (i = 0; i <  cartProds.length-1; i++ ) {
            let prod = JSON.parse(cartProds[i]);

            xhr.open('GET', '/api/products/' + prod["_id"], false);
                            
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
                    response = xhr.responseText;
                } 
                else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
                    console.log("Erro ao carregar produtos do carrinho");
                } 
            };
            xhr.send();
            
            let prodWithQuantity = JSON.parse(response);
            prodWithQuantity["quantity"] = prod["quantity"];
            prodsToShow.push(prodWithQuantity);
        }
    }

    return prodsToShow;
}

function createCartPage(data){
    //generate table body
    function createProductDiv(prod){
        
        let productDiv = document.createElement('tr');
        productDiv.setAttribute('class', "product-div");
        let thisDiv;

        Object.keys(prod).forEach((item)=>{
            if(item.indexOf('_id') >=0) return;     //dont show id

            thisDiv = document.createElement('td');

            //show image
            if(item.indexOf("productImage") >= 0){
                
                try{
                    var imageLink = document.createElement('a');
                    
                    let image = new Image();
                    image.src = '/' + prod.productImage;
                    image.height = 100;
                    image.width = 100;

                    imageLink.appendChild(image);
                    thisDiv.appendChild(imageLink);
                } catch {
                    err => {console.log(err)}
                };
            }

            //show name (with link)
            if(item.indexOf("name") >= 0){
                try{
                    var nameLink = document.createElement('a');
                    nameLink.setAttribute('onclick','pushDatalayerProductClick()');
                    nameLink.innerHTML = prod.name;

                    thisDiv.appendChild(nameLink);
                } catch {
                    err => {console.log(err)}
                };
            }

            //show price
            if(item.indexOf("price") >= 0){
                try{
                    thisDiv.innerHTML = prod.price;
                } catch {
                    err => {console.log(err)}
                };
            }

            //show quantity
            if(item.indexOf("quantity") >= 0){
                try{
                    thisDiv.innerHTML = prod.quantity;
                } catch {
                    err => {console.log(err)}
                };
            }

            //setting class name
            thisDiv.setAttribute('class', item);
            
            //adding node to page
            productDiv.appendChild(thisDiv);
        });
        return productDiv;
    }

    var products = data;

    var productsDiv = document.querySelector('.all-products-table > tbody');
    
    products.forEach(element => {
        let node = createProductDiv(element);
        productsDiv.appendChild(node);
    });
}

function calculateTotalPrice(){
    let products = window.all_cart_products;
    var totalPrice = products.reduce((total, item) => {
        return total += item.price * item.quantity;
    },0);

    totalPrice = totalPrice.toFixed(2);
    var divTotalPrice = document.querySelector('.total-price');
    divTotalPrice.innerHTML = totalPrice;
}

function clearCart() {
    docCookies.removeItem('cartProducts');
    //window.location.replace('/');
}

function purchaseActionInCart() {
    if(getCookieValue('jwtoken')){
        window.location.replace('/checkout');
    } else {
        var instance = M.Modal.init(document.querySelector('#modal-purchase-fail'));   //use modal
        instance.options.onCloseEnd = function(){
            window.location.replace('/user');
        };
        instance.open();
    }
}

function loadCheckoutOptions() {
    function loadCheck() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    };

    if(window.document.readyState === "complete"){
        loadCheck();
    } else {
        document.addEventListener('DOMContentLoaded', loadCheck);
    }
}

function purchaseActionInCheckout () {
    var elems = document.querySelectorAll('select');

    if(elems[0].value === "" || elems[1].value === ""){
        var instance = M.Modal.init(document.querySelector('#modal-purchase-fail'));   //use modal
        instance.open();
    } 
    else {
        var finalOrder = {
            order: {
                "payment": "",
                "shipping": "",
                "products": {} 
            }
        };
        
        function productsInCorrectFormat() {
            let products = window.all_cart_products;
            let obj = "{"
            products.forEach(elem=>{
                obj += '"' +elem._id+'"' + ':{';
                obj += '"_id": "' + elem._id + '",';
                obj += '"quantity":' + elem.quantity;
                obj += '},';
            });
            obj = obj.slice(0, obj.length - 1);
            obj += '}';

            obj = JSON.parse(obj);
            return obj;
        }

        function setPaymentOption(opt) {
            if(opt == 1) return 'Troca de breques';
            if(opt == 2) return 'Instrumento usado';
            if(opt == 3) return 'Cortesia em role de BU';
        }
        function setShippingOption(opt) {
            if(opt == 1) return '90bpm';
            if(opt == 2) return '130bpm';
            if(opt == 3) return '150bpm';
        }

        //execute purchase and go to thank you page
        const paymentOption = setPaymentOption(elems[0].value);
        const shippmentOption = setShippingOption(elems[1].value);
        const products = productsInCorrectFormat();
        var responseWithToken = "";

        finalOrder.order.payment = paymentOption;
        finalOrder.order.shipping = shippmentOption;
        finalOrder.order.products = products;

        console.log(finalOrder);
    
        //request to create order
        var tokenCookieValue = getCookieValue('jwtoken');
        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', '/api/orders', false);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('Authorization', 'Bearer ' + tokenCookieValue);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
                let response = xhr.responseText;
                console.log("order created");
                console.log(response);
                clearCart();
                
                pushDatalayerPurchase(response);

                setTimeout(function(){
                    window.location.replace('/thankyou');
                }, 1500);
            }
            if(xhr.readyState === 4 && xhr.status !== 200) {    //readystate === 4 (done)
                console.log('purchase failed');
            }
        };
        xhr.send(JSON.stringify(finalOrder));
    }
}

function pushDatalayerPurchase (data) {
    window.dataLayer.push({
        event: 'purchase',
        order: JSON.parse(data)
    });
}

/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  https://github.com/madmurphy/cookies.js
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

var docCookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };