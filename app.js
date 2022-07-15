var express = require("express");
var path = require("path");

var routes = require("./routes");

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({limit: '1mb'}));
app.use(routes);
app.use(express.static(path.join(__dirname, '/public')));

//app.use(express.static('public'));


app.listen(app.get("port"), function(){
    console.log("Server started on port ");
});




/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/
