/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to handle old admin auth
*/

import React from 'react';
import axios from 'axios';
import AdminChat from './AdminChat';

class OldAdminLoginAuth extends React.Component{
    constructor() {
        super();
        this.state = {
            authorized: false,
            token: null,
            userName: null
        }
        var self = this;
        this.loginOldAdmin = (e) => {
            e.preventDefault();
            const username = e.target.elements.username.value;
            const password = e.target.elements.password.value;

            const postData = {
                name: username,
                password: password,
                isAdmin: true
            }

            axios.post('/authenticate', postData)
                .then((res) => {
                    console.log(res);
                    if(res.data.success){
                        self.setState({authorized: true, token: res.data.token, userName:username});
                    }else{
                        alert(res.data.message)
                    }
                    
                    console.log(self.state.authorized);
                    console.log(self.state.token);
                    console.log(self.state.userName);
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
                return <AdminChat token={this.state.token}/>
            }
        }

        return (
            <div>
                <title>Chat App | Admin Login</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" style={{ color: 'white' }}>Chat App | Admin Login</a>
                </nav>
                <div className="container">
                    <form onSubmit={this.loginOldAdmin}>
                    <div className="row justify-content-center">
                        <input type="text" name="username" placeholder="Name" autoFocus />
                    </div>    
                    <div className="row justify-content-center">    
                        <input type="password" name="password" placeholder="Password" />
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

export default OldAdminLoginAuth;