const express = require('express');
const config = require('config');
const path = require('path');

var app = express();

// Express vue setup.
var expressVue = require("express-vue");

const vueOptions = {
    rootPath: path.join(__dirname, './views'),
    head: {
        title: "WebPlayground"
    }
}

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// html renderer
app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'ejs');


// Initializing router
app.use('/', require('./routes'));
app.use(express.static('assets'));

app.listen(config.app.port, function(req, res){
    console.log("Server listening on port " + config.app.port);
});
