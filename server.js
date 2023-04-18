var express = require('express')
var app = express()
var http = require('http')
var timeout = require('connect-timeout')

let json_response = [{id: 1, name: "guru", phone_number: 987654321}]

let xml_response = '<note><to>Tove</to></note>';

app.get('/test', async (req, res) => {
    let timeout_in_seconds = (req?.query?.timeout * 60) || 0;
    let header = req?.headers?.accept

    if (timeout_in_seconds)
        await sleep(timeout_in_seconds)
    if (header == "application/json" ){
        res.status(200).set({'Content-Type': 'application/json'}).send(json_response);
    } else if (header == "application/xml" ) {
        res.status(200).set({'Content-Type': 'application/xml'}).send(xml_response);
    } else {
        if(timeout_in_seconds)  {
            res.status(200).set({'Content-Type': 'text/plain'}).send(`Response delayed by ${timeout_in_seconds} seconds`);
        } else {
            res.status(200).set({'Content-Type': 'text/plain'}).send('success')
        }
    }
})

app.get('/test2', async (req, res) => {
    let code = parseInt(req?.query?.code) || 200;
    res.status(code).set('Content-Type', 'text/plain').send('success')
})

app.get('/immediate', async (req, res) => {
    let header = req?.headers?.accept
    if (header == "application/json" ){
        res.status(200).set({'Content-Type': 'application/json', 'keepAlive': false }).send(json_response);
    } else if (header == "application/xml" ) {
        res.set({'Content-Type': 'application/xml', 'keepAlive': false }).send(xml_response);
    } else {
        res.status(200).set({'Content-Type': 'text/plain', 'keepAlive': false }).send('success')
    }
})

function sleep(timeout_in_seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, (timeout_in_seconds * 1000) )
    })
}

app.use(timeout('900s'))
app.use(haltOnTimedout)

function haltOnTimedout(req, res, next){
    if(!req.timedout) next();
}

// const server = http.createServer({}, app).listen(8080);
// server.keepAliveTimeout = 700 * 1000

app.listen(8080, () => {
    console.log('Server running in http://localhost:8080')
})
