$(function () {
    var thisUser;

    var socket = io();
    $('#addRoomId').submit(function () {
        socket.emit('create room', $('#m').val());
        thisUser = $('#m').val();
        $('#m').val('');
        console.log(thisUser);
        var addRoom = document.getElementById("addRoom");
        var clientChat = document.getElementById("clientChat");
        addRoom.style.display = "none";
        clientChat.style.display = "block";
        return false;
    });

    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    })

    $('#chatId').submit(function(){
        socket.in(thisUser).emit('chat message', $('#chat').val());
        $('#chat').val('');
        return false;
    })
    
});