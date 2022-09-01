const http = require("http");
const express = require("express");
const app = express();

// with the help of http create the server and pass app as a parameter 
const server = http.createServer(app);

// while deploying u cannot use your own port thats why we use process.env.PORT ( port provide by the another server )
const port = process.env.PORT || 3000;

//with the help of this line it simply uses css or other static files 
app.use(express.static(__dirname+'/public'))

// when user reach this server via google serve it ....
app.get( '/' , ( req , res ) => {
    res.sendFile(__dirname+'/index.html');
    //__dirname describe => go from root to this directory / absolute path 
})

// ----------SOCKET.IO SETUP---------- 

//create variable ans require(include / import ) socket.io lib 
//our socket will run on server that we have pass 
const io = require("socket.io")(server);

// variable of object type 
let users = {};

//io.on where on is a function And pass an event like "connection "
// when easily connect run a arrow function and we get socket(user/and get a unique id) as a parameter 
//every socket / connection / user /people connects to this url(localhost:3000) it get  unique id  
io.on("connection", (socket) => {
    //print the socket id of a user 
    console.log(socket.id);
    //event function or recieve the request 
    socket.on("new-user-joined" , (username) => {
        //we try to store the user in users variable 
        users[socket.id] = username;
        //console.log(users);

        //server broadcast this message that new user joined except that user who has joined the chat
        //now server send this request to client side that this user has joined 
        socket.broadcast.emit('user-connected' , username);

        //target all the connected sockets / for transfering data 
        io.emit("user-list" , users);
    })

    //another event for user left the chat 
    socket.on("disconnect" , () => {
        socket.broadcast.emit('user-disconnected' , user=users[socket.id]);
        //console.log(user);
        delete users[socket.id];

        //target all the connected sockets / for transfering data 
        // when user connecy or disconnect it update the list 
        io.emit("user-list" , users);
    })

    socket.on('message' , (data) => {
        socket.broadcast.emit("message" , {user:data.user , msg : data.msg});
    })
})



//with the help of server variable listen the function and pass port number
//when function get executed it runs the arrow function  
server.listen( port , () => {
    console.log("server is running at => "+port);
})

// to run => npm run test 

