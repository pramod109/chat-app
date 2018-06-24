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
                <h1>This is the Home Page</h1>
                <h3>Please choose one:</h3>
                <button onClick = {this.handleClientClick}>Client</button>
                <button onClick = {this.handleAdminClick}>Admin</button>
            </div>
        );
    }
}

export default HomePage;