# ecommerce-bateria

An percursive instruments ecommerce. The purpose of this project is learning git, webapps and deploying in practice.
You can access the webapp through this link: https://loja-bateria.herokuapp.com/


## Files
- **.gitignore**: a list of files that are stored in my local environment and wont be sent to git.
- **Procfile**: a Heroku file that indicates the initializing project files.
- **app.js**: file that contains the application proggramation.
- **server.js**: creates the server and initialize the app.js file.
- **package.json** and **package-lock.json**: (contem os pacotes node.js mas nao sei exatamente. pesquisar para preencher aqui).

### How to use the webapp
#### Home
- Home page: https://loja-bateria.herokuapp.com/
#### Login and Signup
Your login session expires in 1 hour.
- Login and Signup page: https://loja-bateria.herokuapp.com/user
#### Product
- All products page: https://loja-bateria.herokuapp.com/products
- Specific product page: http://www.loja-bateria.herokuapp.com/product/:productId
#### Order
To see all orders you need to login.
- All orders page: https://loja-bateria.herokuapp.com/orders
- Specific order page: work-in-progress


### How to use the API
Enter the webapp link an use the route /api. Disponible routes:
- POST to /api/users/login
- POST to /api/users/signup
- GET to /api/products
  - GET to /api/products/*:productid*
- GET to /api/order (with Authorization param)
  - GET to /api/order/*:orderid* (with Authorization param)
