/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to handle main page of the chat app
*/

import React from 'react';
import NewClientRegisterAuth from './NewClientRegisterAuth';
import OldAdminLoginAuth from './OldAdminLoginAuth';

class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.handleClientClick = this.handleClientClick.bind(this);
        this.handleAdminClick = this.handleAdminClick.bind(this);
        this.state = {currStatus: 'none'};
    }
    handleClientClick(){
        this.setState({currStatus: 'client'});
    }
    handleAdminClick(){
        this.setState({currStatus: 'admin'});
    }
    render(){

        const currStatus = this.state.currStatus;
        if(currStatus === 'client'){
            return <NewClientRegisterAuth />
        }
        if(currStatus === 'admin'){
            return <OldAdminLoginAuth />
        }
        return(
            <div>
                <title>Chat App | Home</title>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand">Chat App</a>
                </nav>
                <div className="container inner-container">
                    <div className="row justify-content-center">
                        <form>
                            <div className="form-group">
                                <button type="button" className="btn btn-primary btn-lg" onClick={this.handleClientClick}>Client</button>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-primary btn-lg" onClick={this.handleAdminClick}>Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
