import React from 'react';
import { socketEmit } from '../helpers/socketEvents';
import ClientChat from './ClientChat';

class ClientRegister extends React.Component{
    constructor(){
        super();

        this.state = {
            error: null,
            clientChat: false,
            userName: null
        };

        this.loginClient = (e) => {
            e.preventDefault();
            
            const userName = e.target.elements.userName.value.trim();

            if(!userName){
                return this.setState({error: 'You must enter a unique user name'});
            }

            socketEmit.createRoom(userName, (err) => {
                this.setState({error: err});
            })

            if(this.state.error === null){
                this.setState({userName: userName});
                this.setState({clientChat: true});
            }

            e.target.elements.userName.value = '';
        };
    }

    render(){

        if(this.state.clientChat){
            return <ClientChat userName={this.state.userName} />
        }

        return (
            <div>
                <title>Chat App | Client Reg</title>
                <h1>This is the client register page</h1>
                <div>
                    <form onSubmit={this.loginClient}>
                        <h3>Join Chat</h3>
                        <p>{this.state.error}</p>
                        <p>Username</p>
                        <input type="text" name="userName" autoFocus autoComplete="off" />
                        <button type="submit">Join</button> 
                    </form>
                </div>
            </div>
        );
    }
}

export default ClientRegister;