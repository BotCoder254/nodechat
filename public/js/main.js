const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('messages');

// Join chat room
const roomId = window.location.pathname.split('/').pop();
socket.emit('join', { userId: USER_ID, room: roomId });

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', {
        chatId: roomId,
        sender: USER_ID,
        username: USERNAME,
        content: msg
    });

    // public/js/main.js (continued)
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('flex', message.user === USERNAME ? 'justify-end' : 'justify-start');

    div.innerHTML = `
        <div class="max-w-xl ${message.user === USERNAME ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3">
            <p>${message.message}</p>
            <span class="text-xs ${message.user === USERNAME ? 'text-blue-100' : 'text-gray-500'}">
                ${message.time}
            </span>
        </div>
    `;

    document.querySelector('#messages').appendChild(div);
}