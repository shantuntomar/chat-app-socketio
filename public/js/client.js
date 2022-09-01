// socket coding for client 
const socket = io();

var username;
var chats = document.querySelector('.chats');
var user_list = document.querySelector('.users-list');
var user_count = document.querySelector('.user-count');
var user_msg = document.querySelector('#user-msg');
var msg_send = document.querySelector('#msg-send');

 do {
    username = prompt("Enter your Name:");
 }while(!username);

// this methods tells the server that we(or any new user) join the chat 
// first parameter is event and second is the name of the user 
// when this function runs it send the request to server.js(server) file 
socket.emit("new-user-joined" , username);

//now this function recieve the request 
socket.on('user-connected' , (socket_name) => {
    // common function for join or left the user 
    userJoinLeft(socket_name,'joined');
})

function userJoinLeft(name , status) {
    // create element 
    let div = document.createElement("div");
    // add class to that div 
    div.classList.add('user-join');
    //variable for content 
    let content = `<p><b>${name}</b> ${status} the chat </p>`;
    //put content variable to that above div 
    div.innerHTML = content; // full div with content is created now we have to appent the div 
    // append the div 
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('user-disconnected' , (user) => {
    userJoinLeft(user,'left')
});

// to update the user list and count 
socket.on('user-list' , (users) => {
    // firstly blank list 
    user_list.innerHTML = "";
    // server sends the user list in variable users we have to fetch the name from users list 
    // set the name of user in users_arr variable 
    users_arr = Object.values(users);
    //traverse the list 
    for(i=0; i<users_arr.length; i++) {
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        user_list.appendChild(p);
    }
    user_count.innerHTML = users_arr.length;
})

// for sending message 
msg_send.addEventListener('click' , () => {
    // encapsulate the data in the form of objects 
    let data = {
        user : username,
        msg : user_msg.value
    };
    if(user_msg != "") {
        appendMessage(data , 'outgoing');
        socket.emit('message' , data);
        user_msg.value = "";
    }
})

function appendMessage(data , status) {
    let div = document.createElement('div');
    div.classList.add('message' , status);
    let content = `
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;  
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message' , (data) => {
    appendMessage(data , 'incoming');
})



