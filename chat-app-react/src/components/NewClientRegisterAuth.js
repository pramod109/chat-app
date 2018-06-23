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

            axios.post('http://localhost:3001/registerNewClient', postData)
                .then( (res) => {
                    console.log(res);
                    self.setState({isOldClient: true});
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
                <h2>This is the NewClientRegisterAuth page</h2>
                <h3>Click here if you are already a user</h3>
                <button onClick={this.goToLogin}>Login</button>
                <h2>New Users Register Below</h2>
                <div>
                    <form onSubmit={this.registerNewClient}>
                        <input type="text" name="username" placeholder="Name" autoFocus />
                        <input type="password" name="password" placeholder="Password" />
                        <button type="submit">Register</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default NewClientRegisterAuth;