/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to handle new client registrations
*/

import React from 'react';
import axios from 'axios';
import OldClientLoginAuth from './OldClientLoginAuth';

class NewClientRegisterAuth extends React.Component{
    constructor() {
        super();
        this.state = {
            isOldClient: false
        }
        this.goToLogin = () => {
            this.setState({isOldClient: true});
        }
        var self = this;
        this.registerNewClient = (e) => {
            e.preventDefault();
            const username = e.target.elements.username.value;
            const password = e.target.elements.password.value;

            const postData = {
                name: username,
                password: password
            }

            axios.post('/registerNewClient', postData)
                .then( (res) => {
                    console.log(res);
                    console.log(res.success);
                    if(res.data.success){
                        self.setState({isOldClient: true});
                    }else{
                        alert("Please choose a unique name. This name is already taken...")
                    }
                    
                })
                .catch(function(err) {
                    console.log(err);
                }
            )
        }
    }
    render() {

        if (this.state.isOldClient){
            return <OldClientLoginAuth />
        }

        return (
            <div>
                <title>Chat App | Client</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand" style={{ color: 'white' }}>Chat App | New Client</a>
                </nav>
                <div className="container">
                    <div className="row justify-content-center">
                        <h3>Already a user?</h3>
                    </div>
                    <div className="row justify-content-center">
                        <button className="btn btn-success" onClick={this.goToLogin}>Login</button>
                    </div>
                    <div className="row justify-content-center">
                        <h3>New Users Register Below</h3>
                    </div>
                    <div>
                        <form onSubmit={this.registerNewClient}>
                            <div className="row justify-content-center">
                                <input type="text" name="username" placeholder="Name" autoFocus autoComplete="off" minLength="1" maxLength="15" required />
                            </div>
                            <div className="row justify-content-center">
                                <input type="password" name="password" placeholder="Password" minLength="1" maxLength="15" required/>
                            </div>
                            <div className="row justify-content-center">
                                <button className="btn btn-primary" type="submit">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewClientRegisterAuth;