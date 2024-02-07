const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const roomInput = document.getElementById('room-input');
const joinInput = document.getElementById('join-button');

// creating new Webscoket connection on this link
const socket = io('http://localhost:3000');

// creating new Webscoket connection on /user namesapce
const userSocket = io('http://localhost:3000/user', { auth: { token: 'token' } });

userSocket.on('connect_error', error => {
  appendMessage(error);
})

socket.on('connect', () => {
  appendMessage(`You connected with id: ${socket.id}`);
  // socket.emit('custom-event', 10, 'hii', {a: 'a'});
})

socket.on('recieved-message', message => {
  appendMessage(message);
})

// sending message
// socket.emit('custom-event-1', 10, 'hii', {a: 'a'});
// socket.emit('custom-event-2', 23, 'Hii', {b: 'B'});

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value;
  const room = roomInput.value;
  
  socket.emit('send-message', message, room);

  appendMessage(`You: ${message}`);
  messageInput.value = '';
});

joinInput.addEventListener('click', (e) => {
  const room = roomInput.value;
  // joing room via another event
  socket.emit('join-room', room, message => {
    appendMessage(message);
  });
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}


let count = 0;
setInterval(() => {
  // socket.emit('ping', ++count); // by default, socket.io stores all emit messages while is in disconnected mode -> sends all of them thogether while comes online again
  socket.volatile.emit('ping', ++count);    // by adding volatile, we can skip messages of discunnection duration
}, 1000);

document.addEventListener('keydown', e => {
    // return if words are getting typed inside input field
    if(e.target.matches('input')) return;

    // disconnect & connect key
    if(e.key === "e") socket.connect();
    if(e.key === "d") socket.disconnect();
});