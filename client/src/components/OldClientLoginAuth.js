/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to handle old client login
*/

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
                password: password,
                isAdmin: false
            }
            axios.post('/authenticate', postData)
                .then((res) => {
                    console.log(res);
                    if(res.data.success){
                        self.setState({authorized: true, token: res.data.token, userName:username});

                        socketEmit.createRoom(self.state.userName, (err) => {
                            this.setState({error: err});
                
                        })
                    }else{
                        alert(res.data.message)
                    }                    
                    //console.log(self.state.authorized);
                    //console.log(self.state.token);
                    //console.log(self.state.userName);
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
                <title>Chat App | Client Login</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" style={{ color: 'white' }}>Chat App | Client Login</a>
                </nav>
                <div className="container">
                    <form onSubmit={this.loginOldClient}>
                        <div className="row justify-content-center">
                            <input type="text" name="username" placeholder="Name" autoFocus minLength="1" maxLength="15" required />
                        </div>
                        <div className="row justify-content-center">
                            <input type="password" name="password" placeholder="Password" minLength="1" maxLength="15" required/>
                        </div>
                        <div className="row justify-content-center">
                            <button className="btn btn-success" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default OldClientLoginAuth;
