import React from 'react';
import axios from 'axios';
import ClientChat from './ClientChat';
import { socketEmit } from '../helpers/socketEvents';

class OldClientLoginAuth extends React.Component{
    constructor() {
        super();
        this.state = {
            authorized: false,
            token: null,
            userName: null
        }
        var self = this;
        this.loginOldClient = (e) => {
            e.preventDefault();
            const username = e.target.elements.username.value;
            const password = e.target.elements.password.value;

            const postData = {
                name: username,
                password: password
            }

            axios.post('http://localhost:3001/authenticate', postData)
                .then((res) => {
                    console.log(res);
                    self.setState({authorized: true, token: res.data.token, userName:username});
                    console.log(self.state.authorized);
                    console.log(self.state.token);
                    console.log(self.state.userName);

                    socketEmit.createRoom(self.state.userName, (err) => {
                        this.setState({error: err});
                    })
                }) 
                .catch((err) => {
                    console.log(err);
                }
            )
        }
    }
    render(){

        if(this.state.authorized){
            if(this.state.token){
                return <ClientChat userName={this.state.userName} token={this.state.token}/>
            }
        }

        return (
            <div>
                <h2>This is the old client login page</h2>
                <div>
                    <form onSubmit={this.loginOldClient}>
                        <input type="text" name="username" placeholder="Name" autoFocus />
                        <input type="password" name="password" placeholder="Password" />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default OldClientLoginAuth;