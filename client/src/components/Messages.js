/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to display messages
*/

import React from 'react';
import MessageCard from './MessageCard';

class Messages extends React.Component{
    constructor(){
        super();
    }

    render(){
        const messageCards = this.props.messages.map((message) => {
            return (
                <MessageCard message={message} />
            )
        })
        return (
            messageCards
        );
    }
}

export default Messages;
