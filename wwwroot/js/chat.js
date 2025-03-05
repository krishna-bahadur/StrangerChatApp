"use strict";

document.getElementById('joinChat').addEventListener('click', function (event) {
    event.preventDefault();

    StartChatConnection();

    var clickHereToChat = document.getElementById('clickHereToChat');
    clickHereToChat.style.fontSize = '14px';
    clickHereToChat.innerHTML = "<b>Hang tight!</b> We're connecting you with a stranger...";
});

function StartChatConnection() {
    var connection = new signalR.HubConnectionBuilder().withUrl("/hub").build();

    connection.start().then(function () {
        
    }).catch(function (err) {
        var clickHereToChat = document.getElementById('clickHereToChat');
        clickHereToChat.style.fontSize = '14px';
        clickHereToChat.setAttribute('style', 'color: red !important;');
        clickHereToChat.innerHTML = 'Failed to connect to chat. Please try again later.';
    });

    connection.on("MatchedWithUser", function () {
        document.getElementById('status-indicator-offline').style.display = 'none';
        document.getElementById('status-indicator-online').style.display = "block";

        document.getElementById('actionButtons').style.display = "block";

        var clickHereToChat = document.getElementById('clickHereToChat');
        clickHereToChat.style.fontSize = '14px';
        clickHereToChat.innerHTML = '<b>Connected</b>, You’re now chatting with a stranger. Say hi!';

        document.getElementById('sendButton').disabled = false;

    });


    document.getElementById("sendButton").addEventListener("click", function (event) {
        event.preventDefault();
        var message = document.getElementById('messageInput').value;
        debugger;
        if (message.trim() !== '') {
            connection.invoke("SendMessage", message).then(function () {
                var chatBody = document.getElementById("chatBody");
                var messageContainerDiv = document.createElement('div');
                messageContainerDiv.classList.add('message-container', 'd-flex', 'justify-content-end', 'my-1', 'text-end');
                var messageDiv = document.createElement('div');
                messageDiv.classList.add("py-2", "px-3", "rounded-pill");
                messageDiv.style.backgroundColor = '#5dacde';
                messageDiv.style.maxWidth = '80%';
                messageDiv.innerHTML = message;
                messageContainerDiv.appendChild(messageDiv);
                chatBody.appendChild(messageContainerDiv);

                // Empty Input
                document.getElementById('messageInput').value = "";

            }).catch(function (err) {
                return console.error(err.toString());
            });
        }
    });


    connection.on("ReceiveMessage", function (message) {
        var chatBody = document.getElementById("chatBody");
        var messageContainerDiv = document.createElement('div');
        messageContainerDiv.classList.add('message-container', 'my-1');
        var messageDiv = document.createElement('div');
        messageDiv.classList.add("py-2", "px-3", "rounded-pill");
        messageDiv.style.backgroundColor = 'hotpink';
        messageDiv.style.width = 'fit-content';
        messageDiv.style.maxWidth = '80%';
        messageDiv.innerHTML = message;
        messageContainerDiv.appendChild(messageDiv);
        chatBody.appendChild(messageContainerDiv);

        // Empty Input
        document.getElementById('messageInput').value = "";

    });


    connection.on("UserDisconnected", function () {
        document.getElementById('status-indicator-offline').style.display = 'block';
        document.getElementById('status-indicator-online').style.display = "none";

        document.getElementById('actionButtons').style.display = "block";

        var chatBody = document.getElementById("chatBody");
        var messageContainerDiv = document.createElement('div');
        messageContainerDiv.classList.add('message-container', 'my-1', 'disconnected');
        var messageDiv = document.createElement('div');
        messageDiv.classList.add("py-2", "px-3", "text-center");
        messageDiv.style.fontSize = '14px';
        messageDiv.innerHTML = "<b>Disconnected</b>, Try reconnecting to meet someone else!";
        messageContainerDiv.appendChild(messageDiv);
        chatBody.appendChild(messageContainerDiv);

        document.getElementById('sendButton').disabled = false;
    });


};

