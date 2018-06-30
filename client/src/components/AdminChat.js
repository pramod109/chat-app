/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to display and handle admin chat
*/

import React from 'react';
import { socketEmit, socketOn } from '../helpers/socketEvents';
import axios from 'axios';
import Messages from './Messages';
import HomePage from './HomePage';

class AdminChat extends React.Component{
    constructor(){
        super();
        this.state = {
            name: 'Admin',
            loggedOut: false,
            roomName: '',
            userRooms: [],
            messages: []
        };
        socketEmit.getUsers();

        this.scrollToBottom = () => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
        this.logout = () => {
            this.setState({loggedOut: true});
            window.location.reload();
        }        
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
                this.scrollToBottom();
            }
        });
        this.handleClick = (e) => {
            const name = e.target.innerText;
            //console.log(name);
            this.setState({roomName: name});
            socketEmit.getMessages(name);
        }
        this.sendMessage = (e) => {
            e.preventDefault();
            const adminMessage = 'Admin : ' + e.target.elements.adminMessage.value.trim();
            axios.post('/verify', {token:this.props.token})
                .then((res) => {
                    //console.log(res);
                    socketEmit.chatMessage({roomName:this.state.roomName,message:adminMessage}, (err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log(err);
                }
            )
            e.target.elements.adminMessage.value = '';
        }
    };
    render(){
        if(this.state.loggedOut){
            return(
                <HomePage />
            )
        }
        const userList = this.state.userRooms.map((user) => 
            <li key={user.name.toString()}>{user.name}</li>
        )

        return (
            <div>
                <title>Chat App | Admin Chat</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" style={{ color: 'white' }}>Chat App | Admin Chat</a>
                    <button className="btn btn-danger pull-right" onClick={this.logout}>Logout</button>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2">
                            <ul id="userList" onClick={this.handleClick}>{userList}</ul>
                        </div>
                        <div className="col-10">
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
                                            <input type="text" className="form-control border-dark" name="adminMessage" autoComplete="off" autoFocus required minLength="1" maxLength="60" />
                                        </div>
                                        <div className="form-group col-1">
                                            <button className="btn btn-success border-dark" type="submit">Send</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminChat;
