$(function () {
    var thisAdminName='Admin';
    var thisRoomName;
    var socket = io();

    socket.on('update user rooms', function(data){
        var temp = $('<li>'+data+'</li>').on('click', function(){
            var roomName = $(this).text();
            console.log(roomName);
            socket.emit('get messages', roomName);
            thisRoomName = roomName;
        })
        $('#userList').append(temp);
    });

    $('#userList').on('click', "li", function(){
        
    });

    socket.on('update user messages', function(data){
        
        jQuery.each(data, function(index, item){
            $('#admin-messages').append($('<li>').text(item));
        })
    });

    socket.on('chat message', function(data){
        if (data.roomName === thisRoomName){
            $('#admin-messages').append($('<li>').text(data.message));
        }
    })

    $('#adminChatId').submit(function(){
        var msg = thisAdminName + ':' + $('#a-chat').val();
        socket.emit('chat message', 
        {
            roomName: thisRoomName, 
            message: msg
        });
        $('#a-chat').val('');
        return false;
    })
    
});