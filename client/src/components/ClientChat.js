/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to display and handle client chat
*/

import React from 'react';
import { socketEmit, socketOn } from '../helpers/socketEvents';
import axios from 'axios';

class ClientChat extends React.Component{
    constructor(){
        super();

        this.state = {
            messages: []
        };
        
        socketOn.chatMessage((data) => {

            if(data.roomName === this.props.userName){
                const newMessages = this.state.messages.slice();
                newMessages.push(data.message);
                this.setState({messages: newMessages});
            }
        })

        this.sendMessage = (e) => {
            e.preventDefault();
            
            const userMessage = this.props.userName + ' : ' + e.target.elements.userMessage.value.trim();

            axios.post('/verify', {token:this.props.token})
                .then((res) => {
                    console.log(res);
                    socketEmit.chatMessage({roomName:this.props.userName,message:userMessage}, (err) => {
                
                    });
                })
                .catch((err) => {
                    console.log(err);
                }
            )

            e.target.elements.userMessage.value = '';
        };
    }

    render(){
        const thisMessages = this.state.messages;
        const messageList = thisMessages.map((message) => 
            <li key={message.toString()}>{message}</li>
        )

        return (
            <div>
                <title>Chat App | Client Chat</title>
                <h1>This is the client chat page</h1>
                <div>
                    <form onSubmit={this.sendMessage}>
                        <h3>Client Chat</h3>
                        <ul>{messageList}</ul>
                        <p>This room belongs to: {this.props.userName}</p>
                        <input type="text" name="userMessage" autoFocus autoComplete="off" />
                        <button type="submit">Join</button> 
                    </form>
                </div>
            </div>
        );
    }
}

export default ClientChat;