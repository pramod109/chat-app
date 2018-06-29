/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to display and handle client chat
*/

import React from 'react';
import { socketEmit, socketOn } from '../helpers/socketEvents';
import axios from 'axios';
import Messages from './Messages';
import HomePage from './HomePage';

class ClientChat extends React.Component{
    constructor(){
        super();

        this.state = {
            loggedOut: false,
            messages: []
        };

        this.scrollToBottom = () => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
        
        this.logout = () => {
            this.setState({loggedOut: true});
            window.location.reload();
        }

        socketOn.chatMessage((data) => {

            if(data.roomName === this.props.userName){
                const newMessages = this.state.messages.slice();
                newMessages.push(data.message);
                this.setState({messages: newMessages});
                this.scrollToBottom();
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
        if(this.state.loggedOut){
            return (
                <HomePage />
            )
        }
        return (
            <div>
                <title>Chat App | Client Login</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" style={{ color: 'white' }}>Chat App | Client Chat</a>
                    <button className="btn btn-danger pull-right" onClick={this.logout}>Logout</button>
                </nav>
                <div className="container-fluid">
                    <div className="container-fluid" id="clientMessages">
                        <Messages messages={this.state.messages} />

                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>

                    </div>
                    <div className="container-fluid">
                        <form id="chatForm" onSubmit={this.sendMessage}>
                            <div className="form-row">
                                <div className="form-group col-11 ">
                                    <input type="text" className="form-control border-dark" name="userMessage" autoComplete="off" autoFocus required minLength="1" maxLength="60" />
                                </div>
                                <div className="form-group col-1">
                                    <button className="btn btn-success border-dark" type="submit">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClientChat;