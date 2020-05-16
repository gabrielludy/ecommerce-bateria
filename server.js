const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log("Your app is listening on port " + server.address().port);
}); 