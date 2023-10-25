const express = require ('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const {Server} = require ('socket.io')
const io = new Server (server)

io.on('connection', (socket) =>{
    //console.log('Se ha conectado un usuario al chat en vivo')

    /* socket.on('disconnect', ()=> {
        console.log() 
    }) */

    /* socket.on('online', (msg) => {
        console.log('Mensaje: '+msg)
    }) */

    socket.on('online', (msg) => {
        io.emit('online', msg)
    })
})

app.get('/', (req, res) => {
    //res.send('<h1>CHAT EN VIVO</h1>')
    //console.log(__dirname)
    res.sendFile(`${__dirname}/client/index.html`)
})

server.listen(3000, ()=> {
    console.log('Servidor corriendo en http://localhost:3000')
})

