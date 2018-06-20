$(function () {
    var thisUserRoom;

    var socket = io();
    $('#addRoomId').submit(function () {
        socket.emit('create room', $('#m').val());
        thisUserRoom = $('#m').val();
        $('#m').val('');
        console.log(thisUserRoom);
        var addRoom = document.getElementById("addRoom");
        var clientChat = document.getElementById("clientChat");
        addRoom.style.display = "none";
        clientChat.style.display = "block";
        return false;
    });

    socket.on('chat message', function (data) {
        if(data.roomName === thisUserRoom){
            $('#messages').append($('<li>').text(data.message));
        }
    })

    $('#chatId').submit(function(){
        var msg = thisUserRoom + ':' + $('#chat').val();
        socket.emit('chat message', 
        {
            roomName: thisUserRoom, 
            message: msg
        });
        $('#chat').val('');
        return false;
    })
    
});