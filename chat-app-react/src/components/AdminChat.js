import React from 'react';
import { socketEmit, socketOn } from '../helpers/socketEvents';

class AdminChat extends React.Component{
    constructor(){
        super();
        this.state = {
            name: 'Admin',
            roomName: '',
            userRooms: [],
            messages: []
        };

        socketEmit.getUsers();

        socketOn.updateUserRoomsAdmin((data) => {
            this.setState({userRooms: data});
        });

        socketOn.updateUserRooms((data) => {
            this.setState({userRooms: data});
        })

        socketOn.updateUserMessages((data) => {
            this.setState({messages: data});
        })

        socketOn.chatMessage((data) => {
            if(data.roomName === this.state.roomName){
                const newMessages = this.state.messages.slice();
                newMessages.push(data.message);
                this.setState({messages: newMessages});
            }
        })

        this.handleClick = (e) => {
            const name = e.target.innerText;
            console.log(name);
            this.setState({roomName: name});
            socketEmit.getMessages(name);
        }

        this.sendMessage = (e) => {
            e.preventDefault();

            const adminMessage = 'Admin : ' + e.target.elements.adminMessage.value.trim();

            socketEmit.chatMessage({roomName:this.state.roomName, message: adminMessage}, (err) => {

            });

            e.target.elements.adminMessage.value = '';
        }
    };

    render(){
        const userList = this.state.userRooms.map((user) => 
            <li key={user.name.toString()}>{user.name}</li>
        )
        const adminMessages = this.state.messages.map((message) =>
            <li key={message.toString()}>{message}</li> 
        )
        return (
            <div>
                <title>Chat App | Admin Chat</title>
                <h1>This is the Admin Chat page</h1>
                <h3>List of users</h3>
                <ul onClick={this.handleClick}>{userList}</ul>
                <div>
                    <h3>Admin messages</h3>
                    <ul>{adminMessages}</ul>
                </div>

                <div>
                    <form onSubmit={this.sendMessage}>
                        <p>This room belongs to: {this.state.roomName}</p>
                        <input type="text" name="adminMessage" autoFocus autoComplete="off" />
                        <button type="submit">Send</button>
                    </form>
                </div>

            </div>
        );
    }
}

export default AdminChat;