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

    formButton.onclick = () => {
        userName = nameInput.value || 'User Name';
        userNick = nickInput.value || 'nickname';
        userHeader.innerText = `${userName} ${userNick}`;
        form.setAttribute('class', 'hidden');
        chat.setAttribute('class', 'shown');

        let data = {
            name: `${userName} ${userNick}`
        }

        ajaxRequest({
            method: 'POST',
            url: '/members',
            data: data
        });
    };

    textSubmit.onclick = () => {
        let data = {
            name: `${userName} ${userNick}`,
            text: text.value
        };
        text.value = '';

        ajaxRequest({
            method: 'POST',
            url: '/messages',
            data: data
        });
    };

    if (window.closed) {
        let data = {
            name: `${userName} ${userNick}`
        }

        ajaxRequest({
            method: 'PUT',
            url: '/members',
            data: data
        });
    }

    const ajaxRequest = (options) => {
        let url = options.url || '/';
        let method = options.method || 'GET';
        let callback = options.callback || function() {};
        let data = options.data || {};
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(JSON.stringify(data));

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
                callback(xmlHttp.responseText);
            }
        };
    };

    const getData = () => {
        ajaxRequest({
            url: '/messages',
            method: 'GET',
            callback: (msg) => {
                msg = JSON.parse(msg);
                messages.innerHTML = '';
                for (let i in msg) {
                    if (msg.hasOwnProperty(i)) {
                        let el = document.createElement('li');
                        if (msg[i].text.includes(`@${userNick}`)) {
                            el.style.color = '#c7254e';
                            el.style.backgroundColor = '#f9f2f4';
                        }
                        el.innerText = `${msg[i].name}: ${msg[i].text}`;
                        messages.appendChild(el);
                    }
                }
            }
        });

        ajaxRequest({
            url: '/members',
            method: 'GET',
            callback: (msg) => {
                msg = JSON.parse(msg);
                members.innerHTML = '';
                for (let i in msg) {
                    if (msg.hasOwnProperty(i)) {
                        let el = document.createElement('li');
                        el.innerText = msg[i].name;
                        members.appendChild(el);
                    }
                }
            }
        });
    };

    getData();

    setInterval(() => {
        getData();
    }, 1000);
})();