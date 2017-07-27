'use strict';

(function() {
    const userHeader = document.getElementById('userHeader');
    const form = document.getElementById('form');
    const chat = document.getElementById('chat');
    const formButton = document.getElementById('formButton');
    const nameInput = document.getElementById('nameInput');
    const nickInput = document.getElementById('nickInput');
    const messages = document.getElementById('messages');
    const members = document.getElementById('members');
    const text = document.getElementById('text');
    const textSubmit = document.getElementById('textSubmit');

    let userName = 'User Name';
    let userNick = 'nickname';
    userHeader.innerText = `${userName} ${userNick}`;

    let socket = io.connect();

    formButton.onclick = () => {
        userName = nameInput.value || 'User Name';
        userNick = nickInput.value || 'nickname';
        userHeader.innerText = `${userName} ${userNick}`;
        form.setAttribute('class', 'hidden');
        chat.setAttribute('class', 'shown');

        let data = {
            name: `${userName} ${userNick}`
        }

        socket.emit('chat members', data);
    };

    textSubmit.onclick = () => {
        let data = {
            name: `${userName} ${userNick}`,
            text: text.value
        };
        text.value = '';

        socket.emit('chat message', data);
    };

    socket.on('chat history', (msg) => {
        messages.innerHTML = '';
        for (let i in msg) {
            if (msg.hasOwnProperty(i)) {
                let el = document.createElement('li');
                el.innerText = `${msg[i].name}: ${msg[i].text}`;
                messages.appendChild(el);
            }
        }
    });

    socket.on('chat message', (msg) => {
        let el = document.createElement('li');
        if (msg.text.includes(`@${userNick}`)) {
            el.style.color = '#c7254e';
            el.style.backgroundColor = '#f9f2f4';
        }
        el.innerText = `${msg.name}: ${msg.text}`;
        messages.appendChild(el);
    });

    socket.on('chat members', (msg) => {
        let el = document.createElement('li');
        el.innerText = msg.name;
        members.appendChild(el);
    });
})();