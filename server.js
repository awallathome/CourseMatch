const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/routes.js')(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = "7000";
app.listen(PORT, () =>{
  console.log("SEAS schedule app is listening on port: ", PORT);
});