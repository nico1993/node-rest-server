require('./config/config');

const express = require('express')
const app = express()
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('GET usuario')
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    res.status(500).json({error: "Error!!"});
    // res.json({
    //     body
    // });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({id});
});

app.delete('/usuario', function (req, res) {
    res.json('DELETE usuario')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ' + process.env.PORT);
});